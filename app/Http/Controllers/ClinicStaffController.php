<?php

namespace App\Http\Controllers;

use App\Models\ClinicStaff;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClinicStaffController extends Controller
{
    public function index()
    {
        // $clinicStaffs = ClinicStaff::paginate(5); // Retrieves paginated records
        // return Inertia::render('ClinicStaff/Index', ['clinicStaffs' => $clinicStaffs]);

        $clinicStaffs = ClinicStaff::leftJoin('users', 'clinic_staffs.staff_id', '=', 'users.staff_id')
            ->select('clinic_staffs.*', 'users.user_id', 'users.role as user_role')
            ->paginate(5);

        return Inertia::render('ClinicStaff/Index', ['clinicStaffs' => $clinicStaffs]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lname' => 'required|string|max:100',
            'fname' => 'required|string|max:100',
            'mname' => 'nullable|string|max:100',
            'ext' => 'nullable|string|max:10',
            'role' => 'required|in:School Nurse,School Physician,School Dentist',
            'license_no' => 'required|string|max:50',
            'ptr_no' => 'required|string|max:50',
            'email' => 'required|email|max:200|unique:clinic_staffs,email',
            'contact_no' => 'nullable|string|max:50',
        ]);

        ClinicStaff::create($validated);
        return redirect()->route('clinic-staff.index')->with('success', 'Clinic Staff Added');
    }

    public function refetch()
    {
        $clinicStaffs = ClinicStaff::paginate(5);
        return response()->json($clinicStaffs);
    }


    public function update(Request $request, ClinicStaff $clinicStaff)
    {
        $validated = $request->validate([
            'lname' => 'required|string|max:100',
            'fname' => 'required|string|max:100',
            'mname' => 'nullable|string|max:100',
            'ext' => 'nullable|string|max:10',
            'role' => 'required|in:School Nurse,School Physician,School Dentist',
            'license_no' => 'required|string|max:50',
            'ptr_no' => 'required|string|max:50',
            'email' => 'required|email|max:200|unique:clinic_staffs,email,' . $clinicStaff->staff_id . ',staff_id',
            'contact_no' => 'nullable|string|max:50',
        ]);

        $clinicStaff->update($validated);
        return redirect()->route('clinic-staff.index')->with('success', 'Clinic Staff Updated');
    }

    public function destroy(ClinicStaff $clinicStaff)
    {
        // Check if the user associated with this staff is an admin
        $user = $clinicStaff->user;

        $adminCount = \App\Models\User::where('role', 'admin')->count();
        if ($user && $user->role === 'admin' && $adminCount <= 1) {
            return redirect()->route('clinic-staff.index')->with('error', 'Cannot delete the only admin.');

            // Prevent deletion if it's the only admin
            if ($adminCount <= 1) {
                return redirect()->route('clinic-staff.index')->with('error', 'Cannot delete the only admin.');
            }
        }

        // Proceed with deletion if it's not the only admin
        $clinicStaff->delete();
        return redirect()->route('clinic-staff.index')->with('success', 'Clinic Staff Deleted');
    }
}
