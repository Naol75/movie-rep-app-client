import { Routes, Route } from "react-router-dom";
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
import MovieDetails from "./pages/MovieDetails";
import PopularSeriesPage from "./pages/PopularSeriesPage";
import AiringTodaySeriesPage from "./pages/AiringTodaySeriesPage";
import OnTvSeriesPage from "./pages/OnTvSeriesPage";
import TopRatedSeriesPage from "./pages/TopRatedSeriesPage";
import TvShowDetails from "./pages/TvShowDetails"
import Details from "./pages/Details"
import DiscoverPage from "./pages/DiscoverPage";
import FavouritesPage from "./pages/FavouritesPage";
import IsPrivate from "./components/isPrivate";
import { FilterProvider } from './context/filters.context';
import './index.css'



function App() {
  return (
    <>

        <NavbarComp/>
        <FilterProvider>
          <Routes>
            <Route path='/register' 
            element={

              <RegisterPage/> 
 
          }/>
            <Route path='/login'
             element={

              <LoginPage/>
             }/>
            <Route path='/account' element={<IsPrivate><AccountPage/></IsPrivate>}/>
            <Route path='/' element={<PopularMoviesPage />}/>
            <Route path='/movies/popular' element={<PopularMoviesPage/>}/>
            <Route path='/movies/now-playing' element={<NowPlayingMoviesPage />}/>
            <Route path='/movies/new-releases' element={<NewReleasesMoviesPage />}/>
            <Route path='/movies/top-rated' element={<TopRatedMovies />}/>
            <Route path='/:movieId/movie-details' element={<MovieDetails/>}/>
            <Route path='/series/popular' element={<PopularSeriesPage />}/>
            <Route path='/series/airing-today' element={<AiringTodaySeriesPage />}/>
            <Route path='/series/on-tv' element={<OnTvSeriesPage />}/>
            <Route path='/series/top-rated' element={<TopRatedSeriesPage />}/>
            <Route path='/:tvshowId/tv-show-details' element={<TvShowDetails />}/>
            <Route path="/discover" element={<DiscoverPage/>}/>
            <Route path="/my-favourites" element={<FavouritesPage/>}/>
            <Route path='/:itemId/details' element={<Details/>}/>
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </FilterProvider>
    </>
  )
}

export default App