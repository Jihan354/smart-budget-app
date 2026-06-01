import { useState } from "react";

import TripSummary from "./TripSummary";
import TripBreakdown from "./TripBreakdown";

export default function MyTrip() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [myTrips, setMyTrips] = useState(
    JSON.parse(localStorage.getItem(`myTrips_${currentUser?.email}`)) || [],
  );

  // =====================================================
  // FILTER STATE
  // =====================================================

  const [search, setSearch] = useState("");

  const [yearFilter, setYearFilter] = useState("");

  const [sortBy, setSortBy] = useState("newest");

  // =====================================================
  // DELETE TRIP
  // =====================================================

  const handleDelete = (indexToDelete) => {
    const updatedTrips = myTrips.filter((_, index) => index !== indexToDelete);

    setMyTrips(updatedTrips);

    localStorage.setItem(
      `myTrips_${currentUser?.email}`,
      JSON.stringify(updatedTrips),
    );
  };

  // =====================================================
  // LOGIN CHECK
  // =====================================================

  if (!localStorage.getItem("login")) {
    return (
      <div className="card">
        {" "}
        <h2>My Trip</h2>
        <p>Login untuk melihat riwayat perjalanan Anda.</p>
      </div>
    );
  }

  // =====================================================
  // FILTER DATA
  // =====================================================

  let filteredTrips = myTrips.filter((trip) => {
    const destination = trip.prediction?.destination?.toLowerCase() || "";

    const matchesSearch = destination.includes(search.toLowerCase());

    const matchesYear = yearFilter ? trip.tripDate?.includes(yearFilter) : true;

    return matchesSearch && matchesYear;
  });

  // =====================================================
  // SORT DATA
  // =====================================================

  filteredTrips.sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.tripDate) - new Date(a.tripDate);
    } else {
      return new Date(a.tripDate) - new Date(b.tripDate);
    }
  });

  return (
    <div>
      {/* ================================================= */}
      {/* FILTER SECTION */}
      {/* ================================================= */}

      <div className="card">
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "10px",
          }}
        >
          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              minWidth: "220px",
            }}
          />

          {/* YEAR FILTER */}

          <input
            type="text"
            placeholder="Search year..."
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              minWidth: "140px",
            }}
          />

          {/* SORT */}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          >
            <option value="newest">Newest</option>

            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <br />

      {/* ================================================= */}
      {/* TRIP LIST */}
      {/* ================================================= */}

      {filteredTrips.length === 0 ? (
        <div className="card">
          <h3>No Trips Found</h3>

          <p>Tidak ada perjalanan yang cocok dengan filter.</p>
        </div>
      ) : (
        filteredTrips.map((trip, index) => (
          <div key={index}>
            <TripSummary
              prediction={trip.prediction}
              selectedWisata={trip.selectedWisata}
              totalBudget={trip.totalBudget}
              tripDate={trip.tripDate}
              onDelete={() => handleDelete(index)}
            />

            <br />

            <TripBreakdown
              prediction={trip.prediction}
              selectedWisata={trip.selectedWisata}
            />

            <br />
          </div>
        ))
      )}
    </div>
  );
}
