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

        {/* DATA */}
        <div 
          className={page === "data" ? "active" : ""}
          onClick={() => setPage("data")}
        >
           {open && "Data"}
        </div>

        {/* PREDIKSI */}
        <div 
          className={page === "predict" ? "active" : ""}
          onClick={() => setPage("predict")}
        >
           {open && "Prediksi"}
        </div>

      </div>

      {/* ================= LOGOUT ================= */}
      <div className="logout">
        <button onClick={handleLogout}>
          🚪 {open && "Logout"}
        </button>
      </div>

    </div>
  );
}