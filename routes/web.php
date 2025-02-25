<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ClinicStaffController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthenticateController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Auth;


// Route::middleware(['web', 'admin'])->group(function () {
//     Route::resource('/clinic-staff', ClinicStaffController::class);
// });


Route::get('/patients/{id}', [PatientController::class, 'show'])->name('patients.show');

Route::get('/edit-patients', [PatientController::class, 'index'])->name('edit_patients.index');
Route::post('/edit-patients', [PatientController::class, 'store'])->name('edit_patients.store');
Route::put('/edit-patients/{patient}', [PatientController::class, 'update'])->name('edit_patients.update');
Route::delete('/edit-patients/{patient}', [PatientController::class, 'destroy'])->name('edit_patients.destroy');

Route::get('/patients', function () {
    return Inertia::render('Patients/Index');

});

require __DIR__ . '/auth.php';