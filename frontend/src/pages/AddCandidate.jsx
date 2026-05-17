import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function AddCandidate() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Convert comma-separated skills string to array
    const skillsArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skillsArray.length === 0) {
      setError("Please enter at least one skill");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${API}/api/candidates`,
        { ...form, skills: skillsArray, experience: Number(form.experience) },
        { headers }
      );
      setSuccess(`✅ ${form.name} has been added successfully!`);
      setForm({ name: "", email: "", skills: "", experience: "", bio: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add candidate");
    } finally {
      setLoading(false);
    }
  };

  const exampleSkills = [
    "React", "Node.js", "MongoDB", "AWS", "Docker",
    "Python", "TypeScript", "GraphQL", "Vue", "PostgreSQL"
  ];

  const addExampleSkill = (skill) => {
    const current = form.skills;
    const skillsArr = current.split(",").map((s) => s.trim()).filter(Boolean);
    if (!skillsArr.includes(skill)) {
      setForm({ ...form, skills: [...skillsArr, skill].join(", ") });
    }
  };

  return (
    <div style={{ padding: "40px 48px", maxWidth: "800px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "8px" }}>
          Add Candidate
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Add a new candidate profile to the talent pool
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>

        {/* Main Form */}
        <div className="card">
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Full Name *
                </label>
                <input
                  name="name"
                  placeholder="Rahul Sharma"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Email Address *
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="rahul@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                Skills * <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(comma separated)</span>
              </label>
              <input
                name="skills"
                placeholder="React, Node.js, MongoDB"
                value={form.skills}
                onChange={handleChange}
                required
              />
              {/* Live skill preview */}
              {form.skills && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
                  {form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill) => (
                    <span key={skill} className="badge badge-skill">{skill}</span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                Experience (years) *
              </label>
              <input
                name="experience"
                type="number"
                min="0"
                max="40"
                placeholder="2"
                value={form.experience}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                Bio / Projects <span style={{ fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                name="bio"
                placeholder="Brief description of the candidate's background, projects, or strengths..."
                value={form.bio}
                onChange={handleChange}
                rows={4}
                style={{ resize: "vertical" }}
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Adding Candidate..." : "Add Candidate →"}
            </button>
          </form>
        </div>

        {/* Right side panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Quick add skills */}
          <div className="card">
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "14px" }}>
              Quick Add Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {exampleSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => addExampleSkill(skill)}
                  type="button"
                  style={{
                    background: "rgba(124,106,247,0.08)",
                    color: "var(--text-muted)",
                    border: "1.5px solid var(--border)",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    transition: "var(--transition)",
                    fontFamily: "var(--font-body)",
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = "var(--primary)";
                    e.target.style.color = "var(--primary)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = "var(--border)";
                    e.target.style.color = "var(--text-muted)";
                  }}
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Tips card */}
          <div className="card" style={{
            background: "rgba(124,106,247,0.06)",
            border: "1.5px solid rgba(124,106,247,0.2)",
          }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "12px", color: "var(--primary)" }}>
              💡 Tips
            </h3>
            <ul style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.8, paddingLeft: "16px" }}>
              <li>Use exact skill names for better AI matching</li>
              <li>Separate multiple skills with commas</li>
              <li>Add a bio to improve AI recommendation quality</li>
              <li>Experience is in full years (e.g. 2.5 → use 2)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}