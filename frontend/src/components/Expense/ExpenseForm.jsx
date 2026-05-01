import { useState } from "react";
import { addExpense } from "../../services/api";

export default function ExpenseForm({ refresh }) {

  // ================= STATE =================
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [kategori, setKategori] = useState("Transport");
  const [trip, setTrip] = useState("bali");
  const [type, setType] = useState("expense");

  //  TAMBAHAN TANGGAL
  const [tanggal, setTanggal] = useState("");

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {

    // ================= VALIDASI =================
    if (!nama || !jumlah || !tanggal) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (Number(jumlah) <= 0) {
      alert("Jumlah harus lebih dari 0!");
      return;
    }

    try {
      await addExpense({
        nama,
        kategori,
        jumlah: Number(jumlah),
        tanggal: tanggal, // 🔥 pakai input user
        trip,
        type
      });

      // ================= RESET =================
      setNama("");
      setJumlah("");
      setTanggal("");

      refresh();

    } catch (error) {
      console.error("Error:", error);
    }
  };

 return (
  <div className="card form-card">
    <h3>Tambah Data Travel</h3>

    <div className="form-row">

      <input
        placeholder="Contoh: Tiket Pesawat / Hotel Bali"
        value={nama}
        onChange={(e) => setNama(e.target.value)}
      />

      <input
        type="number"
        placeholder="Jumlah (contoh: 500000)"
        value={jumlah}
        onChange={(e) => setJumlah(e.target.value)}
      />

      <input
        type="date"
        value={tanggal}
        onChange={(e) => setTanggal(e.target.value)}
      />

      <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
        <option>Transport</option>
        <option>Hotel</option>
        <option>Food</option>
        <option>Ticket</option>
      </select>

      <select value={trip} onChange={(e) => setTrip(e.target.value)}>
        <option value="bali">Bali</option>
        <option value="jakarta">Jakarta</option>
        <option value="luar_negeri">Luar Negeri</option>
      </select>

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <button onClick={handleSubmit}>
        Tambah
      </button>

    </div>
  </div>
);
}