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
// EXPENSE
// =========================================================
import ExpenseForm from "./components/Expense/ExpenseForm";
import ExpenseList from "./components/Expense/ExpenseList";

// =========================================================
// AUTH
// =========================================================
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

// =========================================================
// STYLE
// =========================================================
import "./App.css";

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
  // FILTER STATE
  // =========================================================
  const [filterTrip, setFilterTrip] = useState("");

  const [searchNama, setSearchNama] = useState("");

  const [filterBulan, setFilterBulan] = useState("");

  const [filterTahun, setFilterTahun] = useState("");

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
  // FILTER DATA
  // =========================================================
  const filteredData = data

    // FILTER TRIP
    .filter((item) => (filterTrip ? item.trip === filterTrip : true))

    // SEARCH NAMA
    .filter((item) =>
      item.nama.toLowerCase().includes(searchNama.toLowerCase()),
    )

    // FILTER BULAN
    .filter((item) => {
      if (!filterBulan) return true;

      const bulan = new Date(item.start_date).getMonth() + 1;

      return bulan === Number(filterBulan);
    })

    // FILTER TAHUN
    .filter((item) => {
      if (!filterTahun) return true;

      const tahun = new Date(item.start_date).getFullYear();

      return tahun === Number(filterTahun);
    });

  // =========================================================
  // TRIP OPTIONS
  // =========================================================
  const tripOptions = [...new Set(data.map((item) => item.trip))];

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
        {/* EXPENSES */}
        {/* ================================================= */}
        {page === "expenses" && (
          <>
            {/* ============================================= */}
            {/* HEADER */}
            {/* ============================================= */}
            <div className="card">
              <h3>Travel Expense Manager</h3>

              <p>
                Track and manage your travel expenses based on trip destination
                and category.
              </p>
            </div>

            {/* ============================================= */}
            {/* FILTER BAR */}
            {/* ============================================= */}
            <div className="filter-bar">
              {/* SEARCH */}
              <input
                type="text"
                placeholder="Cari nama..."
                value={searchNama}
                onChange={(e) => setSearchNama(e.target.value)}
              />

              {/* FILTER TRIP */}
              <select onChange={(e) => setFilterTrip(e.target.value)}>
                <option value="">Semua Trip</option>

                {tripOptions.map((trip, index) => (
                  <option key={index} value={trip}>
                    {trip}
                  </option>
                ))}
              </select>

              {/* FILTER BULAN */}
              <select onChange={(e) => setFilterBulan(e.target.value)}>
                <option value="">Semua Bulan</option>

                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>

              {/* FILTER TAHUN */}
              <input
                type="number"
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
              />
            </div>

            {/* ============================================= */}
            {/* EXPENSE FORM */}
            {/* ============================================= */}
            <ExpenseForm refresh={loadData} />

            {/* ============================================= */}
            {/* EXPENSE LIST */}
            {/* ============================================= */}
            <ExpenseList data={filteredData} refresh={loadData} />
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
