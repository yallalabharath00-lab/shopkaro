import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

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
      {/* Logo */}
      <div>
        <Link
          to="/"
          style={{
            textDecoration: "none",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          ShopKaro
        </Link>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <Link to="/">Home</Link>

        <Link to="/cart">Cart</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span>
              Hi, {user?.name}
            </span>

            <button onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;