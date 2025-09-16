import React from 'react';
import './HomePage.css'; // We'll create this CSS file next

function HomePage() {
  return (
    <main className="homepage">
      <h1>Welcome to RENT-EASE</h1>
      <p>The easiest way to rent anything, from tools to gadgets.</p>
      <button className="cta-button">Browse Rentals</button>
    </main>
  );
}

export default HomePage;