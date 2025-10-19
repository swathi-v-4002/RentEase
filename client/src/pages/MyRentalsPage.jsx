import React, { useState, useEffect, useContext } from "react"; // <-- CHANGED
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext"; // <-- NEW
import { useNavigate } from "react-router-dom"; // <-- NEW (for ReviewForm)

// --- Review Form Component ---
const ReviewForm = ({ rentalId, onItemReviewed }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return navigate("/login");

    try {
      const reviewData = { rentalId, rating, comment };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post("/api/reviews", reviewData, config);

      Swal.fire({
        title: "Review Submitted!",
        text: "Thank you for your feedback.",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });

      onItemReviewed();
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text:
          err.response?.data?.msg ||
          "Failed to submit review. You may have already reviewed this rental.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>Leave a Review</h4>
      <div className="form-group">
        <label>Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          <option value={5}>5 - Excellent</option>
          <option value={4}>4 - Good</option>
          <option value={3}>3 - Average</option>
          <option value={2}>2 - Fair</option>
          <option value={1}>1 - Poor</option>
        </select>
      </div>
      <div className="form-group">
        <label>Comment</label>
        <textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit Review
      </button>
    </form>
  );
};

// --- Updated MyRentalsPage ---
function MyRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingRentalId, setReviewingRentalId] = useState(null);
  const { token } = useContext(AuthContext); // <-- NEW: Get the token

  // Fetch rentals on component mount
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await axios.get("/api/rentals/myrentals");
        setRentals(res.data);
      } catch (error) {
        console.error("Failed to fetch rentals", error);
        // This alert will now only show if there's a *real* error
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

    // <-- NEW: Only fetch if the token is ready
    if (token) {
      fetchRentals();
    } else {
      // If there's no token, don't even try.
      setLoading(false);
    }
  }, [token]); // <-- CHANGED: Run this effect when the token changes

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

      {/* NEW: Check for no token *after* loading is done */}
      {!token && rentals.length === 0 ? (
        <p className="no-rentals">Please log in to see your rentals.</p>
      ) : rentals.length === 0 ? (
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
                <p>Status: {rental.rentalStatus}</p>
              </div>

              <div className="rental-actions">
                {rental.rentalStatus === "Approved" && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelRental(rental._id)}
                  >
                    Cancel Rental
                  </button>
                )}

                {/* --- THIS IS THE CRITICAL PART --- */}
                {/* Make sure this button just sets state, no navigation! */}
                {rental.rentalStatus === "Approved" &&
                  reviewingRentalId !== rental._id && (
                    <button
                      className="btn btn-primary"
                      onClick={() => setReviewingRentalId(rental._id)} // <-- CORRECT
                    >
                      Leave a Review
                    </button>
                  )}
              </div>

              {reviewingRentalId === rental._id && (
                <ReviewForm
                  rentalId={rental._id}
                  onItemReviewed={() => {
                    setReviewingRentalId(null);
                    // Re-fetch rentals to update status (e.g., hide review button)
                    if (token) {
                      const fetchAgain = async () => {
                        const res = await axios.get("/api/rentals/myrentals");
                        setRentals(res.data);
                      };
                      fetchAgain();
                    }
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRentalsPage;
