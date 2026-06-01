import Summary from "./Summary";
import Charts from "./Charts";
import "../../styles/dashboard.css";

export default function Dashboard({ summary, data }) {
  if (!localStorage.getItem("login")) {
    return (
      <div className="card">
        <h2>Dashboard Analytics</h2>

        <p>Login untuk melihat analytics budget dan histori perjalanan Anda.</p>
      </div>
    );
  }

  return (
    <div>
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
