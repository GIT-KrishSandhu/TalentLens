import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/add-candidate", label: "Add Candidate" },
    { path: "/match", label: "Job Match" },
    { path: "/shortlisted", label: "AI Shortlist" },
  ];

  return (
    <nav style={{
      background: "rgba(19,19,26,0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1.5px solid var(--border)",
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: "64px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.2rem",
        fontWeight: 700,
        color: "var(--primary)",
        letterSpacing: "-0.5px",
      }}>
        Talent<span style={{ color: "var(--accent)" }}>Lens</span>
      </span>

      <div style={{ display: "flex", gap: "4px" }}>
        {links.map((link) => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            style={{
              background: location.pathname === link.path
                ? "rgba(124,106,247,0.15)"
                : "transparent",
              color: location.pathname === link.path
                ? "var(--primary)"
                : "var(--text-muted)",
              border: location.pathname === link.path
                ? "1.5px solid rgba(124,106,247,0.3)"
                : "1.5px solid transparent",
              padding: "8px 18px",
              borderRadius: "8px",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "var(--transition)",
            }}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "36px", height: "36px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "#fff",
        }}>
          {user.name ? user.name[0].toUpperCase() : "R"}
        </div>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {user.name || "Recruiter"}
        </span>
        <button className="btn-danger" onClick={logout} style={{ width: "auto" }}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;