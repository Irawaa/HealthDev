<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ClinicStaff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50|unique:users,username',
            'password' => 'required|string|min:6',
            'staff_id' => 'required|exists:clinic_staffs,staff_id',
        ]);

        $email = ClinicStaff::where('staff_id', $request->staff_id)->value('email');

        if (!$email) {
            return back()->withErrors(['staff_id' => 'Invalid staff ID.']);
        }

        User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'email' => $email,
            'staff_id' => $request->staff_id,
            'role' => 'user', // Set default role as admin
        ]);

        return back()->with('success', 'User registered successfully as an admin.');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string|min:6|confirmed',
            'staff_id' => 'required|exists:users,staff_id',
        ]);

        $user = User::where('staff_id', $request->staff_id)->first();
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Password changed successfully.');
    }
}
