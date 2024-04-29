import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newName, setNewName] = useState('');
  const [newRegion, setRegion] = useState('');
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
  const [updateRegion, setUpdateRegion] = useState('');
  const [updateChannel, setUpdateChannel] = useState('');
  const [updateMediaType, setUpdateMediaType] = useState('');
  const [updateStartDate, setUpdateStartDate] = useState('');
  const [updateEndDate, setUpdateEndDate] = useState('');
  const [oldChannel, setOldChannel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllChannels();
    getAllMedia();
    getAllCampaigns();
  }, []);

  const getAllCampaigns = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/campaign', {
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
      const response = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newName,
          region: newRegion,
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
      setRegion('');
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
      const response = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/channel', {
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
      const response = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/media', {
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

  const deleteCampaign = async (event, id) => {
    event.stopPropagation(); // Spriječi podizanje događaja
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server\.vercel\.app/campaign/${id}`, {
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

  const handleEditClick = (event, campaign) => {
    event.stopPropagation(); // Spriječi podizanje događaja
    setSelectedCampaign(campaign);
    setUpdateName(campaign.name);
    setUpdateRegion(campaign.region);
    setUpdateChannel(campaign.channels);
    setUpdateMediaType(campaign.mediatypes);
    setUpdateStartDate(campaign.durationfrom);
    setUpdateEndDate(campaign.durationto);
    setOldChannel(campaign.channels);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleUpdateCampaign = async () => {
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server\.vercel\.app/campaign/${selectedCampaign.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: updateName,
          region: updateRegion,
          channels: updateChannel,
          mediatypes: updateMediaType,
          durationfrom: updateStartDate,
          durationto: updateEndDate,
          oldChannel: oldChannel
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

  const handleCampaignClick = (campaignId) => {
    console.log("Clicked campaign ID:", campaignId);
    Cookies.set('campaignID', campaignId); 
    navigate('/campaign');
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
          <input
            className="input-region"
            type="text"
            placeholder="Region"
            value={newRegion}
            onChange={(e) => setRegion(e.target.value)}
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
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>REGION</th>
              <th>CHANNEL</th>
              <th>MEDIA TYPE</th>
              <th>DURATION</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, index) => (
              <tr key={index} onClick={() => handleCampaignClick(campaign.id)}>
                <td>{campaign.name}</td>
                <td>{campaign.region}</td>
                <td>{campaign.channels}</td>
                <td>{campaign.mediatypes}</td>
                <td>{`${campaign.durationfrom} - ${campaign.durationto}`}</td>
                <td>
                  <button className="btn-edit" onClick={(e) => handleEditClick(e, campaign)}>✏️</button>
                  <button className="btn-delete" onClick={(e) => deleteCampaign(e, campaign.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {isPopupOpen && selectedCampaign && (
        <div className="popup-background">
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
                  <input
                    className="input-region"
                    type="text"
                    placeholder="Region"
                    value={updateRegion}
                    onChange={(e) => setUpdateRegion(e.target.value)}
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
      )}
    </div>
  );
};

export default Campaigns;
