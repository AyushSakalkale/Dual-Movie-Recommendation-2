import React, {useEffect} from "react";
import MovieListing from "../movielisting/movielisting.jsx";
import {useDispatch} from "react-redux";
import {
  fetchAsyncMovies,
  fetchAsyncShows,
  fetchAsyncRecommendations,
} from "../../features/movies/movieSlice.jsx";

const Home = () => {
  const movieText = "Harry"; // Example movie to fetch
  const showText = "FRIENDS";

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAsyncMovies(movieText));
    dispatch(fetchAsyncShows(showText));
    dispatch(fetchAsyncRecommendations(movieText)); // Fetch recommendations based on movieText
  }, []);

  return (
    <div>
      <div className="banner-img">
        <MovieListing />
      </div>
    </div>
  );
};

export default Home;
