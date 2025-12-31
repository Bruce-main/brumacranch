import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const DeletedProducts = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  // ✅ Fetch deleted products + revenue (no income insert here)
  const fetchDeletedProducts = () => {
    axios
      .get("https://brumacranch2point0.pythonanywhere.com/api/deletedproducts")
      .then((response) => {
        setDeletedProducts(response.data.deleted_products);
        setTotalRevenue(response.data.total_revenue);
      })
      .catch((error) => {
        console.error("Error fetching deleted products:", error);
      });
  };

  // ✅ Restore single product
  const restoreProduct = (productId) => {
    axios
      .post(
        `https://brumacranch2point0.pythonanywhere.com/api/restoreproduct/${productId}`
      )
      .then(() => {
        fetchDeletedProducts();
      })
      .catch((error) => {
        console.error("Error restoring product:", error);
      });
  };

  // ✅ Restore all products
  const restoreAllProducts = () => {
    axios
      .post(
        "https://brumacranch2point0.pythonanywhere.com/api/restoreallproducts"
      )
      .then(() => {
        fetchDeletedProducts();
      })
      .catch((error) => {
        console.error("Error restoring all products:", error);
      });
  };

  // ✅ Push revenue into income table manually
  const pushRevenueToIncome = () => {
    axios
      .post("https://brumacranch2point0.pythonanywhere.com/api/addincome", {
        expenditure: 0, // or user-provided later
        revenue: totalRevenue,
      })
      .then((res) => {
        setMessage(res.data.Message);
      })
      .catch((error) => {
        console.error("Error pushing revenue to income:", error);
        setMessage("Error updating income");
      });
  };

  // ✅ Filter deleted products by search term
  const filteredDeletedProducts = deletedProducts.filter((product) =>
    product.name?.toLowerCase().includes(search.toLowerCase())
  );

  const user = { name: "Bruce" }; // Example user, replace with auth state

  return (
    <>
      <Navbar user={user} />

      <div className="container-fluid bg-light min-vh-100 py-4">
        <h2 className="text-center text-success fw-bold mb-4 farm-title">
          🗂️ Deleted Products 🗂️
        </h2>

        {/* Restore All button */}
        <div className="text-center mb-4">
          {deletedProducts.length > 0 && (
            <button
              className="btn btn-success fw-bold shadow"
              onClick={restoreAllProducts}
            >
              ♻️ Restore All Products
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="row justify-content-center mb-4">
          <input
            type="search"
            className="form-control w-50 border border-danger shadow-sm"
            placeholder="🔍 Search deleted products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Deleted products table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-danger">
              <tr className="text-center">
                <th>Name</th>
                <th>Description</th>
                <th>Price (KES)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeletedProducts.map((product) => (
                <tr key={product.product_id} className="align-middle">
                  <td className="fw-bold text-danger">{product.name}</td>
                  <td className="fst-italic text-muted">
                    {product.description || "No description available"}
                  </td>
                  <td className="fw-bold">{product.price}</td>
                  <td className="text-center">
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => restoreProduct(product.product_id)}
                      >
                        ♻️ Restore
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDeletedProducts.length === 0 && (
            <p className="text-center text-muted">No deleted products found.</p>
          )}
        </div>

        {/* Revenue summary + push button */}
        <h2 className="text-center text-success fw-bold mt-4">
          Total Revenue from Deleted Products: KES {totalRevenue}
        </h2>

        <div className="text-center mt-3">
          <button
            className="btn btn-primary fw-bold shadow"
            onClick={pushRevenueToIncome}
            disabled={totalRevenue === 0}
          >
            💰 Push Revenue to Income
          </button>
        </div>

        {message && (
          <p className="text-center text-success fw-bold mt-3">{message}</p>
        )}
      </div>
    </>
  );
};

export default DeletedProducts;
