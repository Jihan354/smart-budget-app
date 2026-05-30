export default function Sidebar({ setPage, setIsLogin, open, setOpen, page }) {
  // ================= LOGOUT =================
  const handleLogout = () => {
    setIsLogin(false);
  };

  return (
    <div className={open ? "sidebar open" : "sidebar closed"}>
      {/* ================= TOGGLE ================= */}
      <button className="toggle-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      {/* ================= LOGO ================= */}
      {open && (
        <h2 className="logo">
          Smart <span>Budget</span>
        </h2>
      )}

      {/* ================= MENU ================= */}
      <div className="menu">
        {/* DASHBOARD */}
        <div
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          {open && "Dashboard"}
        </div>

        {/* PLAN TRIP */}
        <div
          className={page === "planTrip" ? "active" : ""}
          onClick={() => setPage("planTrip")}
        >
          {open && "Plan Trip"}
        </div>

        {/* MyTrip */}
        <div
          className={page === "expenses" ? "active" : ""}
          onClick={() => setPage("expenses")}
        >
          {open && "MyTrip"}
        </div>
      </div>

      {/* ================= LOGOUT ================= */}
      <div className="logout">
        <button onClick={handleLogout}> {open && "Logout"} ➜]</button>
      </div>
    </div>
  );
}
