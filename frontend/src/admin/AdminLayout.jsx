import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../api/adminUserApi";
import toast from "react-hot-toast";
import axios from "axios";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout API
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      // Remove token from localStorage
      localStorage.removeItem("auth_token");

      // Optional: remove any other user/admin data
      localStorage.removeItem("name");
      localStorage.removeItem("email");

      toast.success("Logged out successfully!");
      navigate("/admin/login"); // redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          Admin Panel
        </div>

        <nav className="p-4 space-y-2">
          <Link className="block hover:bg-gray-700 p-2 rounded" to="/admin/dashboard">
            Dashboard
          </Link>
          <Link className="block hover:bg-gray-700 p-2 rounded" to="/admin/profile">
            Profile
          </Link>
          <Link className="block hover:bg-gray-700 p-2 rounded" to="/admin/users">
            Users
          </Link>
          <Link className="block hover:bg-gray-700 p-2 rounded" to="/admin/orders">
            Orders
          </Link>
          <Link className="block hover:bg-gray-700 p-2 rounded" to="/admin/categories">
            Categories
          </Link>
          <Link className="block hover:bg-gray-700 p-2 rounded" to="/admin/products">
            Products
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left hover:bg-gray-700 p-2 rounded">
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
//npm and npx difference: npm is a package manager for JavaScript, while npx is a tool for executing Node.js packages without installing them globally. npx comes bundled with npm (version 5.2.0 and higher) and allows you to run packages directly from the command line, making it easier to use command-line tools without the need for a global installation.