import {
  AppBar,
  Toolbar,
  Button,
  InputBase,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { useRef } from "react";
import userIcon from "../assets/user-icon.png";

const Navbar = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [elevation, setElevation] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const inputRef = useRef(null);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setSearchVisible(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    setElevation(scrollTop > 0 ? 0.5 : 0);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="navbar-div">
      <AppBar position="static" elevation={elevation} className="navbar">
        <Toolbar className="toolbar">
          <img
            src={logo}
            style={{
              width: "180px",
              marginLeft: "-10px",
              marginTop: "0",
              marginRight: "20px",
              marginBottom: "8px",
            }}
            alt="logo"
          />

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ fontSize: "0.8rem", marginRight: "10px" }}
            onMouseOver={handleMenuOpen}
            onClick={handleMenuOpen}
          >
            MOVIES
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem component={Link} to="/movies/popular">
              Popular
            </MenuItem>
            <MenuItem component={Link} to="/movies/now-playing">
              Now Playing
            </MenuItem>
            <MenuItem component={Link} to="/movies/upcoming">
              Upcoming
            </MenuItem>
            <MenuItem component={Link} to="/movies/top-rated">
              Top Rated
            </MenuItem>
          </Menu>
          <Button
            sx={{ fontSize: "0.8rem" }}
            className="nav-link"
            component={Link}
            to="/tvshows"
            color="inherit"
          >
            SERIES
          </Button>
          <Button
            sx={{ fontSize: "0.8rem" }}
            className="nav-link"
            component={Link}
            to="/my-favorites"
            color="inherit"
          >
            My Favourites
          </Button>
          <div className="search-bar" ref={inputRef}>
            <SearchIcon className="search-icon" onClick={toggleSearch} />
            {searchVisible && (
              <InputBase
                sx={{ color: "white" }}
                placeholder="Search..."
                onChange={handleSearchChange}
              />
            )}
          </div>
          <div className="nav-right">
            <Button
              sx={{ fontSize: "0.8rem" }}
              component={Link}
              to="/account"
              color="inherit"
            >
              <img
                src={userIcon}
                alt="user-image"
                style={{ width: "2.3rem" }}
              />
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
