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
import PopularSeriesPage from "./pages/PopularSeriesPage";
import AiringTodaySeriesPage from "./pages/AiringTodaySeriesPage";
import OnTvSeriesPage from "./pages/OnTvSeriesPage";
import TopRatedSeriesPage from "./pages/TopRatedSeriesPage";
import DiscoverPage from "./pages/DiscoverPage"
import { FilterProvider } from './context/filters.context';



function App() {

  
  return (
    <>

        <NavbarComp/>
        <FilterProvider>
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
            <Route path="/discover" element={<DiscoverPage/>}/>
            <Route path="/error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </FilterProvider>
    </>
  )
}

export default App