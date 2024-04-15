import { Link } from "react-router-dom";
import LikeButton from "./LikeButton.jsx";
import "../styles/LikeButton.css";
import "../styles/Card.css";
import clapperboardImage from "../assets/clapperboard.png";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { useContext } from "react";
import ProgressBar from "./ProgressBar.jsx";
import PropTypes from 'prop-types';

function Card({
  items,
  addToFavorites,
  removeFromFavorites,
  showReleaseDate,
  showMovieInfo,
}) {
  const authContext = useContext(AuthContext);
  const { activeUserId } = authContext;
  const [smallestScreen, setSmallestScreen] = useState(false);
  const [showMovieInformation, setShowMovieInformation] = useState(true);
  const [showVoteCount, setShowVoteCount] = useState(true);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);

  const handleMouseEnter = (movieId) => {
    setHoveredMovieId(movieId);
  };

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    setShowMovieInformation(screenWidth > 518);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMouseLeave = () => {
    setHoveredMovieId(null);
  };
  const roundedRating = (rating) => parseFloat(rating).toFixed(2);

  const getDefaultImageUrl = () => clapperboardImage;
  const getImageUrl = (path) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : getDefaultImageUrl();

  const mapGenreIdsToNames = (genreIds) => {
    const genreMap = {
      10759: "Action & Adventure",
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
      10762: "Kids",
      10763: "News",
      10402: "Music",
      9648: "Mystery",
      10764: "Reality",
      10749: "Romance",
      878: "Science Fiction",
      10765: "Sci-Fi & Fantasy",
      10766: "Soap",
      10767: "Talk",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return genreIds.map((genreId) => genreMap[genreId]).join(", ");
  };

  return (
    <div className="grid" style={smallestScreen ? { marginTop: "80px" } : {}}>
      {showMovieInformation || showMovieInfo
        ? items.map((movie, index) => (
            <div
              key={`info-${movie.id}-index${index}-smallestScreen`}
              className="card-container"
              onMouseEnter={() => handleMouseEnter(movie.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link className="link" to={`/${movie.id}/movie-details`}>
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
                <div>
                  <div className="card-overlay">
                    <div className="overview-in-overlay">
                      <p>{movie.overview}</p>
                    </div>
                  </div>
                  {hoveredMovieId !== movie.id && (
                    <div className="info">
                      {movie.title ? (
                        <div className="movie-title">
                          <h3>
                            {movie.title} (
                            {movie.release_date &&
                              movie.release_date.substring(0, 4)}
                            )
                          </h3>
                        </div>
                      ) : (
                        <div className="movie-title">
                          <h3>
                            {movie.name} (
                            {movie.first_air_date &&
                              movie.first_air_date.substring(0, 4)}
                            )
                          </h3>
                        </div>
                      )}
                      <div className="votes-rating-genres">
                        {movie.genre_ids ? (
                          <div className="genres">
                            <p id="genres">
                              {mapGenreIdsToNames(movie.genre_ids)}
                            </p>
                          </div>
                        ) : (
                          <div className="genres">
                            <p id="genres">
                              {mapGenreIdsToNames(
                                movie.genres.map((genre) => genre.id)
                              )}
                            </p>
                          </div>
                        )}

                        <p className="rating">
                          ⭐ {roundedRating(movie.vote_average)}
                        </p>
                        {showVoteCount && (
                          <p className="vote-count">
                            ({movie.vote_count} Votes)
                          </p>
                        )}
                      </div>
                      {showReleaseDate && (
                        <div className="release-date">
                          <h6 className="neonred">
                            Released On: {`(${movie.release_date})`}
                          </h6>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
              {activeUserId && hoveredMovieId === movie.id && (
                <LikeButton
                  movieId={movie.id}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                />
              )}
            </div>
          ))
        : items.map((movie, index) => (
            <>
              <div
                key={`small-${movie.id}-index${index}`}
                className="card-container-small"
                onMouseEnter={() => handleMouseEnter(movie.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  className="link"
                  to={`/${movie.id}/movie-details`}
                  key={movie.id}
                >
                  <div className="circle-container">
                    <ProgressBar percent={(movie.vote_average / 10) * 100} />
                  </div>

                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={`${movie.title} Poster`}
                    className="poster"
                    style={
                      { objectFit: "cover", height: "85%", borderRadius: "5px" }
                    }
                  />
                </Link>
              </div>
            </>
          ))}
    </div>
  );
}
Card.propTypes = {
  items: PropTypes.array,
  addToFavorites: PropTypes.func,
  removeFromFavorites: PropTypes.func,
  showReleaseDate: PropTypes.bool,
  showMovieInfo: PropTypes.bool,
};


export default Card;
