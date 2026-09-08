  import { useEffect, useState } from "react";
  import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useParams,
  } from "react-router-dom";
  import { CartProvider } from "./context/CartContext";
  import { useCart } from "./context/CartContext";
  import Cart from "./Cart";
  import Navbar from "./Navbar";

  function Products() {
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
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                style={{
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <div
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    margin: "10px 0",
                    cursor: "pointer",
                  }}
                >
                  <h3>{product.name}</h3>

                  <p>{product.description}</p>

                  <p>₹{product.price}</p>

                  <p>Category: {product.category}</p>

                  <p>Stock: {product.stock}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }


  // Product Details Page
  function ProductDetails() {
    const { addToCart } = useCart();
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
      fetch(`http://localhost:5000/api/products/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch product");
          }

          return response.json();
        })
        .then((data) => {
          console.log("Product Details:", data);

          if (data.success) {
            setProduct(data.product);
          } else {
            setError(data.message || "Product not found");
          }
        })
        .catch((error) => {
          console.error("Product Error:", error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [id]);

    if (loading) {
      return <p>Loading product...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (!product) {
      return <p>Product not found.</p>;
    }

    return (
      <div>
        <Link to="/">← Back to Products</Link>

        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <h2>₹{product.price}</h2>

        <p>Category: {product.category}</p>

        <p>Stock: {product.stock}</p>

        <button onClick={() => addToCart(product)}>

          Add to Cart
        </button>

        <Link to="/cart">
           <button style={{ marginLeft: "10px" }}>
              Go to Cart
            </button>
        </Link>
      </div>
    );
  }


  // Main App
  function App() {
    return (
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>


          <Route path="/" 
            element={<Products />} 
          />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />
          <Route path="/cart" element={<Cart />} />

          </Routes>
        </BrowserRouter>
      </CartProvider >
    );
  }

  export default App;