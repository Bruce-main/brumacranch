import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Getproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // ✅ track product being edited
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://brumacranch2point0.pythonanywhere.com/api/products/${id}`
      );
      setProducts(products.filter((p) => p.product_id !== id));
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err.message);
      setError("Failed to delete product.");
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product.product_id);
    setEditName(product.name);
    setEditDescription(product.description);
    setEditPrice(product.price);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `https://brumacranch2point0.pythonanywhere.com/api/products/${id}`,
        {
          name: editName,
          description: editDescription,
          price: editPrice,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setProducts(
        products.map((p) =>
          p.product_id === id
            ? { ...p, name: editName, description: editDescription, price: editPrice }
            : p
        )
      );
      setEditingProduct(null);
    } catch (err) {
      console.error("Error updating product:", err.response?.data || err.message);
      setError("Failed to update product.");
    }
  };

  const filteredProducts = products.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <h2 className="text-center text-success fw-bold mb-4 farm-title">
        🌾 Browse Our Farm Products 🌾
      </h2>

      <div className="text-center mb-4 d-flex justify-content-center gap-3">
        <button
          className="btn btn-success fw-bold shadow"
          onClick={() => navigate("/addproducts")}
        >
          ➕ Add New Product
        </button>
        <button
          className="btn btn-outline-secondary fw-bold shadow"
          onClick={() => navigate("/deletedproducts")}
        >
          🗂️ View Deleted Products
        </button>
      </div>


      <div className="row justify-content-center mb-5">
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

      <div className="row justify-content-center">
        {filteredProducts.map((product) => (
          <div key={product.product_id} className="col-md-3 mb-4">
            <div className="card border border-success shadow h-100 farm-card">
              <div className="card-body text-center">
                {editingProduct === product.product_id ? (
                  <>
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleUpdate(product.product_id)}
                    >
                      ✅ Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingProduct(null)}
                    >
                      ❌ Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h5 className="fw-bold text-success">{product.name}</h5>
                    <p className="text-muted fst-italic">
                      {product.description || "No description available"}
                    </p>
                    <p className="text-brown fw-bold fs-5">
                      Price: KES {product.price}
                    </p>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => startEdit(product)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product.product_id)}
                    >
                      🗑️ Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && !loading && !error && (
          <p className="text-center text-muted">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Getproducts;
