import { useEffect, useState, useContext } from "react";
import { MoonLoader } from "react-spinners";
import { useFilter } from "../context/filters.context";
import HeaderCompDiscover from "../components/HeaderCompDiscover.jsx";
import ScrollButton from "../components/ScrollButton.jsx";
import service from "../services/api";
import "../styles/Card.css";
import { AuthContext } from "../context/auth.context";
import { useFavoritesContext } from "../context/favorites.context";
import Card from "../components/Card.jsx";

const DiscoverPage = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const authContext = useContext(AuthContext);
  const { activeUserId, ip, userRegion } = authContext;
  const { filters, sortBy, sortOrder } = useFilter();
  const [popularMovies, setPopularMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showMovieInfo, setShowMovieInfo] = useState(window.innerWidth > 450);
  const { addToFavorites, removeFromFavorites } =
    useFavoritesContext();



  useEffect(() => {
    console.log("User id:", activeUserId);
    console.log("User region:", userRegion)
    console.log("User IP:", ip);
  }, []);

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    const newShowMovieInfo = screenWidth > 450;
    setShowMovieInfo(newShowMovieInfo);
  };
  useEffect(() => {

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  
  const fetchPopularMoviesOnFiltersChange = async () => {
    try {
      console.log("Current Filters:", filters);
      console.log("User region:", userRegion)
      let response;
      if (userRegion !== "ES") {
        response = await service.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${page}&with_genres=${filters.genre}&primary_release_year=${filters.minYear}&sort_by=${sortBy}.${sortOrder}&vote_count.gte=10&watch_region=${userRegion}&with_watch_providers=${filters.streamingProvider}`
        );
      } else {
        response = await service.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&page=${page}&with_genres=${filters.genre}&primary_release_year=${filters.minYear}&sort_by=${sortBy}.${sortOrder}&vote_count.gte=10&watch_region=${userRegion}&with_watch_providers=${filters.streamingProvider}`
        );
      }
      setPopularMovies((prevMovies) => {
        const uniqueMovies = response.data.results.filter(
          (newMovie) =>
            !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
        );

        return [...prevMovies, ...uniqueMovies];
      });
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setIsPageLoading(false);
    }
  };
  const fetchPopularMoviesOnScroll = async () => {
    try {
      setIsPageLoading(true);
      console.log("Current Filters:", filters);
      let response;
      if (userRegion !== "ES") {
        response = await service.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${page}&with_genres=${filters.genre}&primary_release_year=${filters.minYear}&sort_by=${sortBy}.${sortOrder}&vote_count.gte=10&watch_region=${userRegion}&with_watch_providers=${filters.streamingProvider}`
        );
      } else {
        response = await service.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=es-ES&page=${page}&with_genres=${filters.genre}&primary_release_year=${filters.minYear}&sort_by=${sortBy}.${sortOrder}&vote_count.gte=10&watch_region=${userRegion}&with_watch_providers=${filters.streamingProvider}`
        );
      }
      setPopularMovies((prevMovies) => {
        const uniqueMovies = response.data.results.filter(
          (newMovie) =>
            !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
        );

        return [...prevMovies, ...uniqueMovies];
      });
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setIsPageLoading(false);
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleInitialFetch = async () => {
    try {
      await fetchPopularMoviesOnFiltersChange();
    } catch (error) {
      console.error("Error fetching user location by IP:", error);
    }
  };


  const handleScroll = () => {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    setIsSticky(scrollTop > 0);

    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 750 && !isPageLoading) {
      fetchPopularMoviesOnScroll();
    }
  };

  useEffect(() => {
    handleInitialFetch();
  }, [userRegion]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, isPageLoading]);

  useEffect(() => {
    const fetchData = async () => {
      setIsPageLoading(true);
      setPage(1);
      setPopularMovies([]);
      window.scrollTo(0, 0);

      try {
        await fetchPopularMoviesOnFiltersChange();
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchData();
  }, [filters, sortBy, sortOrder]);

  return (
    <div>
      <div className={`discover-header ${isSticky ? "sticky-header" : ""}`}>
        <HeaderCompDiscover />
      </div>
      <Card
      items={popularMovies}
      addToFavorites={addToFavorites}
      removeFromFavorites={removeFromFavorites}
      showMovieInfo={showMovieInfo}
      />
      {isPageLoading && (
        <div
          className="loader-container"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <MoonLoader color="red" size={50} loading={true} />
        </div>
      )}
      <ScrollButton />
    </div>
  );
};

export default DiscoverPage;
