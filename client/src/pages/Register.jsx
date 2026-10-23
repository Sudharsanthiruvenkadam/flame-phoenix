import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Flame, UserRound, Mail, LockKeyhole, Building2, Phone } from "lucide-react";
import { registerUser } from "../services/api";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerUser(form);
      setError("");

      // Save the token and basic user details after successful registration.
      localStorage.setItem("fp_token", result.token);
      localStorage.setItem("fp_user", JSON.stringify(result.user));

      navigate("/login/client", {
        state: { message: "Account created successfully. You can now sign in." },
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-back">
          <ArrowLeft size={17} /> Back to home
        </Link>

        <div className="auth-brand-icon">
          <Flame size={32} />
        </div>

        <p className="auth-eyebrow">FLAME PHOENIX WORKSPACE</p>
        <h1>Create your account</h1>
        <p className="auth-description">
          Join Flame Phoenix to discuss your ideas and manage your projects.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name *</label>
          <div className="auth-input-wrap">
            <UserRound size={18} />
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              minLength={2}
              maxLength={100}
              required
            />
          </div>

          <label htmlFor="register-email">Email address *</label>
          <div className="auth-input-wrap">
            <Mail size={18} />
            <input
              id="register-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
              required
            />
          </div>

          <label htmlFor="register-password">Password *</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={18} />
            <input
              id="register-password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              minLength={8}
              required
            />
          </div>

          <label htmlFor="company">Company (optional)</label>
          <div className="auth-input-wrap">
            <Building2 size={18} />
            <input
              id="company"
              name="company"
              type="text"
              placeholder="Company name"
              value={form.company}
              onChange={updateField}
              autoComplete="organization"
              maxLength={150}
            />
          </div>

          <label htmlFor="phone">Phone number (optional)</label>
          <div className="auth-input-wrap">
            <Phone size={18} />
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Your phone number"
              value={form.phone}
              onChange={updateField}
              autoComplete="tel"
              maxLength={30}
            />
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create client account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login/client">Sign in</Link>
        </p>

        <p className="auth-footer">
          Public registration creates client accounts only.
        </p>
      </section>
    </main>
  );
}

export default Register;
