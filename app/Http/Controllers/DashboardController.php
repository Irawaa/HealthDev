<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Support\Facades\DB;
use App\Models\FDARForm;
use App\Models\BPForm;
use App\Models\DentalCertificate;
use App\Models\LaboratoryExamReferral;
use App\Models\MedicalCertificate;
use App\Models\PreParticipatory;
use App\Models\Prescription;
use App\Models\DentalRecord; // Importing DentalRecord
use App\Models\MedicalRecord; // Importing MedicalRecord
use App\Models\GeneralReferral; // Importing GeneralReferral
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the dashboard with total consultation records.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $recentPatients = Patient::select('patients.patient_id', 'fname', 'lname')
            ->joinSub(
                DB::table('medical_records')->select('patient_id', 'created_at', DB::raw("'Medical Record' as record_type"))
                    ->unionAll(DB::table('dental_records')->select('patient_id', 'created_at', DB::raw("'Dental Record' as record_type")))
                    ->unionAll(DB::table('bp_forms')->select('patient_id', 'created_at', DB::raw("'BP Form' as record_type")))
                    ->unionAll(DB::table('fdar_forms')->select('patient_id', 'created_at', DB::raw("'FDAR Form' as record_type")))
                    ->unionAll(DB::table('incident_reports')->select('patient_id', 'created_at', DB::raw("'Incident Report' as record_type")))
                    ->unionAll(DB::table('prescriptions')->select('patient_id', 'created_at', DB::raw("'Prescription' as record_type")))
                    ->unionAll(DB::table('medical_certificates')->select('patient_id', 'created_at', DB::raw("'Medical Certificate' as record_type")))
                    ->unionAll(DB::table('dental_certificates')->select('patient_id', 'created_at', DB::raw("'Dental Certificate' as record_type")))
                    ->unionAll(DB::table('laboratory_exam_referrals')->select('patient_id', 'created_at', DB::raw("'Laboratory Exam Referral' as record_type")))
                    ->unionAll(DB::table('general_referrals')->select('patient_id', 'created_at', DB::raw("'General Referral' as record_type")))
                    ->unionAll(DB::table('pre_participatories')->select('patient_id', 'created_at', DB::raw("'Pre-Participatory' as record_type"))),
                'all_records',
                function ($join) {
                    $join->on('patients.patient_id', '=', 'all_records.patient_id');
                }
            )
            ->select('patients.patient_id', 'fname', 'lname', 'all_records.created_at', 'all_records.record_type')
            ->orderByDesc('all_records.created_at')
            ->limit(5)
            ->get()
            ->map(function ($record) {
                return [
                    'id' => $record->patient_id,
                    'name' => "{$record->lname}, {$record->fname} {$record->mname}",
                    'record' => $record->record_type,
                    'consultationDate' => \Carbon\Carbon::parse($record->created_at)->toDateString(),
                    'createdAt' => $record->created_at,
                ];
            });

        // Get the total number of FDAR records
        $totalFdarRecords = FDARForm::count();

        // Get the total number of BPForm records
        $totalBpRecords = BPForm::count();

        // Get the total number of Dental Certificates
        $totalDentalCertificates = DentalCertificate::count();

        // Get the total number of Laboratory Exam Referrals
        $totalLaboratoryExamReferrals = LaboratoryExamReferral::count();

        // Get the total number of Medical Certificates
        $totalMedicalCertificates = MedicalCertificate::count();

        // Get the total number of Pre Participatory records
        $totalPreParticipatoryRecords = PreParticipatory::count();

        // Get the total number of Prescriptions
        $totalPrescriptions = Prescription::count();

        // Get the total number of Dental Records
        $totalDentalRecords = DentalRecord::count();  // Counting Dental Records

        // Get the total number of Medical Records
        $totalMedicalRecords = MedicalRecord::count();  // Counting Medical Records

        // Get the total number of General Referrals
        $totalGeneralReferrals = GeneralReferral::count(); // Counting General Referrals

        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Total consultations this month (FDAR + BP)
        $totalConsultations = FDARForm::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count()
            + BPForm::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count();

        // Total records (FDAR, BP, Dental Certificates, Medical Certificates, etc.)
        $totalRecords = $totalFdarRecords + $totalBpRecords + $totalDentalCertificates + $totalLaboratoryExamReferrals + $totalMedicalCertificates + $totalPreParticipatoryRecords + $totalPrescriptions + $totalDentalRecords + $totalMedicalRecords + $totalGeneralReferrals;

        // Total referred (sum of all referrals)
        $totalReferred = $totalGeneralReferrals + $totalLaboratoryExamReferrals;

        // Return data to React using Inertia
        return Inertia::render('Dashboard', [
            'totalFdarRecords' => $totalFdarRecords,
            'totalBpRecords' => $totalBpRecords,
            'totalDentalCertificates' => $totalDentalCertificates,
            'totalLaboratoryExamReferrals' => $totalLaboratoryExamReferrals,
            'totalMedicalCertificates' => $totalMedicalCertificates,
            'totalPreParticipatoryRecords' => $totalPreParticipatoryRecords,
            'totalPrescriptions' => $totalPrescriptions,
            'totalDentalRecords' => $totalDentalRecords,  // Passing Dental Records count
            'totalMedicalRecords' => $totalMedicalRecords, // Passing Medical Records count
            'totalGeneralReferrals' => $totalGeneralReferrals, // Passing General Referrals count
            'totalConsultations' => $totalConsultations,
            'totalRecords' => $totalRecords,
            'totalReferred' => $totalReferred,
            'recentPatients' => $recentPatients,
        ]);
    }
}
