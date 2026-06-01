export default function Sidebar({ setPage, setIsLogin, open, setOpen, page }) {
  // ================= LOGOUT =================

  const handleLogout = () => {
    setIsLogin(false);
  };

  return (
    <div className={open ? "sidebar open" : "sidebar closed"}>
      {/* ================= LOGO ================= */}

      <div className="logo-wrapper">
        {open && (
          <h2 className="logo">
            Smart <span>Budget</span>
          </h2>
        )}
      </div>

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

        {/* MY TRIP */}

        <div
          className={page === "expenses" ? "active" : ""}
          onClick={() => setPage("expenses")}
        >
          {open && "MyTrip"}
        </div>

        {/* DESTINATION */}

        <div
          className={page === "destination" ? "active" : ""}
          onClick={() => setPage("destination")}
        >
          {open && "Destination Terdekat"}
        </div>
      </div>
    </div>
  );
}
