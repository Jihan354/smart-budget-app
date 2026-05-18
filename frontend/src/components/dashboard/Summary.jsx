import "../../styles/summary.css";
export default function Summary({ summary, data }) {
  // =========================================================
  // FORMAT RUPIAH
  // =========================================================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // =========================================================
  // SAFETY
  // =========================================================
  if (!data) {
    return null;
  }

  // =========================================================
  // CATEGORY MAP
  // =========================================================
  const kategoriMap = {};

  data.forEach((item) => {
    if (item.type === "expense") {
      if (!kategoriMap[item.kategori]) {
        kategoriMap[item.kategori] = 0;
      }

      kategoriMap[item.kategori] += Number(item.jumlah);
    }
  });

  // =========================================================
  // DESTINATION MAP
  // =========================================================
  const tripMap = {};

  data.forEach((item) => {
    const destination = item.destination || "Unknown";

    if (!tripMap[destination]) {
      tripMap[destination] = 0;
    }

    tripMap[destination]++;
  });

  // =========================================================
  // FAVORITE DESTINATION
  // =========================================================
  const favoriteTrip =
    Object.keys(tripMap).length > 0
      ? Object.entries(tripMap).sort((a, b) => b[1] - a[1])[0][0]
      : "No Destination";

  // =========================================================
  // TOTAL DESTINATION
  // =========================================================
  const totalDestination = new Set(data.map((item) => item.destination)).size;

  // =========================================================
  // TOP CATEGORY
  // =========================================================
  const topCategory =
    Object.keys(kategoriMap).length > 0
      ? Object.entries(kategoriMap).sort((a, b) => b[1] - a[1])[0][0]
      : "No Category";

  // =========================================================
  // TOTAL ACTIVITY
  // =========================================================
  const totalActivity = data.filter(
    (item) => item.kategori === "Activity",
  ).length;

  // =========================================================
  // BUDGET STATUS
  // =========================================================
  let budgetStatus = "Safe";

  if ((summary.total_expense || 0) > 10000000) {
    budgetStatus = "Over Budget";
  } else if ((summary.total_expense || 0) > 5000000) {
    budgetStatus = "Warning";
  }

  return (
    <div>
      {/* ===================================================== */}
      {/* TRAVEL SUMMARY */}
      {/* ===================================================== */}
      <div className="summary">
        {/* TOTAL EXPENSE */}
        <div className="card">
          <h4>Total Travel Expense</h4>

          <p>Rp {formatRupiah(summary.total_expense || 0)}</p>
        </div>

        {/* FAVORITE DESTINATION */}
        <div className="card">
          <h4>Favorite Destination</h4>

          <p>{favoriteTrip}</p>
        </div>

        {/* TOTAL DESTINATION */}
        <div className="card">
          <h4>Total Destination</h4>

          <p>{totalDestination} City</p>
        </div>

        {/* TOP CATEGORY */}
        <div className="card">
          <h4>Top Spending Category</h4>

          <p>{topCategory}</p>
        </div>

        {/* TOTAL ACTIVITY */}
        <div className="card">
          <h4>Total Activity</h4>

          <p>{totalActivity} Activity</p>
        </div>

        {/* BUDGET STATUS */}
        <div className="card">
          <h4>Budget Status</h4>

          <p>{budgetStatus}</p>
        </div>
      </div>

      {/* ===================================================== */}
      {/* CATEGORY SUMMARY */}
      {/* ===================================================== */}
      <div className="card">
        <h4>Travel Expenses by Category</h4>

        {Object.keys(kategoriMap).length === 0 ? (
          <p>No Travel Expense Data</p>
        ) : (
          Object.entries(kategoriMap).map(([kategori, total]) => {
            // =================================================
            // ICON
            // =================================================
            let icon = "📌";

            if (kategori === "Transport") icon = "🚆";

            if (kategori === "Hotel") icon = "🏨";

            if (kategori === "Food") icon = "🍜";

            if (kategori === "Activity") icon = "🎫";

            return (
              <p key={kategori}>
                {icon} {kategori}
                {" : "}
                Rp {formatRupiah(total)}
              </p>
            );
          })
        )}
      </div>
    </div>
  );
}
