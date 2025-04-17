import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Home from "./components/home/home.jsx";
import Header from "./components/header/header.jsx";
import Footer from "./components/footer/footer.jsx";
import PageNotFound from "./components/pagenotfound/pagenotfound.jsx";
import MovieDetail from "./components/moviedetail/moviedetail.jsx";
import "./App.scss";
import ShowDetail from "./components/showdetail/showdetail.jsx";
import SeasonDetail from "./seasondetail/SeasonDetail.jsx";

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/show/:imdbID/season/:seasonId"
              element={<SeasonDetail />}
            />
            <Route path="/movie/:imdbID" element={<MovieDetail />} />
            <Route path="/show/:imdbID" element={<ShowDetail />} />
            <Route element={<PageNotFound />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
