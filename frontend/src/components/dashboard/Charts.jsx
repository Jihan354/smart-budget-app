import "../../styles/charts.css";

import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Charts() {
  // =====================================================
  // LOGIN CHECK
  // =====================================================

  const isLogin = localStorage.getItem("login");

  // =====================================================
  // CURRENT USER
  // =====================================================

  const currentUser = isLogin ? JSON.parse(localStorage.getItem("user")) : null;

  // =====================================================
  // GET MY TRIPS
  // =====================================================

  const myTrips =
    JSON.parse(localStorage.getItem(`myTrips_${currentUser?.email}`)) || [];

  // =====================================================
  // DESTINATION DATA
  // =====================================================

  const groupedDestination = {};

  myTrips.forEach((trip) => {
    const destination = trip.prediction?.destination;

    const total = trip.prediction?.predicted_budget || 0;

    if (!groupedDestination[destination]) {
      groupedDestination[destination] = 0;
    }

    groupedDestination[destination] += total;
  });

  const destinationData = Object.keys(groupedDestination).map((key) => ({
    destination: key,
    total: groupedDestination[key],
  }));

  // =====================================================
  // CATEGORY DATA
  // =====================================================

  let transport = 0;
  let hotel = 0;
  let food = 0;
  let activity = 0;

  myTrips.forEach((trip) => {
    const budget = trip.prediction?.predicted_budget || 0;

    transport += budget * 0.45;
    hotel += budget * 0.25;
    food += budget * 0.2;
    activity += budget * 0.1;
  });

  const categoryData = [
    {
      name: "Transport",
      value: transport,
    },

    {
      name: "Hotel",
      value: hotel,
    },

    {
      name: "Food",
      value: food,
    },

    {
      name: "Activity",
      value: activity,
    },
  ];

  // =====================================================
  // COLORS
  // =====================================================

  const COLORS = ["#7c3aed", "#2563eb", "#9333ea", "#06b6d4"];

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  // =====================================================
  // EMPTY STATE
  // =====================================================

  if (!isLogin || destinationData.length === 0) {
    return (
      <div className="card">
        <h3>Travel Analytics Chart</h3>

        <p>No Chart Data</p>
      </div>
    );
  }

  return (
    <div className="charts-wrapper">
      {/* ================================================= */}
      {/* BAR CHART */}
      {/* ================================================= */}

      <div className="card bar-card">
        <div className="chart-header">
          <h3>Destination Spending Comparison</h3>

          <p>Compare total travel expenses between destinations</p>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <BarChart
            data={destinationData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={
                document.body.classList.contains("dark") ? "#334155" : "#e2e8f0"
              }
            />

            <XAxis
              dataKey="destination"
              tick={{
                fill: document.body.classList.contains("dark")
                  ? "#ffffff"
                  : "#1e293b",
              }}
            />

            <YAxis
              tick={{
                fill: document.body.classList.contains("dark")
                  ? "#ffffff"
                  : "#1e293b",
              }}
            />

            <Tooltip
              formatter={(value) => `Rp ${formatRupiah(value)}`}
              contentStyle={{
                backgroundColor: document.body.classList.contains("dark")
                  ? "#0f172a"
                  : "#ffffff",
                border: "1px solid #334155",
                color: "#ffffff",
                borderRadius: "12px",
              }}
            />

            <Bar dataKey="total" fill="#7c3aed" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ================================================= */}
      {/* PIE CHART */}
      {/* ================================================= */}

      <div className="card pie-card">
        <div className="chart-header">
          <h3>Travel Budget Distribution</h3>

          <p>Analyze spending categories</p>
        </div>

        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => `Rp ${formatRupiah(value)}`}
              contentStyle={{
                backgroundColor: document.body.classList.contains("dark")
                  ? "#0f172a"
                  : "#ffffff",
                border: "1px solid #334155",
                color: "#ffffff",
                borderRadius: "12px",
              }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
