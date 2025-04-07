<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use ConvertApi\ConvertApi;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;


class BPFormDocxService
{
    public static function generateDocx(array $bpForm)
    {
        $templatePath = storage_path('app/templates/BP1.docx');
        $storageDir = storage_path('app/generated');

        // Ensure "generated" directory exists
        if (!File::exists($storageDir)) {
            File::makeDirectory($storageDir, 0755, true, true);
        }

        // Check if the template exists
        if (!File::exists($templatePath)) {
            Log::error("DOCX template not found", ['path' => $templatePath]);
            throw new \Exception("Template file not found at: {$templatePath}");
        }

        $bpFormId = $bpForm['id'] ?? null;
        if (!$bpFormId) {
            Log::error("BP Form ID is missing", ['bp_form' => $bpForm]);
            throw new \Exception("BP Form ID is missing.");
        }

        $createdAt = isset($bpForm['created_at'])
            ? Carbon::parse($bpForm['created_at'])->format('Ymd_His')
            : now()->format('Ymd_His');

        $patientName = isset($bpForm['patient']['fname'], $bpForm['patient']['lname'])
            ? trim("{$bpForm['patient']['fname']}_{$bpForm['patient']['lname']}")
            : 'unknown_patient';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters
        $outputPath = "{$storageDir}/bp_form_{$bpFormId}_{$patientName}_{$createdAt}.docx";

        $templateProcessor = new TemplateProcessor($templatePath);

        // Get patient details
        $patient = $bpForm['patient'] ?? null;
        if (!$patient) {
            Log::error("Patient not found for BP Form", ['bp_form_id' => $bpFormId]);
            throw new \Exception("Patient not found for BP Form ID: {$bpFormId}");
        }

        // Extract recorded nurse details
        $recordedBy = $bpForm['recorded_by']['clinic_staff'] ?? [];
        $gender = isset($patient['gender'])
            ? ($patient['gender'] == 1 ? 'Female' : 'Male')
            : 'N/A';

        // Handling BP form readings
        $readings = isset($bpForm['readings']) ? $bpForm['readings'] : [];

        $programName = $bpForm['patient']['student']['program']['program_code'] ?? '';
        $collegeName = $bpForm['patient']['student']['college']['college_code'] ?? '';

        $programCollege = ($programName && $collegeName) ? "{$programName}/{$collegeName}" : ($programName ?: $collegeName);

        // Extract nurse and physician details
        $schoolNurse = $bpForm['school_nurse'] ?? [];

        // $departmentName = isset($bpForm['patient']['personnel']['department'])
        //     ? $bpForm['patient']['personnel']['department']['name']
        //     : $bpForm['patient']['personnel']['college']['name'];

        // Prepare shortcodes
        $shortcodes = [
            'pn' => trim("{$patient['fname']} {$patient['lname']} " . ($patient['mname'] ?? '')),
            'pi' => $patient['patient_id'] ?? 'N/A',
            'dob' => $patient['birthdate'] ?? 'N/A',
            'age' => isset($patient['birthdate']) ? Carbon::parse($patient['birthdate'])->age : 'N/A',
            'g' => $gender,
            'pc' => $programCollege,
            'dept' => $programCollege,
            'date' => now()->format('Y-m-d'),
            'time' => now()->format('H:i'),
            'status' => $bpForm['status'] ?? 'Stable',
            'sn_name' => "{$schoolNurse['fname']} {$schoolNurse['lname']}",
            'sn_role' => $schoolNurse['role'] ?? 'N/A',
            'sn_license_no' => $schoolNurse['license_no'] ?? 'N/A',
        ];

        // Dynamically add readings rows to the table using cloneRowAndSetValues
        if (!empty($readings)) {
            // Ensure at least 11 rows exist in the table
            $requiredRows = 11;
            $actualReadings = count($readings);

            // Fill the remaining slots with "N/A" if readings are less than 11
            while (count($readings) < $requiredRows) {
                $readings[] = [
                    'date' => '',
                    'time' => '',
                    'blood_pressure' => '',
                    'has_signature' => false,
                    'remarks' => '',
                ];
            }

            // Prepare the values array for the readings
            $values = array_map(function ($reading) {
                return [
                    'reading_d' => $reading['date'] ?? '',
                    'reading_t' => $reading['time'] ?? '',
                    'reading_bp' => $reading['blood_pressure'] ?? '',
                    'reading_s' => $reading['has_signature'] ? 'Yes' : '',
                    'reading_r' => $reading['remarks'] ?? '',
                ];
            }, $readings);

            // Clone table rows to always have 11 rows
            // Loop through and apply values to placeholders
            foreach ($shortcodes as $key => $value) {
                $templateProcessor->setValue($key, $value);
            }

            $templateProcessor->cloneRowAndSetValues('reading_d', $values);
        }

        // Save the modified DOCX file
        $templateProcessor->saveAs($outputPath);

        // Log successful document generation
        Log::info("BP Form DOCX file generated successfully", ['file_path' => $outputPath]);

        return $outputPath;
    }

    public static function generatePDF($data)
    {
        Log::info("🔹 Starting PDF generation", ['bp_form_id' => $data['id']]);

        $createdAt = isset($data['created_at']) ? Carbon::parse($data['created_at'])->format('Ymd_His') : now()->format('Ymd_His');

        $patientName = isset($data['patient']['fname'], $data['patient']['lname'])
            ? trim("{$data['patient']['fname']}_{$data['patient']['lname']}")
            : 'unknown_patient';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters

        $pdfPath = storage_path("app/generated/bp_form_{$data['id']}_{$patientName}_{$createdAt}.pdf");

        if (File::exists($pdfPath)) {
            Log::info("✅ PDF already exists", ['file_path' => $pdfPath]);
            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="bp_form_' . $data['id'] . '.pdf"',
            ]);
        }

        Log::info("📝 Generating new PDF for BP Form ID: " . $data['id']);

        $docxPath = self::generateDocx($data);

        if (!File::exists($docxPath)) {
            Log::error("❌ DOCX file not found", ['file_path' => $docxPath]);
            throw new \Exception("DOCX file not found: {$docxPath}");
        }

        Log::info("✅ DOCX file ready: " . $docxPath);

        try {
            // Set ConvertAPI Secret Key
            ConvertApi::setApiCredentials(env('CONVERTAPI_SECRET'));

            Log::info("🚀 Converting DOCX to PDF for BP Form ID: " . $data['id']);

            $result = ConvertApi::convert('pdf', [
                'File' => $docxPath
            ]);

            // Save the converted file
            $result->saveFiles($pdfPath);

            if (!File::exists($pdfPath)) {
                Log::error("❌ PDF file was not created", ['file_path' => $pdfPath]);
                throw new \Exception("PDF file was not created: {$pdfPath}");
            }

            Log::info("✅ PDF file saved successfully", ['file_path' => $pdfPath]);

            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="bp_form_' . $data['id'] . '.pdf"',
            ]);
        } catch (\Exception $e) {
            Log::error("❌ ConvertAPI PDF conversion failed", [
                'error_message' => $e->getMessage(),
                'bp_form_id' => $data['id']
            ]);
            throw new \Exception("Failed to convert DOCX to PDF: " . $e->getMessage());
        }
    }

    public static function previewPDF($data)
    {
        Log::info("Starting PDF preview for BP Form ID: " . $data['id']);

        $createdAt = isset($data['created_at']) ? Carbon::parse($data['created_at'])->format('Ymd_His') : now()->format('Ymd_His');

        $patientName = isset($data['patient']['fname'], $data['patient']['lname'])
            ? trim("{$data['patient']['fname']}_{$data['patient']['lname']}")
            : 'unknown_patient';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters

        $pdfPath = storage_path("app/generated/bp_form_{$data['id']}_{$patientName}_{$createdAt}.pdf");

        Log::info("Checking PDF path: " . $pdfPath);

        if (!File::exists($pdfPath)) {
            Log::info("PDF does not exist yet, generating...");
            self::generatePDF($data);
        }

        if (!File::exists($pdfPath)) {
            Log::error("❌ PDF file not found: " . $pdfPath);
            throw new \Exception("PDF file not found: {$pdfPath}");
        }

        return response()->file($pdfPath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="bp_form_' . $data['id'] . '.pdf"',
        ]);
    }
}
