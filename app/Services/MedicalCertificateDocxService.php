<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use ConvertApi\ConvertApi;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class MedicalCertificateDocxService
{
    public static function generateDocx(array $medicalCertificate)
    {
        $setCheckbox = function ($condition) {
            return $condition ? '☑' : '☐';
        };

        $templatePath = storage_path('app/templates/Medical_Certificate.docx');
        $storageDir = storage_path('app/generated');

        // ✅ Ensure "generated" directory exists
        if (!File::exists($storageDir)) {
            File::makeDirectory($storageDir, 0755, true, true);
        }

        // ✅ Check if the template exists
        if (!File::exists($templatePath)) {
            Log::error("❌ DOCX template not found", ['path' => $templatePath]);
            throw new \Exception("Template file not found at: {$templatePath}");
        }

        // ✅ Extract Certificate ID
        $certId = $medicalCertificate['id'] ?? null;
        if (!$certId) {
            Log::error("❌ Medical Certificate ID is missing", ['medical_certificate' => $medicalCertificate]);
            throw new \Exception("Medical Certificate ID is missing.");
        }

        // ✅ Extract Patient Details
        $patient = $medicalCertificate['patient'] ?? null;
        if (!$patient) {
            Log::error("❌ Patient not found for Medical Certificate", ['medical_certificate_id' => $certId]);
            throw new \Exception("Patient not found for Medical Certificate ID: {$certId}");
        }

        // ✅ Format Date and Patient Name
        $createdAt = Carbon::parse($medicalCertificate['created_at'] ?? now())->format('Ymd_His');
        $patientName = isset($patient['fname'], $patient['lname'])
            ? preg_replace('/[^A-Za-z0-9_-]/', '', "{$patient['fname']}_{$patient['lname']}")
            : 'unknown_patient';

        // ✅ Set Output Path
        $outputPath = "{$storageDir}/medical_certificate_{$certId}_{$patientName}_{$createdAt}.docx";

        $templateProcessor = new TemplateProcessor($templatePath);

        // ✅ Extract Gender and Age
        $gender = isset($patient['gender'])
            ? ($patient['gender'] == 1 ? 'Female' : 'Male')
            : ' ';

        $age = isset($patient['birthdate'])
            ? Carbon::parse($patient['birthdate'])->age
            : '   ';

        $currentMonth = now()->month;

        // Determine the semester based on the month
        $semester = ($currentMonth >= 1 && $currentMonth <= 6) ? 1 : (($currentMonth >= 8 && $currentMonth <= 12) ? 2 : null);

        $mobile = $patient['mobile'] ?? 'N/A';
        $telephone = $patient['telephone'] ?? 'N/A';

        $contactNumber = $mobile;
        if (!empty($telephone)) {
            $contactNumber .= " / " . $telephone;
        }

        $student = $medicalCertificate['patient']['student'] ?? null;
        $emergencyContactName = $student['emergency_contact_name'] ?? 'N/A';
        $emergencyContactNo = $student['emergency_contact_no'] ?? 'N/A';
        $guardianRelation = $student['guardian_relation'] ?? 'N/A';

        $collegeName = $patient['student']['college']['college_name'] ?? '   ';
        $programName = $patient['student']['program']['program_name'] ?? '   ';

        // ✅ Extract School Nurse Details
        $schoolNurse = $medicalCertificate['schoolNurse'] ?? [];
        $schoolNurseDetails = [
            'sn_n' => $schoolNurse['name'] ?? '    ',
            'sn_r' => $schoolNurse['role'] ?? '    ',
            'sn_l' => $schoolNurse['license_no'] ?? '    ',
            'sn_p' => $schoolNurse['ptr_no'] ?? '    ',
            'sn_e' => $schoolNurse['email'] ?? '    ',
            'sn_c' => $schoolNurse['contact_no'] ?? '    ',
        ];

        Log::info("✅ School Nurse Data", ['school_nurse' => $schoolNurseDetails]);

        // ✅ Extract School Physician Details
        $schoolPhysician = $medicalCertificate['schoolPhysician'] ?? [];
        $schoolPhysicianDetails = [
            'sp_n' => $schoolPhysician['name'] ?? '    ',
            'sp_r' => $schoolPhysician['role'] ?? '    ',
            'sp_l' => $schoolPhysician['license_no'] ?? '    ',
            'sp_p' => $schoolPhysician['ptr_no'] ?? '    ',
            'sp_e' => $schoolPhysician['email'] ?? '    ',
            'sp_c' => $schoolPhysician['contact_no'] ?? '    ',
        ];

        Log::info("✅ School Physician Data", ['school_physician' => $schoolPhysicianDetails]);

        $advisedMedicationRestRequired = $medicalCertificate['advised_medication_rest_required'] ?? false;
        $advisedMedicationRestDate = $medicalCertificate['advised_medication_rest'] ?? '';

        // Set placeholders for checkboxes and underscores
        $purpose = $medicalCertificate['purpose'] ?? '';
        $recommendationValue = $medicalCertificate['recommendation'] ?? null;
        $clearanceStatusValue = $medicalCertificate['clearance_status'] ?? null;
        $furtherEvaluation = $medicalCertificate['further_evaluation'] ?? '';
        $notClearedFor = $medicalCertificate['not_cleared_for'] ?? '';
        $activitySpecification = $medicalCertificate['activity_specification'] ?? '';

        // Desired length for the diagnosis (e.g., 100 characters)
        $desiredLength = 88;

        // Check if diagnosis exists and if it is shorter than the desired length
        $diagnosis = $medicalCertificate['diagnosis'] ?? '_______________________________________________________________________________________';

        // The Unicode character for a blank space (U+2800)
        $spaceCharacter = "_";

        // If there's a diagnosis and it's shorter than the desired length, add the blank space character
        if (!empty($diagnosis) && strlen($diagnosis) < $desiredLength) {
            $diagnosis = str_pad($diagnosis, $desiredLength, $spaceCharacter);
        } elseif (empty($diagnosis)) {
            // If no diagnosis, just display a line of the blank space character
            $diagnosis = str_repeat($spaceCharacter, $desiredLength);
        }

        // ✅ Prepare shortcode replacements
        $shortcodes = [
            'pn' => trim("{$patient['fname']} {$patient['lname']} " . ($patient['mname'] ?? '')),
            'dob' => $patient['birthdate'] ?? '  ',
            'age' => $age,
            'g' => $gender,
            'date' => now()->format('Y-m-d'),
            'ay' => now()->year . ' - ' . now()->addYear()->year,
            'sem' => $semester,

            // Academic Information
            'pro' => $programName,
            'col' => $collegeName,

            'mob' => $mobile,
            'tel' => $telephone,
            'con' => $contactNumber,

            'ecn' => $emergencyContactName,
            'ecno' => $emergencyContactNo,
            'gr' => $guardianRelation,

            'dia' => $diagnosis,
            'rec' => $medicalCertificate['recommendation'] ?? '  ',
            'pur' => $medicalCertificate['purpose'] ?? '  ',
            'sta' => $medicalCertificate['clearance_status'] ?? '  ',

            // ✅ School Nurse Information
            'sn_n' => $schoolNurseDetails['sn_n'],
            'sn_r' => $schoolNurseDetails['sn_r'],
            'sn_l' => $schoolNurseDetails['sn_l'],
            'sn_p' => $schoolNurseDetails['sn_p'],
            'sn_e' => $schoolNurseDetails['sn_e'],
            'sn_c' => $schoolNurseDetails['sn_c'],

            // ✅ School Physician Information
            'sp_n' => $schoolPhysicianDetails['sp_n'],
            'sp_r' => $schoolPhysicianDetails['sp_r'],
            'sp_l' => $schoolPhysicianDetails['sp_l'],
            'sp_p' => $schoolPhysicianDetails['sp_p'],
            'sp_e' => $schoolPhysicianDetails['sp_e'],
            'sp_c' => $schoolPhysicianDetails['sp_c'],

            // ✅ Checkboxes
            'ad' => ($medicalCertificate['advised_medication_rest_required'] ?? false) ? '☑ ' : ' ☐ ',
            'ex' => ($medicalCertificate['purpose'] ?? '' === 'Excuse Slip') ? ' ☑ ' : '☐',
            'of' => ($medicalCertificate['purpose'] ?? '' === 'Off school activity') ? ' ☑ ' : ' ☐ ',
            'ojt' => ($medicalCertificate['purpose'] ?? '' === 'OJT') ? ' ☑ ' : '☐',
            'spo' => ($medicalCertificate['purpose'] ?? '' === 'Sports') ? ' ☑ ' : '☐',
            'rot' => ($medicalCertificate['purpose'] ?? '' === 'ROTC') ? ' ☑ ' : '☐',
            'oth' => ($medicalCertificate['purpose'] ?? '' === 'Others') ? ' ☑ ' : '☐',
            'ret' => (($medicalCertificate['recommendation'] ?? null) === 0) ? '☑ ' : ' ☐ ',
            'csh' => (($medicalCertificate['recommendation'] ?? null) === 1) ? ' ☑ ' : ' ☐ ',
            'cho' => (($medicalCertificate['recommendation'] ?? null) === 2) ? ' ☑ ' : ' ☐ ',
            'cf' => (($medicalCertificate['clearance_status'] ?? null) === 0) ? '☑ ' : ' ☐ ',
            'e' => (($medicalCertificate['clearance_status'] ?? null) === 1) ? '☑ ' : ' ☐ ',
            'cn' => (($medicalCertificate['clearance_status'] ?? null) === 2) ? '☑ ' : ' ☐ ',
            'cs' => ($medicalCertificate['not_cleared_for'] ?? '' === 'All sports') ? ' ☑ ' : ' ☐ ',
            'cc' => ($medicalCertificate['not_cleared_for'] ?? '' === 'Certain sports') ? '  ☑ ' : ' ☐ ',
            'ca' => ($medicalCertificate['not_cleared_for'] ?? '' === 'Activity') ? '  ☑ ' : ' ☐ ',

            // ✅ Underscores
            'ur' => $advisedMedicationRestRequired ? $advisedMedicationRestDate : '_____________',
            'uo' => ($purpose === 'Others') ? ($medicalCertificate['purpose_other'] ?? '__________') : '__________',
            'ue' => $furtherEvaluation ?: '_______________________',
            'ua' => ($notClearedFor === 'Activity') ? $activitySpecification : '_____________________',
        ];

        // ✅ Apply values to DOCX template
        foreach ($shortcodes as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // ✅ Save the modified DOCX file
        $templateProcessor->saveAs($outputPath);

        Log::info("📄 Medical Certificate DOCX file generated successfully", ['file_path' => $outputPath]);

        return $outputPath;
    }

    public static function generatePDF($data, $schoolNurse = [], $schoolPhysician = [])
    {
        Log::info("🔹 Starting PDF generation", ['medical_certificate_id' => $data['id']]);

        $createdAt = Carbon::parse($data['created_at'] ?? now())->format('Ymd_His');
        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', "{$data['patient']['fname']}_{$data['patient']['lname']}");

        $pdfPath = storage_path("app/generated/medical_certificate_{$data['id']}_{$patientName}_{$createdAt}.pdf");

        // ✅ Check if the PDF already exists
        if (File::exists($pdfPath)) {
            Log::info("✅ PDF already exists", ['file_path' => $pdfPath]);
            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="medical_certificate_' . $data['id'] . '.pdf"',
            ]);
        }

        Log::info("📝 Generating new PDF for Medical Certificate ID: " . $data['id']);

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
            Log::info("🚀 Converting DOCX to PDF for Medical Certificate ID: " . $data['id']);

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
                'Content-Disposition' => 'inline; filename="medical_certificate_' . $data['id'] . '.pdf"',
            ]);
        } catch (\Exception $e) {
            Log::error("❌ ConvertAPI PDF conversion failed", [
                'error_message' => $e->getMessage(),
                'medical_certificate_id' => $data['id']
            ]);
            throw new \Exception("Failed to convert DOCX to PDF: " . $e->getMessage());
        }
    }

    public static function previewPDF($data)
    {
        Log::info("Starting PDF preview for Medical Certificate ID: " . $data['id']);

        $createdAt = Carbon::parse($data['created_at'] ?? now())->format('Ymd_His');
        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', "{$data['patient']['fname']}_{$data['patient']['lname']}");

        $pdfPath = storage_path("app/generated/medical_certificate_{$data['id']}_{$patientName}_{$createdAt}.pdf");

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
            'Content-Disposition' => 'inline; filename="medical_certificate_' . $data['id'] . '.pdf"',
        ]);
    }
}
