import { useState, useEffect } from "react";

import { predictWisata } from "../../services/api";

export default function AIWisata({ setSelectedWisata }) {
  // =========================================================
  // STATE
  // =========================================================
  const [city, setCity] = useState("");

  const [category, setCategory] = useState("");

  const [price, setPrice] = useState("");

  const [result, setResult] = useState([]);

  const [wisataImages, setWisataImages] = useState({});

  // =========================================================
  // FETCH IMAGE
  // =========================================================
  const fetchWisataImage = async (placeName) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          placeName,
        )}`,
      );

      const data = await response.json();

      // =====================================================
      // WIKIPEDIA IMAGE
      // =====================================================
      if (data.thumbnail?.source) {
        return data.thumbnail.source;
      }

      // =====================================================
      // FALLBACK IMAGE
      // =====================================================
      return `https://source.unsplash.com/600x400/?${encodeURIComponent(
        placeName + " tourism indonesia",
      )}`;
    } catch (error) {
      // =====================================================
      // FINAL FALLBACK
      // =====================================================
      return `https://source.unsplash.com/600x400/?${encodeURIComponent(
        placeName + " tourism indonesia",
      )}`;
    }
  };

  // =========================================================
  // LOAD IMAGE
  // =========================================================
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = {};

      for (const item of result) {
        const image = await fetchWisataImage(item.place_name);

        imageMap[item.place_name] = image;
      }

      setWisataImages(imageMap);
    };

    if (result.length > 0) {
      loadImages();
    }
  }, [result]);

  // =========================================================
  // PREDICT AI
  // =========================================================
  const handlePredict = async () => {
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
    setSelectedWisata({
      destination: item.city,

      activity_name: item.place_name,

      activity_price: item.price,

      category: item.category,

      rating: item.rating,
    });

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
              <img
                src={wisataImages[item.place_name]}
                alt={item.place_name}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "https://picsum.photos/400/300";
                }}
              />

              {/* CONTENT */}
              <div className="recommend-content">
                {/* PLACE */}
                <h3>{item.place_name}</h3>

                {/* CITY */}
                <p>{item.city}</p>

                {/* RATING */}
                <div className="recommend-rating">⭐ {item.rating}</div>

                {/* PRICE */}
                <div className="recommend-price">
                  Rp {item.price.toLocaleString("id-ID")}
                </div>

                {/* BUTTON */}
                <button
                  className="select-btn"
                  onClick={() => handleSelectWisata(item)}
                >
                  Plan AI ✈
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
