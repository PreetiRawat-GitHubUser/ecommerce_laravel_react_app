// src/api/adminUserApi.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/admin",
});

// Add auth token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token"); 
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Get all users
export const getAllUsers = () => API.get("/users");

// Promote user
export const promoteUser = (id) => API.post(`/users/${id}/promote`);

// Demote user
export const demoteUser = (id) => API.post(`/users/${id}/demote`);

// Delete user
export const deleteUser = (id) => API.delete(`/users/${id}`);

export const adminLogout = async () => {
  return await axios.post("/api/logout", {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("admin_token")}`
    }
  });
}