import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const API_BASE = "https://brumacranch2point0.pythonanywhere.com/api";

export default function Stocks() {
  // ---------- AUTH ----------
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  // ---------- STOCK DATA ----------
  const [groups, setGroups] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [buyingPrice, setBuyingPrice] = useState("");
  const [totalProfit, setTotalProfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ---------- PASSWORD CHECK ----------
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/checkpassword`, { password });
      if (res.data.authorized) setAuthorized(true);
      else alert("Incorrect password");
    } catch {
      alert("Incorrect password");
    }
  };

  // ---------- GROUP PRODUCTS ----------
  const groupProducts = useCallback((products) => {
    const map = {};
    products.forEach((p) => {
      const key = `${p.name}|${p.description}`;
      if (!map[key]) {
        map[key] = {
          key,
          name: p.name,
          description: p.description,
          price: Number(p.price),
          buying_price: Number(p.buying_price),
          quantity: 1,
          product_ids: [p.product_id],
        };
      } else {
        map[key].quantity += 1;
        map[key].product_ids.push(p.product_id);
      }
    });
    setGroups(Object.values(map));
  }, []);

  // ---------- FETCH PRODUCTS ----------
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/getproducts`);
      groupProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  }, [groupProducts]);

  useEffect(() => {
    if (authorized) fetchProducts();
  }, [authorized, fetchProducts]);

  // ---------- BUYING PRICE ----------
  const startEdit = (group) => {
    setEditingKey(group.key);
    setBuyingPrice(group.buying_price);
  };

  const saveBuyingPrice = async (group) => {
    if (buyingPrice === "") return alert("Enter buying price");
    try {
      await Promise.all(
        group.product_ids.map((id) =>
          axios.put(`${API_BASE}/products/${id}/buyingprice`, { buying_price: buyingPrice })
        )
      );
      setEditingKey(null);
      setBuyingPrice("");
      fetchProducts();
    } catch {
      alert("Failed to update buying price");
    }
  };

  // ---------- PROFIT CALCULATIONS ----------
  const unitProfit = (sell, buy) => Number(sell) - Number(buy);
  const groupProfit = (group) => unitProfit(group.price, group.buying_price) * group.quantity;
  const calculateTotalProfit = () => {
    const total = groups.reduce((sum, g) => sum + groupProfit(g), 0);
    setTotalProfit(total);
  };

  // ---------- FILTER ----------
  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------- PASSWORD SCREEN ----------
  if (!authorized) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            backgroundColor: "#f7f3ee",
          }}
        >
          <form
            onSubmit={handleSubmitPassword}
            style={{
              backgroundColor: "#fffbea",
              padding: "24px",
              borderRadius: "12px",
              border: "2px solid #6c9a74",
              boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minWidth: "280px",
            }}
          >
            <h2 className="farm-title">Enter Password</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "2px solid #6c9a74",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#6c9a74",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Enter
            </button>
          </form>
        </div>
      </>
    );
  }

  // ---------- STOCKS TABLE SCREEN ----------
  return (
    <>
      <Navbar />
      <div style={{ padding: "24px", background: "#f7f3ee", minHeight: "100vh" }}>
        <h2 className="farm-title" style={{ fontSize: "28px", marginBottom: "16px" }}>
          🌾 Farm Stock Inventory
        </h2>

        {/* --- Top Panel: Total Profit + Search --- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fffbea",
              border: "2px solid #6c9a74",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              Total Profit:{" "}
              <span style={{ color: totalProfit < 0 ? "red" : "green" }}>
                KES {totalProfit !== null ? totalProfit : "—"}
              </span>
            </span>
            <button
              onClick={calculateTotalProfit}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#6c9a74",
                color: "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#588a61")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#6c9a74")}
            >
              Refresh
            </button>
          </div>

          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "2px solid #6c9a74",
              width: "100%",
              maxWidth: "400px",
            }}
          />
        </div>

        {/* --- Product Table --- */}
        <div className="farm-card" style={{ padding: "16px", overflowX: "auto" }}>
          {loading ? (
            <p>Loading stock...</p>
          ) : (
            <table
              width="100%"
              cellPadding="12"
              style={{
                borderCollapse: "collapse",
                minWidth: "700px",
              }}
            >
              <thead>
                <tr>
                  <th align="left">Product</th>
                  <th align="left">Qty</th>
                  <th align="left">Sell (KES)</th>
                  <th align="left">Buy (KES)</th>
                  <th align="left">Unit Profit</th>
                  <th align="left">Total Profit</th>
                  <th align="left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.length === 0 && (
                  <tr>
                    <td colSpan="7">No products found</td>
                  </tr>
                )}

                {filteredGroups.map((g) => {
                  const liveBuy = editingKey === g.key ? buyingPrice : g.buying_price;
                  const perUnit = unitProfit(g.price, liveBuy);
                  const total = perUnit * g.quantity;

                  return (
                    <tr
                      key={g.key}
                      style={{
                        backgroundColor: "#fdfcf7",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <td>
                        <strong>{g.name}</strong>
                        <br />
                        <small style={{ color: "#555" }}>{g.description}</small>
                      </td>
                      <td>{g.quantity}</td>
                      <td>{g.price}</td>
                      <td>
                        {editingKey === g.key ? (
                          <input
                            type="number"
                            value={buyingPrice}
                            onChange={(e) => setBuyingPrice(e.target.value)}
                            style={{
                              width: "80px",
                              padding: "4px 6px",
                              borderRadius: "6px",
                              border: "1px solid #ccc",
                            }}
                          />
                        ) : (
                          g.buying_price
                        )}
                      </td>
                      <td style={{ color: perUnit < 0 ? "red" : "green", fontWeight: "bold" }}>
                        {perUnit}
                      </td>
                      <td style={{ color: total < 0 ? "red" : "green", fontWeight: "bold" }}>
                        {total}
                      </td>
                      <td>
                        {editingKey === g.key ? (
                          <>
                            <button
                              onClick={() => saveBuyingPrice(g)}
                              style={{
                                padding: "4px 10px",
                                marginRight: "6px",
                                borderRadius: "6px",
                                border: "none",
                                backgroundColor: "#6c9a74",
                                color: "#fff",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                border: "1px solid #6c9a74",
                                backgroundColor: "#fff",
                                cursor: "pointer",
                                fontSize: "14px",
                              }}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEdit(g)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              border: "none",
                              backgroundColor: "#6c9a74",
                              color: "#fff",
                              cursor: "pointer",
                              fontSize: "14px",
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
