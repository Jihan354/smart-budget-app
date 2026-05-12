import { useState } from "react";
import { predictWisata } from "../../services/api";

export default function AIWisata({ setSelectedWisata }) {
  // =========================================================
  // STATE
  // =========================================================
  const [city, setCity] = useState("Jakarta");

  const [category, setCategory] = useState("Budaya");

  const [price, setPrice] = useState("");

  const [result, setResult] = useState(null);

  // =========================================================
  // PREDICT AI
  // =========================================================
  const handlePredict = async () => {
    try {
      const res = await predictWisata({
        city,

        category,

        price: Number(price),
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
          <option>Jakarta</option>
          <option>Bandung</option>
          <option>Yogyakarta</option>
          <option>Semarang</option>
          <option>Surabaya</option>
        </select>

        {/* CATEGORY */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>Budaya</option>
          <option>Bahari</option>
          <option>Taman Hiburan</option>
          <option>Cagar Alam</option>
        </select>

        {/* PRICE */}
        <input
          type="number"
          placeholder="Budget Tiket Wisata"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* BUTTON */}
        <button className="ai-btn" onClick={handlePredict}>
          Find Recommendation
        </button>
      </div>

      {/* ===================================================== */}
      {/* RESULT */}
      {/* ===================================================== */}
      {result && result.length > 0 && (
        <div className="ai-result">
          <h3>Menampilkan wisata sesuai budget tiket.</h3>

          {result.map((item, index) => (
            <div key={index} className="recommend-card">
              {/* ============================================= */}
              {/* PLACE */}
              {/* ============================================= */}
              <h4>{item.place_name}</h4>

              {/* CITY */}
              <p>📍 {item.city}</p>

              {/* CATEGORY */}
              <p>🏷️ {item.category}</p>

              {/* PRICE */}
              <p>💰 Rp {item.price.toLocaleString("id-ID")}</p>

              {/* RATING */}
              <p>⭐ {item.rating}</p>

              <br />

              {/* ============================================= */}
              {/* BUTTON SELECT */}
              {/* ============================================= */}
              <button
                className="select-btn"
                onClick={() => handleSelectWisata(item)}
              >
                Select Destination
              </button>

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
