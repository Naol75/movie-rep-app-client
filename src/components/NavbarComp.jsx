import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import userIcon from "../assets/user-icon.png";
import { NavLink } from "react-router-dom";
import searchIcon from "../assets/lupa.png";
import service from "../services/api";
import clapperboardImage from "../assets/clapperboard.png";
import { Link } from "react-router-dom";
import { MoonLoader } from "react-spinners";

const NavbarComp = () => {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [showUserIcon, setShowUserIcon] = useState(true);
  const [smallScreen, setSmallScreen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [elevation, setElevation] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isUserActive } = useContext(AuthContext);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);

  const getDefaultImageUrl = () => clapperboardImage;
  const getImageUrl = (path) =>
    path ? `https://image.tmdb.org/t/p/w300${path}` : getDefaultImageUrl();
  const inputRef = useRef(null);

  const toggleSearch = () => {
    console.log("Toggle Search");
    setSearchResults([]);
    setSearchTerm("");
    setSearchVisible(!searchVisible);
  };

  const handleSearch = async () => {
    try {
      const response = await service.get(
        `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&api_key=${apiKey}&page=${page}`
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching movie info:", error);
    }
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    setPage(1);
    console.log("Search term changed. Fetching results...");
    handleSearch();
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setSearchVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setSearchVisible(false);
      setSearchResults([]);
      setSearchTerm("");
    }, 1000);
  };

  const fetchSearchResults = async () => {
    try {
      setIsPageLoading(true);
      console.log(`Loading page ${page}...`);
      const response = await service.get(
        `https://api.themoviedb.org/3/search/multi?query=${searchTerm}&api_key=${apiKey}&page=${page}`
      );
      console.log("Fetched results:", response.data.results);
      setSearchResults((prevResults) => [
        ...prevResults,
        ...response.data.results,
      ]);
    } catch (error) {
      console.error("Error fetching movie info:", error);
    } finally {
      setIsPageLoading(false);
      setIsLoadingResults(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchVisible(false);
      }
    };

    if (searchVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchVisible]);

  const handleResize = () => {
    const screenWidth = window.innerWidth;
    setSmallScreen(screenWidth < 376);
    setShowUserIcon(screenWidth > 576);
  };

  useEffect(() => {
    fetchSearchResults();
  }, [page]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Navbar expand="sm" className="navbar">
      <Navbar.Brand href="/movies/popular" className="navbar-brand">
        <img className="logo-img" src={logo} alt="logo" />
      </Navbar.Brand>

      <Navbar.Toggle
        className="navbar-toggle"
        aria-controls="basic-navbar-nav"
      />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto navbar-nav">
          <NavDropdown
            title="MOVIES"
            id="movies-nav-dropdown"
            style={{ color: "white" }}
          >
            <NavLink to="/movies/popular" className="dropdown-item">
              Popular
            </NavLink>
            <NavLink to="/movies/now-playing" className="dropdown-item">
              Now Playing
            </NavLink>
            <NavLink to="/movies/new-releases" className="dropdown-item">
              New Releases
            </NavLink>
            <NavLink to="/movies/top-rated" className="dropdown-item">
              Top Rated
            </NavLink>
          </NavDropdown>
          <NavDropdown
            title="SERIES"
            id="series-nav-dropdown"
            style={{ color: "white" }}
          >
            <NavLink to="/series/popular" className="dropdown-item">
              Popular
            </NavLink>
            <NavLink to="/series/airing-today" className="dropdown-item">
              Airing Today
            </NavLink>
            <NavLink to="/series/on-tv" className="dropdown-item">
              On TV
            </NavLink>
            <NavLink to="/series/top-rated" className="dropdown-item">
              Top Rated
            </NavLink>
          </NavDropdown>
          <Nav.Link href="/discover" style={{ color: "white" }}>
            DISCOVER
          </Nav.Link>
          {smallScreen && !isUserActive && (
            <Nav.Link href="/register" style={{ color: "white" }}>
              REGISTER
            </Nav.Link>
          )}
          {isUserActive && (
            <Nav.Link href="/my-favourites" style={{ color: "white" }}>
              FAVOURITES
            </Nav.Link>
          )}
          {smallScreen && isUserActive && (
            <Nav.Link href="/account" style={{ color: "white" }}>
              MY ACCOUNT
            </Nav.Link>
          )}

          <div className="search-bar" onMouseLeave={handleMouseLeave}>
            <img
              className="search-icon"
              style={{ marginLeft: "0.7vw", width: "1.2em" }}
              onClick={toggleSearch}
              src={searchIcon}
              alt="search"
            />
            {searchVisible && (
              <div className="search-results">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  ref={inputRef}
                  autoFocus
                  spellCheck="false"
                />
                {searchResults.length > 0 && (
                  <div ref={inputRef} id="searched-items-display">
                    {searchResults.map((item) => (
                      <Link
                        to={`/${item.id}/movie-details`}
                        className="searched-item-link"
                        key={item.id}
                      >
                        <div className="list-item">
                          <img
                            src={getImageUrl(item.poster_path)}
                            alt={item.title}
                            className="searched-item-image"
                          />
                          <p className="searched-item-title">
                            {item.title || item.original_title || item.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Nav>
      </Navbar.Collapse>
      <NavLink className="login-btn" to="/login" style={{ color: "white" }}>
        {!isUserActive && "LOGIN"}
      </NavLink>
      {isPageLoading && (
        <div
          className="loader-container"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <MoonLoader color="red" size={50} loading={true} />
        </div>
      )}
    </Navbar>
  );
};

export default NavbarComp;
