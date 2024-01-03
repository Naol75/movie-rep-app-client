import "../styles/Filters.css";
import { useFilter } from "../context/filters.context";

function FiltersCompDiscover() {
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
  const {
    filters,
    setFilters,
    sortBy,
    sortOrder,
    updateSortBy,
    updateSortOrder,
  } = useFilter();
  const currentYear = new Date().getFullYear();

  const handleYearChange = (event) => {
    console.log("Year changed:", event.target.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      minYear: parseInt(event.target.value),
    }));
  };

  const handleGenreChange = (event) => {
    console.log("Genre changed:", event.target.value);
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
    <section className="filters">
      <div>
        <label htmlFor="year">Released On</label>
        <select id="year" value={filters.minYear} onChange={handleYearChange}>
          <option value="">Select Year</option>
          {[...Array(currentYear - 1900 + 1).keys()].map((year) => (
            <option key={year} value={year + 1900}>
              {year + 1900}
            </option>
          ))}
        </select>

        <label htmlFor="genre">Genre</label>
        <select id="genre" value={filters.genre} onChange={handleGenreChange}>
          <option value="">Select Genre</option>
          {Object.entries(genreMap).map(([genreId, genreName]) => (
            <option key={genreId} value={genreId}>
              {genreName}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Sort By:</label>
        <select value={sortBy} onChange={handleSortByChange}>
          {/* Options for sorting criteria */}
          <option value="popularity">Popularity</option>
          <option value="release_date">Release Date</option>
          <option value="vote_average">Rating</option>
          <option value="vote_count">Vote Count</option>
          {/* Add more criteria as needed */}
        </select>

        <label>Sort Order:</label>
        <select value={sortOrder} onChange={handleSortOrderChange}>
          {/* Options for sorting order */}
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </section>
  );
}

export default FiltersCompDiscover;
