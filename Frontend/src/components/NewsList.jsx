import React, { useEffect, useState } from "react";
import { fetchNews, submitReaction } from "../services/api";
import { Link } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import NewsItem from "./NewsItem";

/**
 * NewsList Component
 * - Fetches and displays a list of news articles.
 * - Allows users to like/dislike news articles.
 */
const NewsList = () => {
  const [news, setNews] = useState([]); // State to store fetched news articles
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State to handle API errors

  /**
   * Fetch news articles when the component mounts.
   */
  useEffect(() => {
    const getNews = async () => {
      try {
        const newsData = await fetchNews();
        setNews(newsData);
      } catch (err) {
        setError("Failed to fetch news articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  /**
   * Handles like/dislike actions.
   * @param {number} newsId - ID of the news article.
   * @param {string} action - Either "like" or "dislike".
   */
  const handleReaction = async (newsId, action) => {
    try {
      const updatedNews = await submitReaction(newsId, action);
      setNews((prevNews) =>
        prevNews.map((item) =>
          item.id === newsId ? { ...item, likes: updatedNews.likes, dislikes: updatedNews.dislikes } : item
        )
      );
    } catch (err) {
      alert("Failed to submit reaction. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Latest News</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading news articles...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <div className="alert alert-warning text-center">No news articles available.</div>
      )}

      <div className="row">
        {news.map((article) => (
          <div key={article.id} className="col-md-6 col-lg-4 mb-4">
            <NewsItem news={article} onReact={handleReaction} />
          </div>
        ))}
      </div>

      <div className="text-center mt-3">
        <Link to="/stats" className="btn btn-info">
          View Site Stats
        </Link>
      </div>
    </div>
  );
};

export default NewsList;
