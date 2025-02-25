<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user(); // Get the authenticated use

        if (!$user) {
            return redirect('/login')->withErrors('You must be logged in.');
        }

        // Allow access if the user is an admin or a regular authenticated user
        if ($user->role === 'admin' || $request->route()->getName() === 'dashboard') {
            return $next($request);
        }

        return redirect('/dashboard')->withErrors('Unauthorized access.');
    }
}
