// src/api/adminApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/admin",
});

// Add token to every request automatically
API.interceptors.request.use((config) => {
 const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Fetch all orders (with optional filter)
export const getAllOrders = (status = "") =>
  API.get(`/orders${status ? `?status=${status}` : ""}`);

// Fetch order details
export const getOrderDetails = (id) => API.get(`/orders/${id}`);

// Update order status
export const updateOrderStatus = (id, data) =>
  API.put(`/orders/${id}/status`, data);

//fetch all category
export const getAllCategories= () => API.get("/categories");

// Create a new category
export const createCategory = (data) => API.post("/categories", data);

// Update a category
export const updateCategory = (id, data) => API.put(`/categories/${id}`, data);

// Delete a category
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// fetch all products
export const getAllProducts= () =>API.get("/products");

//create a product
export const createProduct = (data) =>
  API.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  //update product
export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete a product
export const deleteProduct = (id) => API.delete(`/products/${id}`);

//admin dashboard
export const getDashboardStats = () => API.get("/dashboard/stats");
