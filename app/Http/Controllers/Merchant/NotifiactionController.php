<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NotifiactionController extends Controller
{

    public function index(Request $request): Response
    {
        return Inertia::render('Merchant/Notifications/Index');
    }

    public function archive(Request $request): Response
    {
        return Inertia::render('Merchant/Notifications/Archive');
    }

}