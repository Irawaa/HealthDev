<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use ConvertApi\ConvertApi;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class FDARDocxService
{

    public static function generateDocx(array $fdarForm)
    {
        function formatString($input, $length = 70, $padChar = ' ')
        {
            $formatted = str_pad(substr($input ?? '', 0, $length), $length, $padChar);
            Log::info("formatString debug", ['input' => $input, 'formatted' => $formatted]);
            return $formatted;
        }

        $templatePath = storage_path('app/templates/FDAR.docx');
        $storageDir = storage_path('app/generated');

        // ✅ Ensure "generated" directory exists
        if (!File::exists($storageDir)) {
            File::makeDirectory($storageDir, 0755, true, true);
        }

        // ✅ Check if the template exists
        if (!File::exists($templatePath)) {
            Log::error("DOCX template not found", ['path' => $templatePath]);
            throw new \Exception("Template file not found at: {$templatePath}");
        }

        $fdarFormId = $fdarForm['id'] ?? null;
        if (!$fdarFormId) {
            Log::error("FDAR Form ID is missing", ['fdar_form' => $fdarForm]);
            throw new \Exception("FDAR Form ID is missing.");
        }

        $createdAt = isset($fdarForm['created_at']) ? Carbon::parse($fdarForm['created_at'])->format('Ymd_His') : now()->format('Ymd_His');

        $patientName = isset($fdarForm['patient']['fname'], $fdarForm['patient']['lname'])
            ? trim("{$fdarForm['patient']['fname']}_{$fdarForm['patient']['lname']}")
            : 'unknown_student';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters
        $outputPath = "{$storageDir}/fdar_{$fdarFormId}_{$patientName}_{$createdAt}.docx";


        $templateProcessor = new TemplateProcessor($templatePath);

        // ✅ Get patient details
        $patient = $fdarForm['patient'] ?? null;
        if (!$patient) {
            Log::error("Patient not found for FDAR form", ['fdar_form_id' => $fdarFormId]);
            throw new \Exception("Patient not found for FDAR form ID: {$fdarFormId}");
        }

        // Extract diseases (use `custom_disease` if `disease_name` is null)
        $diseaseList = array_map(function ($disease) {
            return $disease['disease_name'] ?? $disease['custom_disease'] ?? 'N/A';
        }, $fdarForm['all_diseases'] ?? []);

        // Join all diseases into a single string (comma-separated) (Focus)
        $shortcodes['foc'] = !empty($diseaseList) ? implode(', ', $diseaseList) : 'N/A';

        $currentMonth = now()->month;

        // Determine the semester based on the month
        $semester = ($currentMonth >= 1 && $currentMonth <= 6) ? 1 : (($currentMonth >= 8 && $currentMonth <= 12) ? 2 : null);

        // Extract recorded nurse details
        $recordedBy = $fdarForm['recorded_by'] ?? [];
        $gender = isset($patient['gender'])
            ? ($patient['gender'] == 1 ? 'Female' : 'Male')
            : 'N/A';

        $programName = $fdarForm['patient']['student']['program']['program_code'] ?? 'N/A';
        $collegeName = $fdarForm['patient']['student']['college']['college_code'] ?? 'N/A';

        $studentData = $fdarForm['patient']['student'] ?? [];

        $shortcodes += [
            'nn' => formatString(isset($recordedBy['fname'], $recordedBy['lname'])
                ? trim("{$recordedBy['fname']} {$recordedBy['lname']} {$recordedBy['mname']}")
                : 'N/A', 36),
            'nl'   => formatString($recordedBy['license_no'] ?? 'N/A', 10),
            'nptr' => formatString($recordedBy['ptr_no'] ?? 'N/A', 12),

            // ✅ Populate the rest of the data
            'pn' => formatString(trim("{$patient['fname']} {$patient['lname']} {$patient['mname']}")),
            'pi'  => $patient['patient_id'] ?? 'N/A',
            'dob' => $patient['birthdate'] ?? 'N/A',
            'age' => formatString(isset($patient['birthdate']) ? Carbon::parse($patient['birthdate'])->age : 'N/A', 9),
            'g' => formatString($gender, 11),
            'pc' => formatString("{$programName}/{$collegeName}", 51),

            'date' => formatString(now()->format('m-d'), 8),
            'time' => formatString(now()->format('H:i'), 10),
            'year' => formatString(now()->format('Y'), 9),

            'o' => formatString($semester == 1 ? ' /' : '   ', 3),
            't' => formatString($semester == 2 ? ' /' : '   ', 3),

            // Student 
            'sad' => isset($studentData['address_house'], $studentData['address_brgy'], $studentData['address_citytown'], $studentData['address_province'], $studentData['address_zipcode'])
                ? formatString(trim("{$studentData['address_house']} {$studentData['address_brgy']} {$studentData['address_citytown']} {$studentData['address_province']} {$studentData['address_zipcode']}"), 60)
                : formatString('N/A', 37),

            'dat' => $fdarForm['data'] ?? 'N/A',
            'act' => $fdarForm['action'] ?? 'N/A',
            'res' => $fdarForm['response'] ?? 'N/A',

            'wt'  => formatString($fdarForm['weight'] ?? 'N/A', 11),
            'ht'  => formatString($fdarForm['height'] ?? 'N/A', 11),
            'bp'  => formatString($fdarForm['blood_pressure'] ?? 'N/A', 10),
            'cr'  => formatString($fdarForm['cardiac_rate'] ?? 'N/A', 10),
            'rr'  => formatString($fdarForm['respiratory_rate'] ?? 'N/A', 10),
            'tmp' => formatString($fdarForm['temperature'] ?? 'N/A', 10),

            'os'  => $fdarForm['oxygen_saturation'] ?? 'N/A',
            'lmp' => $fdarForm['last_menstrual_period'] ?? 'N/A',
        ];

        // Loop through and apply values
        foreach ($shortcodes as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // ✅ Save the modified DOCX file
        $templateProcessor->saveAs($outputPath);

        // ✅ Log successful document generation
        Log::info("DOCX file generated successfully", ['file_path' => $outputPath]);

        return $outputPath;
    }

    public static function generatePDF($data)
    {
        Log::info("🔹 Starting PDF generation", ['fdar_id' => $data['id']]);

        $createdAt = isset($data['created_at']) ? Carbon::parse($data['created_at'])->format('Ymd_His') : now()->format('Ymd_His');

        $patientName = isset($data['patient']['fname'], $data['patient']['lname'])
            ? trim("{$data['patient']['fname']}_{$data['patient']['lname']}")
            : 'unknown_student';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters
        $pdfPath = storage_path("app/generated/fdar_{$data['id']}_{$patientName}_{$createdAt}.pdf");


        // ✅ Check if the PDF already exists
        if (File::exists($pdfPath)) {
            Log::info("✅ PDF already exists", ['file_path' => $pdfPath]);
            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="fdar_' . $data['id'] . '.pdf"',
            ]);
        }

        Log::info("📝 Generating new PDF for FDAR ID: " . $data['id']);

        $docxPath = self::generateDocx($data);

        if (!File::exists($docxPath)) {
            Log::error("❌ DOCX file not found", ['file_path' => $docxPath]);
            throw new \Exception("DOCX file not found: {$docxPath}");
        }

        Log::info("✅ DOCX file ready: " . $docxPath);

        try {
            // ✅ Set ConvertAPI Secret Key
            ConvertApi::setApiCredentials(env('CONVERTAPI_SECRET'));

            // ✅ Convert DOCX to PDF
            Log::info("🚀 Converting DOCX to PDF for FDAR ID: " . $data['id']);

            $result = ConvertApi::convert('pdf', [
                'File' => $docxPath
            ]);

            // ✅ Save the converted file
            $result->saveFiles($pdfPath);

            if (!File::exists($pdfPath)) {
                Log::error("❌ PDF file was not created", ['file_path' => $pdfPath]);
                throw new \Exception("PDF file was not created: {$pdfPath}");
            }

            Log::info("✅ PDF file saved successfully", ['file_path' => $pdfPath]);

            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="fdar_' . $data['id'] . '.pdf"',
            ]);
        } catch (\Exception $e) {
            Log::error("❌ ConvertAPI PDF conversion failed", [
                'error_message' => $e->getMessage(),
                'fdar_id' => $data['id']
            ]);
            throw new \Exception("Failed to convert DOCX to PDF: " . $e->getMessage());
        }
    }

    public static function previewPDF($data)
    {
        Log::info("Starting PDF preview for FDAR ID: " . $data['id']);

        $createdAt = isset($data['created_at']) ? Carbon::parse($data['created_at'])->format('Ymd_His') : now()->format('Ymd_His');

        $patientName = isset($data['patient']['fname'], $data['patient']['lname'])
            ? trim("{$data['patient']['fname']}_{$data['patient']['lname']}")
            : 'unknown_student';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters
        $pdfPath = storage_path("app/generated/fdar_{$data['id']}_{$patientName}_{$createdAt}.pdf");

        Log::info("Checking PDF path: " . $pdfPath);

        if (!File::exists($pdfPath)) {
            Log::info("PDF does not exist yet, generating...");
            self::generatePDF($data);
        }

        if (!File::exists($pdfPath)) {
            Log::error("❌ PDF file not found: " . $pdfPath);
            throw new \Exception("PDF file not found: {$pdfPath}");
        }

        Log::info("✅ PDF file ready for preview: " . $pdfPath);

        return response()->file($pdfPath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="fdar_' . $data['id'] . '.pdf"',
        ]);
    }
}
