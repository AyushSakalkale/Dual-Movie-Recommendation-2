import React, {useState, useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import user from "../../../images/user.png";
import "./header.scss";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchAsyncMovies,
  fetchAsyncShows,
  fetchAsyncRecommendations,
  fetchAsyncTrending,
} from "../../features/movies/movieSlice";
import movieapi from "../../common/apis/movieapi.js";

const Header = () => {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("all"); // "all", "movie", "tv"
  const [error, setError] = useState("");
  const searchTimeout = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {loading} = useSelector((state) => state.movies);

  // Debounced search for suggestions
  useEffect(() => {
    if (term.length < 2) {
      setSuggestions([]);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        setError("");
        
        const searchPromises = [];
        if (searchType === "all" || searchType === "movie") {
          searchPromises.push(
            movieapi.get(`search/movie?api_key=041afab09a0c3f7eef21c8fc4a9ce1a3&query=${encodeURIComponent(term)}`)
          );
        }
        if (searchType === "all" || searchType === "tv") {
          searchPromises.push(
            movieapi.get(`search/tv?api_key=041afab09a0c3f7eef21c8fc4a9ce1a3&query=${encodeURIComponent(term)}`)
          );
        }

        const results = await Promise.all(searchPromises);
        const combinedSuggestions = results.flatMap(response => 
          response.data.results.map(item => ({
            id: item.id,
            title: item.title || item.name,
            type: item.title ? "movie" : "tv",
            poster: item.poster_path,
            year: (item.release_date || item.first_air_date || "").split("-")[0]
          }))
        );

        setSuggestions(combinedSuggestions.slice(0, 10));
      } catch (err) {
        setError("Failed to fetch suggestions. Please try again.");
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [term, searchType]);

  useEffect(() => {
    dispatch(fetchAsyncTrending());
  }, [dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (term.trim() === "") return;
    dispatch(fetchAsyncMovies(term));
    dispatch(fetchAsyncShows(term));
    navigate("/");
  };

  const handleSuggestionClick = (suggestion) => {
    setTerm(suggestion.title);
    setSuggestions([]);
  };

  return (
    <div className="header">
      <div className="logo">
        {" "}
        <Link to="/">Movie App </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/trending" className="nav-link">Trending</Link>
      </div>
      <div className="search-bar">
        <form onSubmit={submitHandler}>
          <div className="search-input-container">
            <input
              type="text"
              value={term}
              placeholder="Search For Movies Or Shows"
              onChange={(e) => setTerm(e.target.value)}
            />
            <div className="search-type-selector">
              <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </div>
          {isLoading && <div className="search-loading">Loading...</div>}
          {error && <div className="search-error">{error}</div>}
          {suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map((suggestion) => (
                <div
                  key={`${suggestion.type}-${suggestion.id}`}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.poster && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${suggestion.poster}`}
                      alt={suggestion.title}
                    />
                  )}
                  <div className="suggestion-info">
                    <span className="suggestion-title">{suggestion.title}</span>
                    <span className="suggestion-year">{suggestion.year}</span>
                    <span className="suggestion-type">{suggestion.type}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
      <div className="user-image">
        <img src={user} alt="user" />
      </div>
    </div>
  );
};

export default Header;
