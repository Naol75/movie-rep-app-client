import { useEffect, useState } from "react";
import service from "../services/api";
import { MoonLoader } from "react-spinners";
import ScrollButton from "../components/ScrollButton.jsx";
import "../styles/Card.css";
import { useFavoritesContext } from "../context/favorites.context";
import Card from "../components/Card.jsx";


function PopularMoviesPage() {
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
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${page}`
      );
      console.log("API Response:", response.data);


      setPopularMovies((prevMovies) => {
        const uniqueMovies = response.data.results.filter(
          (newMovie) => !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
        );
  
        return [...prevMovies, ...uniqueMovies];
      });
      console.log("Current page before setPage (fetchFunction):", page);
      setPage((prevPage) => prevPage + 1);
      console.log("Current page after setPage (fetchFunction):", page);
    } catch (error) {
      console.error("Error fetching popular movies:", error);
    } finally {
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current page scroll effect:", page);

    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 750 && !isPageLoading) {
        fetchPopularMovies();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);

  // Initial fetch
  useEffect(() => {
    setPopularMovies([]);
    console.log("Current page before fetchFunction (initial Fetch):", page);
    fetchPopularMovies();
    console.log("Current page after fetchFunction (initial Fetch):", page);
  }, []);

  return (
    <div>
            <Card
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

export default PopularMoviesPage;
