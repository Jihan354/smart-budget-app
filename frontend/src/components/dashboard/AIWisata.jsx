import { useState } from "react";
import { predictWisata } from "../../services/api";

export default function AIWisata() {

  // ================= STATE =================
  const [city, setCity] = useState("Jakarta");
  const [category, setCategory] = useState("Budaya");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState(null);

  // ================= PREDICT AI =================
const handlePredict = async () => {

  try {

    const res = await predictWisata({
      city,
      category,
      price: Number(price)
    });

    setResult(res);

  } catch (error) {
    console.error(error);
  }
};

  return (
  <div className="card ai-card">

    <h2> AI Wisata Recommendation</h2>

    <div className="ai-form">

      {/* ================= KOTA ================= */}
      <select
  value={city}
  onChange={(e) => setCity(e.target.value)}
>
  <option>Jakarta</option>
  <option>Bandung</option>
  <option>Yogyakarta</option>
  <option>Semarang</option>
  <option>Surabaya</option>
</select>

      {/* ================= KATEGORI ================= */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Budaya</option>
        <option>Bahari</option>
        <option>Taman Hiburan</option>
        <option>Cagar Alam</option>
      </select>

      {/* ================= PRICE ================= */}
      <input
        type="number"
        placeholder="Budget Tiket Wisata"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      {/* ================= BUTTON ================= */}
      <button
        className="ai-btn"
        onClick={handlePredict}
      >
        Find Recommendation
      </button>

    </div>

{/* ================= HASIL ================= */}
{result && result.length > 0 && (
  <div className="ai-result">

    <h3>Menampilkan wisata sesuai budget tiket.</h3>

    {result.map((item, index) => (
      <div key={index} className="recommend-card">

        <h4>{item.place_name}</h4>

        <p> {item.city}</p>

        <p> {item.category}</p>

        <p> Rp {item.price.toLocaleString("id-ID")}</p>

        <p>⭐ {item.rating}</p>

        <hr />

      </div>
    ))}

  </div>
)}

  </div>
);
  
}