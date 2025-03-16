import React from "react";
import Stats from "../components/Stats";

/**
 * StatsPage Component
 *
 * This page serves as a container for displaying site statistics.
 * It includes a header and leverages the Stats component, which handles data fetching and display.
 * The layout uses Bootstrap classes to ensure a responsive and visually appealing design.
 */
function StatsPage() {
  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="row">
        <div className="col">
          <h1 className="text-center mb-4">Site Statistics</h1>
        </div>
      </div>

      {/* Render the Stats component */}
      <div className="row">
        <div className="col">
          <Stats />
        </div>
      </div>
    </div>
  );
}

export default StatsPage;
