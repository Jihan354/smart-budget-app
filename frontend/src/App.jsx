import { useEffect, useState } from "react";

import { getExpenses, getSummary } from "./services/api";

// =========================================================
// LAYOUT
// =========================================================
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";

// =========================================================
// DASHBOARD
// =========================================================
import Dashboard from "./components/dashboard/Dashboard";
import TripPlanner from "./components/dashboard/TripPlanner";
import Prediction from "./components/dashboard/Prediction";
import Destination from "./components/dashboard/Destination";

// =========================================================
// MY TRIP
// =========================================================
import Expenses from "./components/Expense/Expenses";

// =========================================================
// AUTH
// =========================================================
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// =========================================================
// STYLE
// =========================================================
import "./styles/base.css";
import "./styles/sidebar.css";
import "./styles/responsive.css";
import "./styles/navbar.css";

function App() {
  // =========================================================
  // MAIN STATE
  // =========================================================
  const [data, setData] = useState([]);

  const [summary, setSummary] = useState({});

  // =========================================================
  // PAGE STATE
  // =========================================================
  const [page, setPage] = useState(localStorage.getItem("page") || "dashboard");

  // =========================================================
  // AUTH STATE
  // =========================================================
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("login") === "true",
  );

  const [authPage, setAuthPage] = useState("login");
  const [showLogin, setShowLogin] = useState(false);

  const [showRegister, setShowRegister] = useState(false);

  // =========================================================
  // SIDEBAR STATE
  // =========================================================
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );
  // =========================================================
  // LOAD DATA
  // =========================================================
  const loadData = async () => {
    const expenses = await getExpenses();

    const sum = await getSummary();

    setData(expenses);

    setSummary(sum);
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================
  useEffect(() => {
    if (isLogin) {
      loadData();
    } else {
      // kosongin data kalau belum login
      setData([]);
      setSummary({});
    }
  }, [isLogin]);

  // =========================================================
  // SAVE LOGIN
  // =========================================================
  useEffect(() => {
    localStorage.setItem("login", isLogin);
  }, [isLogin]);

  // =========================================================
  // SAVE PAGE
  // =========================================================
  useEffect(() => {
    localStorage.setItem("page", page);
  }, [page]);

  // =========================================================
  // DARK MODE
  // =========================================================
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");

      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");

      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // =========================================================
  // MAIN APP
  // =========================================================
  return (
    <div className="container">
      {/* ===================================================== */}
      {/* SIDEBAR */}
      {/* ===================================================== */}
      <Sidebar
        setPage={setPage}
        setIsLogin={setIsLogin}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        page={page}
      />

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}
      <div
        className="main"
        style={{
          marginLeft: sidebarOpen ? "220px" : "0px",
          transition: "0.3s",
          paddingTop: "90px",
        }}
      >
        {/* ================================================ */}
        {/* NAVBAR */}
        {/* ================================================ */}
        <Navbar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          title={
            page === "dashboard"
              ? "Dashboard Analytics"
              : page === "planTrip"
                ? "AI Destination Finder"
                : page === "expenses"
                  ? "My Trips History"
                  : page === "destination"
                    ? "Wisata Terdekat"
                    : "Smart Budget"
          }
          isLogin={isLogin}
          setShowLogin={setShowLogin}
          setShowRegister={setShowRegister}
          setIsLogin={setIsLogin}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* ================================================= */}
        {/* DASHBOARD */}
        {/* ================================================= */}
        {page === "dashboard" && <Dashboard summary={summary} data={data} />}

        {/* ================================================= */}
        {/* PLAN TRIP */}
        {/* ================================================= */}
        {page === "planTrip" && (
          <TripPlanner
            refresh={loadData}
            isLogin={isLogin}
            setShowLogin={setShowLogin}
          />
        )}

        {page === "expenses" &&
          (isLogin ? (
            <Expenses />
          ) : (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              Silakan login terlebih dahulu untuk melihat trip Anda
            </div>
          ))}

        {/* ================================================= */}
        {/* AI PREDICTION */}
        {/* ================================================= */}
        {page === "prediction" && <Prediction refresh={loadData} />}
        {page === "destination" && <Destination />}
      </div>

      {/* ================================================= */}
      {/* LOGIN MODAL */}
      {/* ================================================= */}

      {showLogin && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <div className="close-auth" onClick={() => setShowLogin(false)}>
              ✕
            </div>

            <Login
              setIsLogin={setIsLogin}
              setAuthPage={() => {}}
              setShowLogin={setShowLogin}
              setShowRegister={setShowRegister}
            />
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* REGISTER MODAL */}
      {/* ================================================= */}

      {showRegister && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <div className="close-auth" onClick={() => setShowRegister(false)}>
              ✕
            </div>

            <Register
              setAuthPage={() => {}}
              setShowRegister={setShowRegister}
              setShowLogin={setShowLogin}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
