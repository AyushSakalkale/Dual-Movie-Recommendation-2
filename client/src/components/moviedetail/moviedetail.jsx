import React, {useEffect, useState} from "react";
import "./moviedetail.scss";
import {useParams, useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchAsyncMovieDetail,
  getSelectedMovieOrShow,
  removeSelectedMovieOrShow,
} from "../../features/movies/movieSlice";

const MovieDetail = () => {
  const {imdbID} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(getSelectedMovieOrShow);
  const [director, setDirector] = useState([]);
  const [producer, setProducer] = useState([]);
  const [writer, setWriter] = useState([]);
  const [cast, setCast] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const processCredits = () => {
      if (!data.credits) return;
      
      // Get director
      const directorData = data.credits.crew.filter(
        ({job}) => job === "Director"
      );
      setDirector(directorData);
      
      // Get producer
      const producerData = data.credits.crew.filter(
        ({job}) => job === "Producer"
      );
      setProducer(producerData);
      
      // Get writer
      const writerData = data.credits.crew.filter(
        ({job}) => job === "Screenplay" || job === "Writer"
      );
      setWriter(writerData);
      
      // Get top 10 cast members
      const castData = data.credits.cast.slice(0, 10);
      setCast(castData);
    };

    processCredits();
  }, [data]);

  useEffect(() => {
    dispatch(fetchAsyncMovieDetail(imdbID));
    return () => {
      dispatch(removeSelectedMovieOrShow());
    };
  }, [dispatch, imdbID]);

  // Format runtime to hours and minutes
  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  // Format budget and revenue to currency
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
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

  // Handle actor click
  const handleActorClick = (actorId) => {
    navigate(`/actor/${actorId}`);
  };

  return (
    <div className="movie-detail-container">
      {Object.keys(data).length === 0 ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="movie-header">
            <div className="movie-backdrop" style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${data.backdrop_path})`
            }}>
              <div className="backdrop-overlay"></div>
            </div>
            <div className="movie-header-content">
              <div className="movie-poster">
                <img
                  src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
                  alt={data.title}
                />
              </div>
              <div className="movie-header-info">
                <h1 className="movie-title">{data.title}</h1>
                <div className="movie-tagline">{data.tagline}</div>
                <div className="movie-meta">
                  <span className="movie-year">{new Date(data.release_date).getFullYear()}</span>
                  <span className="movie-runtime">{formatRuntime(data.runtime)}</span>
                  <span className="movie-rating">
                    <i className="fa fa-star"></i> {data.vote_average?.toFixed(1)}
                  </span>
                  <span className="movie-votes">
                    <i className="fa fa-thumbs-up"></i> {data.vote_count}
                  </span>
                </div>
                <div className="movie-genres">
                  {data.genres?.map(genre => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="movie-tabs">
            <button 
              className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button 
              className={`tab-button ${activeTab === "cast" ? "active" : ""}`}
              onClick={() => setActiveTab("cast")}
            >
              Cast & Crew
            </button>
            <button 
              className={`tab-button ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
          </div>

          <div className="movie-content">
            {activeTab === "overview" && (
              <div className="overview-tab">
                <div className="movie-plot">
                  <h2>Overview</h2>
                  <p>{data.overview}</p>
                </div>
                
                <div className="movie-cast-preview">
                  <h2>Top Cast</h2>
                  <div className="cast-list">
                    {cast.map(actor => (
                      <div 
                        key={actor.id} 
                        className="cast-item"
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
                </div>
              </div>
            )}

            {activeTab === "cast" && (
              <div className="cast-tab">
                <div className="cast-section">
                  <h2>Cast</h2>
                  <div className="cast-grid">
                    {data.credits?.cast.map(actor => (
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
                </div>
                
                <div className="crew-section">
                  <h2>Crew</h2>
                  <div className="crew-grid">
                    {data.credits?.crew.map((person, index) => (
                      <div key={`${person.id}-${index}`} className="crew-card">
                        <div className="crew-info">
                          <div className="crew-name">{person.name}</div>
                          <div className="crew-job">{person.job}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="details-tab">
                <div className="details-section">
                  <h2>Movie Details</h2>
                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Status</span>
                      <span className="detail-value">{data.status}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Original Language</span>
                      <span className="detail-value">
                        {data.original_language?.toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Budget</span>
                      <span className="detail-value">{formatCurrency(data.budget)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Revenue</span>
                      <span className="detail-value">{formatCurrency(data.revenue)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Runtime</span>
                      <span className="detail-value">{formatRuntime(data.runtime)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Release Date</span>
                      <span className="detail-value">{formatDate(data.release_date)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">IMDB ID</span>
                      <span className="detail-value">{data.imdb_id}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Vote Average</span>
                      <span className="detail-value">{data.vote_average?.toFixed(1)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Vote Count</span>
                      <span className="detail-value">{data.vote_count}</span>
                    </div>
                  </div>
                </div>

                <div className="production-section">
                  <h2>Production Companies</h2>
                  <div className="production-grid">
                    {data.production_companies?.map(company => (
                      <div key={company.id} className="production-card">
                        {company.logo_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w185${company.logo_path}`} 
                            alt={company.name} 
                          />
                        ) : (
                          <div className="company-name">{company.name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="keywords-section">
                  <h2>Keywords</h2>
                  <div className="keywords-list">
                    {data.keywords?.keywords?.map(keyword => (
                      <span key={keyword.id} className="keyword-tag">{keyword.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetail;
