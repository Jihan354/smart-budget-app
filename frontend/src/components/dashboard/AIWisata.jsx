import { useState } from "react";

import { predictWisata } from "../../services/api";

export default function AIWisata({ setSelectedWisata, setShowLogin }) {
  // =========================================================
  // STATE
  // =========================================================

  const [city, setCity] = useState("");

  const [category, setCategory] = useState("");

  const [price, setPrice] = useState("");

  const [result, setResult] = useState([]);

  // =========================================================
  // PREDICT AI
  // =========================================================

  const handlePredict = async () => {
    // =====================================================
    // LOGIN CHECK
    // =====================================================

    if (!localStorage.getItem("login")) {
      setShowLogin(true);

      return;
    }

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!city || !category || !price) {
      alert("Lengkapi pencarian wisata terlebih dahulu!");

      return;
    }

    try {
      const res = await predictWisata({
        city,

        category,

        price: Number(price.replace(/\./g, "")),
      });

      setResult(res);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================================
  // SELECT WISATA
  // =========================================================

  const handleSelectWisata = (item) => {
    // =====================================================
    // LOGIN CHECK
    // =====================================================

    if (!localStorage.getItem("login")) {
      setShowLogin(true);

      return;
    }

    // =====================================================
    // SAVE SELECTED
    // =====================================================

    setSelectedWisata({
      destination: item.city,

      activity_name: item.place_name,

      activity_price: item.price,

      category: item.category,

      rating: item.rating,
    });

    // =====================================================
    // AUTO SCROLL
    // =====================================================

    setTimeout(() => {
      const target = document.querySelector(".prediction-card");

      target?.scrollIntoView({
        behavior: "smooth",
      });
    }, 200);
  };

  return (
    <div className="card ai-card">
      {/* ===================================================== */}
      {/* TITLE */}
      {/* ===================================================== */}

      <h2>AI Wisata Recommendation</h2>

      <p>
        Discover tourism destinations based on city, category, and ticket
        budget.
      </p>

      <br />

      {/* ===================================================== */}
      {/* FORM */}
      {/* ===================================================== */}

      <div className="ai-form">
        {/* CITY */}

        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="" disabled hidden>
            Pilih Kota Wisata
          </option>

          <option>Jakarta</option>

          <option>Bandung</option>

          <option>Yogyakarta</option>

          <option>Semarang</option>

          <option>Surabaya</option>
        </select>

        {/* CATEGORY */}

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="" disabled hidden>
            Jenis Wisata
          </option>

          <option>Budaya</option>

          <option>Bahari</option>

          <option>Taman Hiburan</option>

          <option>Cagar Alam</option>

          <option>Tempat Ibadah</option>

          <option>Pusat Perbelanjaan</option>
        </select>

        {/* PRICE */}

        <input
          type="text"
          placeholder="Budget Tiket Wisata"
          value={price}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, "");

            const formatted = Number(raw).toLocaleString("id-ID");

            setPrice(formatted);
          }}
        />

        {/* BUTTON */}

        <button className="ai-btn" onClick={handlePredict}>
          Find Recommendation
        </button>
      </div>

      {/* ===================================================== */}
      {/* RESULT */}
      {/* ===================================================== */}

      {result.length > 0 && (
        <div className="recommend-grid">
          {result.map((item, index) => (
            <div key={index} className="recommend-card">
              {/* IMAGE */}

              <div className="recommend-image-wrapper">
                <img
                  src={item.Image_URL}
                  alt={item.place_name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />

                {/* RATING */}

                <div className="image-rating">⭐ {item.rating}</div>

                {/* OVERLAY */}

                <div className="image-overlay">
                  <h3>{item.place_name}</h3>

                  <p>{item.city}</p>
                </div>
              </div>

              {/* CONTENT */}

              <div className="recommend-content">
                {/* CATEGORY + PRICE */}

                <div className="recommend-info-row">
                  <span className="category-tag">{item.category}</span>

                  <span className="price-tag">
                    {item.price === 0
                      ? "GRATIS"
                      : `Rp ${item.price.toLocaleString("id-ID")}`}
                  </span>
                </div>

                {/* PLAN BUTTON */}

                <button
                  className="select-btn"
                  onClick={() => handleSelectWisata(item)}
                >
                  Plan AI ➜
                </button>

                {/* MAPS */}

                <button
                  className="maps-btn"
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/${item.place_name}`,
                      "_blank",
                    )
                  }
                >
                  📍 Visit Destination
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
