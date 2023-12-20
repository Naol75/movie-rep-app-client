import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";


function OnTvPage() {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const [popularTvShows, setPopularTvShows] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [renderedSeries, setRenderedSeries] = useState(new Set());
    const [page, setPage] = useState(1);

  
    const roundedRating = (rating) => parseFloat(rating).toFixed(2);
  
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
  
    const fetchPopularTvShows = async () => {
      try {

        setIsPageLoading(true);
        const response = await service.get(
          `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&language=en-US&page=${page}`
        );
        console.log("API Response:", response.data);
  
        const newTvShows = response.data.results.filter(
          (tvShow) => !renderedSeries.has(tvShow.id)
        );
  
        setPopularTvShows((prevTvShows) => [...prevTvShows, ...newTvShows]);
  
        const newRenderedSeriesIds = new Set([
          ...renderedSeries,
          ...newTvShows.map((tvShow) => tvShow.id),
        ]);
        setRenderedSeries(newRenderedSeriesIds);
  
        setPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error("Error fetching popular TV shows:", error);
      } finally {
        setIsPageLoading(false);
      }
    };
  
    useEffect(() => {
      const handleScroll = () => {
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
  
        if (scrollTop + windowHeight >= documentHeight - 800 && !isPageLoading) {
          fetchPopularTvShows();
        }
      };
  
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [page, isPageLoading]);
  
    useEffect(() => {
      fetchPopularTvShows();
    }, []);
  
    return (
      <div>
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
        {isPageLoading && (
          <div className="loader-container" style={{ textAlign: "center", marginTop: "20px" }}>
            <MoonLoader color="red" size={50} loading={true} />
          </div>
        )}
      </div>
    );
}

export default OnTvPage