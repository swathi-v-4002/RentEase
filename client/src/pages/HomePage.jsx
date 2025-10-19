import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 1. IMPORT the Link component

function HomePage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/items");
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Available Items for Rent</h1>
      <div className="item-grid">
        {items.map((item) => (
          <Link
            to={`/item/${item._id}`}
            key={item._id}
            style={{ textDecoration: "none" }}
          >
            <div className="item-card">
              {/* --- ADD THIS IMAGE TAG --- */}
              <img
                src={item.imageUrl}
                alt={item.itemName}
                className="item-card-img"
              />
              <div className="item-card-content">
                <h2>{item.itemName}</h2>
                <p>
                  <strong>Price per day:</strong> ₹{item.rentalPrice}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
