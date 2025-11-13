<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderManagementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
           $status = $request->query('status'); // ?status=pending
        $query = Order::with(['user', 'items.product', 'payment'])->latest();

        if ($status) {
            $query->where('order_status', $status);
        }

        $orders = $query->paginate(10); // 10 per page
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.product', 'payment'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    /**
     * Update the specified resource in storage.
     */
      public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'order_status' => 'required|in:pending,shipped,delivered,cancelled',
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->update(['order_status' => $request->order_status]);

        return response()->json([
            'message' => 'Order status updated successfully',
            'order' => $order
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
