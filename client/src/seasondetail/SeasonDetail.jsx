import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./seasonDetail.scss";
import axios from "axios";

const SeasonDetail = () => {
  const {imdbID, seasonId} = useParams(); // Destructure both imdbID and seasonId in one line
  const [seasonData, setSeasonData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `/tv/${imdbID}?api_key=041afab09a0c3f7eef21c8fc4a9ce1a3/season/${seasonId}`
      )
      .then((response) => setSeasonData(response.data))
      .catch((error) => console.error("Error fetching season details:", error));
  }, [imdbID, seasonId]); // Dependency array should include imdbID and seasonId

  if (!seasonData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="season-detail glass-effect">
      <h1>{seasonData.name}</h1>
      <p>Air Date: {seasonData.air_date}</p>
      <h2>Episodes</h2>
      <ul>
        {seasonData.episodes.map((episode) => (
          <li key={episode.id}>
            <h3>{episode.name}</h3>
            <p>{episode.overview || "No description available."}</p>
            <p>Air Date: {episode.air_date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeasonDetail;
