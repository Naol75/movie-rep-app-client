import { useEffect, useState, useContext } from "react";
import { MoonLoader } from "react-spinners";
import { useFilter } from "../context/filters.context";
import HeaderCompDiscover from "../components/HeaderCompDiscover.jsx";
import { Link } from "react-router-dom";
import ScrollButton from "../components/ScrollButton.jsx";
import service from "../services/api";
import clapperboardImage from "../assets/clapperboard.png";
import "../styles/Card.css";
import LikeButton from "../components/LikeButton.jsx";
import { AuthContext } from "../context/auth.context";
import { useFavoritesContext } from "../context/favorites.context";

const DiscoverPage = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const ipstackApiKey = import.meta.env.VITE_IPSTACK_API_KEY;
  const authContext = useContext(AuthContext);
  const { activeUserId } = authContext;
  const apiUrl = `http://api.ipstack.com/check?access_key=${ipstackApiKey}`;
  const { filters, sortBy, sortOrder } = useFilter();
  const [popularMovies, setPopularMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [userRegion, setUserRegion] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const { favoriteMovies, addToFavorites, removeFromFavorites } =
    useFavoritesContext();
  const [isFavorited, setIsFavorited] = useState(false);

  const roundedRating = (rating) => parseFloat(rating).toFixed(2);

  const getDefaultImageUrl = () => clapperboardImage;
  const getImageUrl = (path) =>
    path ? `https://image.tmdb.org/t/p/w300${path}` : getDefaultImageUrl();

  const mapGenreIdsToNames = (genreIds) => {
    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return genreIds.map((genreId) => genreMap[genreId]).join(", ");
  };

  const isMovieFavorited = (movieTitle) =>
    favoriteMovies.includes(movieTitle.toLowerCase());

  const fetchUserLocation = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setUserRegion(data.country_code);
      console.log(userRegion);
    } catch (error) {
      console.error("Error fetching user location by IP:", error);
    }
  };

  const handleAddToFavorites = async (movieTitle) => {
    console.log("Click en Agregar a Favoritos");
    try {
      if (isMovieFavorited(movieTitle)) {
        console.log("Movie title already in favs:", movieTitle);
        await removeFromFavorites(movieTitle);
      } else {
        await addToFavorites(movieTitle);
      }
    } catch (error) {
      console.error("Error al agregar o quitar película de favoritos", error);
    }
  };

  useEffect(() => {
    console.log("Favorite movies:", favoriteMovies);
  }, [favoriteMovies]);

  useEffect(() => {
    console.log("User id:", activeUserId);
  }, []);

  const fetchPopularMoviesOnFiltersChange = async () => {
    try {
      console.log("Current Filters:", filters);
      const response = await service.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${page}&with_genres=${filters.genre}&primary_release_year=${filters.minYear}&sort_by=${sortBy}.${sortOrder}&vote_count.gte=10&watch_region=${userRegion}&with_watch_providers=${filters.streamingProvider}`
      );
      console.log("API Response:", response.data);
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
      const response = await service.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${page}&with_genres=${filters.genre}&primary_release_year=${filters.minYear}&sort_by=${sortBy}.${sortOrder}&vote_count.gte=10&watch_region=${userRegion}&with_watch_providers=${filters.streamingProvider}`
      );
      console.log("API Response:", response.data);
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
      await fetchUserLocation();
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
  }, []);

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
      <div className="grid">
        {popularMovies.map((movie) => (
          <div
            className="card-container"
            key={movie.id}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="card-overlay">
              <div className="overview-in-overlay">
                <p>{movie.overview}</p>
                </div>
                <div className="heart-container">
              </div>
                <LikeButton
                  key={movie.title}
                  className="heart-button"
                  movieTitle={movie.title}
                  onClick={() => handleAddToFavorites(movie.title)}
                  isFavorited={isMovieFavorited(movie.title)}
                />
            </div>
            <Link className="link" to={`/${movie.id}/movie-details`}>
              <img
                src={getImageUrl(movie.poster_path)}
                alt={`${movie.title} Poster`}
                className="poster"
              />
              <div className="info">
                <h3>
                  {movie.title} (
                  {movie.release_date && movie.release_date.substring(0, 4)})
                </h3>
                <p>{mapGenreIdsToNames(movie.genre_ids)}</p>
                <p className="rating">⭐ {roundedRating(movie.vote_average)}</p>
                <p className="vote-count">({movie.vote_count} Votes)</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
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
