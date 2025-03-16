import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchNewsItem } from "../services/api";
import axios from "axios";

function NewsItem() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/v1";

  // Fetch the news item when the component mounts or when the id changes.
  useEffect(() => {
    const getNews = async () => {
      try {
        const data = await fetchNewsItem(id);

        setNews(data);
      } catch (err) {
        setError("Error fetching news item");
      } finally {
        setLoading(false);
      }
    };
    getNews();
  }, [id]);

  // Handle like action
  const handleLike = async () => {
    try {
      const response = await axios.post(`${API_URL}/news/${id}/like/`);
      setNews((prevNews) => ({
        ...prevNews,
        like_count: response.data.like_count,
      }));
    } catch (err) {
      console.error("Error liking the news:", err);
    }
  };

  // Handle dislike action
  const handleDislike = async () => {
    try {
      const response = await axios.post(`${API_URL}/news/${id}/dislike/`);
      setNews((prevNews) => ({
        ...prevNews,
        dislike_count: response.data.dislike_count,
      }));
    } catch (err) {
      console.error("Error disliking the news:", err);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <p>Loading news...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5 text-danger">
        <p>{error}</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container text-center mt-5">
        <p>News item not found.</p>
      </div>
    );
  }



  // Render images: if multiple images exist, display a carousel; if one, show a single image.
  // const renderImages = () => {
  //   console.log(news);
  //   if (news.images && news.images.length > 1) {
  //     return (
  //       <div id="newsCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
  //         <div className="carousel-inner">
  //           {news.images.map((img, index) => (
  //             <div key={img.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
  //               <img
  //                 src={img.image}
  //                 className="d-block w-100"
  //                 alt={img.caption || "News image"}
  //               />
  //               {img.caption && (
  //                 <div className="carousel-caption d-none d-md-block">
  //                   <p>{img.caption}</p>
  //                 </div>
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //         <button
  //           className="carousel-control-prev"
  //           type="button"
  //           data-bs-target="#newsCarousel"
  //           data-bs-slide="prev"
  //         >
  //           <span className="carousel-control-prev-icon" aria-hidden="true"></span>
  //           <span className="visually-hidden">Previous</span>
  //         </button>
  //         <button
  //           className="carousel-control-next"
  //           type="button"
  //           data-bs-target="#newsCarousel"
  //           data-bs-slide="next"
  //         >
  //           <span className="carousel-control-next-icon" aria-hidden="true"></span>
  //           <span className="visually-hidden">Next</span>
  //         </button>
  //       </div>
  //     );
  //   } else if (news.images && news.images.length === 1) {
  //     const img = news.images[0];
  //     return (
  //       <div className="mb-4">
  //         <img src={img.image} className="img-fluid rounded" alt={img.caption || "News image"} />
  //         {img.caption && <p className="mt-2 text-muted">{img.caption}</p>}
  //       </div>
  //     );
  //   }
  //   return null;
  // };


  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        {news.featured_image && (
            <img src={news.featured_image} alt={news.title} className="card-img-top img-fluid rounded-top" style={{ objectFit: 'cover', maxHeight: '400px' }}/>
        )}
        <div className="card-body">
          <h1 className="card-title text-center mb-3">{news.title}</h1>

          <div className="d-flex justify-content-between align-items-center text-muted mb-3">
            <small>{new Date(news.published_at).toLocaleDateString()}</small>
            <div>
              {news.tags && news.tags.map(tag => (
                  <span key={tag.id} className="badge bg-secondary me-1">{tag.name}</span>
              ))}
            </div>
          </div>

          <p className="card-text" style={{fontSize: "1.1rem", lineHeight: "1.6"}}>{news.content}</p>
          <div className="d-flex justify-content-between align-items-center text-muted mb-3">
            <div>
              {news.tags && news.tags.map(tag => (
                  <span key={tag.id} className="badge bg-secondary me-1">{tag.name}</span>
              ))}
            </div>
          </div>
          {news.images && news.images.length > 1 && (
              <div id="newsCarousel" className="carousel slide mt-4" data-bs-ride="carousel" data-bs-interval="6000" data-bs-pause="false">
                <div className="carousel-inner">
                  {news.images.map((img, index) => (
                      <div key={img.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                        <img src={img.image} className="d-block w-100" alt={img.caption || "News image"}
                             style={{maxHeight: '300px', objectFit: 'contain'}}/>
                        {img.caption && (
                            <div className="carousel-caption d-none d-md-block">
                              <p>{img.caption}</p>
                            </div>
                        )}
                      </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#newsCarousel"
                        data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#newsCarousel"
                        data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
              </div>
          )}

          <div className="card-footer text-muted text-center mt-3">
            Published on {new Date(news.published_at).toLocaleDateString()}
          </div>


          {/*{renderImages()}*/}
          {/*<p className="card-text">{news.content}</p>*/}


          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button onClick={handleLike} className="btn btn-success me-2">
                Like <span className="badge bg-light text-dark">{news.like_count}</span>
              </button>
              <button onClick={handleDislike} className="btn btn-danger">
                Dislike <span className="badge bg-light text-dark">{news.dislike_count}</span>
              </button>
            </div>
            <Link to="/" className="btn btn-outline-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsItem;
