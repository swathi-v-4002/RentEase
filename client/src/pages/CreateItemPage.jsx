import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

function CreateItemPage() {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    rentalPrice: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories when the component loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
        // Set a default category if available
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const { itemName, description, rentalPrice, category } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire("Error", "Please upload an image for the item.", "error");
      return;
    }
    const data = new FormData();
    data.append("itemImage", file);
    data.append("itemName", itemName);
    data.append("description", description);
    data.append("rentalPrice", rentalPrice);
    data.append("category", category);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'multipart/form-data' <-- Axios sets this automatically with FormData
        },
      };
      await axios.post("/api/items", data, config);
      Swal.fire("Success!", "Item listed successfully!", "success");
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
      Swal.fire("Error", "Failed to list item.", "error");
    }
  };
  //   try {
  //     await axios.post("/api/items", formData);
  //     alert("Item listed successfully!");
  //     navigate("/");
  //   } catch (error) {
  //     console.error(error.response.data);
  //     alert("Failed to list item.");
  //   }
  // };

  return (
    <div className="form-container">
      <h1>List a New Item</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Item Name"
            name="itemName"
            value={itemName}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Item Image</label>
          <input
            type="file"
            name="itemImage"
            onChange={onFileChange}
            required
            style={{ padding: "10px", border: "none" }}
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Description"
            name="description"
            value={description}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Rental Price (per day)"
            name="rentalPrice"
            value={rentalPrice}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <select name="category" value={category} onChange={onChange} required>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          List Item
        </button>
      </form>
    </div>
  );
}

export default CreateItemPage;
