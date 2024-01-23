import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";
import clapperboardImage from "../assets/clapperboard.png";
import { isAfter, subMonths } from "date-fns";
import { Link } from "react-router-dom";
import ScrollButton from "../components/ScrollButton.jsx";
import "../styles/Card.css";

function NewReleasesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [popularMovies, setPopularMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [renderedMovies, setRenderedMovies] = useState(new Set());

  const roundedRating = (rating) => parseFloat(rating).toFixed(2);

  const getDefaultImageUrl = () => {
    return clapperboardImage;
  };

  const getImageUrl = (path) => {
    const baseUrl = "https://image.tmdb.org/t/p/w300";
    return path ? `${baseUrl}${path}` : getDefaultImageUrl();
  };

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

  const fetchPopularMovies = async () => {
    try {
      setIsPageLoading(true);
      const response = await service.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}`
      );
      console.log("API Response:", response.data);

      const currentDate = new Date();
      const threeMonthsAgo = subMonths(currentDate, 3);

      const newMovies = response.data.results
        .filter((movie) => !renderedMovies.has(movie.id))
        .filter((movie) =>
          isAfter(new Date(movie.release_date), threeMonthsAgo)
        );

      setPopularMovies((prevMovies) => [...prevMovies, ...newMovies]);

      const newRenderedMovieIds = new Set([
        ...renderedMovies,
        ...newMovies.map((movie) => movie.id),
      ]);
      setRenderedMovies(newRenderedMovieIds);

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current page:", page);

    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 800 && !isPageLoading) {
        fetchPopularMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, isPageLoading]);

  // Initial fetch
  useEffect(() => {
    fetchPopularMovies();
  }, []);

  return (
    <div>
      <div className="grid">
        {popularMovies &&
          popularMovies.map((movie) => (
            <Link
              className="link"
              to={`/${movie.id}/movie-details`}
              key={movie.id}
            >
              <div className="card-container">
                <img
                  src={getImageUrl(movie.poster_path)}
                  alt={`${movie.title} Poster`}
                  className="poster"
                />
                <div className="info">
                  <h3>{movie.title}</h3>
                  <p>{mapGenreIdsToNames(movie.genre_ids)}</p>
                  <p className="rating">
                    ⭐ {roundedRating(movie.vote_average)}
                  </p>
                  <p className="vote-count">({movie.vote_count} Votes)</p>
                  <div className="release-date">
                    <h6 className="neonred">
                      Released On: {`(${movie.release_date})`}
                    </h6>
                  </div>
                </div>
              </div>
            </Link>
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
}

export default NewReleasesPage;
