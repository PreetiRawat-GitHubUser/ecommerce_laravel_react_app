import React, { useState } from "react";
import userApi from "../api/userApi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", password_confirmation: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userApi.post("/register", formData);
      localStorage.setItem("user_token", res.data.token);
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow rounded">
      <h2 className="text-2xl font-bold mb-4">User Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded mb-3" />
        <input name="email" onChange={handleChange} placeholder="Email" type="email" className="w-full p-2 border rounded mb-3" />
        <input name="password" onChange={handleChange} placeholder="Password" type="password" className="w-full p-2 border rounded mb-3" />
        <input name="password_confirmation" onChange={handleChange} placeholder="Confirm Password" type="password" className="w-full p-2 border rounded mb-3" />
        <button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded w-full">Register</button>
      </form>
    </div>
  );
};

export default Register;
