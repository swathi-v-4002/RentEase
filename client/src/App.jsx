import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyListingsPage from "./pages/MyListingsPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import PrivateRoute from "./components/PrivateRoute";
import MyRentalsPage from "./pages/MyRentalsPage";
import PendingApprovalsPage from "./pages/PendingApprovalsPage";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <div>
      <Navbar searchTerm />
      <main >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/item/:id" element={<ItemDetailsPage />} />
          <Route
            path="/my-rentals"
            element={
              <PrivateRoute>
                {" "}
                <MyRentalsPage />{" "}
              </PrivateRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <PrivateRoute>
                <MyListingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/pending-approvals"
            element={
              <PrivateRoute>
                <PendingApprovalsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
