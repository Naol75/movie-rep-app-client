import { Link } from "react-router-dom";
import LikeButton from "./LikeButton.jsx";
import "../styles/LikeButton.css";
import "../styles/Card.css";
import clapperboardImage from "../assets/clapperboard.png";
import { useState } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { useContext } from "react";

function SeriesCard({
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

    const mapGenreIdsToNames = (genres) => {
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
          return genres.map(genreId => genreMap[genreId]).join(", ");
      }
    

  return (
    <div className="grid">
      {items.map((tvShow) => (
        <div
          onClick={() => console.log(tvShow.id)}
          className="card-container"
          key={tvShow.id}
          onMouseEnter={() => handleMouseEnter(tvShow.id)}
          onMouseLeave={handleMouseLeave}
        >
          <Link className="link" to={`/${tvShow.id}/tvShow-details`}>
            <div className="card-overlay">
              <div className="overview-in-overlay">
                <p>{tvShow.overview}</p>
              </div>
            </div>
            <img
              src={getImageUrl(tvShow.poster_path)}
              alt={`${tvShow.name} Poster`}
              className="poster"
              style={
                hoveredMovieId === tvShow.id
                  ? { objectFit: "cover", height: "100%" }
                  : {}
              }
            />
            {hoveredMovieId !== tvShow.id && (
              <div className="info">
                <h3>
                  {tvShow.name} (
                  {tvShow.first_air_date &&
                    tvShow.first_air_date.substring(0, 4)}
                  )
                </h3>
                <p id="genres">{mapGenreIdsToNames(tvShow.genre_ids)}</p>
                <p className="rating">
                  ⭐ {roundedRating(tvShow.vote_average)}
                </p>
                <p className="vote-count">({tvShow.vote_count} Votes)</p>
                {showReleaseDate && (
                  <div className="release-date">
                    <h6 className="neonred">
                      Released On: {`(${tvShow.first_air_date})`}
                    </h6>
                  </div>
                )}
              </div>
            )}
          </Link>
          {activeUserId && hoveredMovieId === tvShow.id && (
            <LikeButton
              className="heart-button"
              movieId={tvShow.id}
              addToFavorites={addToFavorites}
              removeFromFavorites={removeFromFavorites}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default SeriesCard;
