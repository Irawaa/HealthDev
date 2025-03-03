<?php

use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\ClinicStaffController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\NonPersonnelController;
use App\Http\Controllers\MedicalRecordController;
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

    Route::get('/medical', function () {
        return Inertia::render('MedicalRecords/Index');
    })->name('medical');

    Route::get('/medical', [MedicalRecordController::class, 'index'])->name('medical');

    // --- Patients --- //
    Route::get('/patients', [PatientController::class, 'index'])->name('patients.index');
    Route::post('/patients', [PatientController::class, 'store'])->name('patients.store');
    Route::put('/patients/{patient}', [PatientController::class, 'update'])->name('patients.update');
    Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])->name('patients.destroy');

    // Patient - Students //
    Route::post('/students', [StudentController::class, 'store'])->name('students.store');

    // Patient - Personnel //
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');

    // Patient - Non-Personnel //
    Route::post('/nonpersonnel', [NonPersonnelController::class, 'store'])->name('nonpersonnel.store');

    // Medical Records //
    Route::post('/medical-records', [MedicalRecordController::class, 'store'])->name('medical-records.store');

    // --- Logout ---
    Route::post('/logout', [AuthenticateController::class, 'destroy'])->name('logout');
});
