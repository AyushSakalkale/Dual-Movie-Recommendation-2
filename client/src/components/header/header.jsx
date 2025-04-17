import React, {useState} from "react";
import {Link} from "react-router-dom";
import user from "../../../images/user.png";
import "./header.scss";
import {useDispatch} from "react-redux";
import {
  fetchAsyncMovies,
  fetchAsyncShows,
  fetchAsyncRecommendations,
} from "../../features/movies/movieSlice";

const Header = () => {
  const [term, setTerm] = useState("");
  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    console.log(term);
    if (term === "") return alert("PLEASE ENTER SEARCH TERM");
    dispatch(fetchAsyncMovies(term));
    dispatch(fetchAsyncShows(term));
    dispatch(fetchAsyncRecommendations(term));
    setTerm("");
  };
  return (
    <div className="header">
      <div className="logo">
        {" "}
        <Link to="/">Movie App </Link>
      </div>
      <div className="search-bar">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            value={term}
            placeholder="Search For Movies Or Shows"
            onChange={(e) => setTerm(e.target.value)}
          />
          <button>
            <i className="fa fa-search"></i>
          </button>
        </form>
      </div>
      <div className="user-image">
        <img src={user} alt="user" />
      </div>
    </div>
  );
};

export default Header;
