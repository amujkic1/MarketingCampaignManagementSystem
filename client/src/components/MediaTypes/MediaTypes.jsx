import React, { useState, useEffect } from 'react';
import './MediaTypes.css';

const MediaTypes = () => {
  const [types, setTypes] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [isHovered, setIsHovered] = useState(false); // Dodali smo stanje za praćenje hovera

  useEffect(() => {
    getAllMedia();
  }, []); // Pozivamo funkciju za dohvaćanje medija pri prvom renderiranju

  const getAllMedia = async () => {
    try {
      const response = await fetch('http://localhost:3000/media', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }

      const mediaData = await response.json();
      setTypes(mediaData); // Postavljamo stanje tasks na osnovu dobivenih podataka
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };
  const addMediaType = async () => {
    try {
      const response = await fetch('http://localhost:3000/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: mediaType }), // Šaljemo ime novog medija
      });

      if (!response.ok) {
        throw new Error('Failed to add media type');
      }
      await response.json(); // Nema potrebe za spremanjem odgovora u varijablu
      setMediaType(''); // Resetujemo stanje mediaType

      getAllMedia();
    } catch (error) {
      console.error('Error adding media type:', error);
    }
  };

  /* const addTask = () => {
     if (!newTask || !mediaType) return;
     setTasks([...tasks, { name: newTask, type: mediaType }]);
     setNewTask('');
     setMediaType('');
   };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };
*/
const deleteMediaType = async (id) => {
  try {
    const response = await fetch(`http://localhost:3000/media/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete media type');
    }

    getAllMedia();
  } catch (error) {
    console.error('Error deleting media type:', error);
  }
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
            <option value="">Select media type</option>
            <option value="Image">Image</option>
            <option value="Image with text">Image with text</option>
            <option value="Video">Video</option>
            <option value="Link">Link</option>
          </select>

        </div>
        <button
          className="btn-add"
          onClick={addMediaType}
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
              <th>MEDIA TYPE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type, index) => (
              <tr key={index}>
                <td>{type.name}</td>{/* Promijenjen prikaz podataka */}
                <td>
                  <button className="btn-edit" onClick={() => { }}>✏️</button>
                  <button className="btn-delete" onClick={() => deleteMediaType(type.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default MediaTypes;
