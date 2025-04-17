import React from "react";
import {Link} from "react-router-dom";
import "./moviecard.scss";

const MovieCardRecommended = (props) => {
  const {data} = props;
  const movie_id = data.imdbID;
  return (
    <div className="card-item">
      {/* <Link to={`/movie/${movie_id}`}> */}
      <div className="card-inner">
        <div className="card-top">
          <img src={data.Poster} alt={data.Title} />
        </div>
        <div className="card-bottom">
          <div className="card-info">
            <h4>{data.Title}</h4>
            <p>{data.Year}</p>
          </div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};

export default MovieCardRecommended;
