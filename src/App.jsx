import { Routes, Route } from "react-router-dom";
import HeaderComp from "./components/HeaderComp";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import NotFoundPage from "./pages/NotFoundPage";
import NavbarComp from "./components/NavbarComp";
import AccountPage from "./pages/AccountPage";
import PopularMoviesPage from './pages/PopularMoviesPage';
import NowPlayingMoviesPage from "./pages/NowPlayingMoviesPage";
import NewReleasesMoviesPage from "./pages/NewReleasesMoviesPage";
import TopRatedMovies from "./pages/TopRatedMovies";
import PopularSeriesPage from "./pages/PopularSeriesPage";
import AiringTodaySeriesPage from "./pages/AiringTodaySeriesPage";
import OnTvSeriesPage from "./pages/OnTvSeriesPage";
import TopRatedSeriesPage from "./pages/TopRatedSeriesPage";
import { useState } from "react";
import { FilterProvider } from './context/filters.context';

const mapGenreIdsToNames = (genreIds) => {
  const genreMap = {
    28: "Action",
    10759: "Action & Adventure",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10749: "Romance",
    10765: "Sci-Fi & Fantasy",
    878: "Science Fiction",
    10766: "Soap",
    10767: "Talk",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    10768: "War & Politics",
    37: "Western",
  };
  return genreIds.map((genreId) => genreMap[genreId]).join(", ");
};


function App() {

  
  return (
    <>

        <NavbarComp/>
        <FilterProvider>
        <HeaderComp />
          <Routes>
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/account' element={<AccountPage/>}/>
            <Route path='/' element={<PopularMoviesPage />}/>
            <Route path='/movies/popular' element={<PopularMoviesPage/>}/>
            <Route path='/movies/now-playing' element={<NowPlayingMoviesPage />}/>
            <Route path='/movies/new-releases' element={<NewReleasesMoviesPage />}/>
            <Route path='/movies/top-rated' element={<TopRatedMovies />}/>
            <Route path='/:movieId/movie-details' element={<h1>Movie details</h1>}/>
            <Route path='/series/popular' element={<PopularSeriesPage />}/>
            <Route path='/series/airing-today' element={<AiringTodaySeriesPage />}/>
            <Route path='/series/on-tv' element={<OnTvSeriesPage />}/>
            <Route path='/series/top-rated' element={<TopRatedSeriesPage />}/>
            <Route path='/:tvshowId/tv-show-details' element={<h1>TV Show details</h1>}/>
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </FilterProvider>
    </>
  )
}

export default App