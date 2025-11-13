<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
  public function store(Request $request)
{
    $request->validate([
        'order_id' => 'required|exists:orders,id',
        'amount' => 'required|numeric|min:0',
    ]);

    $order = Order::findOrFail($request->order_id);

    // Checking if payment already exists
    if ($order->payment) {
        return response()->json(['message' => 'Payment already exists for this order.'], 400);
    }

    // Simulate payment success
    $payment = Payment::create([
        'order_id' => $order->id,
        'amount' => $request->amount,
        'payment_status' => 'completed', // payment success
        'payment_method' => 'dummy', // just to show
        'transaction_id' => 'TXN' . time(),// its just to show time FOLLOWED BY TXN a unique transaction id as its dummy the real one provide it from their server.
    ]);

    // Order should remain pending
    $order->update(['order_status' => 'pending', 'payment_status' =>'completed']);
       // Reload relationships to include latest payment info
    $order->refresh()->load('payment');

    return response()->json([
        'message' => 'Payment successful. Order is pending for processing.',
        'payment' => $payment,
        'order' => $order
    ], 201);
}

    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
