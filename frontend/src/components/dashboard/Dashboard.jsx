import Summary from "./Summary";
import Charts from "./Charts";
import Insight from "./Insight";

export default function Dashboard({ summary, data }) {

  return (

    <div>

      {/* ================= WELCOME ================= */}
      <div className="card">

        <h2>Welcome Back 👋</h2>

        <p>
          Manage your AI-powered travel budget ecosystem
          smarter and more efficiently.
        </p>

      </div>

      <br />

      {/* ================= SUMMARY ================= */}
      <Summary
        summary={summary}
        data={data}
      />

      <br />

      {/* ================= CHARTS ================= */}
      <Charts
        data={data}
      />

      <br />

      {/* ================= INSIGHT ================= */}
      <Insight
        data={data}
      />

    </div>
  );
}