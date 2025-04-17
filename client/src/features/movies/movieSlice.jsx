import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
("../movielisting/movielisting.jsx");
import movieapi from "../../common/apis/movieapi.js";
import {APIKEY} from "../../common/apis/movieapikey.js";

export const fetchAsyncMovies = createAsyncThunk(
  "movies/fetchAsyncMovies",
  async (term, {rejectWithValue}) => {
    try {
      // Encode the search term to make it URL-safe
      const formattedTerm = encodeURIComponent(term.trim());

      // Make the API request
      const response = await movieapi.get(
        `search/movie?api_key=041afab09a0c3f7eef21c8fc4a9ce1a3&query=${formattedTerm}`
      );

      // Validate and return the response
      if (response && response.data) {
        return response.data;
      } else {
        return rejectWithValue("No data found for the search term.");
      }
    } catch (err) {
      console.error("Error fetching movies:", err.message);
      return rejectWithValue("Failed to fetch movies. Please try again.");
    }
  }
);

export const fetchAsyncShows = createAsyncThunk(
  "movies/fetchAsyncShows",
  async (term, {rejectWithValue}) => {
    try {
      // Encode the search term to make it URL-safe
      const formattedTerm = encodeURIComponent(term.trim());

      // Make the API request
      const response = await movieapi.get(
        `search/tv?api_key=041afab09a0c3f7eef21c8fc4a9ce1a3&query=${formattedTerm}`
      );

      // Validate and return the response
      if (response && response.data) {
        return response.data;
      } else {
        return rejectWithValue("No data found for the search term.");
      }
    } catch (err) {
      console.error("Error fetching shows:", err.message);
      return rejectWithValue("Failed to fetch shows. Please try again.");
    }
  }
);

export const fetchAsyncShowDetail = createAsyncThunk(
  "movies/fetchAsyncShowDetail",
  async (id) => {
    try {
      const response = await movieapi.get(
        `tv/${id}?api_key=041afab09a0c3f7eef21c8fc4a9ce1a3&append_to_response=external_ids,credits`
      );
      return response.data; // Return the data from the API response
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error; // Throw error to be caught in the reducer if needed
    }
  }
);

export const fetchAsyncMovieDetail = createAsyncThunk(
  "movies/fetchAsyncMovieDetail",
  async (id) => {
    try {
      // Make the API call with Axios (movieapi.get)
      const response = await movieapi.get(
        `movie/${id}?api_key=041afab09a0c3f7eef21c8fc4a9ce1a3&append_to_response=external_ids,credits`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    }
  }
);

const initialState = {
  movies: {},
  shows: {},
  selectMovieOrShow: {},
  recommendations: {},
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    // addMovies: (state, {payload}) => {
    //   state.movies = payload;
    // },==>part of asyncmovies
    removeSelectedMovieOrShow: (state) => {
      state.selectMovieOrShow = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAsyncMovies.pending, (state) => {
        console.log("Pending");
      })
      .addCase(fetchAsyncMovies.fulfilled, (state, {payload}) => {
        console.log("Fetched Successfully");
        return {...state, movies: payload};
      })
      .addCase(fetchAsyncMovies.rejected, () => {
        console.log("Rejected");
      })

      .addCase(fetchAsyncShows.fulfilled, (state, {payload}) => {
        console.log("Fetched Successfully");
        return {...state, shows: payload};
      })
      .addCase(fetchAsyncShowDetail.fulfilled, (state, {payload}) => {
        console.log("Fetched Successfully");
        return {...state, selectMovieOrShow: payload};
      })
      .addCase(fetchAsyncMovieDetail.fulfilled, (state, {payload}) => {
        console.log("Fetched Successfully");
        return {...state, selectMovieOrShow: payload};
      })
      .addCase(fetchAsyncRecommendations.fulfilled, (state, {payload}) => {
        console.log("Recommendations fetched successfully");
        console.log(payload.recommendations);
        return {...state, recommendations: payload.recommendations};
      });
  },
});

export const fetchAsyncRecommendations = createAsyncThunk(
  "movies/fetchAsyncRecommendations",
  async (title) => {
    const response = await fetch("http://localhost:5001/recommend", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({title}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Recommendations response:", data); // Log the response to verify
    return data;
  }
);

export const {removeSelectedMovieOrShow} = movieSlice.actions;
export const getAllMovies = (state) => state.movies.movies;
export const getAllShows = (state) => state.movies.shows;
export const getSelectedMovieOrShow = (state) => state.movies.selectMovieOrShow;
export const getRecommendations = (state) => state.movies.recommendations;
export default movieSlice.reducer;
