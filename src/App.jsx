import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import PopularMoviesPage from './pages/PopularMoviesPage';
import PopularSeriesPage from "./pages/PopularSeriesPage";
import { useEffect, useState } from "react";
import axios from "axios";



function App() {

  const [allMovies, setAllMovies] = useState([]);
  const [allTvShows, setAllTvShows] = useState([]);
  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get()
    }
  })
  
  return (
    <>
        <Navbar />
      <Routes>
        <Route path='/' element={<PopularMoviesPage />}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/movies' element={<PopularMoviesPage />}/>
        <Route path='/:movieId/movie-details' element={<h1>Movie details</h1>}/>
        <Route path='/:movieId/edit' element={<h1>Edit movie</h1>}/>
        <Route path='/add-movie' element={<h1>Add new movie</h1>}/>
        <Route path='/tvshows' element={<PopularSeriesPage />}/>
        <Route path='/:tvshowId/tv-show-details' element={<h1>TV Show details</h1>}/>
        <Route path='/:tvshowId/edit' element={<h1>Edit TV Show</h1>}/>
        <Route path='/add-tvshow' element={<h1>Add new TV Show</h1>}/>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </>
  )
}

export default App