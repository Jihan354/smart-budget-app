import "../../styles/charts.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Bar,
} from "recharts";

export default function Charts({ data }) {
  // =========================================================
  // SAFETY
  // =========================================================
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3>Travel Analytics Chart</h3>

        <p>No Chart Data</p>
      </div>
    );
  }

  // =========================================================
  // CATEGORY ANALYTICS
  // =========================================================
  const groupedCategory = {};

  data.forEach((item) => {
    if (item.type === "expense") {
      if (!groupedCategory[item.kategori]) {
        groupedCategory[item.kategori] = 0;
      }

      groupedCategory[item.kategori] += Number(item.jumlah);
    }
  });

  const categoryData = Object.keys(groupedCategory).map((key) => ({
    name: key,

    value: groupedCategory[key],
  }));

  // =========================================================
  // DESTINATION ANALYTICS
  // =========================================================
  const groupedDestination = {};

  data.forEach((item) => {
    if (item.type === "expense") {
      const destination = item.destination || "Unknown";

      if (!groupedDestination[destination]) {
        groupedDestination[destination] = 0;
      }

      groupedDestination[destination] += Number(item.jumlah);
    }
  });

  const destinationData = Object.keys(groupedDestination).map((key) => ({
    destination: key,

    total: groupedDestination[key],
  }));

  // =========================================================
  // COLORS
  // =========================================================
  const COLORS = ["#7f5af0", "#ff8906", "#2cb67d", "#e53170"];

  // =========================================================
  // FORMAT RUPIAH
  // =========================================================
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  return (
    <div>
      {/* ===================================================== */}
      {/* PIE CHART */}
      {/* ===================================================== */}
      <div className="card">
        <h3>Travel Expense by Category</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(value) => `Rp ${formatRupiah(value)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===================================================== */}
      {/* BAR CHART */}
      {/* ===================================================== */}
      <div className="card">
        <h3>Destination Travel Spending</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={destinationData}
            margin={{
              top: 20,
              right: 20,
              left: 40,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="destination" />

            <YAxis />

            <Tooltip formatter={(value) => `Rp ${formatRupiah(value)}`} />

            <Legend />

            <Bar dataKey="total" fill="#7f5af0" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
