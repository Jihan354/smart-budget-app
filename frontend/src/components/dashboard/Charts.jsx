import "../../styles/charts.css";

import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
} from "recharts";

export default function Charts() {
  // =====================================================
  // GET MY TRIPS
  // =====================================================
  const myTrips = JSON.parse(localStorage.getItem("myTrips")) || [];

  // =====================================================
  // DESTINATION DATA
  // =====================================================
  // =====================================================
  // GROUP DESTINATION
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

  // =====================================================
  // FINAL DATA
  // =====================================================
  const destinationData = Object.keys(groupedDestination).map((key) => ({
    destination: key,

    total: groupedDestination[key],
  }));

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  // =====================================================
  // SAFETY
  // =====================================================
  if (destinationData.length === 0) {
    return (
      <div className="card">
        <h3>Travel Analytics Chart</h3>

        <p>No Chart Data</p>
      </div>
    );
  }

  return (
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
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="destination" />

          <YAxis />

          <Tooltip formatter={(value) => `Rp ${formatRupiah(value)}`} />

          <Bar dataKey="total" fill="#7c3aed" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
