// AddProducts.jsx
import React, { useState } from "react";
import axios from "axios";

const AddProducts = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1); // ✅ new quantity field
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // Loop based on quantity
      for (let i = 0; i < quantity; i++) {
        await axios.post(
          "https://brumacranch2point0.pythonanywhere.com/api/addproducts",
          {
            name,
            description,
            price,
          },
          { headers: { "Content-Type": "application/json" } }
        );
      }

      setMessage(`✅ Added ${quantity} ${name}(s) successfully.`);
      setName("");
      setDescription("");
      setPrice("");
      setQuantity(1);
    } catch (error) {
      setMessage(error.response?.data?.Error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-success fw-bold mb-4 farm-title">
        🌾 Add New Farm Product 🌾
      </h2>

      {loading && <p className="text-success text-center">Submitting...</p>}
      {message && <p className="text-center">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="card p-4 shadow col-md-6 mx-auto farm-card"
      >
        <div className="mb-3">
          <label className="form-label fw-bold text-success">Product Name</label>
          <input
            type="text"
            className="form-control border-success"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Fresh Tomatoes"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold text-success">Description</label>
          <textarea
            className="form-control border-success"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your product..."
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold text-success">Price (KSh)</label>
          <input
            type="number"
            className="form-control border-success"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
            placeholder="e.g. 150.00"
            required
          />
        </div>

        {/* ✅ New Quantity Field */}
        <div className="mb-3">
          <label className="form-label fw-bold text-success">Quantity</label>
          <input
            type="number"
            className="form-control border-success"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
            placeholder="e.g. 5"
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 fw-bold">
          🌱 Add Product(s)
        </button>
      </form>
    </div>
  );
};

export default AddProducts;
