<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use ConvertApi\ConvertApi;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;


class DentalCertificateDocxService
{
    public static function generateDocx(array $dentalCertificate)
    {
        Log::info('📋 Incoming Dental Certificate Data', ['dentalCertificate' => $dentalCertificate]);

        $check = fn($condition) => $condition ? '☑' : '☐';

        $templatePath = storage_path('app/templates/Dental_Certificate.docx');
        $storageDir = storage_path('app/generated');

        File::ensureDirectoryExists($storageDir, 0755, true);

        if (!File::exists($templatePath)) {
            Log::error("DOCX template not found", ['path' => $templatePath]);
            throw new \Exception("Template file not found at: {$templatePath}");
        }

        $certId = $dentalCertificate['id'] ?? throw new \Exception("Dental Certificate ID is missing.");
        $patient = $dentalCertificate['patient'] ?? throw new \Exception("Patient not found for Certificate ID: {$certId}");

        $createdAt = isset($dentalCertificate['created_at'])
            ? Carbon::parse($dentalCertificate['created_at'])->format('Ymd_His')
            : now()->format('Ymd_His');

        $patientName = isset($patient['fname'], $patient['lname'])
            ? preg_replace('/[^A-Za-z0-9_-]/', '', "{$patient['fname']}_{$patient['lname']}")
            : 'unknown_patient';

        $docxPath = "{$storageDir}/dental_certificate_{$certId}_{$patientName}_{$createdAt}.docx";
        $pdfPath = "{$storageDir}/dental_certificate_{$certId}_{$patientName}_{$createdAt}.pdf";

        $templateProcessor = new TemplateProcessor($templatePath);

        $gender = ($patient['gender'] === '0' || $patient['gender'] === 0) ? 'Female' : 'Male';
        $age = isset($patient['birthdate']) ? Carbon::parse($patient['birthdate'])->age : 'N/A';

        // $contact = ($patient['mobile'] ?? 'N/A') . ' / ' . ($patient['telephone'] ?? 'N/A');

        $programDescription = $patient['student']['program']['description'] ?? 'N/A';
        $collegeDescription = $patient['student']['college']['description'] ?? 'N/A';

        $dentist = $dentalCertificate['school_dentist'] ?? [];
        $dentistDetails = [
            'dn_n' => trim(($dentist['fname'] ?? '') . ' ' . ($dentist['lname'] ?? '')),
            'dn_r' => $dentist['role'] ?? 'N/A',
            'dn_l' => $dentist['license_no'] ?? 'N/A',
            'dn_c' => $dentist['contact_no'] ?? 'N/A',
            'ptr_no' => $dentist['ptr_no'] ?? '________',
        ];

        $nurse = $dentalCertificate['school_nurse'] ?? [];
        $nurseDetails = [
            'dn_n' => trim(($nurse['fname'] ?? '') . ' ' . ($nurse['lname'] ?? '')),
            'dn_r' => $nurse['role'] ?? 'N/A',
            'dn_l' => $nurse['license_no'] ?? 'N/A',
            'dn_c' => $nurse['contact_no'] ?? 'N/A',
            'ptr_no' => $nurse['ptr_no'] ?? '________',
        ];

        // Semester
        $currentMonth = now()->month;

        $semester = ($currentMonth >= 1 && $currentMonth <= 6) ? '1st' : (($currentMonth >= 8 && $currentMonth <= 12) ? '2nd' : null);

        // Mobile / Telephone No.
        $mobile = $patient['mobile'] ?? 'N/A';
        $telephone = $patient['telephone'] ?? 'N/A';

        $contactNumber = $mobile;
        if (!empty($telephone)) {
            $contactNumber .= " / " . $telephone;
        }

        // ✅ Role checkboxes based on non-null nested keys

        // Check for Student
        $isStudent = !is_null($patient['student'] ?? null);
        $isTeaching = !is_null($patient['personnel'] ?? null);
        $isNonTeaching = !is_null($patient['nonpersonnel'] ?? null);

        // Initialize checkbox variables
        $tp = $check($isTeaching);
        $ntp = $check($isNonTeaching);
        $stu = $check($isStudent);

        // Initialize the variables with default empty values
        $collegeName = '';
        $programName = '';
        $department = '';
        $affiliation = '';

        // If a Student, use college and program
        if ($isStudent) {
            $patientRole = 'Student';
            $collegeName = $patient['student']['college']['college_code'] ?? '';
            $programName = $patient['student']['program']['program_code'] ?? '';
            $department = ''; // Not applicable for students
        }
        // If Teaching Personnel, use college and department
        elseif ($isTeaching) {
            $patientRole = 'Teaching Personnel';
            $collegeName = $patient['personnel']['college']['college_code'] ?? '';
            $department = $patient['personnel']['department']['program_code'] ?? '';
            $programName = ''; // Not applicable for teaching personnel
        }
        // If Non-Teaching Personnel, use affiliation
        elseif ($isNonTeaching) {
            $patientRole = 'Non-Teaching Personnel';
            $affiliation = $patient['nonpersonnel']['affiliation'] ?? '';
            $collegeName = ''; // Not applicable for non-personnel
            $programName = ''; // Not applicable for non-personnel
            $department = ''; // Not applicable for non-personnel
        }
        // If no role matches, set as Unknown
        else {
            $patientRole = 'Unknown';
        }

        // Emergency contact
        $emergencyContactName = $patient['student']['emergency_contact_name'] ?? $patient['personnel']['emergency_contact_person'] ?? '';
        $emergencyContactNumber = $patient['student']['emergency_contact_no'] ?? $patient['personnel']['emergency_contact_number'] ?? '';

        // Define the desired length for remarks (e.g., 120 characters)
        $desiredLength = 293;

        // Get the remarks and check if it's shorter than the desired length
        $remarks = $dentalCertificate['remarks'] ?? '';

        // If the remarks are shorter, pad them with underscores
        if (strlen($remarks) < $desiredLength) {
            $remarks = str_pad($remarks, $desiredLength, '_');
        }

        // Trim any extra underscores if the remarks were too long
        $remarks = substr($remarks, 0, $desiredLength);

        $shortcodes = [
            'sem' => $semester ?? '________',
            'ay' => now()->year . ' - ' . now()->addYear()->year,
            'academic_year' => $dentalCertificate['academic_year'] ?? '________',
            'pn' => trim("{$patient['fname']} {$patient['lname']} " . ($patient['mname'] ?? '')),
            'dob' => $patient['birthdate'] ?? '',
            'age' => $age,
            'g' => $gender,
            'position_year' => $patient['position_year'] ?? '________',
            'program_department' => $programDescription,
            'college_department' => $collegeDescription,
            'date' => now()->format('Y-m-d'),
            // 'con' => $contact,
            'emc' => $emergencyContactName,
            'emr' => $patient['student']['guardian_relation'] ?? 'N/A',
            'emp' => $emergencyContactNumber,

            'pro' => $programName,
            'col' => $collegeName,
            'dep' => $department,
            'aff' => $affiliation,

            'mob' => $mobile,
            'tel' => $telephone,
            'con' => $contactNumber,

            // Treatment checkboxes
            'me' => $check($dentalCertificate['mouth_examination'] ?? false),
            'gt' => $check($dentalCertificate['gum_treatment'] ?? false),
            'op' => $check($dentalCertificate['oral_prophylaxis'] ?? false),
            'e' => $check($dentalCertificate['extraction'] ?? false),
            'ot' => $check($dentalCertificate['orthodontic_treatment'] ?? false),
            'f' => $check($dentalCertificate['fillings'] ?? false),
            's' => $check($dentalCertificate['scaling'] ?? false),
            'rc' => $check($dentalCertificate['root_canal'] ?? false),
            'c' => $check($dentalCertificate['crowns'] ?? false),
            'b' => $check($dentalCertificate['bridges'] ?? false),
            'd' => $check($dentalCertificate['dentures'] ?? false),
            'i' => $check($dentalCertificate['implants'] ?? false),
            //             'r' => $dentalCertificate['remarks'] ?? '__________________________________________________________________________________________________
            // __________________________________________________________________________________________________
            // __________________________________________________________________________________________________
            // ',
            'r' => $remarks,

            // Dentist details
            'dn_n' => $dentistDetails['dn_n'],
            'dn_l' => $dentistDetails['dn_l'],
            'dn_no' => $dentistDetails['ptr_no'],

            // Nurse details
            'n_n' => $nurseDetails['dn_n'],
            'n_l' => $nurseDetails['dn_l'],
            'n_no' => $nurseDetails['ptr_no'],

            // Role checkboxes
            'tp' => $tp,
            'ntp' => $ntp,
            'stu' => $stu,
        ];

        foreach ($shortcodes as $key => $value) {
            if (!is_scalar($value)) {
                Log::warning("🔍 Non-scalar value for placeholder [$key]", ['value' => $value]);
            }

            $templateProcessor->setValue($key, (string) $value);
        }

        $templateProcessor->saveAs($docxPath);

        Log::info("Dental Certificate DOCX file generated successfully", ['file_path' => $docxPath]);

        return $docxPath;
    }

    public static function generatePDF($data, $schoolNurse = [], $schoolDentist = [])
    {
        Log::info("🔹 Starting PDF generation", ['fdar_id' => $data['id']]);

        $createdAt = isset($data['created_at']) ? Carbon::parse($data['created_at'])->format('Ymd_His') : now()->format('Ymd_His');

        $patientName = isset($data['patient']['fname'], $data['patient']['lname'])
            ? trim("{$data['patient']['fname']}_{$data['patient']['lname']}")
            : 'unknown_student';

        $patientName = preg_replace('/[^A-Za-z0-9_-]/', '', $patientName); // Remove special characters
        $pdfPath = storage_path("app/generated/dental_certificate_{$data['id']}_{$patientName}_{$createdAt}.pdf");

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
                'Content-Disposition' => 'inline; filename="dental_certificate_' . $data['id'] . '.pdf"',
            ]);
        } catch (\Exception $e) {
            Log::error("❌ ConvertAPI PDF conversion failed", [
                'error_message' => $e->getMessage(),
                'dental_certificate_id' => $data['id']
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
        $pdfPath = storage_path("app/generated/dental_certificate_{$data['id']}_{$patientName}_{$createdAt}.pdf");

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
            'Content-Disposition' => 'inline; filename="dental_certificate_' . $data['id'] . '.pdf"',
        ]);
    }
}
