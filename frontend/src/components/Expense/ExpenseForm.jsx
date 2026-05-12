import { useState } from "react";
import { addExpense } from "../../services/api";

export default function ExpenseForm({ refresh }) {
  // ================= STATE =================
  const [nama, setNama] = useState("");

  const [jumlah, setJumlah] = useState("");

  const [kategori, setKategori] = useState("Transport");

  const [fromCity, setFromCity] = useState("Jakarta");

  const [destination, setDestination] = useState("Bandung");

  // ================= TRIP DATE =================
  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async () => {
    // ================= VALIDASI =================
    if (!nama || !jumlah || !startDate || !endDate) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (Number(jumlah) <= 0) {
      alert("Jumlah harus lebih dari 0!");
      return;
    }

    if (fromCity === destination) {
      alert("Kota asal dan destination tidak boleh sama!");

      return;
    }

    try {
      await addExpense({
        nama,

        kategori,

        jumlah: Number(jumlah),

        start_date: startDate,

        end_date: endDate,

        from_city: fromCity,

        destination,

        type: "expense",
      });

      // ================= RESET =================
      setNama("");

      setJumlah("");

      setStartDate("");

      setEndDate("");

      refresh();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="card form-card">
      <h3>Add Travel Expense</h3>

      <div className="form-row">
        {/* NAMA */}
        <input
          placeholder="Contoh: Tiket Kereta / Hotel Malioboro"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        {/* JUMLAH */}
        <input
          type="number"
          placeholder="Jumlah Expense"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
        />

        {/* START DATE */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* END DATE */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* KATEGORI */}
        <select value={kategori} onChange={(e) => setKategori(e.target.value)}>
          <option>Transport</option>
          <option>Hotel</option>
          <option>Food</option>
          <option>Activity</option>
        </select>

        {/* DESTINATION */}
        <select value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
          <option>Jakarta</option>
          <option>Bandung</option>
          <option>Yogyakarta</option>
          <option>Semarang</option>
          <option>Surabaya</option>
        </select>

        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          <option>Bandung</option>
          <option>Yogyakarta</option>
          <option>Semarang</option>
          <option>Surabaya</option>
          <option>Jakarta</option>
        </select>

        {/* BUTTON */}
        <button onClick={handleSubmit}>Tambah</button>
      </div>
    </div>
  );
}
