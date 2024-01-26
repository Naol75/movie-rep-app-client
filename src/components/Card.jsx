import PropTypes from 'prop-types'
import { useState, useEffect } from "react";
import { MoonLoader } from "react-spinners";
import { Link } from "react-router-dom";
import LikeButton from "./LikeButton";
import clapperboardImage from "../assets/clapperboard.png";
import { useFavoritesContext } from '../context/favorites.context';
import "../styles/Card.css";

const Card = ({ movie }) => {
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToFavorites, removeFromFavorites, favoritedMovies } = useFavoritesContext();

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

  
  
  const isMovieFavorited = async (movieTitle) =>
  favoritedMovies.includes(movieTitle.toLowerCase());

  const handleFavChange = (movieTitle) => {
    if (favoritedMovies.includes(movieTitle)) {
      addToFavorites(movieTitle);
      setIsFavorited(false)
    } else {
      addToFavorites(movieTitle);
      setIsFavorited(true)
    }
  };
  
  useEffect(() => {
    setIsFavorited(isMovieFavorited(movie.title));
  }, [movie.title]);

  
  return (
    <div
      className={`card-container${isFavorited ? ' favorited' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <LikeButton
        key={movie.title}
        className="heart-button"
        movieTitle={movie.title}
        onAddToFavorites={addToFavorites}
        handleFavChange={() => handleFavChange(movie.title)}
        removeFromFavorites={removeFromFavorites}
        isFavorited={isFavorited}
        setIsFavorited={setIsFavorited}
        movieOverview={movie.overview}
      />
      <Link className="link" to={`/${movie.id}/movie-details`}>
        <img
          src={getImageUrl(movie.poster_path) || clapperboardImage}
          alt={`${movie.title} Poster`}
          className="poster"
        />
        <div className="info">
          <h3>
            {movie.title} (
            {movie.release_date && movie.release_date.substring(0, 4)})
          </h3>
          <p>{mapGenreIdsToNames(movie.genre_ids ?? [])}</p>
          <p className="rating">⭐ {roundedRating(movie.vote_average)}</p>
          <p className="vote-count">({movie.vote_count} Votes)</p>
        </div>
      </Link>
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
};

Card.propTypes = {
    movie: PropTypes.object,
}

export default Card;