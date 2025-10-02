import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { token, user } = useContext(AuthContext); // We don't have user object yet, so we'll just use token
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`/api/items/${id}`);
        setItem(res.data);
        console.log("item:", res.data);
      } catch (error) {
        console.error("Failed to fetch item", error);
      }
    };
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to permanently delete this listing?"
      )
    ) {
      try {
        await axios.delete(`/api/items/${item._id}`);
        alert("Listing deleted successfully.");
        navigate("/");
      } catch (error) {
        alert(error.response.data.msg || "Failed to delete listing.");
      }
    }
  };

  const handleRent = async () => {
    if (!token) return navigate("/login");

    try {
      // Simplified: rent for 1 day
      const rentalData = {
        itemId: item._id,
        totalCost: item.rentalPrice,
      };
      await axios.post("/api/rentals", rentalData);
      alert("Rental Successful!");
      // Refetch item to update its status on the page
      const res = await axios.get(`/api/items/${id}`);
      setItem(res.data);
    } catch (error) {
      console.error(error.response.data);
      alert("Rental failed.");
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <h1>{item.itemName}</h1>
      <p>{item.description}</p>
      <p>
        <strong>Price:</strong> ₹{item.rentalPrice}/day
      </p>
      <p>
        <strong>Owner:</strong> {item.owner.name}
      </p>
      <p>
        <strong>Status:</strong> {item.availabilityStatus}
      </p>

      {item.availabilityStatus === "Available" && (
        <button onClick={handleRent} className="btn btn-primary">
          Rent Now
        </button>
      )}
      {user && user.id === item.owner._id && (
        <button
          onClick={handleDelete}
          className="btn btn-danger"
          style={{ marginLeft: "10px" }}
        >
          Delete My Listing
        </button>
      )}
    </div>
  );
}

export default ItemDetailsPage;
