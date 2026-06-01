import { useState } from "react";

import Prediction from "./Prediction";

import AIWisata from "./AIWisata";

import "../../styles/planner.css";

export default function TripPlanner({ refresh, setShowLogin, isLogin }) {
  // =========================================================
  // SELECTED WISATA
  // =========================================================

  const [selectedWisata, setSelectedWisata] = useState(null);

  return (
    <div>
      {/* ===================================================== */}
      {/* LOGIN REQUIRED */}
      {/* ===================================================== */}

      {!isLogin && (
        <div className="card">
          <h3>Login Required</h3>

          <p>
            Silakan login terlebih dahulu untuk menggunakan fitur AI Trip
            Planner
          </p>

          <button
            onClick={() => setShowLogin(true)}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              background: "#7c3aed",
              color: "white",
              fontWeight: "600",
            }}
          >
            Login Sekarang
          </button>
        </div>
      )}

      {/* ===================================================== */}
      {/* AI WISATA */}
      {/* ===================================================== */}

      {isLogin && (
        <AIWisata
          setSelectedWisata={setSelectedWisata}
          setShowLogin={setShowLogin}
        />
      )}

      <br />

      {/* ===================================================== */}
      {/* PREDICTION */}
      {/* ===================================================== */}

      {isLogin && (
        <Prediction
          refresh={refresh}
          selectedWisata={selectedWisata}
          setShowLogin={setShowLogin}
        />
      )}
    </div>
  );
}
