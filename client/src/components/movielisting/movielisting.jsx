import React from "react";
import Slider from "react-slick";
import {Settings} from "../../common/settings.js";
import {useSelector} from "react-redux";
import {
  getAllMovies,
  getAllShows,
  getRecommendations,
} from "../../features/movies/movieSlice.jsx";
import MovieCard from "../moviecard/moviecard.jsx";
import ShowCard from "../showcard/showcard.jsx";
import "./movielisting.scss";
import MovieCardRecommended from "../moviecard/moviecard_recommended.jsx";

function MovieListing() {
  const movies = useSelector(getAllMovies);
  console.log("Movies:", movies); // Log the movies data
  const shows = useSelector(getAllShows);
  console.log("Shows:", shows); // Log the shows data
  const recommendations = useSelector(getRecommendations);
  const renderMovies =
    movies.results && movies.results.length > 0 ? (
      movies.results.map((movie, index) => (
        <MovieCard key={index} data={movie} />
      ))
    ) : (
      <div className="movies-error">
        <h3>{movies.Error ? movies.Error : "No movies found"}</h3>
      </div>
    );

  const renderShows =
    shows.results && shows.results.length > 0 ? (
      shows.results.map((show, index) => <ShowCard key={index} data={show} />)
    ) : (
      <div className="shows-error">
        <h3>{shows.Error ? shows.Error : "No shows found"}</h3>
      </div>
    );

  console.log("Recommendations:", recommendations); // Log the recommendations data
  const renderRecommendations =
    recommendations.length > 0 ? (
      recommendations.map((movie, index) => (
        <MovieCardRecommended key={index} data={movie} />
      ))
    ) : (
      <div className="recommendations-error">
        <h3>No recommendations available</h3>
      </div>
    );

  return (
    <div className="movie-wrapper">
      <div className="movie-list">
        <h2>Movies</h2>
        <div className="movie-container">
          <Slider {...Settings}>{renderMovies}</Slider>
        </div>
      </div>
      <div className="show-list">
        <h2>Shows</h2>
        <div className="movie-container">
          <Slider {...Settings}>{renderShows}</Slider>
        </div>
      </div>
      <div className="recommendation-list">
        <h2>Recommended Movies</h2>
        <div className="movie-container">
          <Slider {...Settings}>{renderRecommendations}</Slider>
        </div>
      </div>
    </div>
  );
}

export default MovieListing;
