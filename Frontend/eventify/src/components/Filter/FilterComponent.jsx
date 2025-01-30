import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
import { fetchCategories, fetchStatus, fetchPriorities } from "../AddTask/AddTask";
import FilterContext from "../../Context/FilterContext";
// import { useParams } from "react-router-dom";

const FilterComponent = () => {
  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [error, setError] = useState(null);
  const params = window.location.href;

  const { updateFilter, selectedFilters } = useContext(FilterContext);

  const [selectedFilters_, setselectedFilters_] = useState(selectedFilters);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // const token = JSON.parse(localStorage.getItem("token"));
        // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // console.log(token, "from filter");

        // Fetch filter options from API
        const [categoryData, statusData, priorityData] = await Promise.all([
          fetchCategories(),
          fetchStatus(),
          fetchPriorities(),
        ]);

        // const categoryData = await fetchCategories();
        // const statusData = await fetchStatus();
        // const priorityData = await fetchPriorities();
        

        console.log(categoryData, statusData, priorityData);

        // Update state with fetched data
        setCategories(categoryData || []); // Default to empty array if no data
        setStatuses(statusData || []);
        setPriorities(priorityData || []);
      } catch (error) {
        
        console.error("Failed to fetch filter options:", error);
        setError(error.message);
      }
    };

    fetchFilterOptions();
  }, [params]);

  const handleCheckboxChange = (key, value, isChecked) => {
    setselectedFilters_((prevFilters) => {
      const currentFilter = Array.isArray(prevFilters[key]) ? prevFilters[key] : [];
      return {
        ...prevFilters,
        [key]: isChecked
          ? [...currentFilter, value] // Add the value if checked
          : currentFilter.filter((item) => item !== value), // Remove if unchecked
      };
    });
  };

  const applyFilters = () => {
    console.log("Filters applied:", selectedFilters_);
    updateFilter('category', selectedFilters_.category);
    updateFilter('status', selectedFilters_.status);
    updateFilter('priority', selectedFilters_.priority);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Filter Tasks</h2>

      {/* Category Filter */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-1">Category</h3>
        <div className="space-y-1">
          {!error && categories.length > 0 ? (
            categories.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-5 text-blue-600"
                  checked={
                    Array.isArray(selectedFilters_.category) &&
                    selectedFilters_.category.includes(category)
                  }
                  onChange={(e) =>
                    handleCheckboxChange("category", category, e.target.checked)
                  }
                />
                <span className="text-gray-700">{category}</span>
              </label>
            ))
          ) : (
            <div>Loading categories...</div>
          )}
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-1">Status</h3>
        <div className="space-y-1">
          {!error && statuses.length > 0 ? (
            statuses.map((status) => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-5 text-blue-600"
                  checked={
                    Array.isArray(selectedFilters_.status) &&
                    selectedFilters_.status.includes(status)
                  }
                  onChange={(e) =>
                    handleCheckboxChange("status", status, e.target.checked)
                  }
                />
                <span className="text-gray-700">{status}</span>
              </label>
            ))
          ) : (
            <div>Loading statuses...</div>
          )}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-1">Priority</h3>
        <div className="space-y-1">
          {!error && priorities.length > 0 ? (
            priorities.map((priority) => (
              <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-5 text-blue-600"
                  checked={
                    Array.isArray(selectedFilters_.priority) &&
                    selectedFilters_.priority.includes(priority)
                  }
                  onChange={(e) =>
                    handleCheckboxChange("priority", priority, e.target.checked)
                  }
                />
                <span className="text-gray-700">{priority}</span>
              </label>
            ))
          ) : (
            <div>
        
            {!error && <span>Loading priorities...</span>}

  
            {error && <div className="text-red-500">Error: {error}</div>}
              </div>
          )}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterComponent;
