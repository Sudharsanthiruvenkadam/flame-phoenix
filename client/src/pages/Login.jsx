
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Flame,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { loginUser } from "../services/api";
import "./Auth.css";

function Login() {
  const { role = "client" } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const allowedRoles = ["client", "staff", "admin"];
  const normalizedRole = role.toLowerCase();

  const title =
    normalizedRole.charAt(0).toUpperCase() +
    normalizedRole.slice(1);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!allowedRoles.includes(normalizedRole)) {
      setError("Invalid login portal.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginUser({
        email: email.trim(),
        password,
        role: normalizedRole.toUpperCase(),
      });

      if (!result?.success || !result?.token || !result?.user) {
        setError("The server returned an invalid login response.");
        return;
      }

      // Verify the returned account matches this portal.
      if (result.user.role !== normalizedRole.toUpperCase()) {
        setError("This account cannot access this login portal.");
        return;
      }

      // Store the authenticated session.
      localStorage.setItem("fp_token", result.token);
      localStorage.setItem("fp_user", JSON.stringify(result.user));

      // Navigate to the appropriate workspace.
      // Dashboard pages and protected routes will be added next.
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
        setError(
          "Login failed unexpectedly. Please try again."
        );
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
          FLAME PHOENIX WORKSPACE
        </p>

        <h1>{title} Login</h1>

        <p className="auth-description">
          Sign in to continue to your Flame Phoenix workspace.
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

        {normalizedRole === "client" && (
          <p className="auth-switch">
            New client?{" "}
            <Link to="/register">
              Create an account
            </Link>
          </p>
        )}

        <p className="auth-footer">
          Secure access to Flame Phoenix
        </p>
      </section>
    </main>
  );
}

export default Login;
