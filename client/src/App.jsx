import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./components/home/home.jsx";
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import PageNotFound from "./components/pagenotfound/pagenotfound.jsx";
import MovieDetail from "./components/moviedetail/moviedetail.jsx";
import "./App.scss";
import ShowDetail from "./components/showdetail/showdetail.jsx";
import SeasonDetail from "./components/seasondetail/seasondetail.jsx";
import Trending from "./components/trending/trending.jsx";
import ActorDetail from "./components/actordetail/actordetail.jsx";

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Trending />} />
            <Route
              path="/show/:id/season/:seasonNumber"
              element={<SeasonDetail />}
            />
            <Route path="/movie/:imdbID" element={<MovieDetail />} />
            <Route path="/show/:imdbID" element={<ShowDetail />} />
            <Route path="/tv/:imdbID" element={<ShowDetail />} />
            <Route path="/actor/:id" element={<ActorDetail />} />
            <Route element={<PageNotFound />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
