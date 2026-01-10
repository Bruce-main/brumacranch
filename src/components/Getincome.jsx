import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const GetIncome = () => {
  const [totals, setTotals] = useState({ expenditure: 0, revenue: 0, profit: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get token from localStorage (user login)
  const token = localStorage.getItem("token");

  // ---------------- FETCH USER INCOME ----------------
  const fetchIncome = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get(
        "https://brumacranch2point0.pythonanywhere.com/api/currentincome",
        { headers: { Authorization: `Bearer ${token}` } } // send token to backend
      );

      setTotals({
        expenditure: res.data.expenditure || 0,
        revenue: res.data.revenue || 0,
        profit: res.data.profit || (res.data.revenue || 0) - (res.data.expenditure || 0),
      });
    } catch (err) {
      console.error("Error fetching income:", err);
      setMessage("Failed to fetch income");
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ---------------- RESET INCOME ----------------
  const resetIncome = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset your income records?");
    if (!confirmReset) return;

    try {
      await axios.post(
        "https://brumacranch2point0.pythonanywhere.com/api/resetincome",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Income records reset successfully");
      setTotals({ expenditure: 0, revenue: 0, profit: 0 });
    } catch (err) {
      console.error("Error resetting income:", err);
      setMessage("Failed to reset income");
    }
  };

  // ---------------- USE EFFECT ----------------
  useEffect(() => {
    if (token) fetchIncome();
  }, [fetchIncome, token]);

  const user = JSON.parse(localStorage.getItem("user") || '{}'); // display user name if available

  return (
    <>
      <Navbar user={user} />
      <div className="container mt-4">
        <h2 className="farm-title text-success mb-4">📊 {user.name || 'Your'} Income Summary</h2>

        <div className="farm-card p-3 mb-4 shadow-sm">
          <h4 className="text-success">Current Income</h4>

          {loading ? (
            <p className="text-muted">Loading income data...</p>
          ) : (
            <>
              <p><strong>Total Expenditure:</strong> KES {totals.expenditure}</p>
              <p><strong>Total Revenue:</strong> KES {totals.revenue}</p>
              <p>
                <strong>Total Profit:</strong>{" "}
                <span style={{ color: totals.profit >= 0 ? "green" : "red" }}>
                  KES {totals.profit}
                </span>
              </p>
            </>
          )}

          <div className="d-flex gap-2 mt-3">
            <button className="btn btn-primary" onClick={fetchIncome} disabled={loading}>
              🔄 Refresh
            </button>
            <button className="btn btn-danger" onClick={resetIncome}>
              🗑️ Reset Income
            </button>
          </div>
        </div>

        {message && <p className="text-success fw-bold">{message}</p>}
      </div>
    </>
  );
};

export default GetIncome;
