import React, { useState, useEffect, useRef } from 'react';
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
  const [cookieId, setCookieId] = useState(null);
  const [media, setMedia] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [uploadedTextContent, setUploadedTextContent] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);


  useEffect(() => {
    const campaignId = Cookies.get('campaignID');
    if (campaignId) {
      setCookieId(campaignId);
      getCampaignById(campaignId);
      getCampaignMedia(campaignId);
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
      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/campaign/${id}`, {
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
    }
  };


  const uploadTextContent = async () => {
    if (!textContent || !cookieId) return;

    try {
      setUploading(true);

      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/addtext/${cookieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: textContent, type: campaign.mediatypes })
      });

      if (response.ok) {
        console.log('Text content added successfully');
        const data = await response.json();
        console.log('data text ', data.text);
        getCampaignMedia(cookieId);
        // Isprazni tekstualni ulaz nakon uspješnog učitavanja sadržaja
        setTextContent('');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add text content');
      }
    } catch (error) {
      console.error('Error uploading text content:', error);
    } finally {
      setUploading(false);
    }
  };


  const uploadFile = () => {
    if (fileUpload == null || cookieId == null) return;
    if (campaign.mediatypes.toLowerCase() === 'banner' && !bannerLink) {
      setErrorMessage('Please enter both an image and a link.');
      return;
    }
    setUploading(true);
    const fileRef = ref(storage, `videos/${fileUpload.name + v4()}`);
    uploadBytes(fileRef, fileUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            setUploadedUrl(null);
            if (cookieId) {
              const body = {
                type: campaign.mediatypes,
                url,
                campaign_id: cookieId,
              };
              if (campaign.mediatypes.toLowerCase() === 'banner') {
                body.banner_link = bannerLink;
              }
              fetch('https://marketing-campaign-management-system-server.vercel.app/addmediaurl', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
              })
                .then(async (response) => {
                  if (response.ok) {
                    console.log('URL added successfully');
                    getCampaignMedia(cookieId);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''; // Čišćenje vrijednosti input polja
                    }
                    setBannerLink('');
                  } else {
                    return response.json().then((data) => {
                      throw new Error(data.message);
                    });
                  }
                })
                .catch((error) => {
                  console.error('Failed to add URL:', error);
                });
            }
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





  const getCampaignMedia = async (campaignId) => {
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/campaignmedia/${campaignId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch campaign media');
      }
      const mediaData = await response.json();
      console.log(mediaData)
      setMedia(mediaData);
    } catch (error) {
      console.error('Error fetching campaign media:', error);
    }
  };

  const deleteMedia = (mediaId) => {
    fetch(`https://marketing-campaign-management-system-server.vercel.app/deletemediaurl/${mediaId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          console.log('Media deleted successfully');
          // Ponovno dohvatite medije kako biste osvježili prikaz
          getCampaignMedia(cookieId);
        } else {
          return response.json().then(data => {
            throw new Error(data.error || 'Failed to delete media');
          });
        }
      })
      .catch(error => {
        console.error('Failed to delete media:', error);
      });
  };

  const handleUpdate = async (mediaId) => {
    try {
      const updatedText = prompt('Enter new text:');
      if (!updatedText) return; // Ako korisnik otkaže unos ili ne unese tekst

      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/updatemedia/${mediaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newText: updatedText })
      });

      if (response.ok) {
        console.log('Media updated successfully');
        // Osvježite prikaz medija nakon ažuriranja
        getCampaignMedia(cookieId);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update media');
      }
    } catch (error) {
      console.error('Error updating media:', error);
    }
  };


  return (
    <div className="unique-campaign-container">
      <table>
        <tbody>
          <tr>
            <td style={{ width: "350px", verticalAlign: "middle" }}>
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
            </td>
            <td>


              <div className="upload-section">

                {campaign && (campaign.mediatypes.toLowerCase() === 'image') ? (
                  <div className="upload-section">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(event) => {
                        setFileUpload(event.target.files[0]);
                      }}
                    />
                    <button className="upload-button" onClick={uploadFile} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    {uploadedUrl && (
                      <div className="image-card">
                        <img src={uploadedUrl} alt="Uploaded Image" />
                      </div>
                    )}
                  </div>
                ) : campaign && campaign.mediatypes.toLowerCase() === 'video' ? (
                  <div className="upload-section">
                    <input
                      type="file"
                      ref={fileInputRef}
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
                        <video controls width="250" height="200">
                          <source src={uploadedUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                ) : campaign && campaign.mediatypes.toLowerCase() === 'audio' ? (
                  <div className="upload-section">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="audio/*"
                      onChange={(event) => {
                        setFileUpload(event.target.files[0]);
                      }}
                    />
                    <button className="upload-button" onClick={uploadFile} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload Audio'}
                    </button>
                    {uploadedUrl && (
                      <div className="audio-card">
                        <audio controls>
                          <source src={uploadedUrl} type="audio/mpeg" />
                          Your browser does not support the audio tag.
                        </audio>
                      </div>
                    )}
                  </div>
                ) : campaign && campaign.mediatypes.toLowerCase() === 'text' ? (
                  <div className="upload-section">
                    <textarea
                      rows="4"
                      cols="50"
                      placeholder="Enter text content"
                      value={textContent}
                      onChange={(event) => setTextContent(event.target.value)}
                    />
                    <button
                      className="upload-button"
                      onClick={() => {
                        uploadTextContent();
                        console.log('uploaded', uploadedTextContent);
                      }}
                      disabled={uploading}
                      style={{ display: "block", margin: "auto" }}
                    >
                      {uploading ? 'Uploading...' : 'Upload Text'}
                    </button>
                    {uploadedTextContent && (
                      <div className="text-content">
                        <p>{uploadedTextContent}</p>
                      </div>
                    )}
                  </div>

                ) : campaign && campaign.mediatypes.toLowerCase() === 'link' ? (
                  <div className="upload-section">
                    <textarea
                      rows="1"
                      cols="50"
                      placeholder="Enter link"
                      value={textContent}
                      onChange={(event) => setTextContent(event.target.value)}
                    />
                    <button
                      className="upload-button"
                      onClick={() => {
                        uploadTextContent();
                        console.log('uploaded', uploadedTextContent);
                      }}
                      disabled={uploading}
                      style={{ display: "block", margin: "auto" }}
                    >
                      {uploading ? 'Uploading...' : 'Upload Link'}
                    </button>
                    {uploadedTextContent && (
                      <div className="text-content">
                        <p>{uploadedTextContent}</p>
                      </div>
                    )}
                  </div>
                ) : campaign && campaign.mediatypes.toLowerCase() === 'banner' && (
                  <div className="upload-section">
                    <div className="input-container">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(event) => {
                          setFileUpload(event.target.files[0]);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Enter link"
                        value={bannerLink}
                        onChange={(event) => setBannerLink(event.target.value)}
                        className="link-input"
                      />
                    </div>
                    <div className="button-container">
                      <button className="upload-button" onClick={uploadFile} disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Banner'}
                      </button>
                    </div>
                    {errorMessage && (
                      <div className="error-message">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                )}
                <div className="media-container">
                  {media.map((item) => (
                    <div key={item.id} className="media-card" style={{ width: "250px" }}>
                      {item.type.toLowerCase() === 'banner' ? (
                        <a href={item.banner_link} target="_blank" rel="noopener noreferrer">
                          <img src={item.url} alt={item.type} style={{ width: "100%" }} />
                        </a>
                      ) : item.type.toLowerCase() === 'text' ? (
                        <div className="text-content" style={{ overflow: "hidden", wordWrap: "break-word" }}>
                          <p>{item.text}</p>
                        </div>
                      ) : item.type.toLowerCase() === 'link' ? (
                        <div className="text-content" style={{ overflow: "hidden", wordWrap: "break-word" }}>
                          <a href={item.text} target="_blank" rel="noopener noreferrer">{item.text}</a>
                        </div>
                      ) : item.type.toLowerCase() === 'video' ? (
                        <video controls width="249" height="180">
                          <source src={item.url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : item.type.toLowerCase() === 'audio' ? (
                        <iframe src={item.url} title={item.type} width="249" height="50"></iframe>
                      ) : (
                        <img src={item.url} alt={item.type} style={{ width: "100%" }} />
                      )}
                      <div className="button-container">
                        <button className="delete-button" onClick={() => deleteMedia(item.id)}>Delete</button>
                        {item.type.toLowerCase() === 'text' || item.type.toLowerCase() === 'link' ? (
                          <button className="update-button" onClick={() => handleUpdate(item.id)}>Update</button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UniqueCampaign;
