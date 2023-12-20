import './Filters.css'
import { useState, useEffect } from 'react';
import { useFilter } from '../context/filters.context';


function FiltersComp() {

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
  const { filters, setFilters } = useFilter();
  const currentYear = new Date().getFullYear();

  const handleYearChange = (event) => {
    console.log('Year changed:', event.target.value);
    setFilters((prevFilters) => ({ ...prevFilters, minYear: parseInt(event.target.value) }));
  };

  const handleGenreChange = (event) => {
    console.log('Genre changed:', event.target.value);
    setFilters((prevFilters) => ({ ...prevFilters, genre: event.target.value }));
  };

  return (
    <section className="filters">
      <div>
        <label htmlFor="year">Released after</label>
        <select
          id="year"
          value={filters.minYear}
          onChange={handleYearChange}
        >
          <option value="">Select Year</option>
          {[...Array(currentYear - 1900 + 1).keys()].map((year) => (
            <option key={year} value={year + 1900}>
              {year + 1900}
            </option>
          ))}
        </select>
      </div>
      <div>
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
    </section>
  );
}

export default FiltersComp;