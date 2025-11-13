<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        // Basic counts
        $totalOrders = Order::count();
        $completedOrders = Order::where('order_status', 'completed')->count();
        $pendingOrders = Order::where('order_status', 'pending')->count();
        $totalProducts = Product::count();
        $totalCategories = Category::count();

        // Total revenue (only completed orders)
        $totalRevenue = Order::where('order_status', 'completed')->sum('total_amount');

        // Revenue by month (for charts)
        $monthlyRevenue = Order::select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as total')
            )
            ->where('order_status', 'completed')
            ->groupBy('month')
            ->get();

        // Top categories by product count
        $topCategories = Category::withCount('products')
            ->orderByDesc('products_count')
            ->take(5)
            ->get();

        return response()->json([
            'summary' => [
                'totalOrders' => $totalOrders,
                'completedOrders' => $completedOrders,
                'pendingOrders' => $pendingOrders,
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
                'totalRevenue' => $totalRevenue,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'topCategories' => $topCategories,
        ]);
    }
}
