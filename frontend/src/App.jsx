import { useEffect, useState } from "react";
import "./App.css";

/* =========================================
   IMPORT CHART
========================================= */
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

/* =========================================
   IMPORT TOAST
========================================= */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  /* ==================================================
     AUTH STATE
  ================================================== */

  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [namaUser, setNamaUser] = useState("");

  /* ==================================================
     DATA TRANSAKSI
  ================================================== */

  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [trip, setTrip] = useState("");
  const [type, setType] = useState("expense");
  const [editId, setEditId] = useState(null);

  /* ==================================================
     FITUR FRONTEND
  ================================================== */

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  /* ==================================================
     DELETE MODAL
  ================================================== */

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* ==================================================
     SUMMARY
  ================================================== */

  const [summary, setSummary] = useState({});

  useEffect(() => {
    const login = localStorage.getItem("isLogin");

    if (login === "true") {
      setIsLogin(true);
    }
  }, []);

  const getExpenses = async () => {
    const res = await fetch("http://127.0.0.1:5000/expenses");
    const result = await res.json();
    setData(result);
  };

  const getSummary = async () => {
    const res = await fetch("http://127.0.0.1:5000/summary");
    const result = await res.json();
    setSummary(result);
  };

  useEffect(() => {
    if (isLogin) {
      getExpenses();
      getSummary();
    }
  }, [isLogin]);

  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("isLogin", "true");
        setIsLogin(true);
        toast.success(result.message);
      } else {
        toast.error("Login gagal");
      }
    } catch {
      toast.error("Backend belum jalan");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nama: namaUser,
          email,
          password
        })
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message);
        setIsRegister(false);
      } else {
        toast.error("Register gagal");
      }
    } catch {
      toast.error("Backend belum jalan");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
    toast.success("Logout berhasil");
  };

  const handleSubmit = async () => {
    if (!nama || !kategori || !jumlah || !tanggal) {
      toast.warning("Isi field wajib!");
      return;
    }

    if (type === "expense" && !trip) {
      toast.warning("Trip wajib diisi!");
      return;
    }

    const payload = {
      nama,
      kategori,
      jumlah: Number(jumlah),
      tanggal,
      trip,
      type
    };

    if (editId) {
      await fetch(`http://127.0.0.1:5000/expenses/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      toast.success("Data berhasil diupdate");
    } else {
      await fetch("http://127.0.0.1:5000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      toast.success("Data berhasil ditambah");
    }

    setNama("");
    setKategori("");
    setJumlah("");
    setTanggal("");
    setTrip("");
    setType("expense");
    setEditId(null);

    getExpenses();
    getSummary();
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/expenses/${id}`, {
      method: "DELETE"
    });

    toast.success("Data berhasil dihapus");

    getExpenses();
    getSummary();
  };

  const handleEdit = (item) => {
    setNama(item.nama);
    setKategori(item.kategori);
    setJumlah(item.jumlah);
    setTanggal(item.tanggal);
    setTrip(item.trip || "");
    setType(item.type || "expense");
    setEditId(item.id);
  };

  /* =========================================
     EXPORT CSV (BARU)
  ========================================= */
  const exportCSV = () => {
    const header = [
      "Nama",
      "Kategori",
      "Jumlah",
      "Tanggal",
      "Trip",
      "Type"
    ];

    const rows = filteredData.map((item) => [
      item.nama,
      item.kategori,
      item.jumlah,
      item.tanggal,
      item.trip,
      item.type
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows]
        .map((e) => e.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "laporan-budget.csv");

    document.body.appendChild(link);
    link.click();
  };

  const filteredData = data.filter((item) => {
    const cocokSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kategori.toLowerCase().includes(search.toLowerCase());

    const cocokFilter =
      filterType === "all" ? true : item.type === filterType;

    return cocokSearch && cocokFilter;
  });

  const COLORS = ["#7f5af0", "#ff4d4d"];

  const pieData = [
    {
      name: "Expense",
      value: summary.total_expense || 0
    },
    {
      name: "Income",
      value: summary.total_income || 0
    }
  ];

  const barData = filteredData.map((item) => ({
    nama: item.nama,
    jumlah: item.jumlah
  }));

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      {!isLogin ? (
        <div className="login-card">
          <h2>{isRegister ? "Register" : "Login"}</h2>

          {isRegister && (
            <input
              type="text"
              placeholder="Nama"
              onChange={(e) => setNamaUser(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button onClick={isRegister ? handleRegister : handleLogin}>
            {isRegister ? "Register" : "Login"}
          </button>

          <p
            className="switch"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Sudah punya akun? Login"
              : "Belum punya akun? Register"}
          </p>
        </div>
      ) : (
        <>
          <div className="sidebar">
            <h2>💰 Smart Budget</h2>

            <button onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? "☀ Light" : "🌙 Dark"}
            </button>

            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="main">
            <div className="summary">
              <div className="card-summary">
                <h3>Total Expense</h3>
                <p>Rp {summary.total_expense || 0}</p>
              </div>

              <div className="card-summary">
                <h3>Total Income</h3>
                <p>Rp {summary.total_income || 0}</p>
              </div>

              <div className="card-summary">
                <h3>Saldo</h3>
                <p>Rp {summary.saldo || 0}</p>
              </div>
            </div>

            <div className="chart-section">
              <div className="chart-box">
                <h3>Income vs Expense</h3>

                <PieChart width={300} height={250}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>

              <div className="chart-box">
                <h3>Nominal Transaksi</h3>

                <BarChart width={420} height={250} data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nama" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="jumlah" fill="#7f5af0" />
                </BarChart>
              </div>
            </div>

            <div className="top-tools">
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Semua</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              {/* TOMBOL EXPORT BARU */}
              <button onClick={exportCSV}>
                Export CSV
              </button>
            </div>

            <div className="content">
              <div className="form-box">
                <h3>{editId ? "Edit Data" : "Tambah Data"}</h3>

                <input
                  type="text"
                  placeholder="Nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Kategori"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Jumlah"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                />

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                />

                {type === "expense" && (
                  <input
                    type="text"
                    placeholder="Trip"
                    value={trip}
                    onChange={(e) => setTrip(e.target.value)}
                  />
                )}

                <button onClick={handleSubmit}>
                  {editId ? "Update" : "Tambah"}
                </button>
              </div>

              <div className="list">
                {filteredData.map((item) => (
                  <div key={item.id} className="card">
                    <p><b>{item.nama}</b></p>
                    <p>{item.kategori}</p>
                    <p>Rp {item.jumlah}</p>
                    <p>{item.tanggal}</p>
                    <p>{item.trip}</p>
                    <p>{item.type}</p>

                    <button
                      className="edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => {
                        setDeleteId(item.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Yakin mau hapus?</h3>

            <div className="modal-action">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Batal
              </button>

              <button
                className="delete-btn"
                onClick={() => {
                  handleDelete(deleteId);
                  setShowDeleteModal(false);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      />
    </div>
  );
}

export default App;