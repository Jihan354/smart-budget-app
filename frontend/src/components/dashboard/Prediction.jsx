import { useEffect, useState } from "react";
import { predictBudget } from "../../services/api";

export default function Prediction({ refresh, selectedWisata }) {
  // =========================================================
  // STATE
  // =========================================================
  const [fromCity, setFromCity] = useState("Jakarta");

  const [destination, setDestination] = useState("Yogyakarta");

  const [days, setDays] = useState(1);

  const [travelers, setTravelers] = useState(1);

  const [budgetType, setBudgetType] = useState("medium");

  const [result, setResult] = useState(null);

  // =========================================================
  // AUTO FILL FROM AI WISATA
  // =========================================================
  useEffect(() => {
    if (selectedWisata) {
      setDestination(selectedWisata.destination);
    }
  }, [selectedWisata]);

  // =========================================================
  // FORMAT RUPIAH
  // =========================================================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // =========================================================
  // PREDICT
  // =========================================================
  const handlePredict = async () => {
    try {
      const res = await predictBudget({
        from_city: fromCity,

        destination,

        days,

        travelers,

        budget_type: budgetType,
      });

      setResult(res);
    } catch (error) {
      console.error("Error predict:", error);
    }
  };

  return (
    <div className="card prediction-card">
      {/* ===================================================== */}
      {/* TITLE */}
      {/* ===================================================== */}
      <h3>Trip Budget Prediction</h3>

      <p>
        Predict your travel budget based on route, duration, travelers, and
        budget type.
      </p>

      <br />

      {/* ===================================================== */}
      {/* AI SELECTED INFO */}
      {/* ===================================================== */}
      {selectedWisata && (
        <div className="card">
          <h4>Selected AI Destination</h4>

          <p>📍 {selectedWisata.destination}</p>

          <p>🎫 {selectedWisata.activity_name}</p>

          <p>
            💰 Ticket Price : Rp{" "}
            {selectedWisata.activity_price.toLocaleString("id-ID")}
          </p>

          <p>⭐ Rating : {selectedWisata.rating}</p>
        </div>
      )}

      <br />

      {/* ===================================================== */}
      {/* FORM */}
      {/* ===================================================== */}
      <div className="prediction-form">
        {/* FROM CITY */}
        <select value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
          <option value="Jakarta">Jakarta</option>
          <option value="Bandung">Bandung</option>
          <option value="Yogyakarta">Yogyakarta</option>
          <option value="Semarang">Semarang</option>
          <option value="Surabaya">Surabaya</option>
        </select>

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

        {/* DAYS */}
        <input
          type="number"
          min="1"
          max="30"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="Trip Days"
        />

        {/* TRAVELERS */}
        <input
          type="number"
          min="1"
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
          placeholder="Travelers"
        />

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
        <button onClick={handlePredict}>Predict Budget</button>
      </div>

      <br />

      {/* ===================================================== */}
      {/* RESULT */}
      {/* ===================================================== */}
      {result && (
        <div className="prediction-result">
          <p>
            📍 Route: {result.from_city}
            {" → "}
            {result.destination}
          </p>

          <p>📅 Trip Days: {result.days}</p>

          <p>👥 Number of Travelers: {result.travelers}</p>

          <p>💼 Budget Type: {result.budget_type}</p>

          <hr />

          <h4>Estimated Budget Breakdown</h4>

          {/* TRANSPORT */}
          <p>🚆 Transport: Rp {formatRupiah(result.predicted_budget * 0.35)}</p>

          {/* HOTEL */}
          <p>🏨 Hotel: Rp {formatRupiah(result.predicted_budget * 0.4)}</p>

          {/* FOOD */}
          <p>🍜 Food: Rp {formatRupiah(result.predicted_budget * 0.15)}</p>

          {/* ACTIVITY */}
          <p>🎫 Activity: Rp {formatRupiah(result.predicted_budget * 0.1)}</p>

          {/* AI ACTIVITY */}
          {selectedWisata && (
            <>
              <hr />

              <h4>AI Selected Activity</h4>

              <p>🎫 {selectedWisata.activity_name}</p>

              <p>
                💰 Ticket: Rp{" "}
                {selectedWisata.activity_price.toLocaleString("id-ID")}
              </p>
            </>
          )}

          <hr />

          {/* TOTAL */}
          <p className="prediction-total">
            Estimated Total Budget: Rp {formatRupiah(result.predicted_budget)}
          </p>

          <small>
            Estimated budget based on destination, trip duration, travelers, and
            budget type.
          </small>
        </div>
      )}
    </div>
  );
}
