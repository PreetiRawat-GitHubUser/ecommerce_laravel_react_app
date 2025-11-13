<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
    ];

      public function products()
    {
        //Laravel will automatically assume the products table has a column called category_id as the foreign key.
        return $this->hasMany(Product::class); //one category can have many products ex- electronics category can have mobile, laptop etc products.
    }
}
