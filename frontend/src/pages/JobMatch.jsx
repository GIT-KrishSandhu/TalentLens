import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function JobMatch() {
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
        `${API}/api/match`,
        { requiredSkills, preferredSkills, minExperience: Number(form.minExperience) },
        { headers }
      );
      setResults(data);
    } catch (err) {
      setError(err.response?.data?.message || "Matching failed");
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
        <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "8px" }}>
          Job Matching
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Enter job requirements and instantly rank all candidates by skill overlap
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", alignItems: "start" }}>

        {/* Form Panel */}
        <div style={{ position: "sticky", top: "88px" }}>
          <div className="card">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, marginBottom: "20px" }}>
              Job Requirements
            </h3>

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
                {form.preferredSkills && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                    {form.preferredSkills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s} style={{
                        display: "inline-block", padding: "4px 12px",
                        borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600,
                        background: "rgba(247,201,72,0.12)",
                        color: "var(--accent)",
                        border: "1px solid rgba(247,201,72,0.3)",
                      }}>{s}</span>
                    ))}
                  </div>
                )}
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

              <button className="btn-primary" type="submit" disabled={loading}>
                {loading ? "Matching..." : "Match Candidates →"}
              </button>
            </form>
          </div>

          {/* Score legend */}
          <div className="card" style={{ marginTop: "16px" }}>
            <h4 style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Score Legend
            </h4>
            {[
              { label: "High Match", desc: "75%+ score + meets experience", cls: "badge-high" },
              { label: "Medium Match", desc: "40–74% score", cls: "badge-medium" },
              { label: "Low Match", desc: "Below 40% score", cls: "badge-low" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span className={`badge ${item.cls}`}>{item.label}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results Panel */}
        <div>
          {!results && !loading && (
            <div className="card" style={{ textAlign: "center", padding: "80px 40px", color: "var(--text-muted)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🎯</div>
              <h3 style={{ fontFamily: "var(--font-display)", marginBottom: "8px", color: "var(--text)" }}>
                Ready to Match
              </h3>
              <p style={{ fontSize: "0.9rem" }}>
                Fill in the job requirements and click Match Candidates to see ranked results
              </p>
            </div>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner" /> Analyzing candidates...
            </div>
          )}

          {results && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Summary bar */}
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px",
              }}>
                {[
                  { label: "High Match", value: results.tiers.high.length, cls: "badge-high", color: "var(--high)" },
                  { label: "Medium Match", value: results.tiers.medium.length, cls: "badge-medium", color: "var(--medium)" },
                  { label: "Low Match", value: results.tiers.low.length, cls: "badge-low", color: "var(--low)" },
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

              {/* Candidate cards */}
              {results.all.map((c, i) => (
                <div key={c._id} className="card" style={{
                  borderLeft: `3px solid ${c.rank === "High" ? "var(--high)" : c.rank === "Medium" ? "var(--medium)" : "var(--low)"}`,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "var(--surface2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        color: "var(--primary)", fontSize: "0.9rem",
                        border: "1.5px solid var(--border)",
                      }}>
                        #{i + 1}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1rem" }}>{c.name}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{c.email}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span className={`badge ${rankColors[c.rank]}`}>
                        {rankIcons[c.rank]} {c.rank}
                      </span>
                      <div style={{
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        fontSize: "1.3rem",
                        color: c.rank === "High" ? "var(--high)" : c.rank === "Medium" ? "var(--medium)" : "var(--low)",
                      }}>
                        {c.matchScore}%
                      </div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div style={{
                    height: "6px", background: "var(--surface2)",
                    borderRadius: "999px", marginBottom: "14px", overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: "999px",
                      width: `${c.matchScore}%`,
                      background: c.rank === "High" ? "var(--high)" : c.rank === "Medium" ? "var(--medium)" : "var(--low)",
                      transition: "width 0.6s ease",
                    }} />
                  </div>

                  <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Matched Required
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {c.matchedRequired.length > 0
                          ? c.matchedRequired.map((s) => <span key={s} className="badge badge-skill">{s}</span>)
                          : <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>None</span>
                        }
                      </div>
                    </div>
                    {c.matchedPreferred?.length > 0 && (
                      <div>
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          Matched Preferred
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          {c.matchedPreferred.map((s) => (
                            <span key={s} style={{
                              display: "inline-block", padding: "4px 12px",
                              borderRadius: "999px", fontSize: "0.78rem", fontWeight: 600,
                              background: "rgba(247,201,72,0.12)", color: "var(--accent)",
                              border: "1px solid rgba(247,201,72,0.3)",
                            }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ marginLeft: "auto" }}>
                      <span className={`badge ${c.meetsExperience ? "badge-high" : "badge-low"}`}>
                        {c.experience} yrs exp {c.meetsExperience ? "✓" : "✗"}
                      </span>
                    </div>
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