import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
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
      {token ? authLinks : guestLinks}
    </nav>
  );
}

export default Navbar;
