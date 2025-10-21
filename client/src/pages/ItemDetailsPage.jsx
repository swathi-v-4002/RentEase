// client/src/pages/ItemDetailsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

// A simple component to render stars
const StarRating = ({ rating }) => {
  return (
    <div style={{ color: "#f0c040", fontSize: "1.2rem" }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
};

function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]); // State for reviews
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItemAndReviews = async () => {
      try {
        // Fetch item and reviews in parallel
        const [itemRes, reviewsRes] = await Promise.all([
          axios.get(`/api/items/${id}`),
          axios.get(`/api/reviews/item/${id}`),
        ]);

        setItem(itemRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Failed to fetch item or reviews", error);
        // Optional: Redirect to home or show an error screen if item is not found
      }
    };
    fetchItemAndReviews();
  }, [id]);

  const handleDelete = async () => {
    // ... (Your existing handleDelete function is perfect, no changes needed)
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
        await axios.delete(`/api/items/${item._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    if (!token) return navigate("/login");

    try {
      const rentalData = { itemId: item._id, totalCost: item.rentalPrice };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      // This endpoint now creates a "Pending" request
      await axios.post("/api/rentals", rentalData, config);

      // Show a new success message
      Swal.fire({
        title: "Request Sent! 📨",
        text: "Your rental request has been sent to the owner for approval.",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });

      // Optimistically update the UI to show 'Pending'
      setItem((prevItem) => ({
        ...prevItem,
        availabilityStatus: "Pending", // <-- CHANGE THIS
      }));
    } catch (error) {
      console.error(error.response?.data);
      Swal.fire({
        title: "Request Failed 😔",
        text: error.response?.data?.msg || "Failed to send rental request.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  if (!item) return <div className="loading">Loading item details...</div>;

  return (
    <div className="item-details-container">
      <div className="item-details-grid">
        {/* LEFT: Image */}
        <div className="left-column">
          <img
            src={item.imageUrl}
            alt={item.itemName}
            className="item-details-img"
          />
        </div>

        {/* CENTER: Details + actions (Rent Now button below details) */}
        <div className="center-column">
          <div className="item-details-card">
            <div className="item-details-content">
              <h1 className="item-details-title">{item.itemName}</h1>
              <p className="item-details-desc">{item.description}</p>
              <p>
                <strong>Price:</strong> ₹{item.rentalPrice}/day
              </p>
              <p>
                <strong>Owner:</strong> {item.owner?.name || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`status-badge ${item.availabilityStatus.toLowerCase()}`}
                >
                  {item.availabilityStatus}
                </span>
              </p>
            </div>
          </div>

          <div
            className="item-details-actions"
            style={{ marginTop: "1.25rem" }}
          >
            {item.availabilityStatus === "Available" &&
              user?.id !== item.owner?._id && (
                <button onClick={handleRent} className="btn btn-primary">
                  Rent Now
                </button>
              )}

            {user && user.id === item.owner?._id && (
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Listing
              </button>
            )}
          </div>
        </div>

        {/* RIGHT: Reviews */}
        <aside className="right-column reviews-container">
          <h3 className="reviews-title">Reviews</h3>
          {reviews.length === 0 ? (
            <p className="no-reviews">No reviews yet</p>
          ) : (
            <div className="reviews-grid">
              {reviews.map((review) => (
                <div className="review-card item-card" key={review._id}>
                  <div className="review-header">
                    <strong style={{ color: "#111" }}>
                      {review.user?.name || "Anonymous"}
                    </strong>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <small className="review-date">
                    {new Date(review.createdAt).toLocaleDateString("en-IN")}
                  </small>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ItemDetailsPage;
