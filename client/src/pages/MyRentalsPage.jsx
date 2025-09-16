import React, { useState, useEffect } from "react";
import axios from "axios";

function MyRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get("/api/rentals/myrentals");
        setRentals(res.data);
      } catch (error) {
        console.error("Failed to fetch rentals", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const handleCancelRental = async (rentalId) => {
    if (window.confirm("Are you sure you want to cancel this rental?")) {
      try {
        await axios.delete(`/api/rentals/${rentalId}`);
        // Remove the cancelled rental from the list in the UI
        setRentals(rentals.filter((rental) => rental._id !== rentalId));
        alert("Rental cancelled.");
      } catch (error) {
        console.error("Failed to cancel rental", error);
        alert("Could not cancel rental.");
      }
    }
  };

  if (loading) return <p>Loading your rentals...</p>;

  return (
    <div>
      <h1>My Rented Items</h1>
      {rentals.length === 0 ? (
        <p>You have not rented any items yet.</p>
      ) : (
        <div>
          {rentals.map((rental) => (
            <div
              key={rental._id}
              style={{
                border: "1px solid #555",
                padding: "1rem",
                margin: "1rem 0",
              }}
            >
              <h3>{rental.item.itemName}</h3>
              <p>Total Cost: ₹{rental.totalCost}</p>
              <p>
                Rented On: {new Date(rental.createdAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleCancelRental(rental._id)}
                style={{ backgroundColor: "#c0392b" }}
              >
                Cancel Rental
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRentalsPage;
