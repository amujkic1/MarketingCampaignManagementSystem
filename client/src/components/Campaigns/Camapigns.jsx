import React, { useState } from 'react';
import './Campaigns.css';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newName, setNewName] = useState('');
  const [channelType, setChannelType] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const addCampaign = () => {
    if (!newName || !channelType || !mediaType || !startDate || !endDate) return;
    setCampaigns([...campaigns, {
      name: newName,
      channel: channelType,
      media: mediaType,
      duration: `${startDate} - ${endDate}`
    }]);
    setNewName('');
    setChannelType('');
    setMediaType('');
    setStartDate('');
    setEndDate('');
  };

  const deleteCampaign = (index) => {
    setCampaigns(campaigns.filter((_, i) => i !== index));
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
            <option value="TV">TV</option>
            <option value="Radio">Radio</option>
            <option value="Billboard">Billboard</option>
            <option value="Web-site">Web site</option>
            <option value="Display">Display</option>
          </select>
          <select
            className="input-select"
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value)}
          >
            <option value="">Select media type</option>
            <option value="Social Media">Social Media</option>
            <option value="Print">Print</option>
            <option value="Online">Online</option>
          </select>
          <input
            className="input-date"
            type="date"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            className="input-date"
            type="date"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          className="btn-add"
          onClick={addCampaign}
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
                <td>{campaign.channel}</td>
                <td>{campaign.media}</td>
                <td>{campaign.duration}</td>
                <td>
                  <button className="btn-edit" onClick={() => { }}>✏️</button>
                  <button className="btn-delete" onClick={() => deleteCampaign(index)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Campaigns;
