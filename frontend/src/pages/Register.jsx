import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/api/auth/register`, form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
    }}>
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
        {/* Decorative circles */}
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
            Find the best talent,{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>faster.</span>
          </div>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "1rem" }}>
            TalentLens uses AI to rank and shortlist candidates based on real skill matching — not just keywords.
          </p>

          <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {["AI-powered candidate ranking", "Skill overlap scoring", "OpenRouter GPT integration"].map((feat) => (
              <div key={feat} style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "12px 16px",
                textAlign: "left",
              }}>
                <span style={{ color: "var(--accent)", fontSize: "1.1rem" }}>✦</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{feat}</span>
              </div>
            ))}
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
              Create account
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Start shortlisting smarter today
            </p>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                Full Name
              </label>
              <input
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
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
                placeholder="Min 6 characters"
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
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}