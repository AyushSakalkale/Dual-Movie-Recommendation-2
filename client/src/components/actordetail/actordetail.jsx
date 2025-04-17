import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAsyncActorDetails, getSelectedActor } from '../../features/movies/movieSlice';
import './actordetail.scss';

const ActorDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actor = useSelector(getSelectedActor);
  const [loading, setLoading] = useState(true);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularShows, setPopularShows] = useState([]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAsyncActorDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (Object.keys(actor).length > 0) {
      setLoading(false);
      
      // Process combined credits to separate movies and TV shows
      if (actor.combined_credits) {
        // Sort by popularity and get top 10 movies
        const movies = actor.combined_credits.cast
          .filter(item => item.media_type === 'movie')
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10);
        
        // Sort by popularity and get top 10 TV shows
        const shows = actor.combined_credits.cast
          .filter(item => item.media_type === 'tv')
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10);
        
        setPopularMovies(movies);
        setPopularShows(shows);
      }
    }
  }, [actor]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleItemClick = (mediaType, itemId) => {
    if (mediaType === 'movie') {
      navigate(`/movie/${itemId}`);
    } else if (mediaType === 'tv') {
      navigate(`/show/${itemId}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="actor-detail-container">
      <div className="actor-header">
        <div className="actor-backdrop" style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${actor.profile_path})`
        }}>
          <div className="backdrop-overlay"></div>
        </div>
        <div className="actor-header-content">
          <div className="actor-profile">
            {actor.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                alt={actor.name}
              />
            ) : (
              <div className="no-image">{actor.name.charAt(0)}</div>
            )}
          </div>
          <div className="actor-info">
            <h1>{actor.name}</h1>
            <div className="actor-meta">
              <span>
                <i className="fa fa-birthday-cake"></i> {formatDate(actor.birthday)}
              </span>
              <span>
                <i className="fa fa-map-marker"></i> {actor.place_of_birth || 'N/A'}
              </span>
              <span>
                <i className="fa fa-star"></i> {actor.popularity?.toFixed(1)}
              </span>
            </div>
            <div className="actor-biography">
              <h2>Biography</h2>
              <p>{actor.biography || 'No biography available.'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="actor-content">
        <div className="popular-movies">
          <h2>Popular Movies</h2>
          <div className="items-grid">
            {popularMovies.length > 0 ? (
              popularMovies.map(movie => (
                <div 
                  key={movie.id} 
                  className="item-card"
                  onClick={() => handleItemClick('movie', movie.id)}
                >
                  <div className="item-poster">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                        alt={movie.title}
                      />
                    ) : (
                      <div className="no-image">{movie.title.charAt(0)}</div>
                    )}
                  </div>
                  <div className="item-info">
                    <h3>{movie.title}</h3>
                    <div className="item-meta">
                      <span className="year">
                        {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                      </span>
                      <span className="rating">
                        <i className="fa fa-star"></i> {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No movies found.</p>
            )}
          </div>
        </div>

        <div className="popular-shows">
          <h2>Popular TV Shows</h2>
          <div className="items-grid">
            {popularShows.length > 0 ? (
              popularShows.map(show => (
                <div 
                  key={show.id} 
                  className="item-card"
                  onClick={() => handleItemClick('tv', show.id)}
                >
                  <div className="item-poster">
                    {show.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${show.poster_path}`}
                        alt={show.name}
                      />
                    ) : (
                      <div className="no-image">{show.name.charAt(0)}</div>
                    )}
                  </div>
                  <div className="item-info">
                    <h3>{show.name}</h3>
                    <div className="item-meta">
                      <span className="year">
                        {show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A'}
                      </span>
                      <span className="rating">
                        <i className="fa fa-star"></i> {show.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No TV shows found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetail; 