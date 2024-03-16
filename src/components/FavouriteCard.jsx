import { Link } from "react-router-dom";
import LikeButton from "./LikeButton.jsx";
import "../styles/LikeButton.css";
import "../styles/Card.css";
import clapperboardImage from "../assets/clapperboard.png";
import { useState } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { useContext } from "react";

function FavouriteCard({
  items,
  addToFavorites,
  removeFromFavorites,
  showReleaseDate,
  heartButtonFavourite,
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
    path ? `https://image.tmdb.org/t/p/w780${path}` : getDefaultImageUrl();

  return (
    <div className="favourite-grid">
      {items.map((movie) => (
        <div
          onClick={() => console.log(movie.id)}
          className="card-container-favourite"
          key={movie.id}
          onMouseEnter={() => handleMouseEnter(movie.id)}
          onMouseLeave={handleMouseLeave}
        >
          

                <LikeButton
                  movieId={movie.id}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                  heartButtonFavourite={heartButtonFavourite}
                />

          <div className="poster-overlay-container">
            <div className="poster-container-favourite">
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.name}
                className="poster-favourite"
              />
            </div>
            <div className="card-overlay-favourite"></div>
          </div>
          <div className="flex-center-container">
            <div className="info-container-favourite">
              <Link className="link" to={`/${movie.id}/movie-details`}>
                {movie.title ? (
                  <h5>
                    {movie.title} (
                    {movie.release_date && movie.release_date.substring(0, 4)})
                  </h5>
                ) : (
                  <h5>
                    {movie.name} (
                    {movie.first_air_date &&
                      movie.first_air_date.substring(0, 4)}
                    )
                  </h5>
                )}
              </Link>
              <p>{movie.overview.substring(0, 200)}...</p>
              <p className="rating">⭐ {roundedRating(movie.vote_average)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FavouriteCard;
