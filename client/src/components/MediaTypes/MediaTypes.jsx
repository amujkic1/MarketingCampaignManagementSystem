import React, { useState, useEffect } from 'react';
import './MediaTypes.css';

const MediaTypes = () => {
  const [types, setTypes] = useState([]);
  const [mediaType, setMediaType] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedMediaType, setSelectedMediaType] = useState(null);
  const [updateMediaType, setUpdateMediaType] = useState('');

  useEffect(() => {
    getAllMedia();
  }, []);

  const getAllMedia = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/media', {
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
      setTypes(mediaData);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const addMediaType = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/media', {
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
      getAllMedia();
    } catch (error) {
      console.error('Error adding media type:', error);
    }
  };

  const deleteMediaType = async (id) => {
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/media/${id}`, {
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

  const handleEditClick = (mediaType) => {
    setSelectedMediaType(mediaType);
    setUpdateMediaType(mediaType.name);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleUpdateMediaType = async () => {
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/media/${selectedMediaType.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: updateMediaType }),
      });

      if (!response.ok) {
        throw new Error('Failed to update media type');
      }

      setIsPopupOpen(false);
      getAllMedia();
    } catch (error) {
      console.error('Error updating media type:', error);
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
            disabled={isPopupOpen}
          >
            <option value="">Select media type</option>
            <option value="Image">Image</option>
            <option value="Image with text">Image with text</option>
            <option value="Video">Video</option>
            <option value="Link">Link</option>
            <option value="Audio">Audio</option>
            <option value="Text">Text</option>
            <option value="Banner">Banner</option>
          </select>
        </div>
        <button
          className="btn-add"
          onClick={addMediaType}
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
              <th>MEDIA TYPE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {types.map((type, index) => (
              <tr key={index}>
                <td>{type.name}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditClick(type)}>✏️</button>
                  <button className="btn-delete" onClick={() => deleteMediaType(type.id)}>🗑️</button>
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
                    <option value="">Select media type</option>
                    <option value="Image">Image</option>
                    <option value="Image with text">Image with text</option>
                    <option value="Video">Video</option>
                    <option value="Link">Link</option>
                    <option value="Audio">Audio</option>
                    <option value="Text">Text</option>
                    <option value="Banner">Banner</option>
                  </select>
                </div>
                <button
                  className="btn-update"
                  onClick={handleUpdateMediaType}
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

export default MediaTypes;
