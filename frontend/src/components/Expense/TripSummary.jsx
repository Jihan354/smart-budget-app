import "../../styles/expenses.css";

export default function TripSummary({
  prediction,
  selectedWisata,
  totalBudget,
  tripDate,
  onDelete,
}) {
  if (!prediction) return null;

  return (
    <div className="card trip-card">
      {/* =========================================== */}
      {/* HEADER */}
      {/* =========================================== */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        {/* LEFT */}
        <div>
          <h2>
            {prediction.from_city}
            {" → "}
            {prediction.destination}
          </h2>

          <p>🗓 {tripDate}</p>
        </div>

        {/* RIGHT */}
        <div>
          <button className="delete-btn" onClick={onDelete}>
            Hapus
          </button>
        </div>
      </div>

      <br />

      {/* =========================================== */}
      {/* TOTAL */}
      {/* =========================================== */}
      <h3>Rp {prediction.predicted_budget?.toLocaleString("id-ID")}</h3>

      <br />

      {/* =========================================== */}
      {/* INFO */}
      {/* =========================================== */}
      <div className="trip-info-grid">
        <div className="trip-info-item">
          <span>🗓 Duration</span>

          <h4>{prediction.days} Days</h4>
        </div>

        <div className="trip-info-item">
          <span>👥 Travelers</span>

          <h4>{prediction.travelers} Person</h4>
        </div>

        <div className="trip-info-item">
          <span>💼 Budget</span>

          <h4>{prediction.budget_type}</h4>
        </div>
      </div>

      <br />

      {/* =========================================== */}
      {/* DESTINATION */}
      {/* =========================================== */}
      {selectedWisata && (
        <div>
          <h3>AI Selected Destination</h3>

          <p>{selectedWisata.activity_name}</p>

          <p>
            🎫 Ticket : Rp{" "}
            {selectedWisata.activity_price?.toLocaleString("id-ID")}
          </p>

          <p>⭐ {selectedWisata.rating}</p>
        </div>
      )}
    </div>
  );
}
