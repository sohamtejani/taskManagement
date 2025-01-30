import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { toast } from 'react-toastify';
import { useTask } from '../../Context/TaskContext';

const AddTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams(); // To get taskId from URL if editing
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableStatus, setAvailableStatus] = useState([]);
  const [availablePriorities, setAvailablePriorities] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const {tasks, fetchTaskById} = useTask();

    const formatDate = (date) => {
    return date.toISOString().slice(0, 16);
  };

  const [task, setTask] = useState({
    title: '',
    description: '',
    priority: 'LOW',
    status: 'TODO',
    category: 'WORK',
    dueDate: formatDate(new Date()),
    startDate: formatDate(new Date()),
  });

      
      const convertToLocalDate = (dateString) => {
          const date = new Date(dateString);
          return date; // This will convert to the local date format
        };
        useEffect(() => {
            console.log(tasks);
          
            if (tasks[taskId]) {
              // If the task exists, update the task state once
              const taskToUpdate = tasks[taskId];
              setTask({
                ...taskToUpdate,
                createdDate: convertToLocalDate(taskToUpdate.createdDate),
                dueDate: convertToLocalDate(taskToUpdate.dueDate),
                startDate: convertToLocalDate(taskToUpdate.startDate),
                updatedDate: convertToLocalDate(taskToUpdate.updatedDate),
              });
              console.log(task);
              
            } else {
              fetchTaskById(taskId);
            }
          }, [taskId, tasks, fetchTaskById]);
          

  useEffect(() => {
    const loadData = async () => {
      try {
        const categoriesData = await fetchCategories();
        const statusData = await fetchStatus();
        const prioritiesData = await fetchPriorities();

        setAvailableCategories(categoriesData);
        setAvailableStatus(statusData);
        setAvailablePriorities(prioritiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadData();


  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  useEffect(() => {
    const start = new Date(task.startDate);
    const due = new Date(task.dueDate);

    if (start <= due) {
      setErrorMessage('Start date must be greater than due date.');
    } else {
      setErrorMessage(null);
    }
  }, [task.startDate, task.dueDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem('token'));
    if (!token) {
      navigate('/login');
    }

    try {
      const formatToCustomDate = (date) => {
        const d = new Date(date);
        const day = d.toLocaleString('en-US', { weekday: 'short' });
        const month = d.toLocaleString('en-US', { month: 'short' });
        const dateNum = String(d.getDate()).padStart(2, '0');
        const time = d.toTimeString().split(' ')[0];
        const year = d.getFullYear();
        const timeZone = 'IST';
        return `${day} ${month} ${dateNum} ${time} ${timeZone} ${year}`;
      };

      const { title, description, category, priority, status, dueDate, startDate } = task;
      const formattedDueDate = formatToCustomDate(dueDate);
      const formattedStartDate = formatToCustomDate(startDate);

      const queryParams = new URLSearchParams({
        category,
        priority,
        status,
        dueDate: formattedDueDate,
        startDate: formattedStartDate,
      }).toString();

      if (taskId) {
        // Update task request (if editing)
        const response = await axios.put(
          `http://localhost:8083/task/update-task/${taskId}?${queryParams}`,
          { title, description },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        navigate('/');
        toast.success('Task updated successfully');
      } else {
        // Create new task request
        const response = await axios.post(
          `http://localhost:8083/task/upload?${queryParams}`,
          { title, description },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success('Task added successfully');
        // navigate('/');
        console.log(response);
      }
      
      console.log('Task saved successfully');
      setTask({
        title: '',
        description: '',
        priority: 'LOW',
        status: 'TODO',
        category: 'GENERAL',
        dueDate: formatDate(new Date()),
        startDate: formatDate(new Date()),
      });
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="max-w-2lg flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-2lg mx-auto bg-white p-6 rounded-lg shadow-xl">
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {taskId ? 'Edit Task' : 'Add New Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Task Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={task.title}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Task Description */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-semibold text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={task.description}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Task Priority */}
          <div className="mb-4">
            <label htmlFor="priority" className="block text-lg font-semibold text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availablePriorities.map((priority, index) => (
                <option key={index} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </div>

          {/* Task Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-lg font-semibold text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={task.status}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableStatus.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Task Category */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-lg font-semibold text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={task.category}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableCategories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Task Due Date */}
          <div className="mb-4">
            <label htmlFor="dueDate" className="block text-lg font-semibold text-gray-700">
              Due Date
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              name="dueDate"
              value={task.dueDate}
              onChange={handleDateChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Task Start Date */}
          <div className="mb-6">
            <label htmlFor="startDate" className="block text-lg font-semibold text-gray-700">
              Start Date
            </label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={task.startDate}
              onChange={handleDateChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {taskId ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
const token = JSON.parse(localStorage.getItem('token'));

export const fetchCategories = async () => {
  try {
    const response = await axios.get('http://localhost:8083/task/category', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchStatus = async () => {
  try {
    const response = await axios.get('http://localhost:8083/task/status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching status:', error);
    return [];
  }
};

export const fetchPriorities = async () => {
  try {
    const response = await axios.get('http://localhost:8083/task/priority', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching priorities:', error);
    return [];
  }
};

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate, useParams } from 'react-router-dom';
// import 'react-datetime-picker/dist/DateTimePicker.css';
// import 'react-calendar/dist/Calendar.css';
// import 'react-clock/dist/Clock.css';
// import { toast } from 'react-toastify';

// const AddTask = () => {
//     const navigate = useNavigate();
//     const { taskId } = useParams();  // Get taskId from URL if editing
//     const [availableCategories, setAvailableCategories] = useState([]);
//     const [availableStatus, setAvailableStatus] = useState([]);
//     const [availablePriorities, setAvailablePriorities] = useState([]);
//     const [errorMessage, setErrorMessage] = useState(null);
    
//     const formatDate = (date) => {
//         return date.toISOString().slice(0, 16);
//     };

//     const [task, setTask] = useState({
//         title: '',
//         description: '',
//         priority: 'LOW',
//         status: 'TODO',
//         category: 'WORK',
//         dueDate: formatDate(new Date()),
//         startDate: formatDate(new Date()),
//     });

//     // Utility to format date as 'yyyy-MM-ddThh:mm'
//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const categoriesData = await fetchCategories();
//                 const statusData = await fetchStatus();
//                 const prioritiesData = await fetchPriorities();

//                 setAvailableCategories(categoriesData);
//                 setAvailableStatus(statusData);
//                 setAvailablePriorities(prioritiesData);

//                 if (taskId) {
//                     // Fetch task data if we're editing
//                     const response = await axios.get(`http://localhost:8083/task/fetchTask/${taskId}`, {
//                         headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}` }
//                     });
//                     setTask({
//                         ...response.data,
//                         dueDate: formatDate(new Date(response.data.dueDate)),
//                         startDate: formatDate(new Date(response.data.startDate)),
//                     });
//                 }
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         loadData();
//     }, [taskId]); // Run again if taskId changes

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setTask((prevTask) => ({
//             ...prevTask,
//             [name]: value,
//         }));
//     };

//     const handleDateChange = (e) => {
//         const { name, value } = e.target;
//         setTask((prevTask) => ({
//             ...prevTask,
//             [name]: value,
//         }));
//     };

//     useEffect(() => {
//         const start = new Date(task.startDate);
//         const due = new Date(task.dueDate);

//         if (start <= due) {
//             setErrorMessage("Start date must be greater than due date.");
//         } else {
//             setErrorMessage(null);
//         }
//     }, [task.startDate, task.dueDate]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = JSON.parse(localStorage.getItem('token'));
//         if (!token) {
//             navigate('/login');
//         }

//         try {
//             const formatToCustomDate = (date) => {
//                 const d = new Date(date);
//                 const day = d.toLocaleString('en-US', { weekday: 'short' });
//                 const month = d.toLocaleString('en-US', { month: 'short' });
//                 const dateNum = String(d.getDate()).padStart(2, '0');
//                 const time = d.toTimeString().split(' ')[0];
//                 const year = d.getFullYear();
//                 const timeZone = 'IST';
//                 return `${day} ${month} ${dateNum} ${time} ${timeZone} ${year}`;
//             };

//             const { title, description, category, priority, status, dueDate, startDate } = task;
//             const formattedDueDate = formatToCustomDate(dueDate);
//             const formattedStartDate = formatToCustomDate(startDate);

//             const queryParams = new URLSearchParams({
//                 category,
//                 priority,
//                 status,
//                 dueDate: formattedDueDate,
//                 startDate: formattedStartDate,
//             }).toString();

//             if (taskId) {
//                 // PUT request for updating task
//                 const response = await axios.put(
//                     `http://localhost:8083/task/update/${taskId}?${queryParams}`,
//                     { title, description },
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }
//                 );
//                 toast.success("Task updated successfully");
//                 console.log('Task updated successfully:', response.data);
//             } else {
//                 // POST request for creating task
//                 const response = await axios.post(
//                     `http://localhost:8083/task/upload?${queryParams}`,
//                     { title, description },
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }
//                 );
//                 toast.success("Task added successfully");
//                 console.log('Task added successfully:', response.data);
//             }

//             setTask({
//                 title: '',
//                 description: '',
//                 priority: 'LOW',
//                 status: 'TODO',
//                 category: 'GENERAL',
//                 dueDate: formatDate(new Date()),
//                 startDate: formatDate(new Date()),
//             });
//         } catch (error) {
//             console.error('Error adding or updating task:', error);
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-xl mt-10">
//             {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//             <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">{taskId ? 'Edit Task' : 'Add New Task'}</h2>
//             <form onSubmit={handleSubmit}>
//                 {/* Form fields for task */}
//                 <div className="mb-4">
//                     <label htmlFor="title" className="block text-lg font-semibold text-gray-700">Title</label>
//                     <input
//                         type="text"
//                         id="title"
//                         name="title"
//                         value={task.title}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Task Description */}
//                 <div className="mb-4">
//                     <label htmlFor="description" className="block text-lg font-semibold text-gray-700">Description</label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         value={task.description}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Other fields like Priority, Status, etc. */}

//                 {/* Submit Button */}
//                 <div className="flex justify-center">
//                     <button
//                         type="submit"
//                         className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         {taskId ? 'Update Task' : 'Add Task'}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddTask;


// const token = JSON.parse(localStorage.getItem('token'));

// export const fetchCategories = async () => {
//     console.log(token);
    
//     try {
//         const response = await axios.get('http://localhost:8083/task/category', {
//             headers: {
//         Authorization: `Bearer ${token}`, 
//       }
//         });
//         const categories = response.data;  
//         // console.log(categories); 
//         return categories;
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         return []
//     }
// };

// export const fetchStatus = async () => {
//     try {
//         const response = await axios.get('http://localhost:8083/task/status', {
//             headers: {
//         Authorization: `Bearer ${token}`, 
//       }
//         });
//         const status = response.data;  
//         // console.log(status);  
//         return status;
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         return []
//     }
// };

// export const fetchPriorities = async () => {
//     try {
//         const response = await axios.get('http://localhost:8083/task/priority', {
//             headers: {
//         Authorization: `Bearer ${token}`,
//       }
//         });
//         const priority = response.data;  
//         // console.log(priority);
//         return priority;  
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         return []
//     }
// };

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import 'react-datetime-picker/dist/DateTimePicker.css';
// import 'react-calendar/dist/Calendar.css';
// import 'react-clock/dist/Clock.css';
// import { toast } from 'react-toastify';

// const AddTask = () => {
//     const navigate = useNavigate();
//     const [availableCategories, setAvailableCategories] = useState([]);
//     const [availableStatus, setAvailableStatus] = useState([]);
//     const [availablePriorities, setAvailablePriorities] = useState([]);
//     const [errorMessage, setErrorMessage] = useState(null);
//     const formatDate = (date) => {
//         return date.toISOString().slice(0, 16);
//     };
    
//     const [task, setTask] = useState({
//         title: '',
//         description: '',
//         priority: 'LOW',
//         status: 'TODO',
//         category: 'WORK',
//         dueDate: formatDate(new Date()),
//         startDate: formatDate(new Date()),
//     });

//     // Utility to format date as 'yyyy-MM-ddThh:mm'


//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 const categoriesData = await fetchCategories();
//                 const statusData = await fetchStatus();
//                 const prioritiesData = await fetchPriorities();

//                 setAvailableCategories(categoriesData);
//                 setAvailableStatus(statusData);
//                 setAvailablePriorities(prioritiesData);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         };

//         loadData();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setTask((prevTask) => ({
//             ...prevTask,
//             [name]: value,
//         }));
//     };

//     const handleDateChange = (e) => {
//         const { name, value } = e.target;
//         setTask((prevTask) => ({
//             ...prevTask,
//             [name]: value,
//         }));
//     };

//     useEffect(() => {
//         const start = new Date(task.startDate);
//         const due = new Date(task.dueDate);

//         if (start <= due) {
//             setErrorMessage("Start date must be greater than due date.");
//         } else {
//             setErrorMessage(null);
//         }
//     }, [task.startDate, task.dueDate]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const token = JSON.parse(localStorage.getItem('token'));
//         if (!token) {
//             navigate('/login');
//         }
//         try {
            
//             const formatToCustomDate = (date) => {
//                 const d = new Date(date);
    
//                 const day = d.toLocaleString('en-US', { weekday: 'short' }); // Thu
//                 const month = d.toLocaleString('en-US', { month: 'short' }); // Dec
//                 const dateNum = String(d.getDate()).padStart(2, '0'); // 26
//                 const time = d.toTimeString().split(' ')[0]; // 17:10:00
//                 const year = d.getFullYear(); // 2024
    
//                 // Manually replace time zone with IST
//                 const timeZone = 'IST';
    
//                 return `${day} ${month} ${dateNum} ${time} ${timeZone} ${year}`;
//             };
    
//             const { title, description, category, priority, status, dueDate, startDate } = task;
    
//             // Format the dates
//             const formattedDueDate = formatToCustomDate(dueDate);
//             const formattedStartDate = formatToCustomDate(startDate);
    
//             const queryParams = new URLSearchParams({
//                 category,
//                 priority,
//                 status,
//                 dueDate: formattedDueDate,
//                 startDate: formattedStartDate,
//             }).toString();

//         // Make the POST request with query parameters and the task body
//         const response = await axios.post(
//             `http://localhost:8083/task/upload?${queryParams}`,
//             { title, description }, // Body containing part of the Task object
//             {
//                 headers: { Authorization: `Bearer ${token}` },
//             }
//         );
//         console.log(response);

//             toast.success("Task added successfully");
//             console.log('Task added successfully:', response.data);
//             setTask({
//                 title: '',
//                 description: '',
//                 priority: 'LOW',
//                 status: 'TODO',
//                 category: 'GENERAL',
//                 dueDate: formatDate(new Date()),
//                 startDate: formatDate(new Date()),
//             });
//         } catch (error) {
//             console.error('Error adding task:', error);
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-xl mt-10">
//             {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//             <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add New Task</h2>
//             <form onSubmit={handleSubmit}>
//                 {/* Task Title */}
//                 <div className="mb-4">
//                     <label htmlFor="title" className="block text-lg font-semibold text-gray-700">Title</label>
//                     <input
//                         type="text"
//                         id="title"
//                         name="title"
//                         value={task.title}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Task Description */}
//                 <div className="mb-4">
//                     <label htmlFor="description" className="block text-lg font-semibold text-gray-700">Description</label>
//                     <textarea
//                         id="description"
//                         name="description"
//                         value={task.description}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Task Priority */}
//                 <div className="mb-4">
//                     <label htmlFor="priority" className="block text-lg font-semibold text-gray-700">Priority</label>
//                     <select
//                         id="priority"
//                         name="priority"
//                         value={task.priority}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         {availablePriorities.map((priority, index) => (
//                             <option key={index} value={priority}>
//                                 {priority}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Task Status */}
//                 <div className="mb-4">
//                     <label htmlFor="status" className="block text-lg font-semibold text-gray-700">Status</label>
//                     <select
//                         id="status"
//                         name="status"
//                         value={task.status}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         {availableStatus.map((status, index) => (
//                             <option key={index} value={status}>
//                                 {status}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Task Category */}
//                 <div className="mb-4">
//                     <label htmlFor="category" className="block text-lg font-semibold text-gray-700">Category</label>
//                     <select
//                         id="category"
//                         name="category"
//                         value={task.category}
//                         onChange={handleChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         {availableCategories.map((category, index) => (
//                             <option key={index} value={category}>
//                                 {category}
//                             </option>
//                         ))}
//                     </select>
//                 </div>

//                 {/* Task Due Date */}
//                 <div className="mb-4">
//                     <label htmlFor="dueDate" className="block text-lg font-semibold text-gray-700">Due Date</label>
//                     <input
//                         type="datetime-local"
//                         id="dueDate"
//                         name="dueDate"
//                         value={task.dueDate}
//                         onChange={handleDateChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Task Start Date */}
//                 <div className="mb-6">
//                     <label htmlFor="startDate" className="block text-lg font-semibold text-gray-700">Start Date</label>
//                     <input
//                         type="datetime-local"
//                         id="startDate"
//                         name="startDate"
//                         value={task.startDate}
//                         onChange={handleDateChange}
//                         required
//                         className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                 </div>

//                 {/* Submit Button */}
//                 <div className="flex justify-center">
//                     <button
//                         type="submit"
//                         className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                         Add Task
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddTask;

// const token = JSON.parse(localStorage.getItem('token'));

// export const fetchCategories = async () => {
//     console.log(token);
    
//     try {
//         const response = await axios.get('http://localhost:8083/task/category', {
//             headers: {
//         Authorization: `Bearer ${token}`, 
//       }
//         });
//         const categories = response.data;  
//         // console.log(categories); 
//         return categories;
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         return []
//     }
// };

// export const fetchStatus = async () => {
//     try {
//         const response = await axios.get('http://localhost:8083/task/status', {
//             headers: {
//         Authorization: `Bearer ${token}`, 
//       }
//         });
//         const status = response.data;  
//         // console.log(status);  
//         return status;
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         return []
//     }
// };

// export const fetchPriorities = async () => {
//     try {
//         const response = await axios.get('http://localhost:8083/task/priority', {
//             headers: {
//         Authorization: `Bearer ${token}`,
//       }
//         });
//         const priority = response.data;  
//         // console.log(priority);
//         return priority;  
//     } catch (error) {
//         console.error("Error fetching categories:", error);
//         return []
//     }
// };

