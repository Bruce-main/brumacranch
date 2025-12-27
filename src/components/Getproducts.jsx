import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Getproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const navigate = useNavigate();

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://brumacranch2point0.pythonanywhere.com/api/getproducts"
      );
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err.response?.data || err.message);
      setLoading(false);
      setError("Oops! Something went wrong while loading the products.");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleDeleteOne = async (productId) => {
    try {
      await axios.delete(
        `https://brumacranch2point0.pythonanywhere.com/api/products/${productId}`
      );
      setProducts(products.filter((p) => p.product_id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err.message);
      setError("Failed to delete product.");
    }
  };

  const handleDeleteAll = async (name) => {
    try {
      const productsToDelete = products.filter((p) => p.name === name);
      await Promise.all(
        productsToDelete.map((p) =>
          axios.delete(
            `https://brumacranch2point0.pythonanywhere.com/api/products/${p.product_id}`
          )
        )
      );
      setProducts(products.filter((p) => p.name !== name));
    } catch (err) {
      console.error("Error deleting products:", err.response?.data || err.message);
      setError("Failed to delete products.");
    }
  };

  const startEditGroup = (name, group) => {
    setEditingGroup(name);
    setEditName(name);
    setEditDescription(group[0].description);
    setEditPrice(group[0].price);
  };

  const handleUpdateAll = async (name, group) => {
    try {
      await Promise.all(
        group.map((p) =>
          axios.put(
            `https://brumacranch2point0.pythonanywhere.com/api/products/${p.product_id}`,
            {
              name: editName,
              description: editDescription,
              price: editPrice,
            },
            { headers: { "Content-Type": "application/json" } }
          )
        )
      );

      setProducts(
        products.map((p) =>
          p.name === name
            ? { ...p, name: editName, description: editDescription, price: editPrice }
            : p
        )
      );
      setEditingGroup(null);
    } catch (err) {
      console.error("Error updating products:", err.response?.data || err.message);
      setError("Failed to update products.");
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.name]) acc[product.name] = [];
    acc[product.name].push(product);
    return acc;
  }, {});

  const filteredGroups = Object.entries(groupedProducts).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <h2 className="text-center text-success fw-bold mb-4 farm-title">
        🌾 Browse Our Farm Products 🌾
      </h2>

      <div className="text-center mb-4 d-flex justify-content-center gap-3">
        <button
          className="btn btn-outline-secondary fw-bold shadow"
          onClick={() => navigate("/deletedproducts")}
        >
          🗂️ View Deleted Products
        </button>
      </div>

      <div className="row justify-content-center mb-4">
        <input
          type="search"
          className="form-control w-50 border border-success shadow-sm"
          placeholder="🔍 Search fresh produce..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="text-success text-center">Loading farm products...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-success">
            <tr className="text-center">
              <th>Name</th>
              <th>Description</th>
              <th>Price (KES)</th>
              <th>Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map(([name, group]) => {
              const firstProduct = group[0];
              return (
                <tr key={name} className="align-middle">
                  {editingGroup === name ? (
                    <>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                        />
                      </td>
                      <td>
                        <textarea
                          className="form-control"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                        />
                      </td>
                      <td className="fw-bold">{group.length}</td>
                      <td className="text-center">
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdateAll(name, group)}
                          >
                            ✅ Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditingGroup(null)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="fw-bold text-success">{name}</td>
                      <td className="fst-italic text-muted">
                        {firstProduct.description || "No description available"}
                      </td>
                      <td className="fw-bold">{firstProduct.price}</td>
                      <td className="fw-bold">{group.length}</td>
                      <td className="text-center">
                        <div className="d-flex flex-wrap justify-content-center gap-2">
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => startEditGroup(name, group)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteOne(firstProduct.product_id)}
                          >
                            🗑️ Delete One
                          </button>
                          <button
                            className="btn btn-dark btn-sm"
                            onClick={() => handleDeleteAll(name)}
                          >
                            🗑️ Delete All
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredGroups.length === 0 && !loading && !error && (
          <p className="text-center text-muted">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Getproducts;
