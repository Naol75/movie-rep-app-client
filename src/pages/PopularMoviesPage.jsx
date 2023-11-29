import { useEffect, useState } from "react";
import axios from "axios";

function PopularMoviesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [popularMovies, setPopularMovies] = useState([]);
  const roundedRating = (rating) => {
    return parseFloat(rating).toFixed(2);
  };
  
  const getImageUrl = (path) => {
    const baseUrl = "https://image.tmdb.org/t/p/w400";
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

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        setPopularMovies(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      }
    };
    fetchPopularMovies();
  }, []);

  return (
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
            </div>
          </div>
        ))}
    </div>
  );
}

export default PopularMoviesPage;
