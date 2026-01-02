import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const DeletedProducts = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  // Fetch deleted products
  const fetchDeletedProducts = () => {
    axios
      .get("https://brumacranch2point0.pythonanywhere.com/api/deletedproducts")
      .then((response) => {
        setDeletedProducts(response.data.deleted_products || []);
      })
      .catch((error) => {
        console.error("Error fetching deleted products:", error);
      });
  };

  // Restore single product (restore one row from the group)
  const restoreProduct = (productId) => {
    axios
      .post(
        `https://brumacranch2point0.pythonanywhere.com/api/restoreproduct/${productId}`
      )
      .then(() => {
        fetchDeletedProducts();
      })
      .catch((error) => {
        console.error("Error restoring product:", error);
      });
  };

  // Restore all products globally
  const restoreAllProducts = () => {
    axios
      .post(
        "https://brumacranch2point0.pythonanywhere.com/api/restoreallproducts"
      )
      .then(() => {
        fetchDeletedProducts();
      })
      .catch((error) => {
        console.error("Error restoring all products:", error);
      });
  };

  // Restore all rows for a specific product name
  const restoreGroup = async (name) => {
    try {
      const group = groupedDeletedProducts[name];
      await Promise.all(
        group.map((p) =>
          axios.post(
            `https://brumacranch2point0.pythonanywhere.com/api/restoreproduct/${p.product_id}`
          )
        )
      );
      fetchDeletedProducts();
    } catch (error) {
      console.error("Error restoring group:", error);
    }
  };

  // Group deleted products by name
  const groupedDeletedProducts = deletedProducts.reduce((acc, product) => {
    if (!acc[product.name]) acc[product.name] = [];
    acc[product.name].push(product);
    return acc;
  }, {});

  // Apply search filter
  const filteredGroups = Object.entries(groupedDeletedProducts).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Calculate accumulated revenue
  const accumulatedRevenue = deletedProducts.reduce((sum, product) => {
    return sum + (product.price || 0);
  }, 0);

  const user = { name: "Bruce" };

  return (
    <>
      <Navbar user={user} />

      <div className="container-fluid bg-light min-vh-100 py-4">
        <h2 className="text-center text-danger fw-bold mb-4">
          🗂️ Deleted Products 🗂️
        </h2>

        {/* Restore All button */}
        <div className="text-center mb-4">
          {deletedProducts.length > 0 && (
            <button
              className="btn btn-success fw-bold shadow"
              onClick={restoreAllProducts}
            >
              ♻️ Restore All Products
            </button>
          )}
        </div>

        {/* Accumulated Revenue */}
        <div className="text-center mb-4">
          <h4 className="fw-bold text-danger">
            💰 Accumulated Revenue (Deleted): KES {accumulatedRevenue}
          </h4>
        </div>

        {/* Search bar */}
        <div className="row justify-content-center mb-4">
          <input
            type="search"
            className="form-control w-50 border border-danger shadow-sm"
            placeholder="🔍 Search deleted products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Deleted products table */}
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
              {filteredGroups.map(([name, group]) => {
                const firstProduct = group[0];
                const quantity = group.length;
                return (
                  <tr key={name} className="align-middle">
                    <td className="fw-bold text-danger">{name}</td>
                    <td className="fst-italic text-muted">
                      {firstProduct.description || "No description available"}
                    </td>
                    <td className="fw-bold">{firstProduct.price}</td>
                    <td className="fw-bold">{quantity}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => restoreProduct(firstProduct.product_id)}
                      >
                        ♻️ Restore One
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => restoreGroup(name)}
                      >
                        ♻️ Restore All {name}
                      </button>
                    </td>
                  </tr>
                );
              })}
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
