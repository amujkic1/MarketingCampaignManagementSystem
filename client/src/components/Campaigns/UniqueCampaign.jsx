import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../Campaigns/firebase";
import { v4 } from "uuid";
import './UniqueCampaign.css';

const UniqueCampaign = () => {
  const [fileUpload, setFileUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [campaign, setCampaign] = useState(null);
  
  useEffect(() => {
    const campaignId = Cookies.get('campaignID');
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
      throw error;
    }
  };

  const uploadFile = () => {
    if (fileUpload == null) return;
    setUploading(true);
    const fileRef = ref(storage, `videos/${fileUpload.name + v4()}`);
    uploadBytes(fileRef, fileUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            setUploadedUrl(url);
            setUploading(false);
          })
          .catch((error) => {
            console.error("Error getting download URL:", error);
            setUploading(false);
          });
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setUploading(false);
      });
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
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <div className="upload-section">
        <input
          type="file"
          accept="video/*"
          onChange={(event) => {
            setFileUpload(event.target.files[0]);
          }}
        />
        <button className="upload-button" onClick={uploadFile} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
        {uploadedUrl && (
          <div className="video-card">
            <video controls width="250">
              <source src={uploadedUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniqueCampaign;
