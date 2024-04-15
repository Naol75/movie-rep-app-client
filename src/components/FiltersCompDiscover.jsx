import "../styles/Filters.css";
import { useFilter } from "../context/filters.context";
import service from "../services/api";
import { useState, useEffect } from "react";

function FiltersCompDiscover() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [providers, setProviders] = useState([]);

  const genreMap = {
    28: "Action",
    10759: "Action & Adventure",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    10762: "Kids",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10763: "News",
    10764: "Reality",
    10749: "Romance",
    10765: "Sci-Fi & Fantasy",
    878: "Science Fiction",
    10766: "Soap",
    10767: "Talk",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    10768: "War & Politics",
    37: "Western",
  };

  const providerNameToId = {
    "Amazon Prime Video": 119,
    "Disney Plus": 337,
    "HBO Max": 384,
    "Movistar Plus": 149,
    Netflix: 8,
    SkyShowtime: 1773,
  };

  const fetchProvidersInfo = async () => {
    try {
      const response = await service.get(
        `https://api.themoviedb.org/3/watch/providers/movie?api_key=${apiKey}&language=en-US`
      );
      setProviders(response.data.results);
    } catch (error) {
      console.error("Error fetching providers info", error);
    }
  };

  useEffect(() => {
    fetchProvidersInfo();
  }, []);

  const filteredProviders = providers.filter(
    (provider) =>
      provider.provider_name in providerNameToId && provider.provider_id != 9
  );

  const {
    filters,
    setFilters,
    sortBy,
    sortOrder,
    updateStreamingProvider,
    updateSortBy,
    updateSortOrder,
  } = useFilter();
  const currentYear = new Date().getFullYear();

  const handleStreamingProviderChange = (providerId) => {
    const sameProvider = filters.streamingProvider === providerId;
    if (!sameProvider) {
      updateStreamingProvider(providerId);
    } else {
      updateStreamingProvider("");
    }
  };

  const handleYearChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      minYear: parseInt(event.target.value),
    }));
  };

  const handleGenreChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      genre: event.target.value,
    }));
  };

  const handleSortByChange = (e) => {
    updateSortBy(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    updateSortOrder(e.target.value);
  };

  return (
    <div className="filters-providers-container">
      <section className="filters">
        <div className="providers-container-header">
          <div className="providers-padding">
            <div className="providers-header">
              {filteredProviders.map((provider) => (
                <img
                  key={provider.provider_id}
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  onClick={() =>
                    handleStreamingProviderChange(provider.provider_id)
                  }
                  className={
                    filters.streamingProvider === provider.provider_id
                      ? "selected provider-logo-header"
                      : "provider-logo-header"
                  }
                />
              ))}
            </div>
          </div>
        </div>
        <div className="filters-sort-container">
          <div className="released-genres-container">
            <label htmlFor="year">Released On</label>
            <select
              id="year"
              value={filters.minYear}
              onChange={handleYearChange}
            >
              <option value="">All</option>
              {[...Array(currentYear - 1900 + 1).keys()].map((year) => (
                <option key={year} value={year + 1900}>
                  {year + 1900}
                </option>
              ))}
            </select>

            <label htmlFor="genre">Genre</label>
            <select
              id="genre"
              value={filters.genre}
              onChange={handleGenreChange}
            >
              <option value="">Select Genre</option>
              {Object.entries(genreMap).map(([genreId, genreName]) => (
                <option key={genreId} value={genreId}>
                  {genreName}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-container">
            <label>Sort By:</label>
            <select value={sortBy} onChange={handleSortByChange}>
              <option value="popularity">Popularity</option>
              <option value="release_date">Release Date</option>
              <option value="vote_average">Rating</option>
              <option value="vote_count">Vote Count</option>
            </select>

            <label>Sort Order:</label>
            <select value={sortOrder} onChange={handleSortOrderChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FiltersCompDiscover;
