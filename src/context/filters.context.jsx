import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    genre: "",
    minYear: "",
    streamingProvider: "",
  });

  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState("desc");
  const [streamingProvider, setStreamingProvider] = useState("all");

  const updateStreamingProvider = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      streamingProvider: value,
    }));
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
    streamingProvider,
    updateStreamingProvider,
    sortBy,
    sortOrder,
    updateSortBy,
    updateSortOrder,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used inside FilterProvider");
  }
  return context;
};
