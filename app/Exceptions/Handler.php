<?php

namespace App\Exceptions;

use Log;
use Throwable;
use Inertia\Inertia;
use App\Helpers\RouteHelper;
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

    public function render($request, Throwable $e)
    {
        // Kalau request via Inertia (React frontend)
        if ($request->inertia()) {
            // 403 Forbidden
            if ($e instanceof AuthorizationException) {
                return Inertia::render('Error/Forbidden403', [
                    'message' => $e->getMessage() ?: 'Anda tidak memiliki akses ke halaman ini.',
                    'dashboardUrl' => RouteHelper::getDashboardRouteByRole(),
                ])->toResponse($request)->setStatusCode(403);
            }

            // 404 Not Found
            if ($e instanceof NotFoundHttpException) {
                return Inertia::render('Error/NotFound404', [
                    'message' => $e->getMessage() ?: 'Halaman atau data tidak ditemukan.',
                    'dashboardUrl' => RouteHelper::getDashboardRouteByRole(),
                ])->toResponse($request)->setStatusCode(404);
            }
        }

        // Kalau bukan inertia (Blade fallback)
        if ($e instanceof AuthorizationException) {
            return response()->view('errors.403', [
                'message' => $e->getMessage() ?: 'Anda tidak memiliki akses ke halaman ini.',
                'dashboardUrl' => RouteHelper::getDashboardRouteByRole(),
            ], 403);
        }

        if ($e instanceof NotFoundHttpException) {
            return response()->view('errors.404', [
                'message' => $e->getMessage() ?: 'Halaman atau data tidak ditemukan.',
                'dashboardUrl' => RouteHelper::getDashboardRouteByRole(),
            ], 404);
        }

        return parent::render($request, $e);
    }

}
