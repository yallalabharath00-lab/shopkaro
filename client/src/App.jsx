import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);

        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message || "Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h1>ShopKaro</h1>
      <h2>Products</h2>

      {loading && <p>Loading products...</p>}

      {error && <p>Error: {error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div>
          {products.map((product) => (
            <div key={product._id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>₹{product.price}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;