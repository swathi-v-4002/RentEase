import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/api/items/${id}`);
        setItem(res.data);
      } catch (error) {
        console.error("Failed to fetch item", error);
        // Optional: Redirect to home or show an error screen if item is not found
      }
    };
    fetchItem();
  }, [id]);

  // Use SweetAlert2 for consistent UI confirmation
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Listing?",
      text: "Are you sure you want to permanently delete this listing? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33", // Red for danger
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        // Ensure token is included if deletion is a protected route
        await axios.delete(`/api/items/${item._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        Swal.fire("Deleted!", "Listing deleted successfully.", "success");
        navigate("/");
      } catch (error) {
        Swal.fire(
          "Error!", 
          error.response?.data?.msg || "Failed to delete listing.", 
          "error"
        );
      }
    }
  };

  const handleRent = async () => {
    // 1. Check for token and redirect if missing
    if (!token) return navigate("/login");

    try {
      const rentalData = { itemId: item._id, totalCost: item.rentalPrice };

      // CRITICAL FIX: Include the Authorization token in the request headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      await axios.post("/api/rentals", rentalData, config);

      Swal.fire({
        title: "Success! 🥳",
        text: "Rental Successful! View your rented item in 'My Rentals'.",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });

      // Improvement: Optimistically update state instead of fetching again
      setItem(prevItem => ({
        ...prevItem,
        availabilityStatus: "Unavailable" 
      }));

    } catch (error) {
      console.error(error.response?.data);
      
      // Use SweetAlert for rental failure
      Swal.fire({
        title: "Rental Failed 😔",
        text: error.response?.data?.msg || "Failed to process rental. The item may be unavailable.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  if (!item) return <div className="loading">Loading item details...</div>;

  return (
    <div className="item-details-container">
      <div className="item-details-card">
        {item.imageUrl && <img src={item.imageUrl} alt={item.itemName} className="item-details-img" />}
        <div className="item-details-content">
          <h1 className="item-details-title">{item.itemName}</h1>
          <p className="item-details-desc">{item.description}</p>
          <p><strong>Price:</strong> ₹{item.rentalPrice}/day</p>
          {/* Note: Safe access to owner name using optional chaining */}
          <p><strong>Owner:</strong> {item.owner?.name || "N/A"}</p>
          <p><strong>Status:</strong> 
            <span className={`status-badge ${item.availabilityStatus === "Available" ? "available" : "unavailable"}`}>
              {item.availabilityStatus}
            </span>
          </p>

          <div className="item-details-actions">
            {/* The Rent button should only appear if the item is available AND the user is not the owner */}
            {item.availabilityStatus === "Available" && user?.id !== item.owner?._id && (
              <button onClick={handleRent} className="btn btn-primary">Rent Now</button>
            )}
            
            {/* The Delete button should only appear if the logged-in user is the owner */}
            {user && user.id === item.owner?._id && (
              <button onClick={handleDelete} className="btn btn-danger">Delete Listing</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailsPage;