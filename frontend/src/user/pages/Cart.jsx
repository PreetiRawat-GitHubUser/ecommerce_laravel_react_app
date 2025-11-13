// src/user/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem } from "../api/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    }
  };

  const handleIncrease = async (item) => {
    if (item.quantity < item.product.stock) {
      try {
        await updateCartItem(item.id, item.quantity + 1);
        fetchCart();
      } catch (err) {
        console.error(err);
        toast.error("Could not increase quantity");
      }
    } else {
      toast.error("Reached stock limit");
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity > 1) {
      try {
        await updateCartItem(item.id, item.quantity - 1);
        fetchCart();
      } catch (err) {
        console.error(err);
        toast.error("Could not decrease quantity");
      }
    } else {
      toast.error("Minimum quantity is 1");
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeCartItem(id);
      toast.success("Item removed from cart");
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

   const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
    // later: navigate("/checkout") or open checkout page
    navigate("/checkout");
  };

  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty, add some products :)</p>
      ) : (
        <div className="grid gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`http://127.0.0.1:8000/storage/${item.product.image}`}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600">
                   You Pay: ₹{item.product.price} × {item.quantity} ={" "}
                    <span className="font-semibold">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrease(item)}
                  className="px-3 py-1 bg-gray-200 rounded-md text-lg font-bold"
                >
                  -
                </button>
                <span className="font-semibold">{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item)}
                  className="px-3 py-1 bg-gray-200 rounded-md text-lg font-bold"
                  disabled={item.quantity >= item.product.stock}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
              
                 <button
              onClick={handleCheckout}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md "
            >
              Proceed to Pay
            </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
