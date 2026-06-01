import { useEffect, useState } from "react";

import { predictBudget } from "../../services/api";

import "../../styles/prediction.css";

export default function Prediction({ refresh, selectedWisata, setShowLogin }) {
  // =========================================================
  // STATE
  // =========================================================

  const [fromCity, setFromCity] = useState("");

  const [destination, setDestination] = useState("");

  const [days, setDays] = useState("");

  const [travelers, setTravelers] = useState("");

  const [budgetType, setBudgetType] = useState("");

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
  // CREATE TRIP
  // =========================================================

  const handleCreateTrip = () => {
    // =========================================
    // LOGIN CHECK
    // =========================================

    if (!localStorage.getItem("login")) {
      setShowLogin(true);

      return;
    }

    // =========================================
    // CURRENT USER
    // =========================================

    const currentUser = JSON.parse(localStorage.getItem("user"));

    // =========================================
    // GET OLD TRIPS
    // =========================================

    const existingTrips =
      JSON.parse(localStorage.getItem(`myTrips_${currentUser?.email}`)) || [];

    // =========================================
    // TOTAL BUDGET
    // =========================================

    const totalBudget =
      result.predicted_budget * 0.45 +
      result.predicted_budget * 0.25 +
      result.predicted_budget * 0.2 +
      (result.predicted_budget * 0.1 + (selectedWisata?.activity_price || 0));

    // =========================================
    // NEW TRIP
    // =========================================

    const newTrip = {
      prediction: result,

      selectedWisata,

      totalBudget,

      tripDate: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),

      createdAt: new Date(),
    };

    // =========================================
    // PUSH ARRAY
    // =========================================

    existingTrips.push(newTrip);

    // =========================================
    // SAVE
    // =========================================

    localStorage.setItem(
      `myTrips_${currentUser?.email}`,
      JSON.stringify(existingTrips),
    );

    alert("AI Trip berhasil dibuat!");

    refresh?.();
  };

  // =========================================================
  // PREDICT
  // =========================================================

  const handlePredict = async () => {
    // =========================================
    // LOGIN CHECK
    // =========================================

    if (!localStorage.getItem("login")) {
      setShowLogin(true);

      return;
    }

    // =========================================
    // VALIDATION
    // =========================================

    if (!fromCity || !destination || !days || !travelers || !budgetType) {
      alert("Lengkapi data trip terlebih dahulu!");

      return;
    }

    // =========================================
    // VALIDASI KOTA
    // =========================================

    if (fromCity === destination) {
      alert("Kota asal dan tujuan tidak boleh sama!");

      return;
    }

    try {
      const res = await predictBudget({
        from_city: fromCity,

        destination,

        days,

        travelers,

        budget_type: budgetType,
      });

      setResult(res);

      setTimeout(() => {
        const target = document.querySelector(".prediction-result");

        target?.scrollIntoView({
          behavior: "smooth",
        });
      }, 200);
    } catch (error) {
      console.error("Error predict:", error);
    }
  };

  // =========================================================
  // TOTAL BUDGET
  // =========================================================

  const totalBudget =
    result?.predicted_budget * 0.45 +
    result?.predicted_budget * 0.25 +
    result?.predicted_budget * 0.2 +
    (result?.predicted_budget * 0.1 + (selectedWisata?.activity_price || 0));

  return (
    <div className="card prediction-card">
      {/* TITLE */}

      <h3>Trip Budget Prediction</h3>

      <p>
        Predict your travel budget based on route, duration, travelers, and
        budget type.
      </p>

      <br />

      {/* AI SELECTED */}

      {selectedWisata && (
        <div className="card">
          <h4>Selected AI Destination</h4>

          <p>{selectedWisata.destination}</p>

          <p>{selectedWisata.activity_name}</p>

          <p>
            Ticket Price : Rp{" "}
            {selectedWisata.activity_price.toLocaleString("id-ID")}
          </p>

          <p>⭐ Rating : {selectedWisata.rating}</p>
        </div>
      )}

      <br />

      {/* FORM */}

      <div className="prediction-form">
        {/* FROM CITY */}

        <select value={fromCity} onChange={(e) => setFromCity(e.target.value)}>
          <option value="" disabled hidden>
            Kota Asal
          </option>

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
          <option value="" disabled hidden>
            Kota Tujuan
          </option>

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
          placeholder="Berapa Hari?"
        />

        {/* TRAVELERS */}

        <input
          type="number"
          min="1"
          value={travelers}
          onChange={(e) => setTravelers(e.target.value)}
          placeholder="Jumlah Orang?"
        />

        {/* BUDGET */}

        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value)}
        >
          <option value="" disabled hidden>
            Budget Trip
          </option>

          <option value="low">Hemat</option>

          <option value="medium">Standard</option>

          <option value="high">Premium</option>
        </select>

        {/* BUTTON */}

        <button onClick={handlePredict}>Predict Budget</button>
      </div>

      <br />

      {/* RESULT */}

      {result && (
        <div className="prediction-result">
          {/* TOP */}

          <div className="prediction-top">
            <div className="mini-card">
              <span> Route</span>

              <h4>
                {result.from_city} → {result.destination}
              </h4>
            </div>

            <div className="mini-card">
              <span>🗓 Days</span>

              <h4>{result.days}</h4>
            </div>

            <div className="mini-card">
              <span>👥 Travelers</span>

              <h4>{result.travelers}</h4>
            </div>

            <div className="mini-card">
              <span> Budget</span>

              <h4>{result.budget_type}</h4>
            </div>
          </div>

          {/* BREAKDOWN */}

          <h3 className="section-title">Estimated Budget Breakdown</h3>

          <div className="budget-grid">
            <div className="budget-card">
              <span> Transport</span>

              <h4>Rp {formatRupiah(result.predicted_budget * 0.45)}</h4>
            </div>

            <div className="budget-card">
              <span> Penginapan</span>

              <h4>Rp {formatRupiah(result.predicted_budget * 0.25)}</h4>
            </div>

            <div className="budget-card">
              <span> Food</span>

              <h4>Rp {formatRupiah(result.predicted_budget * 0.2)}</h4>
            </div>

            <div className="budget-card">
              <span> Activity</span>

              <h4>
                Rp{" "}
                {formatRupiah(
                  result.predicted_budget * 0.1 +
                    (selectedWisata?.activity_price || 0),
                )}
              </h4>
            </div>
          </div>

          {/* AI ACTIVITY */}

          {selectedWisata && (
            <div className="selected-ai-card">
              <h3>AI Selected Activity</h3>

              <p>{selectedWisata.activity_name}</p>

              <span>
                Ticket: Rp{" "}
                {selectedWisata.activity_price.toLocaleString("id-ID")}
              </span>
            </div>
          )}

          {/* TOTAL */}

          <div className="prediction-total-box">
            <p>Total Estimated Budget</p>

            <h2>Rp {formatRupiah(totalBudget)}</h2>

            <small>
              Estimated budget based on destination, trip duration, travelers,
              and budget type.
            </small>

            <br />

            <button className="create-trip-btn" onClick={handleCreateTrip}>
              Create AI Trip ✈
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
