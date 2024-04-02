import React, { useState } from 'react';
import './Channels.css';

const Channels = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [isHovered, setIsHovered] = useState(false); // Dodali smo stanje za praćenje hovera

  const addTask = () => {
    if (!newTask || !mediaType) return;
    setTasks([...tasks, { name: newTask, type: mediaType }]);
    setNewTask('');
    setMediaType('');
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="task-manager-container">
      <div className="form-container">
        <div className="input-wrapper">
          <select
            className="input-select"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            <option value="">Select channel</option>
            <option value="TV">TV</option>
            <option value="Radio">Radio</option>
            <option value="Billboard">Billboard</option>
            <option value="Web-site">Web site</option>
            <option value="Display">Display</option>
          </select>
          <input
            className="input-name"
            type="text"
            placeholder="Name"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </div>
        <button 
          className="btn-add" 
          onClick={addTask} 
          onMouseEnter={() => setIsHovered(true)} // Postavljamo isHovered na true kada miš uđe
          onMouseLeave={() => setIsHovered(false)} // Postavljamo isHovered na false kada miš izađe
          style={{ backgroundColor: isHovered ? '#415981' : '#2B3D5B' }} // Promjenjena boja prema isHovered stanju
        >
          Add
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>CHANNEL</th>
              <th>NAME</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{task.type}</td>
                <td>{task.name}</td>
                <td>
                  <button className="btn-edit" onClick={() => {}}>✏️</button>
                  <button className="btn-delete" onClick={() => deleteTask(index)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Channels;
