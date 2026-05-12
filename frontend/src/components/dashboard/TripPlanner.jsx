import { useState } from "react";

import Prediction from "./Prediction";
import AIWisata from "./AIWisata";

export default function TripPlanner({ refresh }) {
  // =========================================================
  // SELECTED WISATA
  // =========================================================
  const [selectedWisata, setSelectedWisata] = useState(null);

  return (
    <div>
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}
      <div className="card">
        <h2>AI Smart Travel Planner</h2>

        <p>
          Plan your trip smarter with AI recommendation, budget prediction,
          expense tracking, and travel analytics.
        </p>

        <hr />

        <p>Step 1 : Find Travel Recommendation</p>

        <p>Step 2 : Predict Your Travel Budget</p>

        <p>Step 3 : Manage Your Travel Expenses</p>

        <p>Step 4 : Analyze Your Travel Spending</p>
      </div>

      <br />

      {/* ===================================================== */}
      {/* SELECTED DESTINATION */}
      {/* ===================================================== */}
      {selectedWisata && (
        <div className="card">
          <h3>Selected Destination</h3>

          <p>📍 {selectedWisata.destination}</p>

          <p>🎫 {selectedWisata.activity_name}</p>

          <p>
            💰 Activity Ticket : Rp{" "}
            {selectedWisata.activity_price.toLocaleString("id-ID")}
          </p>

          <p>⭐ Rating : {selectedWisata.rating}</p>
        </div>
      )}

      <br />

      {/* ===================================================== */}
      {/* AI WISATA */}
      {/* ===================================================== */}
      <AIWisata setSelectedWisata={setSelectedWisata} />

      <br />

      {/* ===================================================== */}
      {/* PREDICTION */}
      {/* ===================================================== */}
      <Prediction refresh={refresh} selectedWisata={selectedWisata} />
    </div>
  );
}
