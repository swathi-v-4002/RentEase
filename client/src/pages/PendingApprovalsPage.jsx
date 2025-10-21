import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function PendingApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, fetchPendingCount } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetchRequests();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await axios.get("/api/rentals/pending-approvals", config);
      setRequests(res.data);
    } catch (error) {
      Swal.fire("Error", "Could not fetch pending requests.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (rentalId, newStatus) => {
    const actionText = newStatus === "Approved" ? "Approve" : "Reject";
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(
        `/api/rentals/${rentalId}`,
        { status: newStatus },
        config
      );
      Swal.fire(
        `${actionText}d!`,
        `Rental request has been ${newStatus.toLowerCase()}.`,
        "success"
      );
      setRequests((prev) => prev.filter((req) => req._id !== rentalId));

      // --- 2. Call the function to update the Navbar ---
      fetchPendingCount(token); // Pass the current token
    } catch (error) {
      Swal.fire(
        "Error",
        `Failed to ${actionText.toLowerCase()} the request.`,
        "error"
      );
    }
  };

  if (loading) return <p className="loading">Loading pending requests...</p>;

  return (
    <div className="rentals-container">
      <h1 className="rentals-title">Pending Rental Approvals</h1>
      {requests.length === 0 ? (
        <p className="no-rentals">You have no pending requests.</p>
      ) : (
        <div className="rentals-grid">
          {requests.map((req) => (
            <div className="rental-card" key={req._id}>
              {req.item.imageUrl && (
                <img
                  src={req.item.imageUrl}
                  alt={req.item.itemName}
                  className="rental-image"
                />
              )}
              <div className="rental-info">
                <h3>{req.item.itemName}</h3>
                <p>
                  <strong>Renter:</strong> {req.renter.name} ({req.renter.email}
                  )
                </p>
                <p>
                  <strong>Total Cost:</strong> ₹{req.totalCost}
                </p>
                <p>
                  <strong>Requested:</strong>{" "}
                  {new Date(req.createdAt).toLocaleDateString("en-IN")}
                </p>
                <Link to={`/item/${req.item._id}`}>View Item Details</Link>
              </div>
              <div className="rental-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleDecision(req._id, "Approved")}
                  style={{ backgroundColor: "#2dce89", borderColor: "#2dce89" }} // Green
                >
                  Approve
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDecision(req._id, "Rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingApprovalsPage;
