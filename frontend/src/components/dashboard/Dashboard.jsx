import Summary from "./Summary";
import Charts from "./Charts";
import "../../styles/dashboard.css";

export default function Dashboard({ summary, data }) {
  return (
    <div>
      {/* ================= WELCOME ================= */}
      <div className="card dashboard-welcome">
        <h2>Welcome Back </h2>

        <p>
          Manage your AI-powered travel budget ecosystem smarter and more
          efficiently.
        </p>
      </div>

      <br />

      {/* ================= SUMMARY ================= */}
      <Summary summary={summary} data={data} />

      <br />

      {/* ================= CHARTS ================= */}
      <Charts data={data} />

      <br />
    </div>
  );
}
