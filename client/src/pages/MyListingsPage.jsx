import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

function MyListingsPage() {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    rentalPrice: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories");
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData((prev) => ({ ...prev, category: res.data[0]._id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const res = await axios.get("/api/items/myitems", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMyItems(res.data);
      } catch (error) {
        console.error("Failed to fetch items", error);
      }
    };
    if (token) {
      fetchMyItems();
    }
  }, [token]);

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
        },
      };
      await axios.post("/api/items", data, config);
      Swal.fire("Success!", "Item listed successfully!", "success");
      setFormData({ itemName: "", description: "", rentalPrice: "", category: categories[0]?._id || "" });
      setFile(null);
      // Refresh user's items
      const res = await axios.get("/api/items/myitems", config);
      setMyItems(res.data);
    } catch (error) {
      console.error(error.response?.data);
      Swal.fire("Error", "Failed to list item.", "error");
    }
  };

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: "Delete Listing?",
      text: "Are you sure you want to permanently delete this listing? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send auth token
          },
        });

        Swal.fire("Deleted!", "Listing deleted successfully.", "success");
        
        // Update state to remove the item from the list instantly
        setMyItems(prevItems => prevItems.filter(item => item._id !== itemId));

      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.msg || "Failed to delete listing.",
          "error"
        );
      }
    }
  };

  return (
    <div className="my-listings-grid">
      {/* Left: My listed items */}
      <div className="my-listings-items">
        <h2 className="my-listings-title">My Listed Items</h2>
        {myItems.length === 0 ? (
          <p className="no-listings">You have not listed any items yet.</p>
        ) : (
          <div className="my-listings-item-grid">
            {myItems.map((item) => (
              <Link to={`/item/${item._id}`} key={item._id} style={{ textDecoration: "none" }}>
              <div className="my-listings-item-card" key={item._id}>
                <img src={item.imageUrl} alt={item.itemName} className="my-listings-item-img" />
                <div className="my-listings-item-content">
                  <div className="my-listings-item-name">{item.itemName}</div>
                  <div className="my-listings-item-price">₹{item.rentalPrice}/day</div>
                  <div className="my-listings-item-category">{item.category?.name}</div>

                  <button
                      className="btn btn-danger" // Use existing style from your CSS
                      style={{ marginTop: '0.5rem', width: '100%', fontSize: '0.9rem' }}
                      onClick={(e) => {
                        e.preventDefault(); // Stop the Link from navigating
                        handleDelete(item._id); // Call the delete function
                      }}
                    >
                      Delete
                    </button>

                </div>
              </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Right: Create new listing form */}
      <div className="my-listings-form">
        <h1 className="my-listings-form-title">List a New Item</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group2">
            <input
              type="text"
              placeholder="Item Name"
              name="itemName"
              value={itemName}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group2 upload-file-input">
            <label>Image</label>
            <input
              type="file"
              name="itemImage"
              onChange={onFileChange}
              required
              style={{ padding: "10px", border: "none" }}
            />
          </div>
          <div className="form-group2">
            <textarea
              placeholder="Description"
              name="description"
              value={description}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group2">
            <input
              type="number"
              placeholder="Rental Price (per day)"
              name="rentalPrice"
              value={rentalPrice}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group2">
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
    </div>
  );
}

export default MyListingsPage;
