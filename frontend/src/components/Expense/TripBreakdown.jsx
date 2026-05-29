import "../../styles/expenses.css";

export default function TripBreakdown({ prediction, selectedWisata }) {
  // =====================================================
  // JIKA BELUM ADA DATA
  // =====================================================
  if (!prediction) {
    return (
      <div className="card">
        <h2>Trip Breakdown</h2>

        <p>Belum ada data trip.</p>
      </div>
    );
  }

  // =====================================================
  // BREAKDOWN
  // =====================================================
  const transport = prediction.predicted_budget * 0.45;

  const penginapan = prediction.predicted_budget * 0.25;

  const food = prediction.predicted_budget * 0.2;

  const activity =
    prediction.predicted_budget * 0.1 + (selectedWisata?.activity_price || 0);

  return (
    <div className="card">
      <h2>Trip Breakdown</h2>

      <br />

      <div className="budget-grid">
        {/* TRANSPORT */}
        <div className="budget-card">
          <span>🚗 Transport</span>

          <h4>Rp {transport.toLocaleString("id-ID")}</h4>
        </div>

        {/* PENGINAPAN */}
        <div className="budget-card">
          <span>🏡 Penginapan</span>

          <h4>Rp {penginapan.toLocaleString("id-ID")}</h4>
        </div>

        {/* FOOD */}
        <div className="budget-card">
          <span>🍜 Food</span>

          <h4>Rp {food.toLocaleString("id-ID")}</h4>
        </div>

        {/* ACTIVITY */}
        <div className="budget-card">
          <span>🎯 Activity</span>

          <h4>Rp {activity.toLocaleString("id-ID")}</h4>
        </div>
      </div>
    </div>
  );
}
