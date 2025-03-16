import React, { useState, useEffect } from "react";
import { fetchStats } from "../services/api";

function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch site statistics from the backend when the component mounts.
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching site statistics:", err);
        setError("Failed to load site statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Display a loading spinner while data is being fetched.
  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Display an error message if fetching data failed.
  if (error) {
    return (
      <div className="container text-center mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // Render the statistics in a Bootstrap-styled card.
  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Site Statistics</h1>
      <div className="card shadow">
        <div className="card-header bg-info text-white">
          Overview
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            Total News Articles: <strong>{stats.total_news}</strong>
          </li>
          <li className="list-group-item">
            Total Users: <strong>{stats.total_users}</strong>
          </li>
          <li className="list-group-item">
            Total Likes: <strong>{stats.total_likes}</strong>
          </li>
          <li className="list-group-item">
            Total Dislikes: <strong>{stats.total_dislikes}</strong>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default StatsPage;
