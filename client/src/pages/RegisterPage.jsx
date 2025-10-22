import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const navigate = useNavigate(); // Hook for navigation

  const { name, email, password, phoneNumber } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { name, email, password, phoneNumber };
      await axios.post("/api/users/register", newUser);
      Swal.fire({
        title: "Success!",
        text: "Registration successful! Please log in.",
        icon: "success",
        confirmButtonColor: "#7c3aed", // Optional: matches your theme
      }).then((result) => {
        // Navigate after the user clicks "OK"
        if (result.isConfirmed) {
          navigate("/login"); // Redirect to login page
        }
      });
    } catch (error) {
      console.error(error.response.data);
      Swal.fire({
        title: "Registration Failed",
        // Show the specific error message from the server
        text: error.response?.data?.msg || "Please check your details and try again.",
        icon: "error",
        confirmButtonColor: "#7c3aed", // Optional: matches your theme
      });
    }
  };

  return (
    <div className="form-container register-page">
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={onChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Register
        </button>
      </form>
      {/* ... error message display ... */}
    </div>
  );
}

export default RegisterPage;
