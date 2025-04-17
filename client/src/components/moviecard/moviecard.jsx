import React from "react";
import {Link} from "react-router-dom";
import "./moviecard.scss";
const MovieCard = (props) => {
  const {data} = props;
  const movie_id = data.id;
  return (
    <div className="card-item">
      <Link to={`/movie/${movie_id}`}>
        <div className="card-inner">
          <div className="card-top">
            <img
              src={`http://image.tmdb.org/t/p/w500${data.poster_path}`}
              alt={data.title}
            />
          </div>
          <div className="card-bottom">
            <div className="card-info">
              <h4>{data.title}</h4>
              <p>{data.release_date}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
