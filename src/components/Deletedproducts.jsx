import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const DeletedProducts = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchDeletedProducts = async () => {
    try {
      const response = await axios.get(
        "https://brumacranch2point0.pythonanywhere.com/api/deletedproducts"
      );
      setDeletedProducts(response.data.deleted_products || []);
    } catch (err) {
      console.error("Failed to fetch deleted products", err);
    }
  };

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const restoreProduct = async (productId) => {
    try {
      await axios.post(
        `https://brumacranch2point0.pythonanywhere.com/api/restoreproduct/${productId}`
      );
      fetchDeletedProducts();
    } catch (err) {
      console.error("Failed to restore product", err);
    }
  };

  const restoreGroup = async (name) => {
    try {
      const group = deletedProducts.filter((p) => p.name === name);
      await Promise.all(
        group.map((p) =>
          axios.post(
            `https://brumacranch2point0.pythonanywhere.com/api/restoreproduct/${p.product_id}`
          )
        )
      );
      fetchDeletedProducts();
    } catch (err) {
      console.error("Failed to restore group", err);
    }
  };

  const accumulatedRevenue = deletedProducts.reduce(
    (sum, product) => sum + (product.price || 0),
    0
  );

  const groupedDeletedProducts = deletedProducts.reduce((acc, product) => {
    if (!acc[product.name]) acc[product.name] = [];
    acc[product.name].push(product);
    return acc;
  }, {});

  const filteredGroups = Object.entries(groupedDeletedProducts).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const user = { name: "Bruce" };

  return (
    <>
      <Navbar user={user} />
      <div className="container-fluid bg-light min-vh-100 py-4">
        <h2 className="text-center text-danger fw-bold mb-4">
          🗂️ Sold Products 🗂️
        </h2>

        <div className="text-center mb-4">
          {deletedProducts.length > 0 && (
            <button
              className="btn btn-success fw-bold shadow"
              onClick={() =>
                deletedProducts.forEach((p) =>
                  restoreProduct(p.product_id)
                )
              }
            >
              ♻️ Restore All Products
            </button>
          )}
        </div>

        <div className="text-center mb-4">
          <h4 className="fw-bold text-danger">
            💰 Accumulated Revenue (Sold): KES {accumulatedRevenue}
          </h4>
        </div>

        <div className="row justify-content-center mb-4">
          <input
            type="search"
            className="form-control w-50 border border-danger shadow-sm"
            placeholder="🔍 Search deleted products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-danger">
              <tr className="text-center">
                <th>Name</th>
                <th>Description</th>
                <th>Price (KES)</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGroups.map(([name, group]) => (
                <tr key={name} className="align-middle">
                  <td className="fw-bold text-danger">{name}</td>
                  <td className="fst-italic text-muted">
                    {group[0].description || "No description available"}
                  </td>
                  <td className="fw-bold">{group[0].price}</td>
                  <td className="fw-bold">{group.length}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => restoreProduct(group[0].product_id)}
                    >
                      ♻️ Restore One
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => restoreGroup(name)}
                    >
                      ♻️ Restore All
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredGroups.length === 0 && (
            <p className="text-center text-muted">No deleted products found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DeletedProducts;
