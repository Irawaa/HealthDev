<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use ConvertApi\ConvertApi;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class IncidentReportDocxService
{

    public static function generateDocx(array $incidentReport)
    {
        $templatePath = storage_path('app/templates/Incident_Report.docx');
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

        $incidentReportId = $incidentReport['id'] ?? null;
        if (!$incidentReportId) {
            Log::error("Incident Report ID is missing", ['incident_report' => $incidentReport]);
            throw new \Exception("Incident Report ID is missing.");
        }

        $createdAt = isset($incidentReport['created_at'])
            ? Carbon::parse($incidentReport['created_at'])->format('Ymd_His')
            : now()->format('Ymd_His');

        $patientName = isset($incidentReport['patient']['fname'], $incidentReport['patient']['lname'])
            ? trim("{$incidentReport['patient']['fname']}_{$incidentReport['patient']['lname']}")
            : 'unknown_patient';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters
        $outputPath = "{$storageDir}/incident_report_{$incidentReportId}_{$patientName}_{$createdAt}.docx";

        $templateProcessor = new TemplateProcessor($templatePath);

        // ✅ Get patient details
        $patient = $incidentReport['patient'] ?? null;
        if (!$patient) {
            Log::error("Patient not found for Incident Report", ['incident_report_id' => $incidentReportId]);
            throw new \Exception("Patient not found for Incident Report ID: {$incidentReportId}");
        }

        // Extract recorded nurse details
        $recordedBy = $incidentReport['recorded_by']['clinic_staff'] ?? [];
        $gender = isset($patient['gender'])
            ? ($patient['gender'] == 1 ? 'Female' : 'Male')
            : 'N/A';

        // ✅ Handling management checkboxes
        $isInPNC = $incidentReport['management'] === 'In PNC' ? '☑' : '☐';
        $isReferredToHospital = $incidentReport['management'] === 'Referred to Hospital' ? '☑' : '☐';
        $hospitalSpecification = $incidentReport['management'] === 'Referred to Hospital'
            ? $incidentReport['hospital_specification'] ?? 'N/A'
            : '_____________________';

        $programName = $incidentReport['patient']['student']['program']['program_code'] ?? 'N/A';
        $collegeName = $incidentReport['patient']['student']['college']['college_code'] ?? 'N/A';

        // Extract nurse and physician details
        $schoolNurse = $incidentReport['school_nurse'] ?? [];
        $schoolPhysician = $incidentReport['school_physician'] ?? [];

        $shortcodes = [
            // ✅ Correct the shortcode for recordedBy name
            'nn' => trim("{$recordedBy['fname']} {$recordedBy['lname']} " . ($recordedBy['mname'] ?? '')),
            'nl'   => $recordedBy['license_no'] ?? 'N/A',
            'nptr' => $recordedBy['ptr_no'] ?? 'N/A',

            // ✅ Populate the rest of the data
            'pn' => trim("{$patient['fname']} {$patient['lname']} " . ($patient['mname'] ?? '')),
            'pi'  => $patient['patient_id'] ?? 'N/A',
            'dob' => $patient['birthdate'] ?? 'N/A',
            'age' => isset($patient['birthdate']) ? Carbon::parse($patient['birthdate'])->age : 'N/A',
            'g' => $gender,
            'pc' => "{$programName}/{$collegeName}",

            'date' => now()->format('Y-m-d'),
            'time' => now()->format('H:i'),

            'history' => $incidentReport['history'] ?? 'N/A',
            'nature' => $incidentReport['nature_of_incident'] ?? 'N/A',
            'place' => $incidentReport['place_of_incident'] ?? 'N/A',
            'doi' => $incidentReport['date_of_incident'] ?? 'N/A',
            'toi' => $incidentReport['time_of_incident'] ?? 'N/A',
            'desc' => $incidentReport['description_of_injury'] ?? 'N/A',

            // ✅ Management selection checkboxes
            'pnc' => $isInPNC,  // If "In PNC", mark it ✔, else empty
            'ref' => $isReferredToHospital, // If "Referred to Hospital", mark it ✔, else empty
            'hs' => $hospitalSpecification, // If referred, show hospital name

            // ✅ School Physician Information
            'sp_name' => "{$schoolPhysician['fname']} {$schoolPhysician['lname']}",
            'sp_role' => $schoolPhysician['role'] ?? 'N/A',
            'sp_ext' => $schoolPhysician['ext'] ?? 'N/A',
            'sln' => $schoolPhysician['license_no'] ?? 'N/A',
            'sptr' => $schoolPhysician['ptr_no'] ?? 'N/A',
            'sp_email' => $schoolPhysician['email'] ?? 'N/A',
            'sp_contact_no' => $schoolPhysician['contact_no'] ?? 'N/A',
        ];

        // Loop through and apply values
        foreach ($shortcodes as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // ✅ Save the modified DOCX file
        $templateProcessor->saveAs($outputPath);

        // ✅ Log successful document generation
        Log::info("Incident Report DOCX file generated successfully", ['file_path' => $outputPath]);

        return $outputPath;
    }

    public static function generatePDF($data)
    {
        Log::info("🔹 Starting PDF generation", ['incident_report_id' => $data['id']]);

        $createdAt = isset($data['created_at']) ? Carbon::parse($data['created_at'])->format('Ymd_His') : now()->format('Ymd_His');

        $patientName = isset($data['patient']['fname'], $data['patient']['lname'])
            ? trim("{$data['patient']['fname']}_{$data['patient']['lname']}")
            : 'unknown_patient';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters

        // ✅ Use 'incident_report_' instead of 'fdar_' for consistent naming
        $pdfPath = storage_path("app/generated/incident_report_{$data['id']}_{$patientName}_{$createdAt}.pdf");

        // ✅ Check if the PDF already exists
        if (File::exists($pdfPath)) {
            Log::info("✅ PDF already exists", ['file_path' => $pdfPath]);
            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="incident_report_' . $data['id'] . '.pdf"',
            ]);
        }

        Log::info("📝 Generating new PDF for Incident Report ID: " . $data['id']);

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
            Log::info("🚀 Converting DOCX to PDF for Incident Report ID: " . $data['id']);

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
                'Content-Disposition' => 'inline; filename="incident_report_' . $data['id'] . '.pdf"',
            ]);
        } catch (\Exception $e) {
            Log::error("❌ ConvertAPI PDF conversion failed", [
                'error_message' => $e->getMessage(),
                'incident_report_id' => $data['id']
            ]);
            throw new \Exception("Failed to convert DOCX to PDF: " . $e->getMessage());
        }
    }

    public static function previewPDF($data)
    {
        Log::info("Starting PDF preview for Incident Report ID: " . $data['id']);

        $createdAt = isset($data['created_at']) ? Carbon::parse($data['created_at'])->format('Ymd_His') : now()->format('Ymd_His');

        $patientName = isset($data['patient']['fname'], $data['patient']['lname'])
            ? trim("{$data['patient']['fname']}_{$data['patient']['lname']}")
            : 'unknown_student';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters

        // ✅ Use 'incident_report_' instead of 'fdar_' for consistent naming
        $pdfPath = storage_path("app/generated/incident_report_{$data['id']}_{$patientName}_{$createdAt}.pdf");

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
            'Content-Disposition' => 'inline; filename="incident_report_' . $data['id'] . '.pdf"',
        ]);
    }
}
