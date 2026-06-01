import { useState } from "react";

import "../../styles/summary.css";

export default function Summary() {
  // =====================================================
  // GET MY TRIPS
  // =====================================================
  const isLogin = localStorage.getItem("login");

  const currentUser = isLogin ? JSON.parse(localStorage.getItem("user")) : null;

  const myTrips =
    JSON.parse(localStorage.getItem(`myTrips_${currentUser?.email}`)) || [];

  // =====================================================
  // TARGET BUDGET
  // =====================================================
  const [targetBudget, setTargetBudget] = useState(
    Number(localStorage.getItem("targetBudget")) || 30000000,
  );

  const [inputBudget, setInputBudget] = useState(targetBudget);

  // =====================================================
  // SAVE TARGET
  // =====================================================
  const saveTargetBudget = () => {
    localStorage.setItem("targetBudget", inputBudget);

    setTargetBudget(Number(inputBudget));
  };

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
  const categoryTotals = {
    Transport: 0,
    Penginapan: 0,
    Food: 0,
    Activity: 0,
  };

  myTrips.forEach((trip) => {
    const budget = trip.prediction?.predicted_budget || 0;

    categoryTotals.Transport += budget * 0.45;

    categoryTotals.Penginapan += budget * 0.25;

    categoryTotals.Food += budget * 0.2;

    categoryTotals.Activity += budget * 0.1;
  });

  // ===================== // TOP CATEGORY // ==============================
  const topCategory = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

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

  const usagePercent = (yearlyExpense / targetBudget) * 100;

  // OVER
  if (usagePercent >= 100) {
    budgetStatus = "Over Budget";
  }

  // WARNING
  else if (usagePercent >= 80) {
    budgetStatus = "Warning";
  }

  return (
    <div>
      {/* ======================================= */}
      {/* HERO */}
      {/* ======================================= */}
      <div className="dashboard-hero">
        {/* LEFT */}

        <div className="dashboard-hero-left">
          Halo, {isLogin ? currentUser?.name : "Traveler"}
          <p>Berikut adalah ringkasan analitik dan wawasan perjalanan Anda.</p>
        </div>

        {/* RIGHT */}

        <div className="dashboard-hero-right">
          <div>
            <small>TARGET BUDGET</small>

            <h3>Rp {formatRupiah(targetBudget)}</h3>
          </div>

          <div className="target-input">
            <input
              type="number"
              value={inputBudget}
              onChange={(e) => setInputBudget(e.target.value)}
            />

            <button onClick={saveTargetBudget}>Set</button>
          </div>
        </div>
      </div>

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
        <p> Transport : Rp {formatRupiah(categoryTotals.Transport)}</p>

        <p> Penginapan : Rp {formatRupiah(categoryTotals.Penginapan)}</p>

        <p> Food : Rp {formatRupiah(categoryTotals.Food)}</p>

        <p> Activity : Rp {formatRupiah(categoryTotals.Activity)}</p>
      </div>
    </div>
  );
}
