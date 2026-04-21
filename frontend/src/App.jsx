import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [editId, setEditId] = useState(null);

  const getExpenses = async () => {
    const res = await fetch("http://127.0.0.1:5000/expenses");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    getExpenses();
  }, []);

  const handleSubmit = async () => {
    if (editId) {
      // UPDATE
      await fetch(`http://127.0.0.1:5000/expenses/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          jumlah: Number(jumlah),
        }),
      });
    } else {
      // CREATE
      await fetch("http://127.0.0.1:5000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama,
          jumlah: Number(jumlah),
        }),
      });
    }

    setNama("");
    setJumlah("");
    setEditId(null);
    getExpenses();
  };

  const handleDelete = async (id) => {
    await fetch(`http://127.0.0.1:5000/expenses/${id}`, {
      method: "DELETE",
    });
    getExpenses();
  };

  const handleEdit = (item) => {
    setNama(item.nama);
    setJumlah(item.jumlah);
    setEditId(item.id);
  };

  return (
    <div className="container">
      <h1>Dashboard 💰</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Nama pengeluaran"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <input
          type="number"
          placeholder="Jumlah"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Tambah"}
        </button>
      </div>

      <div className="list">
        {data.map((item) => (
          <div key={item.id} className="card">
            <p>{item.nama}</p>
            <p>Rp {item.jumlah}</p>

            <button onClick={() => handleEdit(item)}>✏️ Edit</button>
            <button onClick={() => handleDelete(item.id)}>❌ Hapus</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;