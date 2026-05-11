export default function Summary({ summary, data }) {

  // ================= FORMAT RUPIAH =================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // ================= HITUNG PER KATEGORI =================
  const kategoriMap = {};

  data.forEach((item) => {
    if (item.type === "expense") {
      if (!kategoriMap[item.kategori]) {
        kategoriMap[item.kategori] = 0;
      }

      kategoriMap[item.kategori] += item.jumlah;
    }
  });

  // ================= FAVORITE DESTINATION =================
  const tripMap = {};

  data.forEach((item) => {
    if (!tripMap[item.trip]) {
      tripMap[item.trip] = 0;
    }

    tripMap[item.trip]++;
  });

  const favoriteTrip =
    Object.keys(tripMap).length > 0
      ? Object.entries(tripMap).sort((a, b) => b[1] - a[1])[0][0]
      : "No Trip";

  // ================= TOP SPENDING CATEGORY =================
  const topCategory =
    Object.keys(kategoriMap).length > 0
      ? Object.entries(kategoriMap).sort((a, b) => b[1] - a[1])[0][0]
      : "No Category";

  // ================= BUDGET STATUS =================
  let budgetStatus = "Safe";

  if ((summary.total_expense || 0) > 10000000) {
    budgetStatus = "Over Budget";
  } else if ((summary.total_expense || 0) > 5000000) {
    budgetStatus = "Warning";
  }

  return (
    <div>

      {/* ================= SUMMARY ================= */}
      <div className="summary">

        {/* TOTAL EXPENSES */}
        <div className="card">
          <h4>Total Expenses</h4>
          <p>Rp {formatRupiah(summary.total_expense || 0)}</p>
        </div>

        {/* FAVORITE DESTINATION */}
        <div className="card">
          <h4>Favorite Destination</h4>
          <p>{favoriteTrip}</p>
        </div>

        {/* TOP CATEGORY */}
        <div className="card">
          <h4>Top Spending Category</h4>
          <p>{topCategory}</p>
        </div>

        {/* BUDGET STATUS */}
        <div className="card">
          <h4>Budget Status</h4>
          <p>{budgetStatus}</p>
        </div>

      </div>

      {/* ================= SUMMARY PER KATEGORI ================= */}
      <div className="card">

        <h4>Expenses by Category</h4>

        {Object.keys(kategoriMap).length === 0 ? (
          <p>No Data</p>
        ) : (
          Object.entries(kategoriMap).map(([kategori, total]) => (
            <p key={kategori}>
              {kategori}: Rp {formatRupiah(total)}
            </p>
          ))
        )}

      </div>

    </div>
  );
}