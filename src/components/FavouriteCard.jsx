import { Link } from "react-router-dom";
import LikeButton from "./LikeButton.jsx";
import "../styles/LikeButton.css";
import "../styles/Card.css";
import clapperboardImage from "../assets/clapperboard.png";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { useContext } from "react";
import axios from "axios";

function FavouriteCard({
  movie,
  addToFavorites,
  removeFromFavorites,
  heartButtonFavourite,
}) {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const authContext = useContext(AuthContext);
  const { userRegion } = authContext;
  const { activeUserId } = authContext;
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [streamingProviders, setStreamingProviders] = useState([])

  const getProviderUrl = (providerName) => {
    const providerMappings = {
      "Apple TV Plus": "https://www.apple.com/apple-tv-plus/",
      "Apple TV": "https://www.apple.com/apple-tv-plus/",
      "Amazon Prime Video": "https://www.primevideo.com/",
      "Google Play Movies": "https://play.google.com/store/movies",
      "Microsoft Store": "https://www.microsoft.com/en-us/store/movies-and-tv",
      "YouTube": "https://www.youtube.com/",
      "Sky Go": "https://www.sky.com/",
      "Now TV Cinema": "https://www.nowtv.com/",
      "Vudu": "https://www.vudu.com/",
      "Rakuten TV": "https://www.rakuten.tv/",
      "HBO Max": "https://www.hbomax.com/",
      "HBO": "https://www.hbomax.com/",
      "Movistar Plus": "https://ver.movistarplus.es/",
      "Netflix": "https://www.netflix.com/browse",
      "Netflix basic with Ads": "https://www.netflix.com/browse",
      "SkyShowtime": "https://www.skyshowtime.com/",
      "MGM Plus": "https://www.mgmplus.com/",
      "Hulu": "https://www.hulu.com/",
      "Disney Plus": "https://www.disneyplus.com/",
      "Filmin": "https://www.filmin.es/",
      "Filmin Plus": "https://www.filmin.es/",
      "Tivify": "https://www.tivify.es/es/",
    };

    const sanitizedProviderName = providerName.trim();
    return providerMappings[sanitizedProviderName] || "#";
  };

  const fetchStreamingProviders = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}&language=en-US`
      );
      const providers = response.data.results[userRegion];
      if (providers) {
        const flatrateProviders = providers.flatrate || [];
        setStreamingProviders(flatrateProviders);
      }
      else {
        setStreamingProviders([]);
      }
    } catch (error) {
      console.error("Error fetching streaming providers", error);
    }
  };

  useEffect(() => {
    fetchStreamingProviders(movie.id);
  }, [movie.id]);

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



  useEffect(() => {
    console.log("streamingProviders en FavouriteCard:", streamingProviders);
  }, [])

  return (
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
              <p>{movie.overview.substring(0, 100)}...</p>
              <p className="rating-favourite">⭐ {roundedRating(movie.vote_average)}</p>
                  {streamingProviders && streamingProviders.length > 0 ? (
                    <div className="providers-container-fav">
                          <div className="providers-fav">
                      {streamingProviders.map(
                        (provider) =>
                        provider &&
                        provider.provider_name && (
                          <a
                              key={provider.provider_id}
                              href={getProviderUrl(provider.provider_name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="provider-fav"
                            >
                              {provider.logo_path && (
                                <img
                                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="provider-logo-fav"
                                />
                              )}
                            </a>
                          )
                          )}
                          </div>
                          </div>
                  ) : (
                    <p className="no-streaming-paragraph-fav">
                      No streaming providers available for your region.
                    </p>
                  )}
            </div>
          </div>
        </div>
  );
}

export default FavouriteCard;
