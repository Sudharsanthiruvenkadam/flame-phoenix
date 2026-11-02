
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import logo from "../assets/flame-phoenix-logo.png";
import "./Login.css";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [role, setRole] = useState("STAFF");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
        role,
      });

      if (
        !response?.success ||
        !response?.token ||
        !response?.user
      ) {
        throw new Error(
          response?.message || "Invalid login response."
        );
      }

      if (response.user.role !== role) {
        throw new Error(
          `This account does not have ${role} access.`
        );
      }

      localStorage.setItem("fp_token", response.token);
      localStorage.setItem(
        "fp_user",
        JSON.stringify(response.user)
      );

      // Update the parent App.jsx user state
      onLogin(response.user);

      navigate(role === "ADMIN" ? "/admin" : "/staff");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand">
        <img src={logo} alt="Flame Phoenix Logo" />

        <p className="brand-label">FLAME PHOENIX</p>

        <h1>Build. Manage. Deliver.</h1>

        <p className="brand-description">
          One workspace for managing projects, teams, and progress.
        </p>
      </section>

      <section className="login-section">
        <div className="login-card">
          <p className="login-eyebrow">INTERNAL WORKSPACE</p>

          <h2>Welcome Back</h2>

          <p className="login-subtitle">
            Sign in to your Staff or Admin account.
          </p>

          <div className="role-selector">
            <button
              type="button"
              className={role === "STAFF" ? "active" : ""}
              onClick={() => {
                setRole("STAFF");
                setError("");
              }}
            >
              Staff Login
            </button>

            <button
              type="button"
              className={role === "ADMIN" ? "active" : ""}
              onClick={() => {
                setRole("ADMIN");
                setError("");
              }}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="username"
            />

            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />

            {error && (
              <p className="login-error">{error}</p>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : `Sign in as ${role}`}
            </button>
          </form>

          <p className="login-footer">
            Secure access for authorized team members only.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
