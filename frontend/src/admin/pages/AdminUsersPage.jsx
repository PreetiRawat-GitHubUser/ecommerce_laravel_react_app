// src/pages/admin/AdminUsersPage.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAllUsers,
  promoteUser,
  demoteUser,
  deleteUser,
} from "../../api/adminUserApi";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
     setUsers(res.data.user || []); // fallback to empty array
    } catch (error) {
      toast.error("Failed to load users");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (id) => {
   try {
      await promoteUser(id);
      toast.success("User promoted successfully!");
      fetchUsers();
    } catch {
      toast.error("Failed to promote user");
    }
    
  };

  const handleDemote = async (id) => {
  console.log("Demote clicked for user:", id);
  try {
    await demoteUser(id);
    toast.success("User demoted successfully!");
    fetchUsers();
  } catch (err) {
    console.error("Demote error:", err);
    toast.error("Failed to demote user");
  }
};


  const handleDelete = async (id) => {
     if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User deleted successfully!");
        fetchUsers();
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  if (loading) return <div className="text-center p-4">Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">is_admin</th>
              <th className="border p-2">Created</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="text-center">
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2 font-semibold">{user.is_admin? "True" : "False"}</td>
                  <td className="border p-2">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="border p-2 space-x-2">
                    {user.is_admin ? (
                      <button
                        onClick={() => handleDemote(user.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Demote
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePromote(user.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Promote
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
