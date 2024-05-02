import React, { useState, useEffect } from 'react';
import './Groups.css';

const Groups = () => {
    const [channels, setChannels] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [groupName, setGroupName] = useState('');

    const fetchRegions = async () => {
        try {
            const response = await fetch('http://localhost:3000/groups');
            if (!response.ok) {
                throw new Error('Failed to fetch regions');
            }
            const data = await response.json();
            setRegions(data);
        } catch (error) {
            console.error('Error fetching regions:', error);
        }
    };

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await fetch('http://localhost:3000/channel');
                if (!response.ok) {
                    throw new Error('Failed to fetch channels');
                }
                const data = await response.json();
                setChannels(data);
            } catch (error) {
                console.error('Error fetching channels:', error);
            }
        };
        fetchChannels();

        const fetchCampaigns = async () => {
            try {
                const response = await fetch('http://localhost:3000/campaign');
                if (!response.ok) {
                    throw new Error('Failed to fetch campaigns');
                }
                const data = await response.json();
                setCampaigns(data);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
            }
        };
        fetchCampaigns();

        fetchRegions(); 
    }, []);

    const handleCreateGroup = async () => {
        try {
            const response = await fetch('http://localhost:3000/group', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: groupName,
                    channel_type: selectedChannel
                })
            });
            if (!response.ok) {
                throw new Error('Failed to create group');
            }
            const data = await response.json();
            console.log(data);

            fetchRegions();
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

    const handleAssignGroup = async () => {
        try {
            const response = await fetch('http://localhost:3000/campaign/assigngroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    region_name: selectedRegion,
                    campaign_name: selectedCampaign
                })
            });
            if (!response.ok) {
                throw new Error('Failed to assign region');
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error assigning region:', error);
        }
    };

    return (
        <div className="groups-container">
            <div className="form-container">
                <div className="input-wrapper">
                    <input
                        className="input-name"
                        type="text"
                        placeholder="Region"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                    <select
                        className="input-select"
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value)}
                    >
                        <option value="">Select channel</option>
                        <option value="TV">TV</option>
                        <option value="Radio">Radio</option>
                        <option value="Billboard">Billboard</option>
                        <option value="Web-site">Web site</option>
                        <option value="Display">Display</option>
                    </select>
                    <button className='btn-group' onClick={handleCreateGroup}>Create Group</button>
                    <select
                        className="input-select"
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                    >
                        <option value="">Select campaign</option>
                        {campaigns.map(campaign => (
                            <option key={campaign.id} value={campaign.name}>{campaign.name}</option>
                        ))}
                    </select>
                    <select
                        className="input-select"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="">Select region</option>
                        {regions.map(region => (
                            <option key={region.id} value={region.name}>{region.name}</option>
                        ))}
                    </select>
                    <button className='btn-group' onClick={handleAssignGroup}>Assign Group</button>
                </div>
            </div>
        </div>
    );
};

export default Groups;
