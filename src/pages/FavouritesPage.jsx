import { useEffect, useState, useContext } from "react";
import { MoonLoader } from "react-spinners";
import HeaderCompDiscover from "../components/HeaderCompDiscover.jsx";
import service from "../services/api";
import "../styles/Card.css";
import { AuthContext } from "../context/auth.context";
import { useFavoritesContext } from "../context/favorites.context.jsx";
import MovieCard from "../components/MovieCard.jsx";


function FavouritesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const authContext = useContext(AuthContext);
  const { activeUserId } = authContext;
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(false);
  const { addToFavorites, removeFromFavorites, favoritedMovies } =
  useFavoritesContext();


  useEffect(() => {
    const fetchFavouriteItems = async () => {
      try {
        const userId = activeUserId;
        const response = await service.get("/movies/getAllFavourites", { params: { userId } });
        console.log("Response from getAllFavourites:", response.data);
        if (response.status === 200) {
          const favouriteItems = response.data.favouriteItems;
          console.log("Titles:", favouriteItems);
          setIsPageLoading(true);
          fetchItemsData(favouriteItems);
        }
      } catch (error) {
        console.error("Error getting User's favourites", error);
      }
    };

    const fetchItemsData = async (id) => {
      try {
        console.log("Titles received for fetching data:", id);
        if (id) {
          const itemsDataPromises = id.map(async (id) => {
            const response = await service.get(
              `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
            );
            console.log("response:", response.data)
            return response.data;
          });
          const itemsDataResults = await Promise.all(itemsDataPromises);
          setItems(itemsDataResults);
          console.log("Items:", itemsDataResults);
          setIsPageLoading(false);
        }
      } catch (error) {
        console.error("Error fetching items data", error);
      }
    };

    fetchFavouriteItems();
  }, [activeUserId, apiKey, favoritedMovies]);

  



  return (
    <div>
      <div className="discover-header">
        <HeaderCompDiscover />
      </div>
      <MovieCard
      items={items}
      addToFavorites={addToFavorites}
      removeFromFavorites={removeFromFavorites}
      />
      {isPageLoading && (
        <div className="loader-container" style={{ textAlign: "center", marginTop: "20px" }}>
          <MoonLoader color="red" size={50} loading={true} />
        </div>
      )}
    </div>
  );
}

export default FavouritesPage;
