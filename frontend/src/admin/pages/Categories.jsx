import { useEffect, useState } from "react";
import { getAllCategories ,createCategory,updateCategory, deleteCategory, } from "../../api/adminApi";


const Categories = ()=>{
const [categories, setCategories]= useState([]);
 const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories =  async ()=> {
     try {
          const response = await getAllCategories();
    
          // Laravel pagination: actual data is inside response.data.data
          const categoriesData = response.data|| []; // confused? why res.data.data not worked here like orders because in oder api data comes under data as used pagination in category its plane array so only res.data.data.
    
          console.log("Fetched Category:", categoriesData); // check this in console
    
          setCategories(categoriesData);
        } catch (error) {
          console.error("Error fetching categories:", error.response || error);
        } finally {
          setLoading(false);
        }
    };

      const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategory(editId, { name: newName });
        alert("Category updated successfully!");
      } else {
        await createCategory({ name: newName });
        alert("Category added successfully!");
      }
      setNewName("");
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error.response || error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id);
      alert("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error.response || error);
    }
  };

  const handleEdit = (category) => {
    setEditId(category.id);
    setNewName(category.name);
  };


       if (loading) return <p>Loading Categories...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

      <form onSubmit={handleAddOrUpdate} className="mb-4">
        <input
          type="text"
          placeholder="Enter category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
          className="border p-2 rounded mr-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editId ? "Update" : "Add"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat, index) => (
            <tr key={cat.id} className="border-t text-center">
              <td>{index + 1}</td>
              <td>{cat.name}</td>
              <td>
                <button
                  onClick={() => handleEdit(cat)}
                  className="bg-yellow-400 px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
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

export default Categories;
