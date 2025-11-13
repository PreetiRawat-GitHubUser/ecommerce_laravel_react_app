<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;


return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
   ->withMiddleware(function (Middleware $middleware) {
        // Enable CORS globally
        $middleware->use([\Illuminate\Http\Middleware\HandleCors::class,
        // other middleware classes

    ]);
     // Route middleware aliases for specific routes, like this is for admin only routes to change status as shipped or delivered etc.
    $middleware->alias([
        'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
        'auth:sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
        // other middleware aliases
    ]);

    })

    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
