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
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState(true)

  const addToFavorites = async (movieTitle) => {
    try {
      console.log("User id:", activeUserId);
      const favoritesResponse = await service.get("/movies/getAllFavourites", {
        params: { userId: activeUserId },
      });
      setFavoriteMovies(favoritesResponse);
      console.log(favoriteMovies)
      if (favoritesResponse.status === 200) {
        const currentFavorites = favoritesResponse.data.favouriteItems;
        const isAlreadyFavorited = currentFavorites.includes(movieTitle.toLowerCase());
  
        if (isAlreadyFavorited) {
          console.log("Movie title already in favs:", movieTitle)
          await removeFromFavorites(movieTitle);
        } else {
          const response = await service.post("/movies/addToFavourites", {
            userId: activeUserId,
            movieTitle: movieTitle,
          });
  
          if (response.status === 200) {
            setIsFavorited(true);
          }
        }
      }
    } catch (error) {
      console.error("Error al agregar o quitar película de favoritos", error);
    }
  };
  const removeFromFavorites = async (movieTitle) => {
    try {
      console.log("Deleting from favorites:", movieTitle);
      const response = await service.post("movies/deleteFromFavourites", {
        userId: activeUserId,
        movieTitle: movieTitle,
      });
  
      console.log("Response from delete request:", response);
  
      if (response.status === 200) {
        setIsFavorited(false);
      }
    } catch (error) {
      console.error("Error al quitar película de favoritos", error);
    }
  };

  const contextValue = {
    favoriteMovies,
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