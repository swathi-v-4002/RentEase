import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateItemPage from "./pages/CreateItemPage";
import PrivateRoute from "./components/PrivateRoute";
import ItemDetailsPage from "./pages/ItemDetailsPage";
import MyRentalsPage from "./pages/MyRentalsPage";
import SearchResultsPage from "./pages/SearchResultsPage";

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
            path="/create-item"
            element={
              <PrivateRoute>
                <CreateItemPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
