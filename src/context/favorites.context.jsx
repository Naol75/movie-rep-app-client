import { createContext, useContext, useState, useEffect } from 'react';
import service from "../services/api";
import { AuthContext } from "../context/auth.context";

const FavoritesContext = createContext();

export const useFavoritesContext = () => {
  return useContext(FavoritesContext);
};

export const FavoritesProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { activeUserId } = authContext;
  const [favoritedMovies, setFavoritedMovies] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);


  const isMovieFavorited = (movieId) => {
    return favoritedMovies.includes(movieId);
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (activeUserId) 
          setLoadingFavorites(true);
        const favoritesResponse = await service.get("/movies/getAllFavourites", {
          params: { userId: activeUserId },
        });
  
        if (favoritesResponse.status === 200) {
          const currentFavorites = favoritesResponse.data.favouriteItems;
          setFavoritedMovies(currentFavorites);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoadingFavorites(false);
      }
    };
  
    fetchFavorites();
  }, [activeUserId]);

  const addToFavorites = async (movieId) => {
    try {
      console.log("Añadiendo a favoritos:", movieId);
      const response = await service.post("/movies/addToFavourites", {
        userId: activeUserId,
        movieId: movieId,
      });

      if (response.status === 200) {
        setFavoritedMovies((prevFavoritedMovies) => [
          ...prevFavoritedMovies,
          movieId,
        ]);
      }
    } catch (error) {
      console.error("Error al agregar película a favoritos", error);
    }
  };

  const removeFromFavorites = async (movieId) => {
    try {
      console.log("Quitando de favoritos:", movieId);
      const response = await service.post("/movies/deleteFromFavourites", {
        userId: activeUserId,
        movieId: movieId,
      });

      if (response.status === 200) {
        setFavoritedMovies((prevFavoritedMovies) =>
          prevFavoritedMovies.filter((id) => id != movieId)
        );
      }
    } catch (error) {
      console.error("Error al quitar película de favoritos", error);
    }
  };

  const contextValue = {
    favoritedMovies,
    setFavoritedMovies,
    loadingFavorites,
    addToFavorites,
    removeFromFavorites,
    isMovieFavorited
    };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};