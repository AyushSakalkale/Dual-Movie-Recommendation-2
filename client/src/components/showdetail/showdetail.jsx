import React, {useEffect, useState} from "react";
import "./showdetail.scss";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {
  fetchAsyncShowDetail,
  getSelectedMovieOrShow,
  removeSelectedMovieOrShow,
} from "../../features/movies/movieSlice";

const ShowDetail = () => {
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow);
  const navigate = useNavigate();
  const {imdbID} = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);

  useEffect(() => {
    dispatch(fetchAsyncShowDetail(imdbID));
    return () => {
      dispatch(removeSelectedMovieOrShow());
    };
  }, [dispatch, imdbID]);

  useEffect(() => {
    if (data.credits) {
      setCast(data.credits.cast.slice(0, 10));
      setCrew(data.credits.crew.slice(0, 10));
    }
  }, [data]);

  if (Object.keys(data).length === 0) {
    return <div className="loading">Loading...</div>;
  }

  const handleSeasonClick = (id, seasonNumber) => {
    navigate(`/show/${id}/season/${seasonNumber}`);
  };

  // Handle actor click
  const handleActorClick = (actorId) => {
    navigate(`/actor/${actorId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="show-detail-container">
      <div className="show-header">
        <div className="show-backdrop" style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`
        }}>
          <div className="backdrop-overlay"></div>
        </div>
        <div className="show-header-content">
          <div className="show-poster">
            <img
              src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
              alt={data.name}
            />
          </div>
          <div className="show-info">
            <h1>{data.name}</h1>
            <div className="show-meta">
              <span>
                <i className="fa fa-star"></i> {data.vote_average?.toFixed(1)}
              </span>
              <span>
                <i className="fa fa-calendar"></i> {formatDate(data.first_air_date)}
              </span>
              <span>
                <i className="fa fa-film"></i> {data.number_of_seasons} Seasons
              </span>
              <span>
                <i className="fa fa-clock"></i> {data.episode_run_time?.[0]} min/episode
              </span>
            </div>
            <div className="show-genres">
              {data.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="show-content">
        <div className="tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={activeTab === "cast" ? "active" : ""}
            onClick={() => setActiveTab("cast")}
          >
            Cast & Crew
          </button>
          <button
            className={activeTab === "seasons" ? "active" : ""}
            onClick={() => setActiveTab("seasons")}
          >
            Seasons
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "overview" && (
            <div className="overview-section">
              <h2>Overview</h2>
              <p>{data.overview}</p>
              <div className="additional-info">
                <div className="info-item">
                  <h3>Status</h3>
                  <p>{data.status}</p>
                </div>
                <div className="info-item">
                  <h3>Original Language</h3>
                  <p>{data.original_language?.toUpperCase()}</p>
                </div>
                <div className="info-item">
                  <h3>Network</h3>
                  <p>{data.networks?.[0]?.name || "N/A"}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cast" && (
            <div className="cast-section">
              <h2>Cast</h2>
              <div className="cast-grid">
                {cast.map((actor) => (
                  <div 
                    key={actor.id} 
                    className="cast-card"
                    onClick={() => handleActorClick(actor.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="cast-image">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                        />
                      ) : (
                        <div className="no-image">{actor.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="cast-info">
                      <div className="cast-name">{actor.name}</div>
                      <div className="cast-character">{actor.character}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h2>Crew</h2>
              <div className="crew-grid">
                {crew.map((person, index) => (
                  <div key={`${person.id}-${index}`} className="crew-card">
                    <div className="crew-info">
                      <div className="crew-name">{person.name}</div>
                      <div className="crew-job">{person.job}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "seasons" && (
            <div className="seasons-section">
              <h2>Seasons</h2>
              <div className="seasons-grid">
                {data.seasons?.map((season) => (
                  <div
                    key={season.id}
                    className="season-card"
                    onClick={() => handleSeasonClick(data.id, season.season_number)}
                  >
                    <div className="season-poster">
                      {season.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                          alt={season.name}
                        />
                      ) : (
                        <div className="no-image">{season.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="season-info">
                      <h3>{season.name}</h3>
                      <div className="season-meta">
                        <span>
                          {season.episode_count} Episodes
                        </span>
                        <span>
                          {season.air_date ? season.air_date.split("-")[0] : "TBA"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowDetail;
