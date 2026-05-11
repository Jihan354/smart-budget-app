import Prediction from "./Prediction";
import AIWisata from "./AIWisata";

export default function TripPlanner({ refresh }) {

  return (
    <div>

      {/* ================= AI WISATA ================= */}
      <AIWisata />

      <br />

      {/* ================= PREDIKSI BUDGET ================= */}
      <Prediction refresh={refresh} />

    </div>
  );
}