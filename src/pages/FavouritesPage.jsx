import { useEffect, useState, useContext } from "react";
import { MoonLoader } from "react-spinners";
import { useFilter } from "../context/filters.context";
import HeaderCompDiscover from "../components/HeaderCompDiscover.jsx";
import { Link } from "react-router-dom";
import service from "../services/api";
import clapperboardImage from "../assets/clapperboard.png";
import LikeButton from "../components/LikeButton.jsx";
import "../styles/Card.css";
import { AuthContext } from "../context/auth.context";


function FavouritesPage() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const authContext = useContext(AuthContext);
  const { activeUserId } = authContext;
  const [isHovered, setIsHovered] = useState(false);
  const [items, setItems] = useState([])
  const [isPageLoading, setIsPageLoading] = useState(false);

  const roundedRating = (rating) => parseFloat(rating).toFixed(2);
  const getDefaultImageUrl = () => {
    return clapperboardImage;
  };

  const getImageUrl = (path) => {
    const baseUrl = "https://image.tmdb.org/t/p/w300";
    return path ? `${baseUrl}${path}` : getDefaultImageUrl();
  };

  const mapGenreIdsToNames = (genreIds) => {
    const genreMap = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Science Fiction",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };
    return genreIds ? genreIds.map((genreId) => genreMap[genreId]).join(", ") : "";
  };

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

    const fetchItemsData = async (titles) => {
      try {
        console.log("Titles received for fetching data:", titles);
        if (titles) {
          const itemsDataPromises = titles.map(async (title) => {
            const response = await service.get(
              `https://api.themoviedb.org/3/search/multi?query=${title}&api_key=${apiKey}`
            );
            console.log("response:", response.data.results)
            return response.data.results[0];
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
  }, [activeUserId, apiKey]);



  return (
    <div>
      <div className="discover-header">
        <HeaderCompDiscover />
      </div>
      <div className="grid">
      {items.map((movie) => (
          <div
            className="card-container"
            key={movie.id}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="card-overlay">
              <div className="overview-in-overlay">
                <p>{movie.overview}</p>
                </div>
                <div className="heart-container">
              </div>
                <LikeButton
                  className="heart-button"
                  movieTitle={movie.title}
                />
    </div>
            <Link className="link" to={`/${movie.id}/movie-details`}>
              <img
                src={getImageUrl(movie.poster_path)}
                alt={`${movie.title} Poster`}
                className="poster"
              />
              <div className="info">
                <h3>
                  {movie.title} (
                  {movie.release_date && movie.release_date.substring(0, 4)})
                </h3>
                <p>{mapGenreIdsToNames(movie.genre_ids)}</p>
                <p className="rating">⭐ {roundedRating(movie.vote_average)}</p>
                <p className="vote-count">({movie.vote_count} Votes)</p>
              </div>
            </Link>
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

export default FavouritesPage;
