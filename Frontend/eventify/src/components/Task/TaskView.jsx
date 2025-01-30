import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useTask } from '../../Context/TaskContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskView = () => {

    const {taskId} = useParams();
    const {tasks, fetchTaskById} = useTask();
    const [task, setTask] = useState(null);
    const navigate = useNavigate();
    console.log(taskId);
 

    useEffect(() => {
        console.log(tasks);
        
        if(tasks[taskId]){
            setTask(tasks[taskId]);
        }
        else{
            fetchTaskById(taskId);
        }
    }, [taskId, tasks, fetchTaskById]);

    if(!task) return <div>Loading...</div>

    const handleEdit = () => {
        navigate(`/edit/${taskId}`);
    }

    const handleDelete = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        await axios.delete(`http://localhost:8083/task/deleteTask${task.taskId}`, {
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        }).then((res) => {
            console.log(res);
            toast.success("Task deleted successfully");
        })
        .catch(error=> {
            console.log(error);
            toast.error("Error occured during deletion: ", error);
        });
    }
    
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">{task.title}</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Category:</h3>
          <p className="text-gray-700">{task.category}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Description:</h3>
          <p className="text-gray-700">{task.description}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Priority:</h3>
          <p className="text-gray-700">{task.priority}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Status:</h3>
          <p className="text-gray-700">{task.status}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Due Date:</h3>
          <p className="text-gray-700">{new Date(task.dueDate).toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Start Date:</h3>
          <p className="text-gray-700">{new Date(task.startDate).toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Created Date:</h3>
          <p className="text-gray-700">{new Date(task.createdDate).toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Updated Date:</h3>
          <p className="text-gray-700">{new Date(task.updatedDate).toLocaleString()}</p>
        </div>
      </div>

      {/* Edit and Delete Icons */}
      <div className="flex justify-end mt-6 space-x-4">
        <button 
        onClick={handleEdit}
          className="text-blue-600 hover:text-blue-800"
        >
          <FaEdit className="inline-block mr-2" /> Edit
        </button>
        <button 
          className="text-red-600 hover:text-red-800"
          onClick={handleDelete}
        >
          <FaTrash className="inline-block mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

export default TaskView;
