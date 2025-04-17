import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchAsyncSeasonDetail, removeSelectedSeason } from '../../features/movies/movieSlice';
import './seasondetail.scss';

const SeasonDetail = () => {
  const { id, seasonNumber } = useParams();
  const dispatch = useDispatch();
  const season = useSelector((state) => state.movies.selectedSeason);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAsyncSeasonDetail({ id, seasonNumber }));
    return () => {
      dispatch(removeSelectedSeason());
    };
  }, [dispatch, id, seasonNumber]);

  // Update loading state when season data is available
  useEffect(() => {
    if (Object.keys(season).length > 0) {
      setLoading(false);
    }
  }, [season]);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="season-detail-container">
      <div className="season-header">
        <div 
          className="season-backdrop"
          style={{
            backgroundImage: `url(${season?.backdrop_path ? `https://image.tmdb.org/t/p/original${season.backdrop_path}` : ''})`
          }}
        />
        <div className="backdrop-overlay" />
        <div className="season-header-content">
          <div className="season-poster">
            <img 
              src={season?.poster_path ? `https://image.tmdb.org/t/p/w500${season.poster_path}` : '/placeholder.png'} 
              alt={season?.name}
            />
          </div>
          <div className="season-info">
            <h1>{season?.name}</h1>
            <div className="season-meta">
              <span>
                <i className="fas fa-star"></i>
                {season?.vote_average?.toFixed(1)}
              </span>
              <span>
                <i className="fas fa-calendar"></i>
                {formatDate(season?.air_date)}
              </span>
              <span>
                <i className="fas fa-film"></i>
                {season?.episode_count} Episodes
              </span>
            </div>
            <div className="season-overview">
              <p>{season?.overview || 'No overview available.'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="season-content">
        <div className="tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'episodes' ? 'active' : ''} 
            onClick={() => setActiveTab('episodes')}
          >
            Episodes
          </button>
          <button 
            className={activeTab === 'cast' ? 'active' : ''} 
            onClick={() => setActiveTab('cast')}
          >
            Cast & Crew
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2>Season Overview</h2>
              <p>{season?.overview || 'No overview available.'}</p>
              <div className="additional-info">
                <div className="info-item">
                  <h3>Air Date</h3>
                  <p>{formatDate(season?.air_date)}</p>
                </div>
                <div className="info-item">
                  <h3>Episodes</h3>
                  <p>{season?.episode_count}</p>
                </div>
                <div className="info-item">
                  <h3>Rating</h3>
                  <p>{season?.vote_average?.toFixed(1)} / 10</p>
                </div>
                <div className="info-item">
                  <h3>Vote Count</h3>
                  <p>{season?.vote_count}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'episodes' && (
            <div className="episodes-section">
              <h2>Episodes</h2>
              <div className="episode-list">
                {season?.episodes?.map((episode) => (
                  <div key={episode.id} className="episode-card">
                    <div className="episode-image">
                      <img 
                        src={episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : '/placeholder.png'} 
                        alt={episode.name}
                      />
                    </div>
                    <div className="episode-info">
                      <h3>{episode.episode_number}. {episode.name}</h3>
                      <p className="air-date">Air Date: {formatDate(episode.air_date)}</p>
                      <p className="overview">{episode.overview || 'No overview available.'}</p>
                      <div className="episode-meta">
                        <span>
                          <i className="fas fa-star"></i>
                          {episode.vote_average?.toFixed(1)}
                        </span>
                        <span>
                          <i className="fas fa-users"></i>
                          {episode.vote_count} votes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cast' && (
            <div className="cast-section">
              <div className="cast-list">
                <h2>Cast</h2>
                <div className="cast-grid">
                  {season?.credits?.cast?.slice(0, 10).map((member) => (
                    <div key={member.id} className="cast-member">
                      <img 
                        src={member.profile_path ? `https://image.tmdb.org/t/p/w185${member.profile_path}` : '/placeholder.png'} 
                        alt={member.name}
                      />
                      <h3>{member.name}</h3>
                      <p>{member.character}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="crew-list">
                <h2>Crew</h2>
                <div className="crew-grid">
                  {season?.credits?.crew?.slice(0, 10).map((member) => (
                    <div key={member.id} className="crew-member">
                      <h3>{member.name}</h3>
                      <p>{member.job}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeasonDetail; 