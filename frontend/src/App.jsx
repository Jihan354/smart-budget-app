import { useEffect, useState } from "react";

import { getExpenses, getSummary } from "./services/api";

// =========================================================
// LAYOUT
// =========================================================
import Sidebar from "./components/layout/Sidebar";

// =========================================================
// DASHBOARD
// =========================================================
import Dashboard from "./components/dashboard/Dashboard";
import TripPlanner from "./components/dashboard/TripPlanner";
import Prediction from "./components/dashboard/Prediction";

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
import "./styles/global.css";
import "./styles/sidebar.css";
import "./styles/responsive.css";

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

  // =========================================================
  // SIDEBAR STATE
  // =========================================================
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    loadData();
  }, []);

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
  // AUTH CHECK
  // =========================================================
  if (!isLogin) {
    return authPage === "login" ? (
      <Login setIsLogin={setIsLogin} setAuthPage={setAuthPage} />
    ) : (
      <Register setAuthPage={setAuthPage} />
    );
  }

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
          marginLeft: sidebarOpen ? "220px" : "65px",

          transition: "0.3s",
        }}
      >
        {/* ================================================= */}
        {/* DASHBOARD */}
        {/* ================================================= */}
        {page === "dashboard" && <Dashboard summary={summary} data={data} />}

        {/* ================================================= */}
        {/* PLAN TRIP */}
        {/* ================================================= */}
        {page === "planTrip" && <TripPlanner refresh={loadData} />}

        {/* ================================================= */}
        {/* MY TRIP */}
        {/* ================================================= */}
        {page === "expenses" && (
          <>
            {/* ============================================= */}
            {/* HEADER */}
            {/* ============================================= */}
            <div className="card">
              <h2>My Trip</h2>

              <p>Your AI travel plan and estimated trip budget.</p>
            </div>

            <br />

            {/* ============================================= */}
            {/* MY TRIP CONTENT */}
            {/* ============================================= */}
            <Expenses />
          </>
        )}

        {/* ================================================= */}
        {/* AI PREDICTION */}
        {/* ================================================= */}
        {page === "prediction" && <Prediction refresh={loadData} />}
      </div>
    </div>
  );
}

export default App;
