<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NotifiactionController extends Controller
{

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Notifications/Index');
    }

    public function archive(Request $request): Response
    {
        return Inertia::render('Admin/Notifications/Archive');
    }

}