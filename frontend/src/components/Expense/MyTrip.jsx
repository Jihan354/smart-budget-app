import { useState } from "react";

import TripSummary from "./TripSummary";
import TripBreakdown from "./TripBreakdown";

export default function MyTrip() {
  const [myTrips, setMyTrips] = useState(
    JSON.parse(localStorage.getItem("myTrips")) || [],
  );

  const handleDelete = (indexToDelete) => {
    const updatedTrips = myTrips.filter((_, index) => index !== indexToDelete);

    setMyTrips(updatedTrips);

    localStorage.setItem("myTrips", JSON.stringify(updatedTrips));
  };

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
