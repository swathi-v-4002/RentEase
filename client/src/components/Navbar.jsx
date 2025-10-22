import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, logout, pendingCount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(""); // Clear search input after search
    }
  };

  const authLinks = (
    <div className="nav-links">
      {pendingCount > 0 && (
        <Link to="/pending-approvals" className="nav-pending-link">
          Pending Approvals ({pendingCount})
        </Link>
      )}
      <Link to="/my-rentals">My Rentals</Link>
      <Link to="/my-listings">My Listings</Link>
      <button onClick={onLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
  const guestLinks = (
    <div className="nav-links">
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" className="logo" />
        </Link>
        <Link to="/home" className="navbar-brand">
          RentEase
        </Link>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
      <div className="navbar-right">{token ? authLinks : guestLinks}</div>
    </nav>
  );
}

export default Navbar;
