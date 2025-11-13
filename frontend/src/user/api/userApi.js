// src/user/api/userApi.js
import axios from "axios";

const userApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Laravel backend URL
});
// Automatically attach token (if available)
userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("user_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


//userlogin
export const Login = () => userApi.post("/login");

//userlogin
export const Register = () => userApi.post("/register");

// Fetch all products
export const getProducts = () => userApi.get("/products");

// Fetch single product details
export const getProduct = (id) => userApi.get(`/products/${id}`);

// Fetch all categories
export const getCategories = () => userApi.get("/categories");

// ADD TO CART
export const addToCart = async (product_id, quantity = 1) => {
  return await userApi.post(
    "/cart",
    { product_id, quantity },

  );
};

// GET USER CART
export const getCart = async () => {
  return await userApi.get("/cart");
};

//update cart
export const updateCartItem = async (id, quantity) => {
  return await userApi.put(`/cart/${id}`, { quantity });
};

// Remove item from cart
export const removeCartItem = async (id) => {
  return await userApi.delete(`/cart/${id}`);
};

// Create new order
export const createOrder = (data) => userApi.post("/orders", data);

//get orders
export const getAllOrders = async () => {
  return await userApi.get("/orders");
};

// Clear cart after successful order (optional)
export const clearCart = async () => {
  return await userApi.delete("/cart/clear");
};

//cancel placed order
export const cancelPlacedOrder = async (id) =>{
  return await userApi.post(`/orders/${id}/cancel`);
}

export default userApi;