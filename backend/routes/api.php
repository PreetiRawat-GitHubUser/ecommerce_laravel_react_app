 <?php

    use App\Http\Controllers\AuthController;
    use App\Http\Controllers\CartController;
    use App\Http\Controllers\OrderController;
    use App\Http\Controllers\ProductController;
    use App\Http\Controllers\CategoryController;
    use App\Http\Controllers\PaymentController;
    use App\Http\Controllers\AdminDashboardController;
    use App\Http\Controllers\Admin\OrderManagementController;
    use App\Http\Controllers\AdminUserController;
    use App\Http\Controllers\Admin\AdminProfileController;
    use Illuminate\Support\Facades\Route;


    //login, register and logout route
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    //product routes

    // Route::apiResource('products', App\Http\Controllers\ProductController::class);
    Route::apiResource('products', ProductController::class); // apiResource is just a shortcut that expands into all these routes:

    // POST /api/products → create product
    // (send name, price, stock, etc.)

    // GET /api/products/{id} → get product by id

    // PUT /api/products/{id} → update

    // DELETE /api/products/{id} → delete

    //cart routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{id}', [CartController::class, 'update']);
        Route::delete('/cart/clear', [CartController::class, 'clear']);
        Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    });

    //category routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('categories', CategoryController::class); 
    });

    //order routes , only authenticated users can place order and view their orders
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/orders', [OrderController::class, 'store']); // place order
        Route::get('/orders', [OrderController::class, 'index']);  // view orders
        Route::get('/orders/{id}', [OrderController::class, 'show']); // view specific order details
    });

    //status route , only admin can update order status like shipped, delivered etc.
    Route::middleware(['auth:sanctum', 'admin'])->group(function () {
        Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']); //PATCH is specifically used when you want to partially update a resource.ex-PUT /orders/5 → Replace the whole order record (all fields).PATCH /orders/5/status → Update just the status field (not touching other fields).
    });
    // Here, we are using both auth:sanctum and admin middleware to ensure that only authenticated admin users can access this route.

    //cancel order by user'
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']);
    });


    // dummy Payment routes

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/orders/{id}/pay', [PaymentController::class, 'store']);
    });


    //admin dashboard order management routes
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/orders', [OrderManagementController::class, 'index']); // All orders
        Route::get('/orders/{id}', [OrderManagementController::class, 'show']); // Specific order
        Route::put('/orders/{id}/status', [OrderManagementController::class, 'updateStatus']); // Update order status

    });

    //admin category routes
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

        // dashboard Category management
        Route::get('/categories', [CategoryController::class, 'index']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    });

    //Admin product management route
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    // dashboard Product management
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});

//admin dashboard stats route
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard/stats', [AdminDashboardController::class, 'stats']);
});

//admin dashboard user management

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Get all users
    Route::get('/admin/users', [AdminUserController::class, 'index']);

    // Promote a user to admin
    Route::post('/admin/users/{id}/promote', [AdminUserController::class, 'promote']);

    // Demote a user to normal role
    Route::post('/admin/users/{id}/demote', [AdminUserController::class, 'demote']);

    // Delete a user
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);
});

//admin dashboard profile route

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/profile', [AdminProfileController::class, 'show']);
    Route::post('/profile', [AdminProfileController::class, 'update']);
});
