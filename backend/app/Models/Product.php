<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
   use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'image',
        'category_id',
    ];

    public function category()
{
    //Laravel will look for the category_id column on the products table to know which category this product belongs to.
    return $this->belongsTo(Category::class); //each product belongs to one category ex- mobile, laptop etc belongs to electronics category ,One-many relationship.
}
    public  function cart(){
        // a product can appear in many users carts
    return $this->belongsTo(Cart::class);
    }
}
