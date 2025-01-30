import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import TaskCard from "../Task/TaskCard";
import FilterContext from "../../Context/FilterContext";
import FilterComponent from "../Filter/FilterComponent";

const Home = () => {
  const [taskList, setTaskList] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedFilters } = useContext(FilterContext);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem("token"));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      try {
        const response = await axios.get("http://localhost:8083/task/fetchAllTask");
        console.log(response);
        setTaskList(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter tasks based on the selected filters
  const filteredTasks = taskList.filter((task) => {
    const categoryMatch =
      selectedFilters.category.length === 0 || selectedFilters.category.includes(task.category);
    const statusMatch =
      selectedFilters.status.length === 0 || selectedFilters.status.includes(task.status);
    const priorityMatch =
      selectedFilters.priority.length === 0 || selectedFilters.priority.includes(task.priority);

    return categoryMatch && statusMatch && priorityMatch;
  });

  console.log(filteredTasks);
  
  return (
    <div className="flex p-4 space-x-8">
      {/* Filter Component on the left */}
      <div className="w-64 bg-white shadow-lg border-r">
        <FilterComponent />
      </div>

      {/* Main Content on the right */}
      <div className="flex-1">
        {error && <div className="text-red-500">Error: {error.message}</div>}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, ind) => <TaskCard key={ind} task={task} />)
            ) : (
              <div>No tasks found matching the filters.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
