export default function Insight({ data }) {
  // =========================================================
  // SAFETY CHECK
  // =========================================================
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3>Travel Insight</h3>

        <p>Belum ada data travel</p>
      </div>
    );
  }

  // =========================================================
  // FORMAT RUPIAH
  // =========================================================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // =========================================================
  // TOTAL EXPENSE
  // =========================================================
  const total = data.reduce((acc, item) => {
    return acc + Number(item.jumlah);
  }, 0);

  // =========================================================
  // CATEGORY MAP
  // =========================================================
  const categoryMap = {};

  data.forEach((item) => {
    if (!categoryMap[item.kategori]) {
      categoryMap[item.kategori] = 0;
    }

    categoryMap[item.kategori] += Number(item.jumlah);
  });

  // =========================================================
  // BIGGEST CATEGORY
  // =========================================================
  const biggestCategory = Object.keys(categoryMap).reduce((a, b) =>
    categoryMap[a] > categoryMap[b] ? a : b,
  );

  // =========================================================
  // DESTINATION MAP
  // =========================================================
  const destinationMap = {};

  data.forEach((item) => {
    const destination = item.destination || "Unknown";

    if (!destinationMap[destination]) {
      destinationMap[destination] = 0;
    }

    destinationMap[destination] += Number(item.jumlah);
  });

  // =========================================================
  // MOST EXPENSIVE DESTINATION
  // =========================================================
  const expensiveTrip = Object.keys(destinationMap).reduce((a, b) =>
    destinationMap[a] > destinationMap[b] ? a : b,
  );

  // =========================================================
  // TOTAL DESTINATION
  // =========================================================
  const totalTrip = new Set(data.map((item) => item.destination)).size;

  // =========================================================
  // VISITED MAP
  // =========================================================
  const visitedMap = {};

  data.forEach((item) => {
    const destination = item.destination || "Unknown";

    if (!visitedMap[destination]) {
      visitedMap[destination] = 0;
    }

    visitedMap[destination] += 1;
  });

  // =========================================================
  // MOST VISITED
  // =========================================================
  const mostVisited = Object.keys(visitedMap).reduce((a, b) =>
    visitedMap[a] > visitedMap[b] ? a : b,
  );

  return (
    <div className="card">
      {/* ===================================================== */}
      {/* TITLE */}
      {/* ===================================================== */}
      <h3>Travel Insight Analytics</h3>

      {/* TOTAL */}
      <p>
        💰 Total Travel Expense: <b>Rp {formatRupiah(total)}</b>
      </p>

      {/* TOTAL DESTINATION */}
      <p>
        🧳 Total Trip: <b>{totalTrip} Destination</b>
      </p>

      {/* MOST VISITED */}
      <p>
        📍 Most Visited Destination: <b>{mostVisited}</b>
      </p>

      {/* TOP CATEGORY */}
      <p>
        🏆 Highest Expense Category: <b>{biggestCategory}</b>
      </p>

      {/* MOST EXPENSIVE */}
      <p>
        🔥 Most Expensive Trip: <b>{expensiveTrip}</b>
      </p>

      <hr />

      {/* ===================================================== */}
      {/* AI INSIGHT */}
      {/* ===================================================== */}

      {biggestCategory === "Transport" && (
        <p>✈️ Transport menjadi pengeluaran terbesar selama perjalanan</p>
      )}

      {biggestCategory === "Hotel" && (
        <p>🏨 Budget hotel cukup tinggi dibanding kategori lain</p>
      )}

      {biggestCategory === "Food" && (
        <p>🍜 Pengeluaran makanan cukup besar selama trip</p>
      )}

      {biggestCategory === "Activity" && (
        <p>🎫 Aktivitas wisata mendominasi pengeluaran perjalanan</p>
      )}

      {/* WARNING */}
      {total > 3000000 && (
        <p style={{ color: "red" }}>
          ⚠️ Total budget travel cukup tinggi, pertimbangkan trip lebih hemat
        </p>
      )}
    </div>
  );
}
