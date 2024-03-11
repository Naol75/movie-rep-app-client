import { Link } from "react-router-dom";
import LikeButton from "../components/LikeButton.jsx";
import "../styles/LikeButton.css";
import "../styles/Card.css";
import clapperboardImage from "../assets/clapperboard.png";
import { useState } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { useContext } from "react";

function MovieCard({
  items,
  addToFavorites,
  removeFromFavorites,
  showReleaseDate,
}) {
  const authContext = useContext(AuthContext);
  const { activeUserId } = authContext;
  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  const handleMouseEnter = (movieId) => {
    setHoveredMovieId(movieId);
  };

  const handleMouseLeave = () => {
    setHoveredMovieId(null);
  };
  const roundedRating = (rating) => parseFloat(rating).toFixed(2);

  const getDefaultImageUrl = () => clapperboardImage;
  const getImageUrl = (path) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : getDefaultImageUrl();

    

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

  return (
    <div className="grid">
      {items.map((movie) => (
        <div
          onClick={() => console.log(movie.id)}
          className="card-container"
          key={movie.id}
          onMouseEnter={() => handleMouseEnter(movie.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link className="link" to={`/${movie.id}/movie-details`}>
            <div className="card-overlay">
              <div className="overview-in-overlay">
                <p>{movie.overview}</p>
              </div>
            </div>
            <img
              src={getImageUrl(movie.poster_path)}
              alt={`${movie.title} Poster`}
              className="poster"
              style={
                hoveredMovieId === movie.id
                  ? { objectFit: "cover", height: "100%" }
                  : {}
              }
            />
            {hoveredMovieId !== movie.id && (
              <div className="info">
                <h3>
                  {movie.title} (
                  {movie.release_date && movie.release_date.substring(0, 4)})
                </h3>
                {movie.genre_ids ? (
                  <p id="genres">{mapGenreIdsToNames(movie.genre_ids)}</p>
                ) : (
                  <p id="genres">
                    {mapGenreIdsToNames(movie.genres.map((genre) => genre.id))}
                  </p>
                )}
                <p className="rating">⭐ {roundedRating(movie.vote_average)}</p>
                <p className="vote-count">({movie.vote_count} Votes)</p>
                {showReleaseDate && (
                  <div className="release-date">
                    <h6 className="neonred">
                      Released On: {`(${movie.release_date})`}
                    </h6>
                  </div>
                )}
              </div>
            )}
          </Link>
          {activeUserId && hoveredMovieId === movie.id && (
            <LikeButton
              className="heart-button"
              movieId={movie.id}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default MovieCard;
