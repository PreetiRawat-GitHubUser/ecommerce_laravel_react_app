import React, { useEffect, useState } from "react";
import userApi, { getCart, clearCart, createOrder } from "../api/userApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCartItems(res.data);
      const totalAmount = res.data.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setTotal(totalAmount);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load cart");
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error("Please enter your delivery address");
      return;
    }
    try {
      console.log("STEP 1️: Creating order...");
      const orderRes = await createOrder({ shipping_address: address });
      console.log(" Order created:", orderRes.data);

      const order = orderRes.data.order;
      if (!order) throw new Error("Order object missing in response");

      console.log("STEP 2: Processing payment...");
      const paymentRes = await userApi.post(`/orders/${order.id}/pay`, {
        order_id: order.id,
        amount: order.total_amount,
      });
      console.log(" Payment response:", paymentRes.data);
      // console.log(" Payment successful:", paymentRes.data);

      console.log("STEP3 Clearing cart now...");
      await clearCart();
      console.log(" Cart cleared successfully, showing toast...");

      toast.success(" Payment completed and order placed successfully!");
      navigate("/PaymentSuccess", {state: {order}});
    }  catch (err) {
  console.error(" Full Error Details:", err.response?.data || err);
  const backendMsg = err.response?.data?.message;
  toast.error(backendMsg || "Failed to complete order");
}
  };
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Cart Summary */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t mt-3 pt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        {/* Address + Payment */}
        <div className="border p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-3">Delivery Details</h3>

          <label className="block mb-2 font-medium">Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            rows="4"
            placeholder="Enter your delivery address..."
          />

          <label className="block mb-2 font-medium">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded-lg p-2 mb-6"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="online">Online Payment</option>
          </select>

          <button
            onClick={handlePlaceOrder}
            className="bg-green-600 text-white w-full py-2 rounded-lg hover:bg-green-700 transition"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
