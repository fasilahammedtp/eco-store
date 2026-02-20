
import { useState } from "react";
import { getUsers } from "../services/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import "../styles/auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from =
    location.state && location.state.from
      ? location.state.from
      : "/";

  const [toast, setToast] = useState({ show: false, msg: "", type: "" });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });

    setTimeout(() => {
      setToast({ show: false, msg: "", type });
    }, 2500);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Fill all fields ❗", "error");
      return;
    }

    try {
      const res = await getUsers();

      const user = res.data.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        showToast("Invalid email or password ❌", "error");
        return;
      }

      // block check
      if (user.isBlocked) {
        showToast("Your account has been blocked by admin 🚫", "error");
        return;
      }

      showToast("Login successful 🌿");

      login(user);

      setTimeout(() => {
        //if admin logs in from user page , redirect to admin
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate(from);
        }
      }, 1500);

    } catch (err) {
      showToast("Something went wrong ⚠️", "error");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back 🌿</h2>

        <input
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Toast
          show={toast.show}
          message={toast.msg}
          type={toast.type}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          New here? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
