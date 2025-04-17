import React from "react";
import {Link} from "react-router-dom";
import "./showcard.scss";
const ShowCard = (props) => {
  const {data} = props;
  return (
    <div className="card-item">
      <Link to={`/show/${data.id}`}>
        <div className="card-inner">
          <div className="card-top">
            <img
              src={`http://image.tmdb.org/t/p/w500${data.poster_path}`}
              alt={data.original_title}
            />
          </div>
          <div className="card-bottom">
            <div className="card-info">
              <h4>{data.original_name}</h4>
              <p>{data.release_date}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ShowCard;
