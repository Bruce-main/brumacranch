import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const GetIncome = () => {
  const [totals, setTotals] = useState({ expenditure: 0, revenue: 0, profit: 0 });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      // ✅ Call backend endpoint that calculates current income
      const res = await axios.get(
        "https://brumacranch2point0.pythonanywhere.com/api/currentincome"
      );

      // Ensure safe defaults if backend misses fields
      setTotals({
        expenditure: res.data.expenditure || 0,
        revenue: res.data.revenue || 0,
        profit: res.data.profit || (res.data.revenue || 0) - (res.data.expenditure || 0),
      });
    } catch (err) {
      console.error("Error fetching income:", err);
      setMessage("Error fetching income");
    } finally {
      setLoading(false);
    }
  };

  const resetIncome = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all income records?"
    );
    if (!confirmReset) return;

    try {
      const res = await axios.post(
        "https://brumacranch2point0.pythonanywhere.com/api/resetincome"
      );
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

          {loading ? (
            <p className="text-muted">Loading income data...</p>
          ) : (
            <>
              <p>
                <strong>Total Expenditure:</strong> KES {totals.expenditure}
              </p>
              <p>
                <strong>Total Revenue:</strong> KES {totals.revenue}
              </p>
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
