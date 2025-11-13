import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const { data } = await axios.get("http://127.0.0.1:8000/api/admin/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(data);
      setForm((f) => ({ ...f, name: data.name, email: data.email }));
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      const formData = new FormData();
      for (let key in form) {
        if (form[key]) formData.append(key, form[key]);
      }

      const { data } = await axios.post(
        "http://127.0.0.1:8000/api/admin/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(data.message);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      alert("Profile update failed!");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-center text-pink-400"> Hey! {profile.name || "Admin"}</h2>

      <div className="flex flex-col items-center mb-4">
        <img
          src={
            preview ||
            (profile.image
              ? `http://127.0.0.1:8000/storage/${profile.image}`
              : "https://via.placeholder.com/100")
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border mb-3"
        />
        <input type="file" name="image" onChange={handleChange} />
      </div>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <label className="block mb-2">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <label className="block mb-2">New Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <label className="block mb-2">Confirm Password</label>
        <input
          type="password"
          name="password_confirmation"
          value={form.password_confirmation}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <button className="bg-sky-600 text-white py-2 px-4 rounded hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default AdminProfile;
