import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchNews } from "../services/api";


function NewsByTag() {
  // Retrieve the 'tag' parameter from the URL.
  const { tag } = useParams();

  // State to store the news articles.
  const [news, setNews] = useState([]);
  // State to track the current page number.
  const [page, setPage] = useState(1);
  // Flag indicating if more news articles are available.
  const [hasMore, setHasMore] = useState(true);

  // Ref to store the IntersectionObserver instance.
  const observer = useRef();

  // Fetch news articles when the component mounts or when 'page' or 'tag' changes.
  useEffect(() => {
    const loadNews = async () => {
      try {
        // Call fetchNews with current page and tag filter.
        const data = await fetchNews(page, tag);
        console.log("Fetched news data:", data);
        if (data.results && data.results.length > 0) {
          // Append new results to the existing list.
          setNews((prevNews) => [...prevNews, ...data.results]);
          // If the number of results is less than the page size (3), assume no more news.
          if (data.results.length < 3) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching news by tag:", error);
      }
    };

    loadNews();
  }, [page, tag]);

  // Callback ref for the last element to implement infinite scroll.
  const lastNewsElementRef = useCallback(
    (node) => {
      if (!hasMore) return; // Do nothing if no more items.
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // If the last element is visible, increment the page number.
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">News for tag: {tag}</h1>
      <div className="row">
        {news.map((item, index) => (
          <div
            key={item.id}
            className="col-md-4 mb-4"
            // Attach observer to the last news element for infinite scroll.
            ref={index === news.length - 1 ? lastNewsElementRef : null}
          >
            <div className="card h-100 shadow-sm">
              {/* Featured Image (if available) */}
              {item.featured_image && (
                <img
                  src={item.featured_image}
                  className="card-img-top img-fluid"
                  alt={item.title}
                  style={{ objectFit: "cover", maxHeight: "400px" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.title}</h5>
                {/* Display Published Date if available */}
                {item.published_at && (
                  <p className="card-text">
                    <small className="text-muted">
                      {new Date(item.published_at).toLocaleDateString()}
                    </small>
                  </p>
                )}
                {/* Display Tags as Bootstrap badges */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mb-2">
                    {item.tags.map((t) => (
                      <span key={t.id} className="badge bg-secondary me-1">
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}
                {/* Display a summary or excerpt of the content */}
                <p className="card-text flex-grow-1">
                  {item.summary ||
                    (item.content && item.content.substring(0, 100) + "...")}
                </p>
                <Link to={`/news/${item.id}`} className="btn btn-primary mt-auto">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Message when no more news is available */}
      {!hasMore && (
        <p className="text-center mt-4">No more news available.</p>
      )}
    </div>
  );
}

export default NewsByTag;
