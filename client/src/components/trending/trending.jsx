import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAsyncTrending } from "../../features/movies/movieSlice";
import "./trending.scss";

const Trending = () => {
  const dispatch = useDispatch();
  const { trending, loading } = useSelector((state) => state.movies);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    dispatch(fetchAsyncTrending());
  }, [dispatch]);

  const renderContent = () => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    const movies = trending?.movies?.results || [];
    const shows = trending?.shows?.results || [];

    let content = [];
    if (activeTab === "all") {
      content = [...movies, ...shows].sort((a, b) => b.popularity - a.popularity);
    } else if (activeTab === "movie") {
      content = movies;
    } else if (activeTab === "tv") {
      content = shows;
    }

    return (
      <div className="trending-grid">
        {content.map((item) => (
          <Link
            to={`/${item.media_type || (item.title ? 'movie' : 'tv')}/${item.id}`}
            key={`${item.media_type || (item.title ? 'movie' : 'tv')}-${item.id}`}
            className="trending-item"
          >
            <div className="poster">
              <img
                src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                alt={item.title || item.name}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/500x750?text=No+Image";
                }}
              />
            </div>
            <div className="info">
              <h3>{item.title || item.name}</h3>
              <div className="meta">
                <span className="rating">
                  <i className="fa fa-star"></i> {item.vote_average.toFixed(1)}
                </span>
                <span className="year">
                  {(item.release_date || item.first_air_date || "").split("-")[0]}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="trending-container">
      <div className="trending-header">
        <h1>Trending Now</h1>
        <div className="tabs">
          <button
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
          <button
            className={`tab ${activeTab === "movie" ? "active" : ""}`}
            onClick={() => setActiveTab("movie")}
          >
            Movies
          </button>
          <button
            className={`tab ${activeTab === "tv" ? "active" : ""}`}
            onClick={() => setActiveTab("tv")}
          >
            TV Shows
          </button>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default Trending; 