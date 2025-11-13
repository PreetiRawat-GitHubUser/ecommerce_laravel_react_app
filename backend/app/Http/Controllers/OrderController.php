<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Cart;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $orders = Order::with('items.product')->where('user_id', auth()->id())->orderBy('created_at', 'desc')->get(); //Eager load items and products to avoid N+1 problem
        return response()->json($orders, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "shipping_address" => "required|string|max:300",
        ]);

        $user = auth()->user();

        //get all cart item for this user
        $cartitems = Cart::with('product')->where('user_id', $user->id)->get(); //product is a function in Cart model
        if ($cartitems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        DB::beginTransaction(); //start transaction, wrap all db operation in transaction so that if any operation fails all operation will be rollback,either everything succeeds or nothing changes

        try {
            // calculate total price
            $total = 0;
            foreach ($cartitems as $item) {
                if ($item->product->stock < $item->quantity) { // Checking stock before creating order
                    // return response()->json(['message' => 'not enough stock for: {$item->product->name}'], 400);
                    return response()->json([
                        'message' => "Sorry! Not enough stock available for {$item->product->name}."
                    ], 400);
                }
                $total += $item->product->price * $item->quantity;
            }
            //create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $total,
                'shipping_address' => $request->shipping_address,
                'order_status' => 'pending',
                'payment_status' => 'pending',
            ]);

            //create order items and reduce stock
            foreach ($cartitems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);

                // reduce stock
                $item->product->decrement('stock', $item->quantity);
            }
            //clear cart
            Cart::where('user_id', $user->id)->delete();

            DB::commit(); //commit transaction

            return response()->json(['message' => 'Order placed successfully', 'order' => $order->load('items.product'), 201]); //items.product->Load the items relation (all OrderItem rows for this order).For each item, also load its related product (via OrderItem → Product relation).
        } catch (\Exception $e) {
            DB::rollBack(); //rollback transaction if any operation fails
            return response()->json(['message' => 'Failed to place order', 'error' => $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'order_status' => 'required|in:pending,processing,shipped,delivered,cancelled',
        ]);
        $order = Order::findOrFail($id);
        // dd($order); // dump and die ,stops execution and give debug detail on response
        $order->order_status = $request->order_status;
        $order->save();
        return response()->json(['message' => 'Order status updated successfully', 'order' => $order]);
    }

    public function cancelOrder($id)
    {
        $user = auth()->user();
        $order = Order::with('items.product')->where('id', $id)->where('user_id', $user->id)->first();
        if (!$order) {
            return response()->json(['message' => 'order not found'], 404);
        }
        //if it is shipped or out for delivery you cannot cancel it.
        if ($order->order_status !== 'pending') {
            return response()->json(['message' => 'order cannot be cancelled once its been shipped or delivered'], 400);
        }
        //if it is in pending state, so cancel order and refill stock
        DB::beginTransaction();
        try {
            //restore stock for each product
            foreach ($order->items as $item) {
                $item->product->increment('stock', $item->quantity);
            }
            // set status as cancelled
            $order->order_status = "cancelled";
            // dd($order);
            $order->save();
            // dd($order->fresh()); 
            DB::commit();
            return response()->json(['message' => 'order has been cancelled successfully.']);
        } catch (\Exception  $e) {
            DB::rollback();
            return response()->json(['message' => 'something went wrong while cancelling the order.', 'error' => '$e->getMessage()'], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with('items.product')->where('user_id', auth()->id())->findOrFail($id); //Eager load items and products to avoid N+1 problem
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }
        return response()->json($order);
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

//Eager Loading → fetch related data in advance to avoid multiple queries.

//Atomicity → all-or-nothing in DB transactions, ensures safe rollback.

//N+1 Query Problem → performance issue caused by lazy loading relations repeatedly.