// TaskContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TaskContext = createContext();

export const useTask = () => {
  return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});

  const fetchTaskById = async (taskId) => {
    if (tasks[taskId]) return;

    try {
        const token = JSON.parse(localStorage.getItem('token'));

        const response = await axios.get(`http://localhost:8083/task/fetchTask`, {
        params: { taskId },
        headers: {
          'Authorization': `Bearer ${token}`, 
        }});
        
        const taskData = response.data?.data; 
        console.log(response);
        
        if (taskData) {
          setTasks((prevTasks) => ({
            ...prevTasks,
            [taskId]: taskData,
          }));
        } else {
          console.warn(`Task with ID ${taskId} not found`);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    }
  return (
    <TaskContext.Provider value={{ tasks, setTasks, fetchTaskById }}>
      {children}
    </TaskContext.Provider>
  );
};
