import { useState } from "react";
import { predictBudget } from "../../services/api";

export default function Prediction() {

  // ================= STATE =================
  const [days, setDays] = useState(1);
  const [destination, setDestination] = useState("Jakarta");
  const [travelers, setTravelers] = useState(1);
  const [budgetType, setBudgetType] = useState("medium");
  const [result, setResult] = useState(null);


  // ================= FORMAT RUPIAH =================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // ================= PREDICT =================
  const handlePredict = async () => {
    try {
      const res = await predictBudget({
      destination,
      days,
      travelers,
      budget_type: budgetType
});

      setResult(res);
    } catch (error) {
      console.error("Error predict:", error);
    }
  };

  return (
    <div className="card prediction-card">

      <h3> Trip Budget Prediction </h3>

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

        {/* TRAVELERS */}
        <input
          type="number"
          min="1"
         value={travelers}
         onChange={(e) => setTravelers(e.target.value)}
        placeholder="Jumlah Travelers"
        />

        {/* DESTINATION */}
        <select
  value={destination}
  onChange={(e) => setDestination(e.target.value)}
>
  <option value="Jakarta">Jakarta</option>
  <option value="Bandung">Bandung</option>
  <option value="Yogyakarta">Yogyakarta</option>
  <option value="Semarang">Semarang</option>
  <option value="Surabaya">Surabaya</option>
</select>

{/* BUDGET TYPE */}
<select
  value={budgetType}
  onChange={(e) => setBudgetType(e.target.value)}
>
  <option value="low">Low</option>
  <option value="medium">Medium</option>
  <option value="luxury">Luxury</option>
</select>

        {/* BUTTON */}
        <button onClick={handlePredict}>
          Predict
        </button>

      </div>

      {/* ================= HASIL ================= */}
{result && (
  <div className="prediction-result">

    <p>📍 Destination: {result.destination}</p>

    <p>📅 Trip Days: {result.days}</p>

    <p>👥 Number of Travelers: {result.travelers}</p>

    <p>💼 Budget Type: {result.budget_type}</p>

    <hr />

    <p className="prediction-total">
      Estimated Budget: Rp {formatRupiah(result.predicted_budget)}
    </p>

  </div>
)}

    </div>
  );
}

