import "./Filters.css";
import { useFilter } from "../context/filters.context";

function FiltersComp() {
  const { sortBy, sortOrder, updateSortBy, updateSortOrder } = useFilter();

  const handleSortByChange = (e) => {
    updateSortBy(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    updateSortOrder(e.target.value);
  };

  return (
    <section className="filters">
      <div>
        <label>Sort By:</label>
        <select value={sortBy} onChange={handleSortByChange}>
          <option value="popularity">Popularity</option>
          <option value="release_date">Release Date</option>
          <option value="vote_average">Rating</option>
        </select>

        <label>Sort Order:</label>
        <select value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </section>
  );
}

export default FiltersComp;
