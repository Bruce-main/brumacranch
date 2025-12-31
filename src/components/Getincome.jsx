import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const GetIncome = () => {
  const [totals, setTotals] = useState({ expenditure: 0, revenue: 0, profit: 0 });
  const [message, setMessage] = useState("");

  const fetchIncome = async () => {
    try {
      // ✅ Call a backend endpoint that calculates current revenue from deleted products
      const res = await axios.get("https://brumacranch2point0.pythonanywhere.com/api/currentincome");
      setTotals(res.data);
    } catch (err) {
      console.error("Error fetching income:", err);
    }
  };

  const resetIncome = async () => {
    const confirmReset = window.confirm("Are you sure you want to reset all income records?");
    if (!confirmReset) return;

    try {
      const res = await axios.post("https://brumacranch2point0.pythonanywhere.com/api/resetincome");
      setMessage(res.data.Message);
      setTotals({ expenditure: 0, revenue: 0, profit: 0 });
    } catch (err) {
      console.error("Error resetting income:", err);
      setMessage("Error resetting income");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="farm-title text-success mb-4">📊 Income Summary</h2>

        {/* Summary Card */}
        <div className="farm-card p-3 mb-4 shadow-sm">
          <h4 className="text-success">Current Income</h4>
          <p><strong>Total Expenditure:</strong> KES {totals.expenditure}</p>
          <p><strong>Total Revenue: </strong> KES {totals.revenue}</p>
          <p>
            <strong>Total Profit:</strong>{" "}
            <span style={{ color: totals.profit >= 0 ? "green" : "red" }}>
              KES {totals.profit}
            </span>
          </p>

          <button className="btn btn-danger mt-3" onClick={resetIncome}>
            🔄 Reset Income
          </button>
        </div>

        {message && <p className="text-success fw-bold">{message}</p>}
      </div>
    </>
  );
};

export default GetIncome;
