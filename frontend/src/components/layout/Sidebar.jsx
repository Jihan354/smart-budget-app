export default function Sidebar({ setPage, setIsLogin, open, setOpen, page }) {
  // ================= LOGOUT =================

  const handleLogout = () => {
    setIsLogin(false);
  };

  return (
    <>
      {/* ================= SIDEBAR ================= */}

      <div className={open ? "sidebar open" : "sidebar closed"}>
        {/* ================= LOGO ================= */}

        <div className="logo-wrapper">
          <h2 className="logo">
            Smart <span>Budget</span>
          </h2>
        </div>

        {/* ================= MENU ================= */}

        <div className="menu">
          {/* DASHBOARD */}

          <div
            className={page === "dashboard" ? "active" : ""}
            onClick={() => {
              setPage("dashboard");
              setOpen(false);
            }}
          >
            Dashboard
          </div>

          {/* PLAN TRIP */}

          <div
            className={page === "planTrip" ? "active" : ""}
            onClick={() => {
              setPage("planTrip");
              setOpen(false);
            }}
          >
            Plan Trip
          </div>

          {/* MY TRIP */}

          <div
            className={page === "expenses" ? "active" : ""}
            onClick={() => {
              setPage("expenses");
              setOpen(false);
            }}
          >
            MyTrip
          </div>

          {/* DESTINATION */}

          <div
            className={page === "destination" ? "active" : ""}
            onClick={() => {
              setPage("destination");
              setOpen(false);
            }}
          >
            Destination Terdekat
          </div>
        </div>
      </div>

      {/* ================= OVERLAY ================= */}

      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)} />
      )}
    </>
  );
}
