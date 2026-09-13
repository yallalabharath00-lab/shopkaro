import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";

function Cart() {
  const {
    cart,
    loading,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  if (loading) {
    return (
      <div>
        <h1>Shopping Cart</h1>
        <p>Loading cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <h1>Shopping Cart</h1>

        <p>Your cart is empty.</p>

        <Link to="/">
          <button>Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Shopping Cart</h1>

      {cart.map((item) => {
        const product = item.product;

        return (
          <div
            key={product._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h2>{product.name}</h2>

            <p>{product.description}</p>

            <p>Price: ₹{product.price}</p>

            <div>
              <button
                onClick={() => decreaseQuantity(product._id)}
                disabled={item.quantity <= 1}
              >
                -
              </button>

              <span style={{ margin: "0 15px" }}>
                {item.quantity}
              </span>

              <button
                onClick={() => increaseQuantity(product._id)}
              >
                +
              </button>
            </div>

            <p>
              Item Total: ₹{product.price * item.quantity}
            </p>

            <button
              onClick={() => removeFromCart(product._id)}
            >
              Remove
            </button>
          </div>
        );
      })}

      <hr />

      <h2>Total: ₹{cartTotal}</h2>

      <Link to="/">
        <button>Continue Shopping</button>
      </Link>

      <button style={{ marginLeft: "10px" }}>
        Checkout
      </button>
    </div>
  );
}

export default Cart;