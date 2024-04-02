import React, { useState , useEffect} from 'react';
import './Channels.css';

const Channels = () => {
  const [types, setTypes] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    getAllChannels();
  }, []);

  const getAllChannels = async () => {
    try {
      const response = await fetch('http://localhost:3000/channel', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch channel');
      }

      const channelData = await response.json();
      setTypes(channelData);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const addChannel = async () => {
    try {
      const response = await fetch('http://localhost:3000/channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: mediaType }),
      });

      if (!response.ok) {
        throw new Error('Failed to add media type');
      }

      setMediaType('');
      getAllChannels();
    } catch (error) {
      console.error('Error adding media type:', error);
    }
  };

  const deleteChannel = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/channel/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete channel');
      }

      getAllChannels();
    } catch (error) {
      console.error('Error deleting channel:', error);
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
          onClick={addChannel}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ backgroundColor: isHovered ? '#415981' : '#2B3D5B' }}
        >
          Add
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>CHANNEL</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type, index) => (
              <tr key={index}>
                <td>{type.name}</td>
                <td>
                  <button className="btn-edit" >✏️</button>
                  <button className="btn-delete" onClick={() => deleteChannel(type.id)}>🗑️</button>
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
