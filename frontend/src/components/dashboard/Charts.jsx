import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Charts({ data }) {

  // ================= GROUP DATA BY KATEGORI =================
  const grouped = {};

  data.forEach((item) => {
    if (item.type === "expense") {
      if (!grouped[item.kategori]) {
        grouped[item.kategori] = 0;
      }
      grouped[item.kategori] += item.jumlah;
    }
  });

  // ================= FORMAT DATA UNTUK CHART =================
  const chartData = Object.keys(grouped).map((key) => ({
    name: key,
    value: grouped[key]
  }));

  // ================= WARNA =================
  const COLORS = ["#7f5af0", "#ff8906", "#2cb67d", "#e53170"];

  return (
    <div className="card">
      <h3>Pengeluaran per Kategori</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}