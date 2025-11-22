<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProfileController extends Controller
{

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Profiles/Index');
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Admin/Profiles/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'auth' => [
                'user' => $request->user()->fresh() 
            ],
        ]);
    }

    public function settings() 
    {
        return Inertia::render('Admin/Settings');
    }
}