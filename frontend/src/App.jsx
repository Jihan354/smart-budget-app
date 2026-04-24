import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // AUTH
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [namaUser, setNamaUser] = useState("");

  // DATA
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [trip, setTrip] = useState("");
  const [type, setType] = useState("expense");
  const [editId, setEditId] = useState(null);

  // SUMMARY
  const [summary, setSummary] = useState({});

  // AUTO LOGIN
  useEffect(() => {
    const login = localStorage.getItem("isLogin");
    if (login === "true") setIsLogin(true);
  }, []);

  // GET DATA
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

  // LOGIN
  const handleLogin = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem("isLogin", "true");
        setIsLogin(true);
        alert(result.message);
      } else {
        alert("Login gagal");
      }
    } catch {
      alert("Backend belum jalan");
    }
  };

  // REGISTER
  const handleRegister = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          nama: namaUser,
          email,
          password
        }),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        setIsRegister(false);
      } else {
        alert("Register gagal");
      }
    } catch {
      alert("Backend belum jalan");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    setIsLogin(false);
  };

  // CREATE / UPDATE
  const handleSubmit = async () => {
    if (!nama || !kategori || !jumlah || !tanggal) {
      alert("Isi field wajib!");
      return;
    }

    if (type === "expense" && !trip) {
      alert("Trip wajib untuk pengeluaran!");
      return;
    }

    const payload = {
      nama,
      kategori,
      jumlah: Number(jumlah),
      tanggal,
      trip,
      type,
    };

    if (editId) {
      await fetch(`http://127.0.0.1:5000/expenses/${editId}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("http://127.0.0.1:5000/expenses", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(payload),
      });
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

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/expenses/${id}`, {
      method: "DELETE",
    });
    getExpenses();
    getSummary();
  };

  // EDIT
  const handleEdit = (item) => {
    setNama(item.nama);
    setKategori(item.kategori);
    setJumlah(item.jumlah);
    setTanggal(item.tanggal);
    setTrip(item.trip || "");
    setType(item.type || "expense");
    setEditId(item.id);
  };

  return (
    <div className="container">
      {!isLogin ? (
        <div className="card">
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

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={isRegister ? handleRegister : handleLogin}>
            {isRegister ? "Register" : "Login"}
          </button>

          <p onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Sudah punya akun? Login" : "Belum punya akun? Register"}
          </p>
        </div>
      ) : (
        <>
          <h1>Dashboard 💰</h1>
          <button onClick={handleLogout}>Logout</button>

          {/* SUMMARY */}
          <div className="summary">
            <h3>Total Expense: Rp {summary.total_expense || 0}</h3>
            <h3>Total Income: Rp {summary.total_income || 0}</h3>
            <h3>Saldo: Rp {summary.saldo || 0}</h3>
          </div>

          {/* FORM */}
          <div className="form">
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

            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
            />

            {/* 🔥 trip hanya untuk expense */}
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

          {/* LIST */}
          <div className="list">
            {data.map((item) => (
              <div key={item.id} className="card">
                <p><b>{item.nama}</b></p>
                <p>{item.kategori}</p>
                <p>Rp {item.jumlah}</p>
                <p>{item.tanggal}</p>
                <p>{item.trip}</p>
                <p>{item.type}</p>

                <button onClick={() => handleEdit(item)}>✏️ Edit</button>
                <button onClick={() => handleDelete(item.id)}>❌ Hapus</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;