<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\ClinicStaff;

class MedicalHistoryController extends Controller
{
    // Method to show the medical history for the logged-in nurse
    public function showMedicalHistory(Request $request)
    {
        // Get clinic staff ID from authenticated user (School Nurse ID)
        $clinicStaffId = Auth::user()->clinicStaff->staff_id ?? null;

        // Check if the authenticated user is linked to a clinic staff member (nurse)
        if (!$clinicStaffId) {
            Log::warning('Authenticated user is not linked to clinic staff.');
            return back()->withErrors('You are not authorized to view the medical history.');
        }

        // Get the ClinicStaff record for the logged-in nurse
        $clinicStaff = ClinicStaff::findOrFail($clinicStaffId);

        // Get the filter parameter from the request
        $filter = $request->input('filter', 'medicalRecordsAsNurse'); // Default filter to medicalRecordsAsNurse

        // Build the query to retrieve only the relevant records based on the filter
        $medicalHistory = [];

        switch ($filter) {
            case 'medicalRecordsAsNurse':
                $medicalHistory['medicalRecordsAsNurse'] = $clinicStaff->medicalRecordsAsNurse;
                break;
            case 'dentalRecordsAsNurse':
                $medicalHistory['dentalRecordsAsNurse'] = $clinicStaff->dentalRecordsAsNurse;
                break;
            case 'bpFormsAsNurse':
                $medicalHistory['bpFormsAsNurse'] = $clinicStaff->bpFormsAsNurse()->with(['patient', 'readings'])->get();
                break;
            case 'fdarFormsAsNurse':
                $medicalHistory['fdarFormsAsNurse'] = $clinicStaff->fdarFormsAsNurse;
                break;
            case 'incidentReportsAsNurse':
                $medicalHistory['incidentReportsAsNurse'] = $clinicStaff->incidentReportsAsNurse;
                break;
            case 'medicalCertificatesAsNurse':
                $medicalHistory['medicalCertificatesAsNurse'] = $clinicStaff->medicalCertificatesAsNurse;
                break;
            case 'dentalCertificatesAsNurse':
                $medicalHistory['dentalCertificatesAsNurse'] = $clinicStaff->dentalCertificatesAsNurse;
                break;
            case 'prescriptionsAsNurse':
                $medicalHistory['prescriptionsAsNurse'] = $clinicStaff->prescriptionsAsNurse;
                break;
            case 'preParticipatoriesAsNurse':
                $medicalHistory['preParticipatoriesAsNurse'] = $clinicStaff->preParticipatoriesAsNurse;
                break;
            case 'generalReferralsAsNurse':
                $medicalHistory['generalReferralsAsNurse'] = $clinicStaff->generalReferralsAsNurse;
                break;
            case 'laboratoryExamReferralsAsNurse':
                $medicalHistory['laboratoryExamReferralsAsNurse'] = $clinicStaff->laboratoryExamReferralsAsNurse;
                break;
            default:
                // Handle invalid filter
                return back()->withErrors('Invalid filter selected.');
        }

        // Pass the medical history data to the Inertia view
        return Inertia::render('MedicalHistory/Index', [
            'medicalHistory' => $medicalHistory,
            'filter' => $filter, // Pass the current filter to the frontend
        ]);
    }
}
