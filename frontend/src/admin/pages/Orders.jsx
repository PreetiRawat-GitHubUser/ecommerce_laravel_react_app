import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/adminApi";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating]= useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();

      // Laravel pagination: actual data is inside response.data.data
      const ordersData = response.data.data || [];

      console.log("Fetched Orders:", ordersData); // check this in console

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdating(id);
      await updateOrderStatus(id, { order_status: newStatus });
      alert("Order status updated!");
      fetchOrders(); // refresh orders
    } catch (error) {
      console.error("Error updating status:", error.response || error);
      alert("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        // <div class="flex justify-center">
        <table class= "w-full border">
          <thead>
            <tr class= "bg-gray-200">
              <th class= "border border-gray-400 py-3 px-3">ID</th>
              <th class= "border border-gray-400 py-3 px-3">User</th>
              <th class= "border border-gray-400 py-3 px-3">Total</th>
              <th class= "border border-gray-400 py-3 px-3">Order Status</th>
              <th class= "border border-gray-400 py-3 px-3">Payment Status</th>
              <th class= "border border-gray-400 py-3 px-3">Select Order Status</th>
              <th class="border border-gray-400 py-3 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td class= "border border-gray-400 py-3 px-3">{index + 1}</td>
                <td class= "border border-gray-400 py-3 px-3">{order.user?.name || "N/A"}</td>
                <td class= "border border-gray-400 py-3 px-3">₹{order.total_amount}</td>
                <td class= "border border-gray-400 py-3 px-3">{order.order_status}</td>
                <td class= "border border-gray-400 py-3 px-3">{order.payment_status}</td>
                <td class= "border border-gray-400 py-3 px-3">
                  <select
                    value={order.order_status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    disabled={updating === order.id}
                    className="border rounded px-2 py-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                 <td className="border border-gray-400 py-3 px-3">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        // </div>
      )}
    </div>
  );
};

export default Orders;
//async-await: code with harry