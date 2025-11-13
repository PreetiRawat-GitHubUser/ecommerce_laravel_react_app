import React, { useEffect, useState } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
} from "../../api/adminApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    image: null,
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error.response || error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error.response || error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      if (editId) {
        await updateProduct(editId, formData);
        alert("Product updated!");
      } else {
        await createProduct(formData);
        alert("Product created!");
      }

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        image: null,
      });
      setEditId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error.response || error);
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category_id: p.category_id,
      image: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      alert("Deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting:", error.response || error);
    }
  };

  if (loading) return <p>Loading Products...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Products</h2>

      <form onSubmit={handleSubmit} className="mb-4 grid grid-cols-2 gap-3">
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="col-span-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-2"
        >
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <table className="w-full border text-center">
        <thead className="bg-gray-200">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Image</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id} className="border-t">
              <td>{i + 1}</td>
              <td>{p.name}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td>{p.category?.name}</td>
              <td>
                {p.image && (
                  <img
                    src={`http://127.0.0.1:8000/storage/${p.image}`}
                    alt={p.name}
                    className="w-12 h-12 object-cover mx-auto"
                  />
                )}
              </td>
              <td>{p.description}</td>
              <td>
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-400 px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
