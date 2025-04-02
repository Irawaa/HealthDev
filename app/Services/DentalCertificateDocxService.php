<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;
use PhpOffice\PhpWord\IOFactory;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class DentalCertificateDocxService
{
    public static function generatePDF(array $dentalCertificate)
    {
        $setCheckbox = fn($condition) => $condition ? '☑ ' : ' ☐ ';

        // Define paths
        $templatePath = storage_path('app/templates/Dental_Certificate.docx');
        $storageDir = storage_path('app/generated');

        // Ensure directory exists
        File::ensureDirectoryExists($storageDir, 0755, true);

        // Check if template file exists
        if (!File::exists($templatePath)) {
            Log::error("❌ DOCX template not found", ['path' => $templatePath]);
            throw new \Exception("Template file not found at: {$templatePath}");
        }

        // Validate required fields
        $certId = $dentalCertificate['id'] ?? throw new \Exception("Dental Certificate ID is missing.");
        $patient = $dentalCertificate['patient'] ?? throw new \Exception("Patient not found for Dental Certificate ID: {$certId}");

        // Ensure created_at is a valid date
        try {
            $createdAt = Carbon::parse($dentalCertificate['created_at'] ?? now())->format('Ymd_His');
        } catch (\Exception $e) {
            Log::warning("⚠ Invalid created_at date. Using current timestamp.", ['error' => $e->getMessage()]);
            $createdAt = now()->format('Ymd_His');
        }

        // Clean patient name for file naming
        $fname = preg_replace('/[^A-Za-z0-9]/', '', $patient['fname'] ?? 'Unknown');
        $lname = preg_replace('/[^A-Za-z0-9]/', '', $patient['lname'] ?? 'Patient');
        $patientName = "{$fname}_{$lname}";

        // Define output paths
        $docxPath = "{$storageDir}/dental_certificate_{$certId}_{$patientName}_{$createdAt}.docx";
        $pdfPath = "{$storageDir}/dental_certificate_{$certId}_{$patientName}_{$createdAt}.pdf";

        // Load template
        $templateProcessor = new TemplateProcessor($templatePath);

        // Gender processing (strict check for safety)
        $gender = ($patient['gender'] === '1' || $patient['gender'] === 1) ? 'Female' : 'Male';

        // Age calculation
        try {
            $age = isset($patient['birthdate']) ? Carbon::parse($patient['birthdate'])->age : 'N/A';
        } catch (\Exception $e) {
            Log::warning("⚠ Invalid birthdate for patient.", ['error' => $e->getMessage()]);
            $age = 'N/A';
        }

        // Contact details
        $contactNumber = ($patient['mobile'] ?? 'N/A') . ' / ' . ($patient['telephone'] ?? 'N/A');

        // Dentist information (with fallback)
        $dentist = $dentalCertificate['dentist'] ?? [];
        $dentistDetails = [
            'dn_n' => $dentist['name'] ?? 'N/A',
            'dn_r' => $dentist['role'] ?? 'N/A',
            'dn_l' => $dentist['license_no'] ?? 'N/A',
            'dn_c' => $dentist['contact_no'] ?? 'N/A',
        ];

        Log::info("✅ Dentist Data Retrieved", ['dentist' => $dentistDetails]);

        // Define replacement shortcodes
        $shortcodes = [
            'semester' => $dentalCertificate['semester'] ?? '________',
            'academic_year' => $dentalCertificate['academic_year'] ?? '________',
            'pn' => trim("{$patient['fname']} {$patient['lname']} " . ($patient['mname'] ?? '')),
            'dob' => $patient['birthdate'] ?? '  ',
            'age' => $age,
            'g' => $gender,
            'position_year' => $patient['position_year'] ?? '________',
            'program_department' => $patient['program_department'] ?? '________',
            'date' => now()->format('Y-m-d'),
            'emergency_contact' => $patient['emergency_contact_name'] ?? '________',
            'emergency_relationship' => $patient['emergency_contact_relationship'] ?? '________',
            'emergency_phone' => $patient['emergency_contact_phone'] ?? '________',
            'con' => $contactNumber,
            'mouth_exam' => $setCheckbox($dentalCertificate['mouth_exam'] ?? false),
            'gum_treatment' => $setCheckbox($dentalCertificate['gum_treatment'] ?? false),
            'oral_prophylaxis' => $setCheckbox($dentalCertificate['oral_prophylaxis'] ?? false),
            'extraction' => $setCheckbox($dentalCertificate['extraction'] ?? false),
            'orthodontic_treatment' => $setCheckbox($dentalCertificate['orthodontic_treatment'] ?? false),
            'fillings' => $setCheckbox($dentalCertificate['fillings'] ?? false),
            'scaling' => $setCheckbox($dentalCertificate['scaling'] ?? false),
            'root_canal' => $setCheckbox($dentalCertificate['root_canal'] ?? false),
            'crowns' => $setCheckbox($dentalCertificate['crowns'] ?? false),
            'bridges' => $setCheckbox($dentalCertificate['bridges'] ?? false),
            'dentures' => $setCheckbox($dentalCertificate['dentures'] ?? false),
            'implants' => $setCheckbox($dentalCertificate['implants'] ?? false),
            'remarks' => $dentalCertificate['remarks'] ?? '_____________________________________________',
            'school_nurse' => $dentalCertificate['school_nurse'] ?? '________',
            'dn_n' => $dentistDetails['dn_n'],
            'dn_l' => $dentistDetails['dn_l'],
            'ptr_no' => $dentist['ptr_no'] ?? '________',
            'tp' => $setCheckbox($patient['role'] === 'Teaching Personnel'),
            'ntp' => $setCheckbox($patient['role'] === 'Non-Teaching Personnel'),
            'stu' => $setCheckbox($patient['role'] === 'Student'),
        ];

        // Apply values to template
        foreach ($shortcodes as $key => $value) {
            $templateProcessor->setValue($key, $value);
        }

        // Save as DOCX first
        try {
            $templateProcessor->saveAs($docxPath);
            Log::info("✅ DOCX successfully generated", ['file' => $docxPath]);
        } catch (\Exception $e) {
            Log::error("❌ Failed to generate DOCX", ['error' => $e->getMessage()]);
            throw new \Exception("Failed to generate document.");
        }

        // Convert DOCX to PDF
        try {
            $phpWord = IOFactory::load($docxPath);
            $pdfWriter = IOFactory::createWriter($phpWord, 'PDF');
            $pdfWriter->save($pdfPath);
            Log::info("✅ PDF successfully generated", ['file' => $pdfPath]);
        } catch (\Exception $e) {
            Log::error("❌ Failed to convert DOCX to PDF", ['error' => $e->getMessage()]);
            throw new \Exception("Failed to convert document to PDF.");
        }

        // Return relative PDF path for frontend use
        return str_replace(storage_path('app/'), '', $pdfPath);
    }
}
