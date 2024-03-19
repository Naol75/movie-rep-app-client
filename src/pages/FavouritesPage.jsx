import { useEffect, useState, useContext } from "react";
import { MoonLoader } from "react-spinners";
import HeaderCompDiscover from "../components/HeaderCompDiscover.jsx";
import service from "../services/api";
import "../styles/Card.css";
import { AuthContext } from "../context/auth.context";
import { useFavoritesContext } from "../context/favorites.context.jsx";
import FavouriteCard from "../components/FavouriteCard.jsx";

function FavouritesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const authContext = useContext(AuthContext);
  const { activeUserId, userRegion } = authContext;
  const [items, setItems] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [streamingProviders, setStreamingProviders] = useState([])
  const { addToFavorites, removeFromFavorites, favoritedMovies } =
    useFavoritesContext();

  useEffect(() => {
    const fetchFavouriteItems = async () => {
      try {
        const userId = activeUserId;
        const response = await service.get("/movies/getAllFavourites", {
          params: { userId },
        });
        console.log("Response from getAllFavourites:", response.data);
        if (response.status === 200) {
          const favouriteItems = response.data.favouriteItems;
          console.log("Titles:", favouriteItems);
          setIsPageLoading(true);
          fetchItemsData(favouriteItems);
          console.log("Favourite Items:", favouriteItems)
        }
      } catch (error) {
        console.error("Error getting User's favourites", error);
      }
    };

    const fetchItemsData = async (ids) => {
      try {
        console.log("IDs received for fetching data:", ids);
        if (ids) {
          const itemsDataPromises = ids.map(async (id) => {
            let response;
            console.log("id:", id)
            try {
              if (userRegion === "ES") {
                if (id.length < 5) {
                  response = await service.get(
                    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=es-ES`
                  );
                } else {
                  response = await service.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=es-ES`
                  );
                }
              }
              else {
                if (id.length < 5) {
                  response = await service.get(
                    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
                  );
                } else {
                  response = await service.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
                  );
                }
              }

              console.log("response:", response.data);
              return response.data;
            } catch (error) {
              if (error.response && error.response.status === 404) {
                console.log("Error 404: Item not found. Trying alternative API...");
                if (id.length < 5) {
                  response = await service.get(
                    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=${userRegion}-ES`
                  );
                } else {
                  response = await service.get(
                    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=${userRegion}-ES`
                  );
                }
                console.log("Alternative API response:", response.data);
                return response.data;
              } else {
                console.error("Error fetching item data", error);
                return null;
              }
            }
          });
          const itemsDataResults = await Promise.all(itemsDataPromises);
          setItems(itemsDataResults.filter(item => item !== null));
          setIsPageLoading(false);
        }
      } catch (error) {
        console.error("Error fetching items data", error);
      }
    };

    fetchFavouriteItems();
  }, [activeUserId, apiKey, userRegion, favoritedMovies]);

  return (
    <div>
      <div className="discover-header">
        <HeaderCompDiscover />
      </div>
      <div className="favourite-grid">
      {items.map((movie) => (
        <FavouriteCard
        key={movie.id}
        movie={movie}
          heartButtonFavourite={true}
          items={items}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          streamingProviders={streamingProviders}
        />
      )
      )}
      </div>
      {isPageLoading && (
        <div
          className="loader-container"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <MoonLoader color="red" size={50} loading={true} />
        </div>
      )}
    </div>
  );
}

export default FavouritesPage;
