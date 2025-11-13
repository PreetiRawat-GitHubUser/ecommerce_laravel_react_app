// src/user/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { getProducts, getCategories } from "../api/userApi";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";

const BannerCarousel = ({ images = ["/banner.jpg", "/banner2.jpg", "/banner3.jpg"], interval = 4000, heightClasses = "h-60 sm:h-72 lg:h-96" }) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

   return (
    <div className="w-full mb-6">
      <div className={`relative w-full ${heightClasses} rounded-lg overflow-hidden shadow-md`}>
        <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
          {images.map((src, i) => (
            <div key={i} className="min-w-full h-full flex-shrink-0">
              <img
                src={src}
                alt={`banner-${i}`}
                className="w-full h-full object-contain bg-yellow-100" 
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-3 h-3 rounded-full transition-all ${i === index ? "bg-white scale-110" : "bg-white/50"}`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <button onClick={() => setIndex((index - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full">
          ‹
        </button>
        <button onClick={() => setIndex((index + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full">
          ›
        </button>
      </div>
    </div>
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const prodRes = await getProducts();
      const productsData = prodRes.data || [];

      //  Fixed image URL (prepend backend path)
      const formattedProducts = productsData.map((p) => ({
        ...p,
        image: p.image
          ? `http://127.0.0.1:8000/storage/${p.image.replace("public/", "")}`
          : "https://via.placeholder.com/300x200?text=No+Image", // fallback
      }));

      setProducts(formattedProducts);

      const catRes = await getCategories();
      setCategories(catRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  

    const filteredProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === "" || p.category_id === parseInt(selectedCategory);
    const matchSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="container mx-auto p-4">
      
      {/* Search + Filters bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Left: Search */}
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search for Products, Brands and more..."
            className="border p-2 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category dropdown */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <select
            className="border p-2 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
               {/* <Link
            to="/cart"
            className="bg-green-200 text-black px-4 py-2 border rounded-md hover:bg-green-300 transition"
          >
            🛒 Cart
          </Link> */}
        </div>
      </div>
        
       {/* Banner*/}
         <div className="container mx-auto  p-4">
      {/* replace the single image with the carousel */}
      <BannerCarousel images={["/banner.jpg", "/banner2.jpg", "/banner3.jpg"]} />
    </div>


      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;