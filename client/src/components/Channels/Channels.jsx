import React, { useState, useEffect } from 'react';
import './Channels.css';

const Channels = () => {
  const [types, setTypes] = useState([]);
  const [addMediaType, setAddMediaType] = useState('');
  const [updateMediaType, setUpdateMediaType] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    getAllChannels();
  }, []);

  const getAllChannels = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/channel', {
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
      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/channel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: addMediaType }),
      });

      if (!response.ok) {
        throw new Error('Failed to add media type');
      }

      setAddMediaType('');
      getAllChannels();
    } catch (error) {
      console.error('Error adding media type:', error);
    }
  };

  const deleteChannel = async (id) => {
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/channel/${id}`, {
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

  const handleEditClick = (channel) => {
    setSelectedChannel(channel);
    setUpdateMediaType(channel.name);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleUpdateChannel = async () => {
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/channel/${selectedChannel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: updateMediaType }),
      });

      if (!response.ok) {
        throw new Error('Failed to update channel');
      }

      setIsPopupOpen(false);
      getAllChannels();
    } catch (error) {
      console.error('Error updating channel:', error);
    }
  };

  return (
    <div className="task-manager-container">
      <div className="form-container">
        <div className="input-wrapper">
          <select
            className="input-select"
            value={addMediaType}
            onChange={(e) => setAddMediaType(e.target.value)}
            disabled={isPopupOpen}
          >
            <option value="">Select channel</option>
            <option value="TV">TV</option>
            <option value="Radio">Radio</option>
            <option value="Billboard">Billboard</option>
            <option value="Web-site">Web site</option>
            <option value="Display">Display</option>
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
                  <button className="btn-edit" onClick={() => handleEditClick(type)}>✏️</button>
                  <button className="btn-delete" onClick={() => deleteChannel(type.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {isPopupOpen && (
        <div className="popup-background">
            <div className="popup-content">
              <div className="form-container">
                <div className="input-wrapper">
                  <select
                    className="input-select"
                    value={updateMediaType}
                    onChange={(e) => setUpdateMediaType(e.target.value)}
                  >
                    <option value="">Select channel</option>
                    <option value="TV">TV</option>
                    <option value="Radio">Radio</option>
                    <option value="Billboard">Billboard</option>
                    <option value="Web-site">Web site</option>
                    <option value="Display">Display</option>
                  </select>
                </div>
                <button
                  className="btn-update"
                  onClick={handleUpdateChannel}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{ backgroundColor: isHovered ? '#415981' : '#2B3D5B' }}
                >
                  Update
                </button>
                <button className="btn-close" onClick={handleClosePopup}></button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default Channels;
