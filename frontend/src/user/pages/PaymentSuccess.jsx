// src/user/pages/OrderSuccess.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { cancelPlacedOrder } from "../api/userApi";
import { toast } from "react-hot-toast";
import React from "react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4"> Payment Completed!</h1>
        <h2 className="text-xl font-semibold mb-4">Order Placed Successfully</h2>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoHome}
            className="bg-blue-900 text-white py-2 px-6 rounded hover:bg-blue-800"
          >
            Go to Home
          </button>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;
