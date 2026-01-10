import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{ backgroundColor: "#fffbea", borderBottom: "2px solid #6c9a74" }}
    >
      <div className="container-fluid">
        {/* Brand / Logo */}
        <Link
          className="navbar-brand fw-bold text-success farm-title"
          to="/getproducts"
          style={{ letterSpacing: "1px" }}
        >
          🌾 Brumac Ranch
        </Link>

        {/* Toggle for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#farmNavbar"
          aria-controls="farmNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: "#6c9a74" }}
        >
          <span
            className="navbar-toggler-icon"
            style={{ backgroundColor: "#6c9a74" }}
          ></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="farmNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/getproducts">
                🛒 Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/addproducts">
                ➕ Add Product
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/deletedproducts">
                🗂️ Sold Products
              </Link>
            </li>
            {/* Income Links */}
            <li className="nav-item">
              <Link className="nav-link" to="/getincome">
                📊 Income Records
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/stocks"
                title="Password-protected page"
              >
                📦 Stocks
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
