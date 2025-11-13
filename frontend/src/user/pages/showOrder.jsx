import React, { useEffect, useState } from "react";
import { getAllOrders, cancelPlacedOrder } from "../api/userApi";
import { toast } from "react-hot-toast";

const ShowOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      const ordersData = response.data.data || response.data || [];
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error.response || error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, orderStatus) => {
    if (orderStatus !== "pending") {
      toast.error("You can only cancel pending orders.");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      const res = await cancelPlacedOrder(orderId);
      toast.success("Order cancelled successfully!");
      fetchOrders(); // refresh list after cancel
    } catch (error) {
      console.error("Cancel order error:", error);
      toast.error("Failed to cancel order.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-black-600 mb-6 text-center">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
              <p><strong>Payment Status:</strong> {order.payment_status}</p>
              <p><strong>Order Status:</strong> {order.order_status}</p>
              <p><strong>Address:</strong> {order.shipping_address}</p>
              <p><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</p>

              <div className="mt-4 flex justify-between">
                {order.order_status === "pending" && (
                  <button
                    onClick={() => handleCancelOrder(order.id, order.order_status)}
                    className="bg-red-800 text-white py-2 px-6 rounded hover:bg-red-700"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowOrder;
