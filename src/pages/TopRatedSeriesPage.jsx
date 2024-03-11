import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";
import ScrollButton from "../components/ScrollButton.jsx";
import { useFavoritesContext } from "../context/favorites.context";
import SeriesCard from "../components/SeriesCard.jsx";
import "../styles/Card.css";

function TopRatedSeriesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { addToFavorites, removeFromFavorites } =
  useFavoritesContext();
  const [popularTvShows, setPopularTvShows] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [renderedSeries, setRenderedSeries] = useState(new Set());
  const [page, setPage] = useState(1);


  const fetchPopularTvShows = async () => {
    try {
      setIsPageLoading(true);
      const response = await service.get(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=${page}`
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
      <SeriesCard
      items={popularTvShows}
      addToFavorites={addToFavorites}
      removeFromFavorites={removeFromFavorites}
      />
      {isPageLoading && (
        <div
          className="loader-container"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <MoonLoader color="red" size={50} loading={true} />
        </div>
      )}
            <ScrollButton />
    </div>
  );
}

export default TopRatedSeriesPage;
