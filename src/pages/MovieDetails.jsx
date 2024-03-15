import { useEffect, useState } from "react";
import service from "../services/api";
import clapperboardImage from "../assets/clapperboard.png";
import { MoonLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import "../styles/MovieDetails.css";

function MovieDetails() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const ipstackApiKey = import.meta.env.VITE_IPSTACK_API_KEY;
  const apiUrl = `http://api.ipstack.com/check?access_key=${ipstackApiKey}`;
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [movieInfo, setMovieInfo] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [userRegion, setUserRegion] = useState("");
  const [streamingProviders, setStreamingProviders] = useState([]);

  const roundedRating = (rating) => parseFloat(rating).toFixed(2);
  const getDefaultImageUrl = () => "/assets/clapperboard.png";
  const getBackdropUrl = (path) => {
    const baseUrl = "https://image.tmdb.org/t/p/original";
    return path ? `${baseUrl}${path}` : getDefaultImageUrl();
  };

  const { movieId } = useParams();

  const getProviderUrl = (providerName) => {
    const providerMappings = {
      "Apple TV Plus": "https://www.apple.com/apple-tv-plus/",
      "Apple TV": "https://www.apple.com/apple-tv-plus/",
      "Amazon Prime Video": "https://www.primevideo.com/",
      "Google Play Movies": "https://play.google.com/store/movies",
      "Microsoft Store": "https://www.microsoft.com/en-us/store/movies-and-tv",
      YouTube: "https://www.youtube.com/",
      "Sky Go": "https://www.sky.com/",
      "Now TV Cinema": "https://www.nowtv.com/",
      Vudu: "https://www.vudu.com/",
      "Rakuten TV": "https://www.rakuten.tv/",
      "HBO Max": "https://www.hbomax.com/",
      HBO: "https://www.hbomax.com/",
      "Movistar Plus": "https://ver.movistarplus.es/",
      Netflix: "https://www.netflix.com/browse",
      "Netflix basic with Ads": "https://www.netflix.com/browse",
      SkyShowtime: "https://www.skyshowtime.com/",
      "MGM Plus": "https://www.mgmplus.com/",
      Hulu: "https://www.hulu.com/",
      "Disney Plus": "https://www.disneyplus.com/",
      Filmin: "https://www.filmin.es/",
      "Filmin Plus": "https://www.filmin.es/",
    };

    const sanitizedProviderName = providerName.trim();
    return providerMappings[sanitizedProviderName] || "#";
  };

  const fetchUserLocation = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setUserRegion(data.country_code);
    } catch (error) {
      console.error("Error fetching user location by IP:", error);
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchMovieInfo = async () => {
    try {
      setIsPageLoading(true);
      const [movieResponse, videoResponse, watchResponse] = await Promise.all([
        service.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`
        ),
        service.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
        ),
        service.get(
          `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}&language=en-US`
        ),
      ]);
      console.log("Watch Response Results:", watchResponse.data.results);

      const userProviders = watchResponse.data.results[userRegion];
      console.log("streaming providers after fetching", userProviders);

      if (userProviders) {
        const flatrateProviders = userProviders.flatrate || [];

        setStreamingProviders(flatrateProviders);
      } else {
        setStreamingProviders([]);
      }

      const trailer = videoResponse.data.results.find(
        (video) => video.type === "Trailer"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
      }
      setMovieInfo(movieResponse.data);
    } catch (error) {
      console.error("Error fetching movie info", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieInfo();
  }, [movieId, userRegion]);

  return (
    <div
      className="background-image cover-background"
      style={{
        backgroundImage: movieInfo
          ? `url(${getBackdropUrl(movieInfo.backdrop_path)})`
          : "",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isPageLoading ? (
        <MoonLoader color="red" size={50} loading={true} />
      ) : (
        movieInfo && (
          <div className="movie-details">
            <div className="movie-content-container">
              <div className="movie-left-content">
                <div className="h1-container">
                  <h1>{movieInfo.title.toUpperCase()}</h1>
                </div>
                <h2>({movieInfo.release_date.substring(0, 4)})</h2>
                <div className="overview">
                  <p>{movieInfo.overview}</p>
                </div>
                <div className="rating-container">
                  <p className="rating">
                    ⭐ {roundedRating(movieInfo.vote_average)}
                  </p>
                  <p className="vote-count">({movieInfo.vote_count} Votes)</p>
                </div>
                <div className="providers-container">
                  {streamingProviders && streamingProviders.length > 0 ? (
                    <div className="providers">
                      {streamingProviders.map(
                        (provider) =>
                          provider &&
                          provider.provider_name && (
                            <a
                              key={provider.provider_id}
                              href={getProviderUrl(provider.provider_name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="provider"
                            >
                              {provider.logo_path && (
                                <img
                                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                  alt={provider.provider_name}
                                  className="provider-logo"
                                />
                              )}
                            </a>
                          )
                      )}
                    </div>
                  ) : (
                    <p className="no-streaming-paragraph">
                      No streaming providers available for your region.
                    </p>
                  )}
                </div>
              </div>
              <div className="movie-right-content">
                {trailerKey ? (
                  <div className="trailer">
                    <iframe
                      title="Trailer"
                      src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1`}
                      width="100%"
                      height="100%"
                      allow="autoplay"
                      allowFullScreen
                    ></iframe>
                    <div className="movie-info">
                      <p>Duration: {movieInfo.runtime} min</p>
                      <p>
                        Original Language:{" "}
                        {movieInfo.original_language.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={clapperboardImage}
                      alt="ClapperBoard"
                      style={{ width: "20vw" }}
                    />
                    <div className="movie-info" style={{ gap: "1.8vw" }}>
                      <p>Duration: {movieInfo.runtime} min</p>
                      <p>
                        Original Language:{" "}
                        {movieInfo.original_language.toUpperCase()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default MovieDetails;
