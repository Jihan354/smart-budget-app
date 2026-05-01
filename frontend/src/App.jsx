import { useEffect, useState } from "react";
import { getExpenses, getSummary } from "./services/api";

import Sidebar from "./components/layout/Sidebar";
import Summary from "./components/dashboard/Summary";
import Prediction from "./components/dashboard/Prediction";
import ExpenseForm from "./components/Expense/ExpenseForm";
import ExpenseList from "./components/Expense/ExpenseList";
import Charts from "./components/dashboard/Charts";
import Insight from "./components/dashboard/Insight";

import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

import "./App.css";

function App() {

  // ================= STATE =================
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({});

  const [page, setPage] = useState(
    localStorage.getItem("page") || "dashboard"
  );

  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("login") === "true"
  );

  const [authPage, setAuthPage] = useState("login");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 🔥 FILTER (YANG LAMA TETAP)
  const [filterTrip, setFilterTrip] = useState("");
  const [searchNama, setSearchNama] = useState("");
  const [filterBulan, setFilterBulan] = useState("");

  // 🔥 TAMBAHAN (TAHUN)
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear());

  // ================= LOAD DATA =================
  const loadData = async () => {
    const expenses = await getExpenses();
    const sum = await getSummary();

    setData(expenses);
    setSummary(sum);
  };

  // ================= FILTER DATA =================
  const filteredData = data
    .filter(item => filterTrip ? item.trip === filterTrip : true)
    .filter(item => item.nama.toLowerCase().includes(searchNama.toLowerCase()))
    .filter(item => {
      if (!filterBulan) return true;
      const bulan = new Date(item.tanggal).getMonth() + 1;
      return bulan === Number(filterBulan);
    })
    // 🔥 TAMBAHAN FILTER TAHUN (TIDAK MENGGANGGU YANG LAMA)
    .filter(item => {
      if (!filterTahun) return true;
      const tahun = new Date(item.tanggal).getFullYear();
      return tahun === Number(filterTahun);
    });

  const tripOptions = [...new Set(data.map(item => item.trip))];

  // ================= INIT =================
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem("login", isLogin);
  }, [isLogin]);

  useEffect(() => {
    localStorage.setItem("page", page);
  }, [page]);

  // ================= AUTH =================
  if (!isLogin) {
    return authPage === "login" ? (
      <Login setIsLogin={setIsLogin} setAuthPage={setAuthPage} />
    ) : (
      <Register setAuthPage={setAuthPage} />
    );
  }

  // ================= MAIN =================
  return (
    <div className="container">

      <Sidebar 
        setPage={setPage} 
        setIsLogin={setIsLogin}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        page={page}
      />

      <div 
        className="main"
        style={{
          marginLeft: sidebarOpen ? "220px" : "65px",
          transition: "0.3s"
        }}
      >

        {/* ================= DASHBOARD ================= */}
        {page === "dashboard" && (
          <>
            <Summary summary={summary} data={data} />
            <Charts data={data} />
            <Insight data={data} />
          </>
        )}

        {/* ================= DATA ================= */}
        {page === "data" && (
          <>

            {/* 🔥 FILTER BAR (VERSI RAPI) */}
            <div className="filter-bar">

              {/* SEARCH */}
              <input
                type="text"
                placeholder="Cari nama..."
                value={searchNama}
                onChange={(e) => setSearchNama(e.target.value)}
              />

              {/* TRIP */}
              <select onChange={(e) => setFilterTrip(e.target.value)}>
                <option value="">Semua Trip</option>
                {tripOptions.map((trip, index) => (
                  <option key={index} value={trip}>
                    {trip}
                  </option>
                ))}
              </select>

              {/* BULAN */}
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

              {/* 🔥 TAHUN (BARU) */}
              <input
                type="number"
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
              />

              <button className="filter-btn">🔍 Filter</button>

            </div>

            <ExpenseForm refresh={loadData} />
            <ExpenseList data={filteredData} refresh={loadData} />

          </>
        )}

        {/* ================= PREDICT ================= */}
        {page === "predict" && (
          <Prediction refresh={loadData} />
        )}

      </div>
    </div>
  );
}

export default App;