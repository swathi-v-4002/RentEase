import React from 'react';

const RentalCard = ({ rental, handleCancelRental, setReviewingRentalId }) => {
  if (!rental || !rental.item) {
    return <div>Loading...</div>;
  }

  console.log('Rental prop in RentalCard:', rental);

  return (
    <div className="rental-card">
      <div className="rental-card-image-container">
        <img src={rental.item.imageUrl} alt={rental.item.itemName} className="rental-image" />
      </div>
      <div className="rental-card-details-container">
        <div className="rental-info">
          <h3>{rental.item.itemName}</h3>
          <p>Total Cost: ₹{rental.totalCost}</p>
          <p>Rented On: {new Date(rental.createdAt).toLocaleDateString('en-IN')}</p>
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
              onClick={() => setReviewingRentalId(rental._id)}
            >
              Leave a Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
