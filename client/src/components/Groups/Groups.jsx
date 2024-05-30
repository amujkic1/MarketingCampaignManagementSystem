import React, { useState, useEffect } from 'react';
import './Groups.css';

const Groups = () => {
    const [channels, setChannels] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [regions, setRegions] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState('');
    const [selectedCampaigns, setSelectedCampaigns] = useState([]);
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
    }, []);

    useEffect(() => {
        const fetchChannels = async () => {
            if (selectedChannel) {
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
            } else {
                setChannels([]);
            }
        };

        fetchChannels();
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

            // Resetting input fields after successful group creation
            setGroupName('');
            setSelectedChannel('');
            setSelectedChannelIds([]);
            fetchRegions();
            alert('Group successfully created!');
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
                    campaign_names: selectedCampaigns.map(campaign => `${campaign.name} (${campaign.channels})`)
                })
            });
            if (!response.ok) {
                throw new Error('Failed to assign region');
            }
            const data = await response.json();
            console.log('assign response', data);

            // Resetting input fields after successful group assignment
            setSelectedCampaigns([]);
            setSelectedRegion('');
            alert('Group successfully assigned to campaign!');
        } catch (error) {
            console.error('Error assigning region:', error);
        }
    };

    const handleCampaignChange = (campaign, isChecked) => {
        const campaignIdentifier = `${campaign.name}-${campaign.channels}`;
        if (isChecked) {
            setSelectedCampaigns(prev => [...prev, { name: campaign.name, channels: campaign.channels }]);
        } else {
            setSelectedCampaigns(prev => prev.filter(c => `${c.name}-${c.channels}` !== campaignIdentifier));
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

                    {selectedChannel && (
                        <div className="checkbox-container">
                            <span>Select channels:</span>
                            {channels.length === 0 ? (
                                <p>No channels available</p>
                            ) : (
                                channels.map(channel => (
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
                                ))
                            )}
                        </div>
                    )}
                    <div className='button-div'>
                        <button className='btn-group' onClick={handleCreateGroup}>Create Group</button>
                    </div>
                    <div className="checkbox-container">
                        <span>Select campaign:</span>
                        {campaigns.map(campaign => (
                            <div key={campaign.id} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    id={campaign.id}
                                    value={campaign.name}
                                    checked={selectedCampaigns.some(c => c.name === campaign.name && c.channels === campaign.channels)}
                                    onChange={(e) => handleCampaignChange(campaign, e.target.checked)}
                                />
                                <label htmlFor={campaign.id}>
                                    {campaign.name} ({campaign.channels})
                                </label>
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
                    <div className='button-div'>
                        <button className='btn-group' onClick={handleAssignGroup}>Assign Group</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Groups;
