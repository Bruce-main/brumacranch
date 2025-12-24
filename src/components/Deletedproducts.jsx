import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import navigate

const DeletedProducts = () => {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const navigate = useNavigate(); // ✅ initialize navigate

  useEffect(() => {
    fetchDeletedProducts();
  }, []);

  const fetchDeletedProducts = () => {
    axios
      .get("https://brumacranch2point0.pythonanywhere.com/api/deletedproducts")
      .then((response) => {
        setDeletedProducts(response.data.deleted_products);
        setTotalRevenue(response.data.total_revenue);
      })
      .catch((error) => {
        console.error("Error fetching deleted products:", error);
      });
  };

  // Restore a single product
  const restoreProduct = (productId) => {
    axios
      .post(
        `https://brumacranch2point0.pythonanywhere.com/api/restoreproduct/${productId}`
      )
      .then(() => {
        fetchDeletedProducts(); // refresh list
      })
      .catch((error) => {
        console.error("Error restoring product:", error);
      });
  };

  // Restore all deleted products
  const restoreAllProducts = () => {
    axios
      .post(
        "https://brumacranch2point0.pythonanywhere.com/api/restoreallproducts"
      )
      .then(() => {
        fetchDeletedProducts(); // refresh list
      })
      .catch((error) => {
        console.error("Error restoring all products:", error);
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "serif" }}>
      <h2 style={{ color: "#5a3e2b" }}>Deleted Products</h2>
      <ul>
        {deletedProducts.map((product) => (
          <li key={product.product_id} style={{ marginBottom: "10px" }}>
            <strong>{product.name}</strong> - {product.description} ($
            {product.price})
            <button
              onClick={() => restoreProduct(product.product_id)}
              style={{
                marginLeft: "10px",
                backgroundColor: "#3e5a2b",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              Restore
            </button>
          </li>
        ))}
      </ul>
      <h3 style={{ marginTop: "20px", color: "#3e5a2b" }}>
        Total Revenue from Deleted Products: ${totalRevenue}
      </h3>

      {/* ✅ Flex container for spacing between buttons */}
      <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
        {deletedProducts.length > 0 && (
          <button
            onClick={restoreAllProducts}
            style={{
              backgroundColor: "#5a3e2b",
              color: "white",
              border: "none",
              padding: "10px 15px",
              cursor: "pointer",
            }}
          >
            Restore All Products
          </button>
        )}

        <button
          onClick={() => navigate("/getproducts")}
          style={{
            backgroundColor: "#2b5a3e",
            color: "white",
            border: "none",
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          🔙 Back to Products
        </button>
      </div>
    </div>
  );
};

export default DeletedProducts;
