import React, { useState, useEffect } from 'react';
import './Campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newName, setNewName] = useState('');
  const [channelType, setChannelType] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [channelOptions, setChannelOptions] = useState([]);
  const [mediaOptions, setMediaOptions] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [updateName, setUpdateName] = useState('');
  const [updateChannel, setUpdateChannel] = useState('');
  const [updateMediaType, setUpdateMediaType] = useState('');
  const [updateStartDate, setUpdateStartDate] = useState('');
  const [updateEndDate, setUpdateEndDate] = useState('');

  useEffect(() => {
    getAllChannels();
    getAllMedia();
    getAllCampaigns();
  }, []);

  const getAllCampaigns = async () => {
    try {
      const response = await fetch('http://localhost:3000/campaign', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const campaignData = await response.json();
      setCampaigns(campaignData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const createCampaign = async () => {
    try {
      const response = await fetch('http://localhost:3000/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newName,
          channels: channelType,
          mediatypes: mediaType,
          durationfrom: startDate,
          durationto: endDate
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      setNewName('');
      setChannelType('');
      setMediaType('');
      setStartDate('');
      setEndDate('');
      getAllCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

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
        throw new Error('Failed to fetch channels');
      }

      const channelData = await response.json();
      const channelNames = channelData.map(channel => channel.name);
      setChannelOptions(channelNames);
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

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
      const mediaNames = mediaData.map(media => media.name);
      setMediaOptions(mediaNames);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const deleteCampaign = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/campaign/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      getAllCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleEditClick = (campaign) => {
    setSelectedCampaign(campaign);
    setUpdateName(campaign.name);
    setUpdateChannel(campaign.channels);
    setUpdateMediaType(campaign.mediatypes);
    setUpdateStartDate(campaign.durationfrom);
    setUpdateEndDate(campaign.durationto);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleUpdateCampaign = async () => {
    try {
      const response = await fetch(`http://localhost:3000/campaign/${selectedCampaign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updateName,
          channels: updateChannel,
          mediatypes: updateMediaType,
          durationfrom: updateStartDate,
          durationto: updateEndDate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update campaign');
      }

      setIsPopupOpen(false);
      getAllCampaigns();
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  return (
    <div className="campaigns-container">
      <div className="form-container">
        <div className="input-wrapper">
          <input
            className="input-name"
            type="text"
            placeholder="Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select
            className="input-select"
            value={channelType}
            onChange={(e) => setChannelType(e.target.value)}
          >
            <option value="">Select channel</option>
            {channelOptions.map((channel, index) => (
              <option key={index} value={channel}>{channel}</option>
            ))}
          </select>
          <select
            className="input-select"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            <option value="">Select media type</option>
            {mediaOptions.map((media, index) => (
              <option key={index} value={media}>{media}</option>
            ))}
          </select>
          <input
            className="input-date"
            type="date"
            placeholder="Start Date"
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            className="input-date"
            type="date"
            placeholder="End Date"
            value={endDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="btn-add"
          onClick={createCampaign}
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
              <th>NAME</th>
              <th>CHANNEL</th>
              <th>MEDIA TYPE</th>
              <th>DURATION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, index) => (
              <tr key={index}>
                <td>{campaign.name}</td>
                <td>{campaign.channels}</td>
                <td>{campaign.mediatypes}</td>
                <td>{`${campaign.durationfrom} - ${campaign.durationto}`}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditClick(campaign)}>✏️</button>
                  <button className="btn-delete" onClick={() => deleteCampaign(campaign.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && selectedCampaign && (
        <div className="popup-background">
          <div className="popup">
            <div className="popup-content">
              <div className="form-container">
                <div className="input-wrapper">
                  <input
                    className="input-name"
                    type="text"
                    placeholder="Name"
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}
                  />
                  <select
                    className="input-select"
                    value={updateChannel}
                    onChange={(e) => setUpdateChannel(e.target.value)}
                  >
                    <option value="">Select channel</option>
                    {channelOptions.map((channel, index) => (
                      <option key={index} value={channel}>{channel}</option>
                    ))}
                  </select>
                  <select
                    className="input-select"
                    value={updateMediaType}
                    onChange={(e) => setUpdateMediaType(e.target.value)}
                  >
                    <option value="">Select media type</option>
                    {mediaOptions.map((media, index) => (
                      <option key={index} value={media}>{media}</option>
                    ))}
                  </select>
                  <input
                    className="input-date"
                    type="date"
                    placeholder="Start Date"
                    value={updateStartDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setUpdateStartDate(e.target.value)}
                  />
                  <input
                    className="input-date"
                    type="date"
                    placeholder="End Date"
                    value={updateEndDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setUpdateEndDate(e.target.value)}
                  />
                </div>
                <button
                  className="btn-update"
                  onClick={handleUpdateCampaign}
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
        </div>
      )}
    </div>
  );
};

export default Campaigns;
