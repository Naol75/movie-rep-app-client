import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import userIcon from "../assets/user-icon.png";
import { NavLink } from "react-router-dom";

const NavbarComp = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [elevation, setElevation] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [movieMenuOpen, setMovieMenuOpen] = useState(false);
  const [seriesMenuOpen, setSeriesMenuOpen] = useState(false);

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
    <Navbar expand="lg" className="bg-body-tertiary">

        <Navbar.Brand href="#home" className="mx-auto navbar-brand">
          <img className="logo-img" src={logo} alt="logo" />
        </Navbar.Brand>
    
      <Navbar.Toggle className="navbar-toggle" aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto navbar-nav">
          <NavDropdown title="MOVIES" id="movies-nav-dropdown" style={{ color: "white" }}>
            <NavLink to="/movies/popular" className="dropdown-item">
              Popular
            </NavLink>
            <NavLink to="/movies/now-playing" className="dropdown-item">
              Now Playing
            </NavLink>
            <NavLink to="/movies/upcoming" className="dropdown-item">
              Upcoming
            </NavLink>
            <NavLink to="/movies/top-rated" className="dropdown-item">
              Top Rated
            </NavLink>
          </NavDropdown>
          <NavDropdown title="SERIES" id="series-nav-dropdown" style={{ color: "white" }}>
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
          <Nav.Link href="#link" style={{ color: "white" }}>
            MY FAVOURITES
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Nav.Link href="#link" style={{ color: "white" }}>
        <img className="user-icon" src={userIcon} alt="user-icon" />
      </Nav.Link>
    </Navbar>
  );
};

export default NavbarComp;