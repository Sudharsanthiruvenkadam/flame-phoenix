import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Flame,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { loginUser } from "../services/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    setLoading(true);

    try {
      const result = await loginUser({
        email: email.trim(),
        password,
        role: "CLIENT",
      });

      if (!result?.success || !result?.token || !result?.user) {
        setError("The server returned an invalid login response.");
        return;
      }

      // Only CLIENT accounts can access this portal.
      if (String(result.user.role).toUpperCase() !== "CLIENT") {
        setError("This portal is only for client accounts.");
        return;
      }

      // Store the authenticated client session.
      localStorage.setItem("fp_token", result.token);
      localStorage.setItem("fp_user", JSON.stringify(result.user));

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login error:", err);

      if (err.code === "ERR_NETWORK") {
        setError(
          "Cannot connect to the server. Check that the backend is running."
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed unexpectedly. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-back">
          <ArrowLeft size={17} />
          Back to home
        </Link>

        <div className="auth-brand-icon">
          <Flame size={32} />
        </div>

        <p className="auth-eyebrow">
          FLAME PHOENIX CLIENT PORTAL
        </p>

        <h1>Client Login</h1>

        <p className="auth-description">
          Sign in to access your Flame Phoenix client workspace.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address</label>

          <div className="auth-input-wrap">
            <Mail size={18} />

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              maxLength={254}
              required
            />
          </div>

          <label htmlFor="password">Password</label>

          <div className="auth-input-wrap">
            <LockKeyhole size={18} />

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="auth-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          New client?{" "}
          <Link to="/register">
            Create an account
          </Link>
        </p>

        <p className="auth-footer">
          Secure access to Flame Phoenix
        </p>
      </section>
    </main>
  );
}

export default Login;
