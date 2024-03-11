import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";
import MovieCard from "../components/MovieCard.jsx";
import ScrollButton from "../components/ScrollButton.jsx";
import { useFavoritesContext } from "../context/favorites.context.jsx";
import "../styles/Card.css";

function NowPlayingPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const { addToFavorites, removeFromFavorites } =
  useFavoritesContext();
  const [popularMovies, setPopularMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const fetchPopularMovies = async () => {
    try {
      setIsPageLoading(true);
      const response = await service.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=${page}`
      );
      console.log("API Response:", response.data);

      setPopularMovies((prevMovies) => {
        const uniqueMovies = response.data.results.filter(
          (newMovie) => !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
        );
  
        return [...prevMovies, ...uniqueMovies];
      });

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
           <MovieCard
      items={popularMovies}
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

export default NowPlayingPage;
