import React from 'react';
// import { format } from 'date-fns';
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from 'react-router-dom';
import { useTask } from '../../Context/TaskContext';

const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const statusColors = {
    TODO: 'bg-red-400 text-red-900',
    IN_PROGRESS: 'bg-yellow-400 text-yellow-900',
    DONE: 'bg-green-400 text-blue-900',
  };

  const {setTasks} = useTask();
  const formatRelativeDate = (date) => {
    if (!date) return "N/A";
    return `${formatDistanceToNow(new Date(date), { addSuffix: true })}`;
  };

  const handleCardClick = () => {
    setTasks((prevTask) => ({
      ...prevTask,
      [task.taskId] : task
    }))
    navigate(`/task/${task.taskId}`);
  }

  return (
    <div className="relative w-96 bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between" onClick={handleCardClick}>
      {/* Status Badge */}
      <div
        className={`absolute top-3 right-4 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[task.status]}`}
      >
        {task.status}
      </div>
  
      {/* Content */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{task.description}</p>
      </div>
  
      {/* Footer */}
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>Created: {formatRelativeDate(task.createdDate)}</span>
        <span>Due: {formatRelativeDate(task.dueDate)}</span>
      </div>
    </div>
  );
}
export default TaskCard;  