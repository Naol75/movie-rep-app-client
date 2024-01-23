import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import clapperboardImage from "../assets/clapperboard.png";
import "../styles/MovieDetails.css";

function TvShowDetails() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const ipstackApiKey = import.meta.env.VITE_IPSTACK_API_KEY;
  const apiUrl = `http://api.ipstack.com/check?access_key=${ipstackApiKey}`;
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [tvshowInfo, setTvshowInfo] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);
  const [userRegion, setUserRegion] = useState("");
  const [streamingProviders, setStreamingProviders] = useState([]);

  const roundedRating = (rating) => parseFloat(rating).toFixed(2);
  const getDefaultImageUrl = () => "/assets/clapperboard.png";
  const getBackdropUrl = (path) => {
    const baseUrl = "https://image.tmdb.org/t/p/original";
    return path ? `${baseUrl}${path}` : getDefaultImageUrl();
  };

  const { tvshowId } = useParams();

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

  const fetchSeriesInfo = async () => {
    try {
      setIsPageLoading(true);
      const [tvShowResponse, videoResponse, watchResponse] = await Promise.all([
        service.get(
          `https://api.themoviedb.org/3/tv/${tvshowId}?api_key=${apiKey}&language=en-US`
        ),
        service.get(
          `https://api.themoviedb.org/3/tv/${tvshowId}/videos?api_key=${apiKey}&language=en-US`
        ),
        service.get(
          `https://api.themoviedb.org/3/tv/${tvshowId}/watch/providers?api_key=${apiKey}&language=en-US`
        ),
      ]);
      console.log("Watch Response Results:", watchResponse.data.results);

      const userProviders = watchResponse.data.results[userRegion];

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
      setTvshowInfo(tvShowResponse.data);
    } catch (error) {
      console.error("Error fetching movie info", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    fetchSeriesInfo();
    console.log(streamingProviders);
  }, [tvshowId, userRegion]);

  return (
    <div
      className="background-image cover-background"
      style={{
        backgroundImage: tvshowInfo
          ? `url(${getBackdropUrl(tvshowInfo.backdrop_path)})`
          : "",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {isPageLoading ? (
        <MoonLoader color="red" size={50} loading={true} />
      ) : (
        tvshowInfo && (
          <div className="movie-details">
            <div className="movie-content-container">
              <div className="movie-left-content">
                <div className="h1-container">
                  <h1>{tvshowInfo.name.toUpperCase()}</h1>
                </div>
                <h2>({tvshowInfo.first_air_date.substring(0, 4)})</h2>
                <div className="overview">
                  <p>{tvshowInfo.overview}</p>
                </div>
                <div className="rating-container">
                  <p className="rating">
                    ⭐ {roundedRating(tvshowInfo.vote_average)}
                  </p>
                  <p className="vote-count">({tvshowInfo.vote_count} Votes)</p>
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
                      {tvshowInfo.number_of_seasons > 1 ? (
                        <p>{tvshowInfo.number_of_seasons} seasons</p>
                      ) : (
                        <p>{tvshowInfo.number_of_episodes} episodes</p>
                      )}
                      <p>
                        Original Language:{" "}
                        {tvshowInfo.original_language.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={clapperboardImage}
                      alt="ClapperBoard"
                      style={{ width: "25vw" }}
                    />
                    <div className="no-trailer">
                      {tvshowInfo.number_of_seasons > 1 ? (
                        <p>{tvshowInfo.number_of_seasons} seasons</p>
                      ) : (
                        <p>{tvshowInfo.number_of_episodes} episodes</p>
                      )}
                      <p>
                        Original Language:{" "}
                        {tvshowInfo.original_language.toUpperCase()}
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

export default TvShowDetails;
