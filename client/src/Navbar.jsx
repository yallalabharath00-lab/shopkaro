import { Link } from "react-router-dom";
import { useCart } from "./context/CartContext";

function Navbar() {
  const { cart } = useCart();

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        borderBottom: "1px solid #ddd",
        marginBottom: "20px",
      }}
    >
      <Link
        to="/"
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <h2>ShopKaro</h2>
      </Link>

      <Link
        to="/cart"
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        🛒 Cart ({cartCount})
      </Link>
    </nav>
  );
}

export default Navbar;