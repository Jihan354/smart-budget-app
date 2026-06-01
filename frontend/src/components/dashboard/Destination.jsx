import "../../styles/destination.css";
import { useState } from "react";

import { getNearbyTourism } from "../../services/api";

export default function Destination() {
  // ======================================================
  // STATE
  // ======================================================

  const [showCard, setShowCard] = useState(false);

  const [wisataList, setWisataList] = useState([]);

  // ======================================================
  // DETECT LOCATION
  // ======================================================

  const handleLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;

        const longitude = position.coords.longitude;

        try {
          // ==============================================
          // FETCH API
          // ==============================================

          const result = await getNearbyTourism({
            latitude,
            longitude,
          });

          // ==============================================
          // SAVE RESULT
          // ==============================================

          setWisataList(result);

          setShowCard(true);

          alert("Lokasi berhasil dideteksi!");
        } catch (err) {
          console.log(err);

          alert("Gagal mengambil wisata terdekat!");
        }
      },

      (error) => {
        console.log(error);

        alert("Gagal mendeteksi lokasi!");
      },
    );
  };

  return (
    <div className="destination-page">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="destination-header">
        <h1>Destinasi Terdekat</h1>

        <p>Izinkan akses lokasi GPS untuk menemukan wisata di sekitar Anda.</p>
      </div>

      {/* ========================================= */}
      {/* HERO */}
      {/* ========================================= */}

      <div className="nearby-hero">
        <h2>Cari Wisata di Sekitar Saya</h2>

        <p>Menggunakan Satelit GPS/Wi-Fi untuk akurasi tinggi.</p>

        <button onClick={handleLocation}>Deteksi Lokasi Saya</button>
      </div>

      {/* ========================================= */}
      {/* RESULT */}
      {/* ========================================= */}

      {showCard && (
        <>
          <p className="nearby-total">
            Ditemukan {wisataList.length} wisata terdekat dari lokasi Anda.
          </p>

          <div className="nearby-grid">
            {wisataList.map((item, index) => (
              <div key={index} className="nearby-card">
                {/* IMAGE */}

                <div className="nearby-image-wrapper">
                  <img src={item.image} alt={item.name} />

                  <div className="nearby-rating">⭐ {item.rating}</div>

                  <div className="nearby-distance"> {item.distance} Km</div>

                  <div className="nearby-overlay">
                    <h3>{item.name}</h3>

                    <p>{item.city}</p>
                  </div>
                </div>

                {/* CONTENT */}

                <div className="nearby-content">
                  <div className="nearby-info">
                    <span className="nearby-category">{item.category}</span>

                    <span className="nearby-price">
                      Rp {Number(item.price).toLocaleString("id-ID")}
                    </span>
                  </div>

                  {/* GOOGLE MAPS */}

                  <button
                    className="visit-btn"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps?q=${item.latitude},${item.longitude}`,
                        "_blank",
                      );
                    }}
                  >
                    Visit Destination
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
