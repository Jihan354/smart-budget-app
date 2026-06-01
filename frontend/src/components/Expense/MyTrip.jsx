import { useState } from "react";

import TripSummary from "./TripSummary";
import TripBreakdown from "./TripBreakdown";

export default function MyTrip() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [myTrips, setMyTrips] = useState(
    JSON.parse(localStorage.getItem(`myTrips_${currentUser?.email}`)) || [],
  );

  const handleDelete = (indexToDelete) => {
    const updatedTrips = myTrips.filter((_, index) => index !== indexToDelete);

    setMyTrips(updatedTrips);

    localStorage.setItem(
      `myTrips_${currentUser?.email}`,
      JSON.stringify(updatedTrips),
    );
  };

  if (!localStorage.getItem("login")) {
    return (
      <div className="card">
        <h2>My Trip</h2>

        <p>Login untuk melihat riwayat perjalanan Anda.</p>
      </div>
    );
  }

  return (
    <div>
      {myTrips.map((trip, index) => (
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
      ))}
    </div>
  );
}
