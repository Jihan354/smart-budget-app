import "../../styles/summary.css";

export default function Summary() {
  // =====================================================
  // GET MY TRIPS
  // =====================================================
  const myTrips = JSON.parse(localStorage.getItem("myTrips")) || [];

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID").format(angka);
  };

  // =====================================================
  // TOTAL EXPENSE
  // =====================================================
  const totalExpense = myTrips.reduce(
    (total, trip) => total + (trip.prediction?.predicted_budget || 0),

    0,
  );

  // =====================================================
  // FAVORITE DESTINATION
  // =====================================================
  const destinationMap = {};

  myTrips.forEach((trip) => {
    const destination = trip.prediction?.destination;

    if (!destinationMap[destination]) {
      destinationMap[destination] = 0;
    }

    destinationMap[destination]++;
  });

  const favoriteDestination =
    Object.keys(destinationMap).length > 0
      ? Object.entries(destinationMap).sort((a, b) => b[1] - a[1])[0][0]
      : "No Destination";

  // =====================================================
  // TOTAL DESTINATION
  // =====================================================
  const totalDestination = new Set(
    myTrips.map((trip) => trip.prediction?.destination),
  ).size;

  // =====================================================
  // TOTAL ACTIVITY
  // =====================================================
  const totalActivity = myTrips.length;

  // =====================================================
  // TOP CATEGORY
  // =====================================================
  const topCategory = "Activity";

  // =====================================================
  // CURRENT YEAR
  // =====================================================
  const currentYear = new Date().getFullYear();

  // =====================================================
  // YEARLY TRIPS
  // =====================================================
  const yearlyTrips = myTrips.filter((trip) => {
    if (!trip.createdAt) return false;

    const tripYear = new Date(trip.createdAt).getFullYear();

    return tripYear === currentYear;
  });

  // =====================================================
  // YEARLY TOTAL
  // =====================================================
  const yearlyExpense = yearlyTrips.reduce(
    (total, trip) => total + (trip.prediction?.predicted_budget || 0),

    0,
  );

  // =====================================================
  // YEARLY TRIP COUNT
  // =====================================================
  const yearlyTripCount = yearlyTrips.length;

  // =====================================================
  // BUDGET STATUS
  // =====================================================
  let budgetStatus = "Safe";

  // OVER
  if (yearlyTripCount > 6 || yearlyExpense > 60000000) {
    budgetStatus = "Over Budget";
  }

  // WARNING
  else if (yearlyTripCount >= 4 || yearlyExpense > 30000000) {
    budgetStatus = "Warning";
  }

  return (
    <div>
      {/* ======================================= */}
      {/* SUMMARY */}
      {/* ======================================= */}
      <div className="summary">
        {/* TOTAL EXPENSE */}
        <div className="card">
          <h4>Total Travel Expense</h4>

          <p>Rp {formatRupiah(totalExpense)}</p>
        </div>

        {/* FAVORITE DESTINATION */}
        <div className="card">
          <h4>Favorite Destination</h4>

          <p>{favoriteDestination}</p>
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

      <br />

      {/* ======================================= */}
      {/* CATEGORY SUMMARY */}
      {/* ======================================= */}
      <div className="card">
        <h4>Travel Expenses by Category</h4>

        <p>🎫 Activity : Rp {formatRupiah(totalExpense)}</p>
      </div>
    </div>
  );
}
