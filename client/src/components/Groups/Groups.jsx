import React, { useState, useEffect } from 'react';
import './Groups.css';

const Groups = () => {
    const [channels, setChannels] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState('');
    const [selectedCampaign, setSelectedCampaign] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [groupName, setGroupName] = useState('');
    const [selectedChannelIds, setSelectedChannelIds] = useState([]);

    const fetchRegions = async () => {
        try {
            const response = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/groups');
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
                console.log('fetching channels');
                const response = await fetch(`https://marketing-campaign-management-system-server\.vercel\.app/getchannel/${selectedChannel}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
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
                const response = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/campaign');
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
    }, [selectedChannel]);

    const handleCreateGroup = async () => {
        try {
            const response = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/group', {
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
    
            const groupId = data.group.id;
    
            const addChannelsResponse = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/channel/addtogroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    group_id: groupId,
                    channel_ids: selectedChannelIds
                })
            });
            if (!addChannelsResponse.ok) {
                throw new Error('Failed to add channels to group');
            }
            console.log('Channels added to group successfully');
    
            fetchRegions();
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };
    

    const handleAssignGroup = async () => {
        try {
            const response = await fetch('https://marketing-campaign-management-system-server\.vercel\.app/campaign/assigngroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    region_name: selectedRegion,
                    campaign_names: selectedCampaign
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
                        <option value="">Select channel type</option>
                        <option value="TV">TV</option>
                        <option value="Radio">Radio</option>
                        <option value="Billboard">Billboard</option>
                        <option value="Web-site">Web site</option>
                        <option value="Display">Display</option>
                    </select>

                    <div className="checkbox-container">
                        <span>Select channels:</span>
                        {channels.map(channel => (
                            <div key={channel.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={channel.id}
                                    value={channel.id}
                                    checked={selectedChannelIds.includes(channel.id)}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        if (isChecked) {
                                            setSelectedChannelIds(prev => [...prev, channel.id]);
                                        } else {
                                            setSelectedChannelIds(prev => prev.filter(item => item !== channel.id));
                                        }
                                    }}
                                />
                                <label htmlFor={channel.id}>{channel.channel}</label>
                            </div>
                        ))}
                    </div>

                    <button className='btn-group' onClick={handleCreateGroup}>Create Group</button>
                    <div className="checkbox-container">
                        <span>Select campaign:</span>
                        {campaigns.map(campaign => (
                            <div key={campaign.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={campaign.id}
                                    value={campaign.name}
                                    checked={selectedCampaign.includes(campaign.name)}
                                    onChange={(e) => {
                                        const isChecked = e.target.checked;
                                        if (isChecked) {
                                            setSelectedCampaign(prev => [...prev, campaign.name]);
                                        } else {
                                            setSelectedCampaign(prev => prev.filter(item => item !== campaign.name));
                                        }
                                    }}
                                />
                                <label htmlFor={campaign.id}>{campaign.name}</label>
                            </div>
                        ))}
                    </div>

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
