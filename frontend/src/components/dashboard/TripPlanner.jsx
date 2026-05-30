import { useState } from "react";

import Prediction from "./Prediction";
import AIWisata from "./AIWisata";

import "../../styles/planner.css";

export default function TripPlanner({ refresh }) {
  // =========================================================
  // SELECTED WISATA
  // =========================================================
  const [selectedWisata, setSelectedWisata] = useState(null);

  return (
    <div>
      {/* ===================================================== */}
      {/* SELECTED DESTINATION */}
      {/* ===================================================== */}
      {selectedWisata && (
        <div className="card">
          <h3>Selected Destination</h3>

          <p>{selectedWisata.destination}</p>

          <p>{selectedWisata.activity_name}</p>

          <p>
            Activity Ticket : Rp{" "}
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
