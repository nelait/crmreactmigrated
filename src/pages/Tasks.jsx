import React, { useState } from 'react';
import axios from 'axios';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const response = await axios.get('/api/tasks');
    setTasks(response.data);
  };

  return (
    <div className='tasks'>
      <h1>Tasks</h1>
      <button onClick={fetchTasks}>Load Tasks</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
