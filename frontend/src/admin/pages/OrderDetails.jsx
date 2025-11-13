import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderDetails } from "../../api/adminApi";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await getOrderDetails(id);
      setOrder(response.data);
     
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

 
  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Details (ID: {id})</h2>

      <div className="bg-white p-4 rounded shadow-md mb-4">
        <p><strong>Customer:</strong> {order.user?.name}</p>
        <p><strong>Email:</strong> {order.user?.email}</p>
        <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
        <p><strong>Total Amount:</strong> ₹{order.total_amount}</p>
        <p><strong>Payment Status:</strong> {order.payment_status}</p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Items</h3>
      <table className="min-w-full border border-gray-300 mb-4">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Product</th>
            <th className="p-2 border">Quantity</th>
            <th className="p-2 border">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.product?.name}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">₹{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
};

export default OrderDetails;
