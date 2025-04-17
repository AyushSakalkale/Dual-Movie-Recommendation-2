import {configureStore} from "@reduxjs/toolkit";
import moviesReducer from "./movies/movieSlice.jsx";
export const store = configureStore({
  reducer: {
    movies: moviesReducer,
  },
});
