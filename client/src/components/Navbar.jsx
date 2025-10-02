import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
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
    <>
      {/* We will add links to 'My Listings' and 'Create Listing' here later */}
      <Link to="/my-rentals">My Rentals</Link>
      <Link to="/create-item">Create Listing</Link>
      <button onClick={onLogout}>Logout</button>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </>
  );

  return (
    <nav className="navbar">
      <Link to="/" style={{ marginRight: "auto", fontWeight: "bold" }}>
        RentEase
      </Link>
      <Link to="/">Home</Link>

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

      {token ? authLinks : guestLinks}
    </nav>
  );
}

export default Navbar;
