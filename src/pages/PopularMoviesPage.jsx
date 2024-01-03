import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";



function PopularMoviesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [popularMovies, setPopularMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [renderedMovies, setRenderedMovies] = useState(new Set())
  const maxPages = 99999;


  const roundedRating = (rating) => parseFloat(rating).toFixed(2);

  const getImageUrl = (path) => {
    const baseUrl = "https://image.tmdb.org/t/p/w300";
    return `${baseUrl}${path}`;
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
      if (page === maxPages) {
        return
      }
      setIsPageLoading(true);
      const response = await service.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
      );
      console.log("API Response:", response.data);

      const newMovies = response.data.results
      .filter((movie) => !renderedMovies.has(movie.id));
      setPopularMovies((prevMovies) => [...prevMovies, ...newMovies]);

      const newRenderedMovieIds = new Set([...renderedMovies, ...newMovies.map((movie) => movie.id)]);
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
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 750 && !isPageLoading) {
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
    setPopularMovies([]);
    setRenderedMovies(new Set());
    fetchPopularMovies();
  }, []);

  return (
    <div>
    <div className="grid">
      {popularMovies &&
        popularMovies.map((movie) => (
          <div className="card" key={movie.id}>
            <img
              src={getImageUrl(movie.poster_path)}
              alt={`${movie.title} Poster`}
              className="poster"
            />
            <div className="info">
              <h3>
                {movie.title} {`(${movie.release_date.substring(0, 4)})`}
              </h3>
              <p>{mapGenreIdsToNames(movie.genre_ids)}</p>
              <p className="rating">⭐ {roundedRating(movie.vote_average)}</p>
              <p className="vote-count">({movie.vote_count} Votes)</p>
            </div>
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
    </div>
  );
}

export default PopularMoviesPage;