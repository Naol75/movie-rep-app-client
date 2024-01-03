import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    genre: 'all',
    minYear: 2023,
  });

  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState('desc');
  const [movies, setMovies] = useState([]);

  const updateFilters = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  const updateSortBy = (value) => {
    setSortBy(value);
  };

  const updateSortOrder = (value) => {
    setSortOrder(value);
  };


  const contextValue = {
    filters, 
    setFilters, 
    updateFilters, 
    movies, 
    setMovies,
    sortBy,
    sortOrder,
    updateSortBy,
    updateSortOrder,
  };

  return (
    <FilterContext.Provider value={ contextValue }>
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