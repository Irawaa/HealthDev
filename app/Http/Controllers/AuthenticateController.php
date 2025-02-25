<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticateController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        $remember = $request->boolean('remember');

        if (Auth::attempt($credentials, $remember)) {
            $request->session()->regenerate();

            $user = Auth::user();
            if (!$user) {
                return back()->withErrors(['username' => 'Authentication successful, but user not found.']);
            }

            // Redirect based on role
            if ($user->role === 'admin') {
                return redirect()->intended('/dashboard')->with(['user' => $user]);
            }

            return redirect()->intended('/dashboard')->with(['user' => $user]);
        }

        return back()->withErrors([
            'username' => 'Invalid credentials, please try again.'
        ])->onlyInput('username');
    }

    /**
     * Logout user and destroy session.
     */
    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/login');
    }
}
