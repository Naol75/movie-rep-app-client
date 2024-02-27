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

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoadingFavorites(true);
        const favoritesResponse = await service.get("/movies/getAllFavourites", {
          params: { userId: activeUserId },
        });
  
        if (favoritesResponse.status === 200) {
          const currentFavorites = favoritesResponse.data.favouriteItems || [];
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

  const addToFavorites = async (movieTitle) => {
    try {
      console.log("Añadiendo a favoritos:", movieTitle);
      const response = await service.post("/movies/addToFavourites", {
        userId: activeUserId,
        movieTitle: movieTitle,
      });

      if (response.status === 200) {
        setFavoritedMovies((prevFavoritedMovies) => [
          ...prevFavoritedMovies,
          movieTitle,
        ]);
      }
    } catch (error) {
      console.error("Error al agregar película a favoritos", error);
    }
  };

  const removeFromFavorites = async (movieTitle) => {
    try {
      console.log("Quitando de favoritos:", movieTitle);
      const response = await service.post("/movies/deleteFromFavourites", {
        userId: activeUserId,
        movieTitle: movieTitle,
      });

      if (response.status === 200) {
        setFavoritedMovies((prevFavoritedMovies) =>
          prevFavoritedMovies.filter((title) => title !== movieTitle)
        );
      }
    } catch (error) {
      console.error("Error al quitar película de favoritos", error);
    }
  };

  const contextValue = {
    favoritedMovies,
    loadingFavorites,
    addToFavorites,
    removeFromFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};