import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";
import { useFilter } from '../context/filters.context';

function PopularMoviesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { filters } = useFilter();
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [filtersChanged, setFiltersChanged] = useState(false);
  const [page, setPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [renderedMovies, setRenderedMovies] = useState(new Set());

  const roundedRating = (rating) => parseFloat(rating).toFixed(2);

  const getImageUrl = (path) => {
    const baseUrl = "https://image.tmdb.org/t/p/w300";
    return `${baseUrl}${path}`;
  };

  const mapGenreIdsToNames = (genreIds) => {
    const genreMap = {
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
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return genreIds.map((genreId) => genreMap[genreId]).join(", ");
  };

  const fetchPopularMovies = async () => {
    try {
      setIsPageLoading(true);
      if (page === 1 || filtersChanged) {
        setRenderedMovies(new Set());
      }
      const response = await service.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
      );
      console.log("API Response:", response.data);
  
      const newMovies = response.data.results.filter(
        (movie) => !renderedMovies.has(movie.id)
      );
  
      setFilteredMovies(newMovies.filter((movie) => {
        const itemYear = Number(movie.release_date?.substring(0, 4));
        const itemGenres = mapGenreIdsToNames(movie.genre_ids);
      
        return (
          itemYear >= filters.minYear &&
          (filters.genre === 'all' || itemGenres.includes(filters.genre))
        );
      }));
  
      setRenderedMovies((prevRenderedMovies) => new Set([
        ...prevRenderedMovies,
        ...newMovies.map((movie) => movie.id),
      ]));
  
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    
    console.log('MinYear in filters:', filters.minYear);
    fetchPopularMovies();
  }, [filters]);
  
  useEffect(() => {
    setFiltersChanged(false);
  }, []);
  useEffect(() => {
    setFiltersChanged(true);
  }, [filters]);


  useEffect(() => {
    console.log("Current page:", page);
  }, [page]);

  useEffect(() => {
    console.log("Filtered Movies:", filteredMovies);
  }, [filteredMovies]);

  return (
    <div>
      <div className="grid">
      {console.log("Number of filtered movies:", filteredMovies.length)}
        {filteredMovies &&
          filteredMovies.map((movie) => (
            <div className="card" key={movie.id}>
              <img
                src={getImageUrl(movie.poster_path)}
                alt={`${movie.title} Poster`}
                className="poster"
              />
              <div className="info">
                <h3>
                  {movie.title} ({movie.release_date && movie.release_date.substring(0, 4)})
                </h3>
                <p>{mapGenreIdsToNames(movie.genre_ids)}</p>
                <p className="rating">⭐ {roundedRating(movie.vote_average)}</p>
              </div>
            </div>
          ))}
      </div>
      {isPageLoading && (
        <div className="loader-container" style={{ textAlign: "center", marginTop: "20px" }}>
          <MoonLoader color="red" size={50} loading={true} />
        </div>
      )}
    </div>
  );
}

export default PopularMoviesPage;