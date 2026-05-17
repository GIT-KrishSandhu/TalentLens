import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = "https://talentlens-backend-roxt.onrender.com";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left decorative panel */}
      <div style={{
        flex: 1,
        background: "linear-gradient(145deg, #0f0e1a 0%, #1a1030 50%, #0f1a20 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px",
        position: "relative",
        overflow: "hidden",
        borderRight: "1.5px solid var(--border)",
      }}>
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,106,247,0.2) 0%, transparent 70%)",
          top: "-100px", left: "-100px",
        }} />
        <div style={{
          position: "absolute", width: "300px", height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,201,72,0.1) 0%, transparent 70%)",
          bottom: "-80px", right: "-80px",
        }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: "380px" }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: "2.8rem",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "24px",
          }}>
            Welcome{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>back.</span>
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "1rem" }}>
            Your AI-powered recruitment dashboard is ready. Log in to continue shortlisting candidates.
          </p>

          <div style={{
            marginTop: "48px",
            background: "rgba(124,106,247,0.08)",
            border: "1.5px solid rgba(124,106,247,0.2)",
            borderRadius: "14px",
            padding: "24px",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🤖</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, marginBottom: "6px" }}>
              AI Rankings Ready
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>
              OpenRouter GPT analyzes every candidate profile and explains exactly why they fit — or don't.
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        width: "480px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "60px 48px",
      }}>
        <div style={{ width: "100%" }}>
          <div style={{ marginBottom: "36px" }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              color: "var(--primary)",
              marginBottom: "8px",
              fontWeight: 600,
            }}>
              Talent<span style={{ color: "var(--accent)" }}>Lens</span>
            </div>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "8px" }}>
              Sign in
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Access your recruitment dashboard
            </p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="john@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ marginTop: "8px" }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}