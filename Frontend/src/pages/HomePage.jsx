import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {fetchNews} from "../services/api";

function HomePage() {
  // State to store news items, current page, and if there are more items.
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Ref to hold the observer instance.
  const observer = useRef();

  // Load news when the component mounts or when the page number changes.
  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await fetchNews(page); // Expected to return an object with a "results" array.
        if (data.results && data.results.length > 0) {
          setNews((prevNews) => {
            // Combine old news with new result
            const combinedNews =  [...prevNews, ...data.results];

            // Filter out duplicates based on the unique id
            return combinedNews.filter(
                (item, index, self) => index === self.findIndex((t) => t.id === item.id)
            )
          });

          // If we receive fewer items than the page size (3), assume no more news available.
          if (data.results.length < 3) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    loadNews();
  }, [page]);

  // Callback ref to observe the last news element.
  const lastNewsElementRef = useCallback(
    (node) => {
      if (!hasMore) return; // Stop observing if there's no more data.
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // If the last element is visible, load the next page.
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  // Utility function to format the published date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-center">Latest News</h1>
      <div className="row">
        {news.map((item, index) => (
          <div
            key={item.id}
            className="col-md-4 mb-4"
            // Attach the observer to the last item
            ref={index === news.length - 1 ? lastNewsElementRef : null}
          >
            <div className="card h-100 shadow-sm">
              {item.featured_image && (
                <img
                  src={item.featured_image}
                  className="card-img-top"
                  alt={item.title}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.title}</h5>
                <p className="card-text">
                  <small className="text-muted">
                    {console.log(item)}
                    Published on: {formatDate(item.published_at)}
                  </small>
                </p>

                {item.tags && item.tags.length > 0 && (
                    <div className="mb-2">
                      {item.tags.map((tag) => (
                          <span key={tag.id} className="badge bg-secondary me-1">
                            {tag.name}
                          </span>
                      ))}
                    </div>
                )}

                <p className="card-text flex-grow-1">{item.content.substring(0, 100) + "..."}</p>
                <Link to={`/news/${item.id}`} className="btn btn-primary mt-auto">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!hasMore && (
        <p className="text-center mt-4">No more news available.</p>
      )}
    </div>
  );
}

export default HomePage;
