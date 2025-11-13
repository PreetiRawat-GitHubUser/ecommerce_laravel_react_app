<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use Illuminate\Auth\Events\Validated;
USE Illuminate\Support\Facades\DB;
 

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $cart= Cart::with('product')->where('user_id', auth()->id())->get();
        return response()->json($cart);
    }

    /**
     * Store a newly created resource in storage.
     */
 public function store(Request $request)
{
    $request->validate([
        'product_id' => 'required|exists:products,id',
        'quantity' => 'required|integer|min:1',
    ]);

    $cart = Cart::where('user_id', auth()->id())
                ->where('product_id', $request->product_id)
                ->first();

    if ($cart) {
        //  product already in cart → update quantity
        $cart->quantity += $request->quantity;
        $cart->save();
    } else {
        //  product not in cart → create new entry
        $cart = new Cart();
        $cart->user_id = auth()->id();
        $cart->product_id = $request->product_id;
        $cart->quantity = $request->quantity;
        $cart->save();
    }

    return response()->json([
        'message' => 'Product added to cart successfully!',
        'cart' => $cart
    ]);
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
        $cart = Cart::where('user_id', auth()->id())->findOrFail($id);
        $request->validate([
            'quantity'=>'required|integer|min:1'
        ]);

        $cart->update(['quantity'=> $request->quantity]);
        return response()->json($cart);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $cart = Cart::where('user_id', auth()->id())->findOrFail($id);
        $cart->delete();
        return response()->json(['message'=>'Item Removed']);
    }

public function clear()
{
    Cart::where('user_id', auth()->id())->delete();

    return response()->json([
        'message' => 'Cart cleared successfully'
    ], 200);
}


}
