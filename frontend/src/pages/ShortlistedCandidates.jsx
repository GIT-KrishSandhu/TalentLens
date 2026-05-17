import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function ShortlistedCandidates() {
  const [form, setForm] = useState({
    requiredSkills: "",
    preferredSkills: "",
    minExperience: "0",
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null);
    setLoading(true);

    const requiredSkills = form.requiredSkills
      .split(",").map((s) => s.trim()).filter(Boolean);
    const preferredSkills = form.preferredSkills
      .split(",").map((s) => s.trim()).filter(Boolean);

    if (requiredSkills.length === 0) {
      setError("Please enter at least one required skill");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        `${API}/api/ai/shortlist`,
        { requiredSkills, preferredSkills, minExperience: Number(form.minExperience) },
        { headers }
      );
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || "AI shortlisting failed");
    } finally {
      setLoading(false);
    }
  };

  const rankColors = { High: "badge-high", Medium: "badge-medium", Low: "badge-low" };
  const rankIcons = { High: "🟢", Medium: "🟡", Low: "🔴" };

  return (
    <div style={{ padding: "40px 48px", maxWidth: "1100px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 700 }}>AI Shortlisting</h1>
          <span style={{
            background: "linear-gradient(135deg, rgba(124,106,247,0.2), rgba(247,201,72,0.2))",
            border: "1.5px solid rgba(124,106,247,0.3)",
            borderRadius: "999px",
            padding: "4px 14px",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--primary)",
            fontFamily: "var(--font-display)",
          }}>
            ✦ Powered by OpenRouter
          </span>
        </div>
        <p style={{ color: "var(--text-muted)" }}>
          AI analyzes every candidate profile and explains exactly why they fit — or don't
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", alignItems: "start" }}>

        {/* Form Panel */}
        <div style={{ position: "sticky", top: "88px" }}>
          <div className="card" style={{
            background: "linear-gradient(145deg, var(--surface), rgba(124,106,247,0.05))",
            border: "1.5px solid rgba(124,106,247,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ fontSize: "1.4rem" }}>🤖</span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600 }}>
                AI Job Requirements
              </h3>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Required Skills * <span style={{ fontWeight: 400 }}>(comma separated)</span>
                </label>
                <input
                  name="requiredSkills"
                  placeholder="React, Node.js, MongoDB"
                  value={form.requiredSkills}
                  onChange={handleChange}
                  required
                />
                {form.requiredSkills && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s} className="badge badge-skill">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Preferred Skills <span style={{ fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  name="preferredSkills"
                  placeholder="AWS, Docker, TypeScript"
                  value={form.preferredSkills}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Minimum Experience (years)
                </label>
                <input
                  name="minExperience"
                  type="number"
                  min="0"
                  max="20"
                  value={form.minExperience}
                  onChange={handleChange}
                />
              </div>

              <button
                className="btn-primary"
                type="submit"
                disabled={loading}
                style={{
                  background: loading
                    ? "var(--surface2)"
                    : "linear-gradient(135deg, var(--primary), #9b6ef7)",
                }}
              >
                {loading ? "AI is thinking..." : "✦ Run AI Shortlist →"}
              </button>
            </form>
          </div>

          {/* AI info card */}
          <div className="card" style={{ marginTop: "16px", background: "rgba(247,201,72,0.04)", border: "1.5px solid rgba(247,201,72,0.15)" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "10px", color: "var(--accent)" }}>
              ✦ How AI Ranking Works
            </h4>
            <ul style={{ color: "var(--text-muted)", fontSize: "0.83rem", lineHeight: 1.8, paddingLeft: "16px" }}>
              <li>Reads every candidate's full profile</li>
              <li>Goes beyond keyword matching</li>
              <li>Considers bio, experience context</li>
              <li>Explains reasoning for each rank</li>
              <li>Uses OpenRouter GPT model</li>
            </ul>
          </div>
        </div>

        {/* Results Panel */}
        <div>
          {!results && !loading && (
            <div className="card" style={{ textAlign: "center", padding: "80px 40px" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🤖</div>
              <h3 style={{
                fontFamily: "var(--font-display)",
                marginBottom: "8px",
                fontSize: "1.3rem",
              }}>
                AI Ready to Analyze
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", maxWidth: "320px", margin: "0 auto" }}>
                Enter job requirements and let AI rank your candidates with detailed explanations
              </p>
            </div>
          )}

          {loading && (
            <div className="card" style={{ textAlign: "center", padding: "80px 40px" }}>
              <div style={{ fontSize: "3rem", marginBottom: "20px" }}>
                <div className="spinner" style={{ width: "48px", height: "48px", margin: "0 auto", borderWidth: "3px" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "8px" }}>
                AI is analyzing candidates...
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                This may take a few seconds
              </p>
            </div>
          )}

          {results && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Summary */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px",
                marginBottom: "8px",
              }}>
                {[
                  { label: "High Match", value: results.aiRankings.filter((c) => c.rank === "High").length, color: "var(--high)" },
                  { label: "Medium Match", value: results.aiRankings.filter((c) => c.rank === "Medium").length, color: "var(--medium)" },
                  { label: "Low Match", value: results.aiRankings.filter((c) => c.rank === "Low").length, color: "var(--low)" },
                ].map((tier) => (
                  <div key={tier.label} className="card" style={{ textAlign: "center", padding: "16px" }}>
                    <div style={{ fontSize: "1.8rem", fontWeight: 700, color: tier.color, fontFamily: "var(--font-display)" }}>
                      {tier.value}
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "4px" }}>
                      {tier.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Candidate Cards */}
              {results.aiRankings.map((c, i) => (
                <div key={i} className="card" style={{
                  borderLeft: `3px solid ${c.rank === "High" ? "var(--high)" : c.rank === "Medium" ? "var(--medium)" : "var(--low)"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--primary), var(--accent))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        color: "#fff", fontSize: "0.85rem",
                      }}>
                        #{i + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1rem" }}>{c.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{c.email}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className={`badge ${rankColors[c.rank] || "badge-medium"}`}>
                        {rankIcons[c.rank] || "🟡"} {c.rank}
                      </span>
                      <div style={{
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem",
                        color: c.rank === "High" ? "var(--high)" : c.rank === "Medium" ? "var(--medium)" : "var(--low)",
                      }}>
                        {c.matchScore}%
                      </div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div style={{
                    height: "6px", background: "var(--surface2)",
                    borderRadius: "999px", marginBottom: "16px", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: "999px",
                      width: `${c.matchScore}%`,
                      background: c.rank === "High"
                        ? "var(--high)"
                        : c.rank === "Medium"
                        ? "var(--medium)"
                        : "var(--low)",
                      transition: "width 0.8s ease",
                    }} />
                  </div>

                  {/* AI Reason */}
                  <div style={{
                    background: "rgba(124,106,247,0.06)",
                    border: "1.5px solid rgba(124,106,247,0.15)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    marginBottom: "14px",
                  }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      ✦ AI Analysis
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.6 }}>
                      {c.reason}
                    </p>
                  </div>

                  {/* Skills + Experience */}
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", flex: 1 }}>
                      {c.skills?.map((skill) => (
                        <span key={skill} className="badge badge-skill">{skill}</span>
                      ))}
                    </div>
                    <span className="badge badge-medium">
                      {c.experience} yrs experience
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}