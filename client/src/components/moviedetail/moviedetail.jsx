import React, {useEffect, useState} from "react";
import "./moviedetail.scss";
import {useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {
  fetchAsyncMovieDetail,
  getSelectedMovieOrShow,
  removeSelectedMovieOrShow,
} from "../../features/movies/movieSlice";

const MovieDetail = () => {
  const {imdbID} = useParams();
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow);
  console.log("data in details " + data);
  const [director, setDirector] = useState([]);

  useEffect(() => {
    const fetchDirector = async () => {
      console.log("Fetching director for movie:", data);
      const directorData = data.credits.crew.filter(
        ({job}) => job === "Director"
      );
      setDirector(directorData);
    };

    fetchDirector();
  }, [data]);
  useEffect(() => {
    dispatch(fetchAsyncMovieDetail(imdbID));
    return () => {
      dispatch(removeSelectedMovieOrShow());
    };
  }, [dispatch, imdbID]);

  return (
    <div className="movie-section">
      {Object.keys(data).length === 0 ? (
        <div>...Loading</div>
      ) : (
        <>
          <div className="section-left">
            <div className="movie-title">{data.original_title}</div>
            <div className="movie-rating">
              <span>
                IMDB Rating <i className="fa fa-star"></i> : {data.imdb_id}
              </span>
              <span>
                IMDB Votes <i className="fa fa-thumbs-up"></i> :{" "}
                {data.vote_count}
              </span>
              <span>
                Runtime <i className="fa fa-film"></i> : {data.runtime}
              </span>
              <span>
                Year <i className="fa fa-calendar"></i> : {data.release_date}
              </span>
            </div>
            <div className="movie-plot">{data.overview}</div>
            <div className="movie-info">
              <div>
                <span>Director: </span>
                {director.length > 0 ? (
                  <span>{director.map((d) => d.name).join(", ")}</span>
                ) : (
                  <span>No director found</span>
                )}
              </div>
              <div>
                <span>Stars</span>
                <span>{data.Actors}</span>
              </div>
              <div>
                <span>Generes</span>
                <span>{data.Genre}</span>
              </div>
              <div>
                <span>Languages</span>
                <span>{data.Language}</span>
              </div>
              <div>
                <span>Awards</span>
                <span>{data.Awards}</span>
              </div>
            </div>
          </div>
          <div className="section-right">
            <img
              src={`http://image.tmdb.org/t/p/w500${data.poster_path}`}
              alt={data.title}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetail;
