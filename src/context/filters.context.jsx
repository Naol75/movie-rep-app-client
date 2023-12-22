import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    genre: 'all',
    minYear: 2023,
  });

  // Estado para las películas
  const [movies, setMovies] = useState([]);

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };


  return (
    <FilterContext.Provider value={{ filters, setFilters, updateFilters, movies, setMovies }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used inside FilterProvider');
  }
  return context;
};