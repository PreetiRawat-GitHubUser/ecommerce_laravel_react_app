// src/user/pages/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api/userApi";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await getProduct(id);
      const p = res.data;
      p.image = p.image
        ? `http://127.0.0.1:8000/storage/${p.image.replace("public/", "")}`
        : "https://via.placeholder.com/400x300?text=No+Image";
      setProduct(p);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (!product) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover rounded mb-6"
      />
      <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
      <p className="text-xl text-gray-700 mb-4">₹{product.price}</p>

      {product.category && (
        <p className="text-gray-500 mb-4">
          Category: {product.category.name}
        </p>
      )}

      <p className="text-gray-700 leading-relaxed">
        {product.description || "No description available."}
      </p>
    </div>
  );
};

export default ProductDetail;
