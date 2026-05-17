import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Dashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCandidates = async () => {
    try {
      const { data } = await axios.get(`${API}/api/candidates`, { headers });
      setCandidates(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    try {
      await axios.delete(`${API}/api/candidates/${id}`, { headers });
      setDeleteMsg("Candidate deleted successfully");
      fetchCandidates();
      setTimeout(() => setDeleteMsg(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    }
  };

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    if (activeTab === "experienced") return matchSearch && c.experience >= 3;
    if (activeTab === "junior") return matchSearch && c.experience < 2;
    return matchSearch;
  });

  const stats = [
    { label: "Total Candidates", value: candidates.length, icon: "👥", color: "var(--primary)" },
    { label: "Senior (3+ yrs)", value: candidates.filter((c) => c.experience >= 3).length, icon: "⭐", color: "var(--accent)" },
    { label: "Junior (< 2 yrs)", value: candidates.filter((c) => c.experience < 2).length, icon: "🌱", color: "var(--high)" },
    { label: "Avg Experience", value: candidates.length ? (candidates.reduce((a, c) => a + c.experience, 0) / candidates.length).toFixed(1) + " yrs" : "0 yrs", icon: "📊", color: "#60a5fa" },
  ];

  const tabs = [
    { key: "all", label: "All Candidates" },
    { key: "experienced", label: "Senior (3+ yrs)" },
    { key: "junior", label: "Junior (< 2 yrs)" },
  ];

  return (
    <div style={{ padding: "40px 48px", maxWidth: "1200px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "8px" }}>
          Recruitment Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Manage and track all your candidates in one place
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "40px",
      }}>
        {stats.map((stat) => (
          <div key={stat.label} className="card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "var(--font-display)", color: stat.color }}>
                  {stat.value}
                </p>
              </div>
              <span style={{ fontSize: "1.8rem" }}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Messages */}
      {deleteMsg && <div className="success-msg">{deleteMsg}</div>}
      {error && <div className="error-msg">{error}</div>}

      {/* Search + Tabs */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        gap: "16px",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "var(--transition)",
                background: activeTab === tab.key ? "rgba(124,106,247,0.15)" : "transparent",
                color: activeTab === tab.key ? "var(--primary)" : "var(--text-muted)",
                border: activeTab === tab.key ? "1.5px solid rgba(124,106,247,0.3)" : "1.5px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <input
          placeholder="🔍  Search by name, email or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "300px" }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading">
          <div className="spinner" /> Loading candidates...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🔍</div>
          <p>No candidates found. Try adjusting your search or add new candidates.</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0 8px",
          }}>
            <thead>
              <tr>
                {["Candidate", "Skills", "Experience", "Actions"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left",
                    padding: "12px 20px",
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} style={{
                  background: "var(--surface)",
                  borderRadius: "10px",
                  transition: "var(--transition)",
                }}>
                  <td style={{ padding: "16px 20px", borderRadius: "10px 0 0 10px", border: "1.5px solid var(--border)", borderRight: "none" }}>
                    <div style={{ fontWeight: 600, marginBottom: "4px" }}>{c.name}</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{c.email}</div>
                  </td>
                  <td style={{ padding: "16px 20px", border: "1.5px solid var(--border)", borderLeft: "none", borderRight: "none" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {c.skills.map((skill) => (
                        <span key={skill} className="badge badge-skill">{skill}</span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", border: "1.5px solid var(--border)", borderLeft: "none", borderRight: "none" }}>
                    <span className={`badge ${c.experience >= 3 ? "badge-high" : c.experience >= 2 ? "badge-medium" : "badge-low"}`}>
                      {c.experience} yr{c.experience !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", borderRadius: "0 10px 10px 0", border: "1.5px solid var(--border)", borderLeft: "none" }}>
                    <button className="btn-danger" onClick={() => handleDelete(c._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}