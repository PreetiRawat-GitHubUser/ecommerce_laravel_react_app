<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
  public function index()
    {
        $products = Product::with('category')->orderBy('id', 'desc')->get();
        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([ //store new product
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer',  // pending-> have to fix all null values in resposne;
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
 
        ]);
       // $product = Product::create($request->all());
        $product = new Product($request->only('name', 'price', 'category_id','stock','description'));

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('products', 'public');
        $product->image = $path;
    }

    $product->save();

        return response()->json($product, 201); // pending-> with data success msg should be visible on response
        
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Product::findorFail($id); //showing specific product
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, $id)
{
    //dd($request->all());
    $product = Product::findOrFail($id);

    $request->validate([
        'name' => 'sometimes|string|max:255',
        'price' => 'sometimes|numeric',
        'category_id' => 'sometimes|exists:categories,id',
        'stock' => 'sometimes|integer', 
        'description'=> 'nullable|string',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
    ]);

    $product->fill($request->only('name', 'price', 'category_id','stock','description'));

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('products', 'public');
        $product->image = $path;
    }

    $product->save();
    return response()->json($product);
}

}
