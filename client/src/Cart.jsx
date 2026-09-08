import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

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

      {cart.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <h2>{item.name}</h2>

          <p>Price: ₹{item.price}</p>

          <div>
            <button onClick={() => decreaseQuantity(item._id)}>
              -
            </button>

            <span style={{ margin: "0 15px" }}>
              {item.quantity}
            </span>

            <button onClick={() => increaseQuantity(item._id)}>
              +
            </button>
          </div>

          <p>
            Item Total: ₹{item.price * item.quantity}
          </p>

          <button onClick={() => removeFromCart(item._id)}>
            Remove
          </button>
        </div>
      ))}

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