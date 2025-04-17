// import React, {useEffect} from "react";
// import "./showdetail.scss";
// import {useParams} from "react-router";
// import {useDispatch, useSelector} from "react-redux";
// import {
//   fetchAsyncShowDetail,
//   getSelectedMovieOrShow,
//   removeSelectedMovieOrShow,
// } from "../../features/movies/movieSlice";

// const ShowDetail = () => {
//   const {imdbID} = useParams();
//   const dispatch = useDispatch();
//   const data = useSelector(getSelectedMovieOrShow);
//   console.log(data);

//   useEffect(() => {
//     dispatch(fetchAsyncShowDetail(imdbID));
//     return () => {
//       dispatch(removeSelectedMovieOrShow());
//     };
//   }, [dispatch, imdbID]);

//   return (
//     <div className="movie-section">
//       {Object.keys(data).length === 0 ? (
//         <div>...Loading</div>
//       ) : (
//         <>
//           <div className="section-left">
//             <div className="movie-title">{data.original_name}</div>
//             <div className="movie-rating">
//               <span>
//                 IMDB Rating <i className="fa fa-star"></i> :{" "}
//                 {data.external_ids.imdb_id}
//               </span>
//               <span>
//                 IMDB Votes <i className="fa fa-thumbs-up"></i> :{" "}
//                 {data.vote_average}
//               </span>
//               <span>
//                 Runtime <i className="fa fa-film"></i> : {data.runtime}
//               </span>
//               <span>
//                 Year <i className="fa fa-calendar"></i> : {data.first_air_date}
//               </span>
//             </div>
//             <div className="movie-plot">{data.overview}</div>
//             <div className="movie-info">
//               <div>
//                 <span>Director</span>
//                 <span>{data.created_by[0].name}</span>
//               </div>
//               <div>
//                 <span>Stars</span>
//                 <span>{data.Actors}</span>
//               </div>
//               <div>
//                 <span>Generes</span>
//                 <span>{data.genre[0].name}</span>
//               </div>
//               <div>
//                 <span>Languages</span>
//                 <span>{data.languages[0]}</span>
//               </div>
//             </div>
//           </div>
//           <div className="section-right">
//             <img src={data.backdrop_path} alt={data.original_name} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default ShowDetail;

// import React, {useEffect, useState} from "react";
// import "./showdetail.scss";
// import {useParams} from "react-router";
// import {useDispatch, useSelector} from "react-redux";
// import {
//   fetchAsyncShowDetail,
//   getSelectedMovieOrShow,
//   removeSelectedMovieOrShow,
// } from "../../features/movies/movieSlice";

// const ShowDetail = () => {
//   const {imdbID} = useParams();
//   const dispatch = useDispatch();
//   const data = useSelector(getSelectedMovieOrShow);
//   const [selectedSeason, setSelectedSeason] = useState(null);

//   useEffect(() => {
//     dispatch(fetchAsyncShowDetail(imdbID));
//     return () => {
//       dispatch(removeSelectedMovieOrShow());
//     };
//   }, [dispatch, imdbID]);

//   const handleSeasonClick = (season) => {
//     setSelectedSeason(season);
//   };

//   if (Object.keys(data).length === 0) {
//     return <div>...Loading</div>;
//   }

//   return (
//     <div className="movie-section">
//       <div className="section-left glass-effect">
//         <h1 className="movie-title">{data.name}</h1>
//         <div className="movie-rating">
//           <span>
//             <i className="fa fa-star"></i> IMDB ID: {data.external_ids.imdb_id}
//           </span>
//           <span>
//             <i className="fa fa-thumbs-up"></i> Rating: {data.vote_average}
//           </span>
//           <span>
//             <i className="fa fa-calendar"></i> Year: {data.first_air_date}
//           </span>
//         </div>
//         <div className="movie-plot">{data.overview}</div>
//         <div className="movie-info">
//           <div>
//             <span>Director:</span>{" "}
//             <span>{data.created_by[0]?.name || "N/A"}</span>
//           </div>
//           <div>
//             <span>Genres:</span>{" "}
//             <span>{data.genres.map((genre) => genre.name).join(", ")}</span>
//           </div>
//           <div>
//             <span>Languages:</span> <span>{data.languages.join(", ")}</span>
//           </div>
//         </div>
//         <div className="seasons">
//           <h2>Seasons</h2>
//           <div className="season-list">
//             {data.seasons.map((season) => (
//               <div
//                 key={season.id}
//                 className="season-card glass-effect"
//                 onClick={() => handleSeasonClick(season)}
//               >
//                 <img
//                   src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
//                   alt={season.name}
//                   className="season-poster"
//                 />
//                 <h3>{season.name}</h3>
//                 <p>Episodes: {season.episode_count}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="section-right">
//         <img
//           src={`https://image.tmdb.org/t/p/w500${data.backdrop_path}`}
//           alt={data.name}
//         />
//       </div>

//       {selectedSeason && (
//         <div className="season-details glass-effect">
//           <h2>{selectedSeason.name}</h2>
//           <p>Air Date: {selectedSeason.air_date || "N/A"}</p>
//           <p>Episodes: {selectedSeason.episode_count}</p>
//           <ul>
//             {Array.from({length: selectedSeason.episode_count}, (_, i) => (
//               <li key={i}>Episode {i + 1}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShowDetail;

import React, {useEffect} from "react";
import "./showdetail.scss";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {
  fetchAsyncShowDetail,
  getSelectedMovieOrShow,
  removeSelectedMovieOrShow,
} from "../../features/movies/movieSlice";

const ShowDetail = () => {
  const dispatch = useDispatch();
  const data = useSelector(getSelectedMovieOrShow);
  console.log(data);
  const navigate = useNavigate();
  const {imdbID} = useParams();
  useEffect(() => {
    dispatch(fetchAsyncShowDetail(imdbID));
    return () => {
      dispatch(removeSelectedMovieOrShow());
    };
  }, [dispatch, imdbID]);

  if (Object.keys(data).length === 0) {
    return <div>Loading...</div>;
  }
  console.log("this is imdb id" + imdbID);
  const handleSeasonClick = (imdbID, seasonId) => {
    navigate(`/show/${imdbID}/season/${seasonId}`);
  };

  return (
    <div className="movie-section">
      <div className="section-left glass-effect">
        <h1>{data.name}</h1>
        <p>{data.overview}</p>
        <div className="seasons">
          <h2>Seasons</h2>
          <div className="season-list">
            {data.seasons.map((season) => (
              <div
                key={season.id}
                className="season-card glass-effect"
                onClick={() => handleSeasonClick(imdbID, season.id)}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                  alt={season.name}
                />
                <h3>{season.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowDetail;
