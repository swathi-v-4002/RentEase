import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";


function MyRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch rentals on component mount
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get("/api/rentals/myrentals");
        setRentals(res.data);
      } catch (error) {
        console.error("Failed to fetch rentals", error);
        Swal.fire({
          title: "Error!",
          text: "Could not load your rentals. Please try again later.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  // Cancel rental with SweetAlert2 confirmation
  const handleCancelRental = async (rentalId) => {
    if (!rentalId) return;

    const result = await Swal.fire({
      title: "Cancel Rental?",
      text: "Are you sure you want to cancel this rental? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      background: "#fff",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/rentals/${rentalId}`);

        // Remove rental from UI immediately
        setRentals((prevRentals) =>
          prevRentals.filter((rental) => rental._id !== rentalId)
        );

        Swal.fire({
          title: "Cancelled!",
          text: "Your rental has been successfully cancelled.",
          icon: "success",
          confirmButtonColor: "#7c3aed",
        });
      } catch (error) {
        console.error("Failed to cancel rental", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to cancel rental. Please try again later.",
          icon: "error",
          confirmButtonColor: "#7c3aed",
        });
      }
    }
  };

  if (loading) return <p className="loading">Loading your rentals...</p>;

  return (
    <div className="rentals-container">
      <h1 className="rentals-title">My Rented Items</h1>

      {rentals.length === 0 ? (
        <p className="no-rentals">You have not rented any items yet.</p>
      ) : (
        <div className="rentals-grid">
          {rentals.map((rental) => (
            <div className="rental-card" key={rental._id}>
              <div className="rental-info">
                <h3>{rental.item?.itemName || "Unnamed Item"}</h3>
                <p>Total Cost: ₹{rental.totalCost}</p>
                <p>
                  Rented On:{" "}
                  {new Date(rental.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <button
                className="cancel-btn"
                onClick={() => handleCancelRental(rental._id)}
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
