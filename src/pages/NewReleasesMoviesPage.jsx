import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";
import Card from "../components/Card.jsx";
import { isAfter, subMonths } from "date-fns";
import { useFavoritesContext } from "../context/favorites.context";
import ScrollButton from "../components/ScrollButton.jsx";
import "../styles/Card.css";

function NewReleasesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { addToFavorites, removeFromFavorites } = useFavoritesContext();
  const [popularMovies, setPopularMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [renderedMovies, setRenderedMovies] = useState(new Set());

  const fetchPopularMovies = async () => {
    try {
      setIsPageLoading(true);
      const response = await service.get(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=${page}`
      );
      console.log("API Response:", response.data);

      const currentDate = new Date();
      const threeMonthsAgo = subMonths(currentDate, 3);

      const newMovies = response.data.results
        .filter((movie) => !renderedMovies.has(movie.id))
        .filter((movie) =>
          isAfter(new Date(movie.release_date), threeMonthsAgo)
        );

      setPopularMovies((prevMovies) => [...prevMovies, ...newMovies]);

      const newRenderedMovieIds = new Set([
        ...renderedMovies,
        ...newMovies.map((movie) => movie.id),
      ]);
      setRenderedMovies(newRenderedMovieIds);

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current page:", page);

    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 800 && !isPageLoading) {
        fetchPopularMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, isPageLoading]);

  // Initial fetch
  useEffect(() => {
    fetchPopularMovies();
  }, []);

  return (
    <div>
      <Card
        items={popularMovies}
        addToFavorites={addToFavorites}
        removeFromFavorites={removeFromFavorites}
        showReleaseDate={true}
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

export default NewReleasesPage;
