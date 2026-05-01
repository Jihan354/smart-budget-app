import { useState } from "react";
import { predictBudget, addExpense } from "../../services/api";

export default function Prediction({ refresh }) {

  // ================= STATE =================
  const [days, setDays] = useState(1);
  const [budgetType, setBudgetType] = useState("medium");
  const [destination, setDestination] = useState("bali");
  const [result, setResult] = useState(null);

  //  TAMBAHAN TANGGAL
  const [tanggal, setTanggal] = useState("");

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // ================= PREDICT =================
  const handlePredict = async () => {
    try {
      const res = await predictBudget({
        days,
        budget_type: budgetType,
        destination
      });

      setResult(res);
    } catch (error) {
      console.error("Error predict:", error);
    }
  };

  // ================= AUTO SAVE =================
  const handleSavePrediction = async () => {

    //  VALIDASI
    if (!result) return;

    if (!tanggal) {
      alert("Pilih tanggal dulu!");
      return;
    }

    try {
      // Transport
      await addExpense({
        nama: "Transport",
        kategori: "Transport",
        jumlah: result.transport,
        tanggal: tanggal,
        trip: destination,
        type: "expense"
      });

      // Hotel
      await addExpense({
        nama: "Hotel",
        kategori: "Hotel",
        jumlah: result.hotel,
        tanggal: tanggal,
        trip: destination,
        type: "expense"
      });

      // Food
      await addExpense({
        nama: "Food",
        kategori: "Food",
        jumlah: result.food,
        tanggal: tanggal,
        trip: destination,
        type: "expense"
      });

      // Activity
      await addExpense({
        nama: "Activity",
        kategori: "Ticket",
        jumlah: result.activity,
        tanggal: tanggal,
        trip: destination,
        type: "expense"
      });

      alert("Budget berhasil ditambahkan!");

      //  REFRESH DATA 
      refresh();

    } catch (error) {
      console.error("Error save:", error);
    }
  };

  return (
    <div className="card prediction-card">

      <h3> Prediksi Budget</h3>

      {/* ================= FORM ================= */}
      <div className="prediction-form">

        {/* HARI */}
        <input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        {/* TANGGAL */}
        <input
          type="date"
          value={tanggal}
          onChange={(e) => setTanggal(e.target.value)}
        />

        {/* DESTINATION */}
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        >
          <option value="bali">Bali (Murah)</option>
          <option value="jakarta">Jakarta (Sedang)</option>
          <option value="luar_negeri">Luar Negeri (Mahal)</option>
        </select>

        {/* BUDGET */}
        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* BUTTON */}
        <button onClick={handlePredict}>
          Predict
        </button>

      </div>

      {/* ================= HASIL ================= */}
      {result && (
        <div className="prediction-result">

          <p>✈️ Transport: Rp {formatRupiah(result.transport)}</p>
          <p>🏨 Hotel: Rp {formatRupiah(result.hotel)}</p>
          <p>🍜 Food: Rp {formatRupiah(result.food)}</p>
          <p>🎫 Activity: Rp {formatRupiah(result.activity)}</p>

          <hr />

          <p className="prediction-total">
            Total: Rp {formatRupiah(result.total)}
          </p>

          <button
            className="use-budget-btn"
            onClick={handleSavePrediction}
          >
            Gunakan Budget Ini
          </button>

        </div>
      )}

    </div>
  );
}