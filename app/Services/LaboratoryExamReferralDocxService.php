<?php

namespace App\Services;

use PhpOffice\PhpWord\TemplateProcessor;
use Carbon\Carbon;
use ConvertApi\ConvertApi;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;


class LaboratoryExamReferralDocxService
{
    public static function generateDocx(array $labReferral)
    {
        Log::info('🧪 Incoming Lab Exam Referral Data', ['labReferral' => $labReferral]);

        $templatePath = storage_path('app/templates/Lab_Referral.docx');
        $storageDir = storage_path('app/generated');
        File::ensureDirectoryExists($storageDir, 0755, true);

        if (!File::exists($templatePath)) {
            Log::error("DOCX template not found", ['path' => $templatePath]);
            throw new \Exception("Template file not found at: {$templatePath}");
        }

        $referralId = $labReferral['id'] ?? throw new \Exception("Referral ID is missing.");
        $patient = $labReferral['patient'] ?? throw new \Exception("Patient data is missing.");
        $createdAt = isset($labReferral['created_at'])
            ? Carbon::parse($labReferral['created_at'])->format('Ymd_His')
            : now()->format('Ymd_His');

        $patientName = isset($patient['fname'], $patient['lname'])
            ? preg_replace('/[^A-Za-z0-9_-]/', '', "{$patient['fname']}_{$patient['lname']}")
            : 'unknown_patient';

        $docxPath = "{$storageDir}/lab_referral_{$referralId}_{$patientName}_{$createdAt}.docx";

        $templateProcessor = new TemplateProcessor($templatePath);

        // 🧑‍⚕️ Patient Info
        $age = isset($patient['birthdate']) ? Carbon::parse($patient['birthdate'])->age : 'N/A';
        $address = 'N/A';

        if (isset($patient['student'])) {
            $s = $patient['student'];
            $address = "{$s['address_house']}, {$s['address_brgy']}, {$s['address_citytown']}, {$s['address_province']} {$s['address_zipcode']}";
        } elseif (isset($patient['personnel'])) {
            $p = $patient['personnel'];
            $address = "{$p['res_brgy']}, {$p['res_city']}, {$p['res_prov']}, {$p['res_region']} {$p['res_zipcode']}";
        }

        $fullName = trim("{$patient['fname']} " . ($patient['mname'] ?? '') . " {$patient['lname']}");

        // 👨‍⚕️ School Physician
        $schoolPhysician = $labReferral['school_physician'] ?? [];
        $physicianDetails = [
            'sp_name' => trim(($schoolPhysician['fname'] ?? '') . ' ' . ($schoolPhysician['lname'] ?? '')),
            'sp_ext' => $schoolPhysician['ext'] ?? 'N/A',
            'sp_license' => $schoolPhysician['license_no'] ?? 'N/A',
            'sp_ptr' => $schoolPhysician['ptr_no'] ?? 'N/A',
            'sp_email' => $schoolPhysician['email'] ?? 'N/A',
            'sp_contact' => $schoolPhysician['contact_no'] ?? 'N/A',
        ];

        // 🧑‍⚕️ School Nurse
        $nurse = $labReferral['school_nurse'] ?? [];
        $nurseDetails = [
            'n_name' => trim(($nurse['fname'] ?? '') . ' ' . ($nurse['lname'] ?? '')),
            'n_license' => $nurse['license_no'] ?? 'N/A',
            'n_contact' => $nurse['contact_no'] ?? 'N/A',
            'n_ptr' => $nurse['ptr_no'] ?? '________',
        ];

        $check = fn($condition) => $condition ? '☑' : '☐';

        $othValue = $labReferral['others'] ?? 'N/A';
        $othCheck = ($othValue !== 'N/A') ? $check(true) : '☐';

        // 🔗 Template Variables
        $templateProcessor->setValues([
            // Patient
            'pn' => $fullName,
            'age' => $age,
            'ad' => $address,

            // Lab Requests
            'x' => $check($labReferral['x_ray'] ?? false),
            'cbc' => $check($labReferral['cbc'] ?? false),
            'ur' => $check($labReferral['urinalysis'] ?? false),
            'fe' => $check($labReferral['fecalysis'] ?? false),
            'pe' => $check($labReferral['physical_examination'] ?? false),
            'd' => $check($labReferral['dental'] ?? false),
            'hb' => $check($labReferral['hepatitis_b_screening'] ?? false),
            'pt' => $check($labReferral['pregnancy_test'] ?? false),
            'dt' => $check($labReferral['drug_test'] ?? false),
            'm8' => $check($labReferral['magic_8'] ?? false),
            'fbs' => $check($labReferral['fbs'] ?? false),
            'li' => $check($labReferral['lipid_profile'] ?? false),
            'bun' => $check($labReferral['bun'] ?? false),
            'bua' => $check($labReferral['bua'] ?? false),
            'cre' => $check($labReferral['creatine'] ?? false),
            'sgp' => $check($labReferral['sgpt'] ?? false),
            'sgo' => $check($labReferral['sgot'] ?? false),
            'oth' => $othValue,
            'oc' => $othCheck,

            // School Physician
            'sp_n' => $physicianDetails['sp_name'],
            'sp_ext' => $physicianDetails['sp_ext'],
            'sp_l' => $physicianDetails['sp_license'],
            'sp_ptr' => $physicianDetails['sp_ptr'],
            'sp_e' => $physicianDetails['sp_email'],
            'sp_c' => $physicianDetails['sp_contact'],

            // Nurse
            'n_n' => $nurseDetails['n_name'],
            'n_l' => $nurseDetails['n_license'],
            'n_c' => $nurseDetails['n_contact'],
            'n_ptr' => $nurseDetails['n_ptr'],

            // Date
            'date' => now()->format('Y-m-d'),
        ]);

        $templateProcessor->saveAs($docxPath);
        Log::info("Lab Exam Referral DOCX generated", ['file_path' => $docxPath]);

        return $docxPath;
    }

    public static function generatePDF($labReferral)
    {
        Log::info("🧪 Starting Lab Exam Referral PDF generation", ['referral_id' => $labReferral['id']]);

        $createdAt = isset($labReferral['created_at'])
            ? Carbon::parse($labReferral['created_at'])->format('Ymd_His')
            : now()->format('Ymd_His');

        $patientName = isset($labReferral['patient']['fname'], $labReferral['patient']['lname'])
            ? preg_replace('/[^A-Za-z0-9_-]/', '', "{$labReferral['patient']['fname']}_{$labReferral['patient']['lname']}")
            : 'unknown_patient';

        $pdfPath = storage_path("app/generated/lab_referral_{$labReferral['id']}_{$patientName}_{$createdAt}.pdf");

        // ✅ Return existing PDF if it exists
        if (File::exists($pdfPath)) {
            Log::info("✅ Lab Referral PDF already exists", ['file_path' => $pdfPath]);
            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="lab_referral_' . $labReferral['id'] . '.pdf"',
            ]);
        }

        Log::info("📝 Generating new DOCX for Lab Referral ID: {$labReferral['id']}");
        $docxPath = self::generateDocx($labReferral);

        if (!File::exists($docxPath)) {
            Log::error("❌ Lab Referral DOCX not found", ['file_path' => $docxPath]);
            throw new \Exception("DOCX file not found: {$docxPath}");
        }

        try {
            ConvertApi::setApiCredentials(env('CONVERTAPI_SECRET'));

            Log::info("🚀 Converting Lab Referral DOCX to PDF", ['docx_path' => $docxPath]);
            $result = ConvertApi::convert('pdf', ['File' => $docxPath]);

            $result->saveFiles($pdfPath);

            if (!File::exists($pdfPath)) {
                Log::error("❌ PDF file was not created", ['file_path' => $pdfPath]);
                throw new \Exception("PDF file was not created: {$pdfPath}");
            }

            Log::info("✅ Lab Referral PDF generated successfully", ['file_path' => $pdfPath]);

            return response()->file($pdfPath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="lab_referral_' . $labReferral['id'] . '.pdf"',
            ]);
        } catch (\Exception $e) {
            Log::error("❌ ConvertAPI PDF conversion failed", [
                'error_message' => $e->getMessage(),
                'referral_id' => $labReferral['id']
            ]);
            throw new \Exception("Failed to convert DOCX to PDF: " . $e->getMessage());
        }
    }

    public static function previewPDF($labReferral)
    {
        Log::info("🔍 Starting PDF preview for Lab Referral ID: " . $labReferral['id']);

        $createdAt = isset($labReferral['created_at'])
            ? Carbon::parse($labReferral['created_at'])->format('Ymd_His')
            : now()->format('Ymd_His');

        $patientName = isset($labReferral['patient']['fname'], $labReferral['patient']['lname'])
            ? preg_replace('/[^A-Za-z0-9_-]/', '', "{$labReferral['patient']['fname']}_{$labReferral['patient']['lname']}")
            : 'unknown_patient';

        $pdfPath = storage_path("app/generated/lab_referral_{$labReferral['id']}_{$patientName}_{$createdAt}.pdf");

        Log::info("📂 Checking PDF path: " . $pdfPath);

        if (!File::exists($pdfPath)) {
            Log::info("🛠️ PDF not found, generating...");
            self::generatePDF($labReferral);
        }

        if (!File::exists($pdfPath)) {
            Log::error("❌ PDF still not found after generation: " . $pdfPath);
            throw new \Exception("PDF file not found: {$pdfPath}");
        }

        Log::info("✅ PDF ready for preview", ['file_path' => $pdfPath]);

        return response()->file($pdfPath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="lab_referral_' . $labReferral['id'] . '.pdf"',
        ]);
    }
}