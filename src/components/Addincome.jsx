import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const AddIncome = () => {
  const [expenditure, setExpenditure] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch revenue from deleted products
  const fetchRevenue = async () => {
    try {
      const res = await axios.get(
        "https://brumacranch2point0.pythonanywhere.com/api/deletedproducts"
      );

      // If backend already provides total_revenue, use it
      if (res.data.total_revenue !== undefined) {
        setRevenue(res.data.total_revenue);
      } else {
        // Otherwise calculate manually from deleted_products list
        const deletedProducts = res.data.deleted_products || [];
        const total = deletedProducts.reduce(
          (sum, product) => sum + (product.price || 0),
          0
        );
        setRevenue(total);
      }
    } catch (err) {
      console.error("Error fetching revenue:", err);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const handleAddIncome = async () => {
    if (!expenditure) {
      setMessage("Please enter expenditure");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "https://brumacranch2point0.pythonanywhere.com/api/addincome",
        {
          expenditure,
          revenue, // ✅ auto‑filled from deleted products
        }
      );
      setMessage(res.data.Message);
      setExpenditure("");
      fetchRevenue(); // refresh revenue after adding
    } catch (err) {
      console.error("Error adding income:", err);
      setMessage("Error adding income");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="farm-title text-success mb-4">➕ Add Income</h2>

        <div className="farm-card p-3 shadow-sm">
          <label className="fw-bold">Expenditure:</label>
          <input
            type="number"
            className="form-control mb-2"
            value={expenditure}
            onChange={(e) => setExpenditure(e.target.value)}
            placeholder="e.g. 500"
          />

          <label className="fw-bold">Revenue (auto from deleted products):</label>
          <input
            type="number"
            className="form-control mb-2"
            value={revenue}
            readOnly
          />

          {/* Show net income summary */}
          <div className="alert alert-info mt-2">
            <strong>Net Income:</strong>{" "}
            {revenue - (parseFloat(expenditure) || 0)} KES
          </div>

          <button
            className="btn btn-success px-4 py-2 mt-2"
            onClick={handleAddIncome}
            disabled={loading}
          >
            {loading ? "Saving..." : "Add Income"}
          </button>
        </div>

        {message && <p className="text-success fw-bold mt-3">{message}</p>}
      </div>
    </>
  );
};

export default AddIncome;
