// src/user/components/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import { addToCart } from "../api/userApi";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("user_token");

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!token) {
      toast.error("Please login to add items to your cart.");
      navigate("/login"); // if you have login page later
      return;
    }

    try {
      const res = await addToCart( product.id, 1);
      toast.success(res.data.message || "Added to cart!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };


  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer border rounded-lg shadow hover:shadow-lg p-4 transition duration-200"
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-80 object-cover rounded mb-3"
      />
      <h3 className="font-semibold text-lg">{product.name}</h3>
      <p className="text-gray-700">₹{product.price}</p>
      {product.category && (
        <p className="text-sm text-gray-500 mb-2">
          Category: {product.category.name}
        </p>
      )}

      <button
        onClick={handleAddToCart}
        className="w-full bg-blue-900 hover:bg-blue-800 text-white py-2 mt-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
