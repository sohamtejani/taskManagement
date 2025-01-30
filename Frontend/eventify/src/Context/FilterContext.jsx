import React, { createContext, useState, useEffect } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    status: [],
    priority: [],
    dueDate: null,
  });

  const updateFilter = (key, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <FilterContext.Provider
      value={{
        categories,
        statuses,
        priorities,
        selectedFilters,
        updateFilter,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
