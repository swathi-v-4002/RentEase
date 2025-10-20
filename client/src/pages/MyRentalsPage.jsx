import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MyRentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleReviewModal = async (rentalId) => {
    if (!token) return navigate("/login");

    const { value: formValues, dismiss } = await Swal.fire({
      title: 'Leave a Review',
      html:
        '<select id="swal-rating" class="swal2-select mb-4">' +
        '<option value="5">5 - Excellent</option>' +
        '<option value="4">4 - Good</option>' +
        '<option value="3">3 - Average</option>' +
        '<option value="2">2 - Fair</option>' +
        '<option value="1">1 - Poor</option>' +
        '</select>' +
        '<textarea id="swal-comment" class="swal2-textarea" placeholder="Share your experience..."></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Submit Review',
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        return {
          rating: document.getElementById('swal-rating').value,
          comment: document.getElementById('swal-comment').value
        }
      }
    });

    if (!formValues || dismiss) return;

    try {
      const reviewData = { 
        rentalId, 
        rating: Number(formValues.rating), 
        comment: formValues.comment 
      };

      await axios.post("/api/reviews", reviewData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        title: "Review Submitted!",
        text: "Thank you for your feedback.",
        icon: "success",
        confirmButtonColor: "#7c3aed",
      });

      // Re-fetch rentals to update the list
      const res = await axios.get("/api/rentals/myrentals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRentals(res.data);

    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.msg || "Failed to submit review. You may have already reviewed this rental.",
        icon: "error",
        confirmButtonColor: "#7c3aed",
      });
    }
  };

  // Fetch rentals
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const storedToken = token || localStorage.getItem("token");
        if (!storedToken) {
          console.warn("No token found, skipping fetchRentals()");
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/rentals/myrentals", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setRentals(res.data);
      } catch (error) {
        console.error("Failed to fetch rentals", error);
        if (error.response?.status === 401) {
          Swal.fire({
            title: "Session Expired",
            text: "Please log in again.",
            icon: "warning",
            confirmButtonColor: "#7c3aed",
          }).then(()=>{
            localStorage.removeItem("token");
            navigate("/login");
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Could not load your rentals. Please try again later.",
            icon: "error",
            confirmButtonColor: "#7c3aed",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [token]);

  // Cancel rental
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
        await axios.delete(`/api/rentals/${rentalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRentals((prev) =>
          prev.filter((rental) => rental._id !== rentalId)
        );
        Swal.fire({
          title: "Cancelled!",
          text: "Your rental has been successfully cancelled.",
          icon: "success",
          confirmButtonColor: "#7c3aed",
        });
      } catch (error) {
        console.error("Failed to cancel rental", error);
        if (error.response?.status === 401) {
          Swal.fire({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            confirmButtonColor: "#7c3aed",
          }).then(() => {
            localStorage.removeItem("token");
            navigate("/login");
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: "Failed to cancel rental. Please try again later.",
            icon: "error",
            confirmButtonColor: "#7c3aed",
          });
        }
      }
    }
  };

  if (loading) return <p className="loading">Loading your rentals...</p>;

  return (
    <div className="rentals-container">
      <h1 className="rentals-title ">My Rented Items</h1>

      {!token && rentals.length === 0 ? (
        <p className="no-rentals">Please log in to see your rentals.</p>
      ) : rentals.length === 0 ? (
        <p className="no-rentals">You have not rented any items yet.</p>
      ) : (
        <div className="rentals-grid">
          {rentals.map((rental) => {
            
            return (
              <div className="rental-card" key={rental._id}>
                <img
                  src={
                    rental.item?.imageUrl
                      ? rental.item.imageUrl // Cloudinary already gives full URL
                      : '/placeholder.png'   // fallback if no image
                  }
                  alt={rental.item?.itemName || 'Rental item'}
                  className="rental-image"
                />
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

                  {rental.rentalStatus === "Approved" && (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleReviewModal(rental._id)}
                      >
                        Leave a Review
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyRentalsPage;
