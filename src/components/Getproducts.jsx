import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Getproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://brumacranch2point0.pythonanywhere.com/api/getproducts"
      );
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to load products");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // Group products by name
  const groupedProducts = products.reduce((acc, product) => {
    if (!acc[product.name]) acc[product.name] = [];
    acc[product.name].push(product);
    return acc;
  }, {});

  const filteredGroups = Object.entries(groupedProducts).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Add one unit (duplicate row)
  const handleAddOne = async (productId) => {
    try {
      await axios.post(
        `https://brumacranch2point0.pythonanywhere.com/api/products/${productId}/addone`
      );
      getProducts();
    } catch {
      setError("Failed to add product");
    }
  };

  // ✅ Delete ONE row (pick first product_id from group)
  const handleDeleteOne = async (name) => {
    try {
      const group = groupedProducts[name];
      if (!group || group.length === 0) return;
      const productId = group[0].product_id;
      await axios.delete(
        `https://brumacranch2point0.pythonanywhere.com/api/products/${productId}`
      );
      getProducts();
    } catch {
      setError("Failed to delete product");
    }
  };

  // ✅ Delete ALL rows with same name
  const handleDeleteAll = async (name) => {
    try {
      const group = groupedProducts[name];
      await Promise.all(
        group.map((p) =>
          axios.delete(
            `https://brumacranch2point0.pythonanywhere.com/api/products/${p.product_id}`
          )
        )
      );
      getProducts();
    } catch {
      setError("Failed to delete products");
    }
  };

  // ✅ Start editing group
  const startEditGroup = (name, group) => {
    setEditingGroup(name);
    setEditName(name);
    setEditDescription(group[0].description);
    setEditPrice(group[0].price);
  };

  // ✅ Update all rows in group
  const handleUpdateAll = async (name, group) => {
    try {
      await Promise.all(
        group.map((p) =>
          axios.put(
            `https://brumacranch2point0.pythonanywhere.com/api/products/${p.product_id}`,
            {
              name: editName || p.name,
              description: editDescription || p.description,
              price: editPrice || p.price,
            }
          )
        )
      );
      getProducts();
      setEditingGroup(null);
    } catch {
      setError("Failed to update products");
    }
  };

  const user = { name: "Bruce" };

  return (
    <>
      <Navbar user={user} />
      <div className="container-fluid bg-light min-vh-100 py-4">
        <h2 className="text-center text-success fw-bold mb-4">
          🌾 Browse Our Farm Products 🌾
        </h2>

        <div className="row justify-content-center mb-4">
          <input
            type="search"
            className="form-control w-50 border border-success shadow-sm"
            placeholder="🔍 Search fresh produce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <p className="text-success text-center">Loading...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-success">
              <tr className="text-center">
                <th>Name</th>
                <th>Description</th>
                <th>Price (KES)</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map(([name, group]) => {
                const firstProduct = group[0];
                const quantity = group.length;
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
                        <td className="fw-bold">{quantity}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-success btn-sm me-2"
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
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="fw-bold text-success">{name}</td>
                        <td className="fst-italic text-muted">
                          {firstProduct.description || "No description available"}
                        </td>
                        <td className="fw-bold">{firstProduct.price}</td>
                        <td className="fw-bold">{quantity}</td>
                        <td className="text-center">
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => startEditGroup(name, group)}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() => handleAddOne(firstProduct.product_id)}
                          >
                            ➕ Add
                          </button>
                          <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() => handleDeleteOne(name)}
                          >
                            🗑️ Delete One
                          </button>
                          <button
                            className="btn btn-dark btn-sm"
                            onClick={() => handleDeleteAll(name)}
                          >
                            🗑️ Delete All
                          </button>
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
    </>
  );
};

export default Getproducts;
