<?php

use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\ClinicStaffController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\NonPersonnelController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\DentalRecordController;
use App\Http\Controllers\FDARFormController;
use App\Http\Controllers\BPFormController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\PreParticipatoryController;
use App\Http\Controllers\MedicalCertificateController;
use App\Http\Controllers\DentalCertificateController;
use App\Http\Controllers\GeneralReferralController;
use App\Http\Controllers\LaboratoryExamReferralController;

use App\Http\Controllers\MedicalHistoryController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['web', 'guest'])->group(function () {

    // --- Login ------//
    Route::get('/', function () {
        return Inertia::render('Login');
    });

    Route::get('/login', [AuthenticateController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticateController::class, 'store']);
});

// --- Routes for clinic staff (Admins only) ---
Route::middleware(['web', 'admin'])->group(function () {
    // -- Clinic Staff CRUD---//
    Route::resource('/clinic-staff', ClinicStaffController::class);

    // --- User Register ---//
    Route::post('/user/register', [UserController::class, 'register']);
    Route::put('/user/change-password', [UserController::class, 'changePassword']);
});

// --- Routes for all authenticated users ---
Route::middleware(['web', 'auth'])->group(function () {

    // --- Dashboard (Admins and Regular Users) ---
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/medical', [MedicalRecordController::class, 'index'])->name('medical');

    Route::get('/medical-history', [MedicalHistoryController::class, 'showMedicalHistory'])->name('medical-history.index');

    // --- Patients --- //
    Route::get('/patients', [PatientController::class, 'index'])->name('patients.index');
    Route::post('/patients', [PatientController::class, 'store'])->name('patients.store');
    Route::put('/patients/{patient}', [PatientController::class, 'update'])->name('patients.update');
    Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])->name('patients.destroy');
    Route::get('/patients/search', [PatientController::class, 'search'])->name('patients.search'); // Search API route

    // Patient - Students //
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');

    // Patient - Personnel //
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');

    // Patient - Non-Personnel //
    Route::post('/nonpersonnel', [NonPersonnelController::class, 'store'])->name('nonpersonnel.store');

    // Medical Records //
    Route::post('/medical-records', [MedicalRecordController::class, 'store'])->name('medical-records.store');
    Route::post('/medical-records/{id}', [MedicalRecordController::class, 'update'])->name('medical-records.update');
    Route::delete('/medical-records/{id}', [MedicalRecordController::class, 'destroy'])->name('medical-records.destroy');
    Route::get('/medical-records/{id}/image', [MedicalRecordController::class, 'showXrayImage'])->name('medical-records-image.show');
    Route::post('/medical-records/{id}/update-xray', [MedicalRecordController::class, 'updateChestXray'])
        ->name('medical-records.update-xray');

    // Dental Records //
    Route::post('/dental-records/store', [DentalRecordController::class, 'store'])->name('dental-records.store');
    Route::put('/dental-records/{dentalRecord}', [DentalRecordController::class, 'update'])->name('dental-records.update');
    Route::delete('/dental-records/{dentalRecord}', [DentalRecordController::class, 'destroy'])->name('dental-records.destroy');

    // FDAR Forms //
    Route::post('/fdar-forms', [FDARFormController::class, 'store'])->name('fdar-forms.store');
    Route::put('/fdar-forms/{id}', [FDARFormController::class, 'update'])->name('fdar.update'); // Update FDAR Form
    Route::delete('/fdar-forms/{id}', [FDARFormController::class, 'destroy'])->name('fdar-forms.destroy');
    Route::get('/fdar/{id}/pdf', [FDARFormController::class, 'viewPDF']);
    Route::get('/fdar/preview/{id}', [FDARFormController::class, 'preview']);


    // BP Forms (BP Pressure Monitoring Form) //
    Route::post('/bp-forms', [BPFormController::class, 'store'])->name('bp-forms.store');
    Route::put('/bp-forms/{id}', [BPFormController::class, 'update'])->name('bp-forms.update');
    Route::delete('/bp-forms/{id}', [BPFormController::class, 'destroy'])->name('bp-forms.destroy');
    Route::get('/bp-forms/{id}/pdf', [BPFormController::class, 'viewPDF'])->name('bp-forms.view-pdf');
    Route::get('/bp-forms/preview/{id}', [BPFormController::class, 'preview'])->name('bp-forms.preview');

    // Incidents Reports Form //
    Route::post('/incident-reports', [IncidentReportController::class, 'store'])->name('incident-reports.store');
    Route::patch('/incident-reports/{id}', [IncidentReportController::class, 'update'])->name('incident-reports.update');
    Route::delete('/incident-reports/{id}', [IncidentReportController::class, 'destroy'])->name('incident-reports.destroy');
    Route::get('/incident-reports/{id}/pdf', [IncidentReportController::class, 'viewPDF'])->name('incident-reports.view-pdf');
    Route::get('/incident-reports/preview/{id}', [IncidentReportController::class, 'preview'])->name('incident-reports.preview');

    // Prescriptions Form //
    Route::post('/prescriptions', [PrescriptionController::class, 'store'])->name('prescriptions.store');
    Route::put('/prescriptions/{id}', [PrescriptionController::class, 'update'])->name('prescriptions.update');
    Route::delete('/prescriptions/{id}', [PrescriptionController::class, 'destroy'])->name('prescriptions.destroy');
    Route::get('/prescriptions/{id}/image', [PrescriptionController::class, 'showImage'])->name('prescriptions.show');

    // Pre-Participatory Form //
    Route::post('/pre-participatory', [PreParticipatoryController::class, 'store'])->name('pre-participatory.store');
    Route::put('/pre-participatory/{id}', [PreParticipatoryController::class, 'update'])->name('pre-participatory.update');
    Route::delete('/pre-participatory/{id}', [PreParticipatoryController::class, 'destroy'])->name('pre-participatory.destroy');

    // Medical Certificates //
    Route::post('/medical-certificates', [MedicalCertificateController::class, 'store'])->name('medical-certificates.store');
    Route::put('/medical-certificates/{id}', [MedicalCertificateController::class, 'update'])->name('medical-certificates.update');
    Route::delete('/medical-certificates/{id}', [MedicalCertificateController::class, 'destroy'])->name('medical-certificates.destroy');
    Route::get('/medical-certificates/{id}/pdf', [MedicalCertificateController::class, 'viewPDF'])->name('medical-certificates.pdf');
    Route::get('/medical-certificates/preview/{id}', [MedicalCertificateController::class, 'preview'])->name('medical-certificates.preview');

    // Dental Certificates //
    Route::post('/dental-certificates', [DentalCertificateController::class, 'store'])->name('dental-certificates.store');
    Route::put('/dental-certificates/{id}', [DentalCertificateController::class, 'update'])->name('dental-certificates.update');
    Route::delete('/dental-certificates/{id}', [DentalCertificateController::class, 'destroy'])->name('dental-certificates.destroy');
    Route::get('/dental-certificates/{id}/pdf', [DentalCertificateController::class, 'viewPDF'])->name('dental-certificates.pdf');
    Route::get('/dental-certificates/preview/{id}', [DentalCertificateController::class, 'preview'])->name('dental-certificates.preview');

    // General Referrals //
    Route::post('/general-referrals', [GeneralReferralController::class, 'store'])->name('general-referrals.store');
    Route::put('/general-referrals/{id}', [GeneralReferralController::class, 'update'])->name('general-referrals.update');
    Route::delete('/general-referrals/{id}', [GeneralReferralController::class, 'destroy'])->name('general-referrals.destroy');

    // Laboratory Exam Referrals //
    Route::post('/laboratory-exam-referrals', [LaboratoryExamReferralController::class, 'store'])->name('laboratory-exam-referrals.store');
    Route::put('/laboratory-exam-referrals/{id}', [LaboratoryExamReferralController::class, 'update'])->name('laboratory-exam-referrals.update');
    Route::delete('/laboratory-exam-referrals/{id}', [LaboratoryExamReferralController::class, 'destroy'])->name('laboratory-exam-referrals.destroy');

    // --- Logout ---
    Route::post('/logout', [AuthenticateController::class, 'destroy'])->name('logout');
});
