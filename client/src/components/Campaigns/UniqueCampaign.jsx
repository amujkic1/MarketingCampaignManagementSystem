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
  const [cookieId, setCookieId] = useState(null);
  const [media, setMedia] = useState([]);
  const [textContent, setTextContent] = useState('');
  const [uploadedTextContent, setUploadedTextContent] = useState('');
  const [bannerLink, setBannerLink] = useState('');

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
    }
  };


  const uploadTextContent = async () => {
    if (!textContent || !cookieId) return;

    try {
      setUploading(true);

      const response = await fetch(`http://localhost:3000/addtext/${cookieId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: textContent })
      });

      if (response.ok) {
        console.log('Text content added successfully');
        const data = await response.json();
        console.log('data text ', data.text);
        getCampaignMedia(cookieId);
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
    setUploading(true);
    const fileRef = ref(storage, `videos/${fileUpload.name + v4()}`);
    uploadBytes(fileRef, fileUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            // Postavljanje uploadanog URL-a na null nakon uspješnog uploada
            setUploadedUrl(null);
            if (cookieId) {
              const body = {
                type: campaign.mediatypes,
                url,
                campaign_id: cookieId,
              };
              if (campaign.mediatypes.toLowerCase() === 'banner') {
                // Dodajemo banner_link samo ako je medij vrste "banner"
                body.banner_link = bannerLink;
              }
              fetch('http://localhost:3000/addmediaurl', {
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
      const response = await fetch(`http://localhost:3000/campaignmedia/${campaignId}`);
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
    fetch(`http://localhost:3000/deletemediaurl/${mediaId}`, {
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

                {campaign && (campaign.mediatypes.toLowerCase() === 'image' || campaign.mediatypes.toLowerCase() === 'image with text') ? (
                  <div className="upload-section">
                    <input
                      type="file"
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
                      rows="4"
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
                      {uploading ? 'Uploading...' : 'Upload Text'}
                    </button>
                    {uploadedTextContent && (
                      <div className="text-content">
                        <p>{uploadedTextContent}</p>
                      </div>
                    )}
                  </div>
                ) : campaign && campaign.mediatypes.toLowerCase() === 'banner' && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        setFileUpload(event.target.files[0]);
                      }}
                    />
                    <textarea
                      rows="4"
                      cols="50"
                      placeholder="Enter link"
                      value={bannerLink} // Povezujemo polje za unos sa stanjem bannerLink
                      onChange={(event) => setBannerLink(event.target.value)} // Ažuriramo stanje bannerLink
                    />
                    <button className="upload-button" onClick={uploadFile} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Upload banner'}
                    </button>
                  </>
                )}

                <div className="media-container">
                  {media.map((item) => (
                    <div key={item.id} className="media-card" style={{ width: "250px" }}>
                      {item.type.toLowerCase() === 'banner' ? (
                        // Ako je medijski tip "banner", koristimo <a> tag s <img> tagom unutar njega
                        <a href={item.banner_link} target="_blank" rel="noopener noreferrer">
                          <img src={item.url} alt={item.type} style={{ width: "100%" }} />
                        </a>
                      ) : item.type.toLowerCase() === 'text' ? (
                        // Ako je medijski tip "text", prikažemo tekst direktno
                        <div className="text-content" style={{ overflow: "hidden", wordWrap: "break-word" }}>
                          <p>{item.text}</p>
                        </div>
                      ) : (
                        // Za ostale medijske tipove koristimo <img> tag
                        <img src={item.url} alt={item.type} style={{ width: "100%" }} />
                      )}
                      <button className="delete-button" onClick={() => deleteMedia(item.id)}>Delete</button>
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
