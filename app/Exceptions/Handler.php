<?php

namespace App\Exceptions;

use Log;
use Throwable;
use Inertia\Inertia;
use App\Helpers\RouteHelper;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        $guard = $exception->guards()[0] ?? null;

        switch ($guard) {
            case 'admin':
                $login = route('admin.login');
                break;

            case 'merchant':
                $login = route('merchant.login');
                break;

            case 'staff':
                $login = route('staff.login');
                break;

            default:
                $login = route('home');
                break;
        }

        return $request->expectsJson()
            ? response()->json(['message' => 'Unauthenticated'], 401)
            : redirect()->guest($login);
    }


    public function render($request, Throwable $e)
    {
        $status = ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpException)
            ? $e->getStatusCode()
            : 500;

        $messages = [
            401 => 'Anda harus login untuk mengakses halaman ini.',
            403 => $e instanceof AuthorizationException 
                    ? $e->getMessage() ?: 'Anda tidak memiliki akses ke halaman ini.'
                    : 'Anda tidak memiliki akses ke halaman ini.',
            404 => 'Halaman atau data tidak ditemukan.',
            419 => 'Sesi Anda telah berakhir. Silakan muat ulang halaman.',
            429 => 'Terlalu banyak permintaan. Coba lagi nanti.',
            500 => 'Terjadi kesalahan pada server.',
            503 => 'Layanan sedang dalam pemeliharaan.',
        ];

        $message = $messages[$status] ?? 'Terjadi kesalahan pada aplikasi.';

        // Mapping status code → JSX component Inertia
        $statusToComponent = [
            401 => 'Error/Unauthorized401',
            403 => 'Error/Forbidden403',
            404 => 'Error/NotFound404',
            419 => 'Error/PageExpired419',
            429 => 'Error/TooManyRequests429',
            500 => 'Error/ServerError500',
            503 => 'Error/ServiceUnavailable503',
        ];

        if ($request->inertia()) {
            $component = $statusToComponent[$status] ?? 'Error/GenericError';

            return Inertia::render($component, [
                'message' => $message,
                'dashboardUrl' => RouteHelper::getDashboardRouteByRole(),
            ])->toResponse($request)->setStatusCode($status);
        }

        // Blade fallback
        $titles = [
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            419 => 'Page Expired',
            429 => 'Too Many Requests',
            500 => 'Server Error',
            503 => 'Service Unavailable',
        ];

        return response()->view('errors.error', [
            'code' => $status,
            'title' => $titles[$status] ?? 'Error',
            'message' => $message,
        ], $status);
    }





}
