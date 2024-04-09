import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Uvoz Cookies modula
import './UniqueCampaign.css'; // Stilizacija se može prilagoditi prema vašim potrebama

const UniqueCampaign = () => {
  const [campaign, setCampaign] = useState(null);
  
  useEffect(() => {
    const campaignId = Cookies.get('campaignID'); // Čitanje ID-a kampanje iz kolačića
    if (campaignId) {
      getCampaignById(campaignId);
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  const getCampaignById = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/campaign/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch campaign by ID');
      }
  
      const data = await response.json();
      const formattedCampaign = {
        ...data.campaign[0],
        durationfrom: formatDate(data.campaign[0].durationfrom),
        durationto: formatDate(data.campaign[0].durationto),
      };
      setCampaign(formattedCampaign);

      return data.campaign;
    } catch (error) {
      console.error('Error fetching campaign by ID:', error);
      throw error; // Propagirajte grešku prema gore kako biste je mogli obraditi tamo gdje koristite funkciju getCampaignById
    }
  };

  return (
    <div className="unique-campaign-container">
      {campaign ? (
        <div className="campaign-details">
          <p>
            Name:
            <input type="text" value={campaign.name} readOnly />
          </p>
          <p>
            Channel:
            <input type="text" value={campaign.channels} readOnly />
          </p>
          <p>
            Media Type:
            <input type="text" value={campaign.mediatypes} readOnly />
          </p>
          <p>
            Duration Start:
            <input type="text" value={campaign.durationfrom} readOnly />
          </p>
          <p>
            Duration End:
            <input type="text" value={campaign.durationto} readOnly />
          </p>
          {/* Dodajte ostale informacije o kampanji prema potrebi */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UniqueCampaign;
