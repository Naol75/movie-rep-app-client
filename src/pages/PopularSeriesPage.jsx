import { useEffect, useState } from "react";
import axios from "axios";

function PopularSeriesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [popularTvShows, setPopularTvShows] = useState([]);
  const roundedRating = (rating) => {
    return parseFloat(rating).toFixed(2);
  };

  const getImageUrl = (path) => {
    const baseUrl = "https://image.tmdb.org/t/p/w400";
    return `${baseUrl}${path}`;
  };

  const mapGenreIdsToNames = (genreIds) => {
    const genreMap = {
      10759: "Action & Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      10762: "Kids",
      9648: "Mystery",
      10763: "News",
      10764: "Reality",
      10765: "Sci-Fi & Fantasy",
      10766: "Soap",
      10767: "Talk",
      10768: "War & Politics",
    };
    return genreIds.map((genreId) => genreMap[genreId]).join(", ");
  };

  useEffect(() => {
    const fetchPopularTvShows = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        setPopularTvShows(response.data.results);
        console.log(response.data.results);
      } catch (error) {
        console.error("Error fetching popular TV shows:", error);
      }
    };
    fetchPopularTvShows();
  }, []);

  return (
    <div className="grid">
      {popularTvShows &&
        popularTvShows.map((tvShow) => (
          <div className="card" key={tvShow.id}>
            <img
              src={getImageUrl(tvShow.poster_path)}
              alt={`${tvShow.name} Poster`}
              className="poster"
            />
            <div className="info">
              <h3>
                {tvShow.name} {`(${tvShow.first_air_date.substring(0, 4)})`}
              </h3>
              <p>{mapGenreIdsToNames(tvShow.genre_ids)}</p>
              <p className="rating">⭐ {roundedRating(tvShow.vote_average)}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default PopularSeriesPage;