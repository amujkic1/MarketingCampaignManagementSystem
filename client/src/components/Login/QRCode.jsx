import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import Cookies from 'js-cookie';

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrValue, setQRValue] = useState('');
  const [username, setUsername] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Pozivanje handleSetQRCode funkcije prilikom prvog prikaza komponente
    handleTwoFACheck();
  }, []); // Prilikom prvog prikaza, [] će se izvršiti samo jednom

  const handleInputChange = (event) => {
    // Provjera da li je uneseni tekst validan broj i ograničenje na 6 cifara
    const inputText = event.target.value.replace(/\D/g, '').slice(0, 6);
    console.log(inputText)
    setText(inputText);
  };

  const handleSetQRCode = () => {
    fetch('https://marketingcampaignmanagementsystem-1.onrender.com/qrimage', {

      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `uname=${encodeURIComponent(Cookies.get('uname'))}`
      },
      credentials: 'include'
    })
      .then(async res => {
        const { success, image } = await res.json();
        if (success) {
          setQRValue(image);
        } else {
          alert('Unable to fetch QR image');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };


  const handleAuthenticate = () => {
    fetch('https://marketingcampaignmanagementsystem-1.onrender.com/set2FA?code=' + text, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `uname=${encodeURIComponent(Cookies.get('uname'))}`
      },
      credentials: 'include'
    })
      .then( async res => {
        const { success } =  await res.json();
        if (success) {
          navigate('/home');
          //alert('Authentication successful');
        } else {
          alert('Authentication failed');
        }
      })
      .catch(error => {
        console.error(error);
      });

  };
  

  const handleTwoFACheck = () => {
    fetch('https://marketingcampaignmanagementsystem-1.onrender.com/getUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `uname=${encodeURIComponent(Cookies.get('uname'))}`
      },
      credentials: 'include'
    })
      .then(async res => {
        const { success, enabled } = await res.json();
        if (success) {
          if(enabled){
            console.log('2FA enabled');
             // Call handleSetQRCode if 2FA is enabled
          }else{
            handleSetQRCode();
          }
          
        } else {
          console.log('2FA not enabled');
          alert('Two-factor authentication is not enabled');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleLogout = () => {
    console.log("Korisnik se odjavio");
  };

  const handleTwoFactorUpdate = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const cardStyle = {
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '400px',
    margin: 'auto', // Horizontalno centriranje
    position: 'fixed', // Fiksni položaj
    top: '50%', // Vertikalno na sredinu
    left: '50%', // Horizontalno na sredinu
    transform: 'translate(-50%, -50%)', // Podešavanje na tačnu sredinu
    textAlign: 'center',
    overflow: 'hidden' // Sakrivanje mogućnosti scroll-a
  };

  const buttonStyle = {
    fontSize: '18px',
    margin: '10px',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
  };

  const logoutButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#ffcccc',
    color: 'white',
  };

  const twoFactorButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#7CFC00',
    color: 'white',
  };

  return (
    <div style={cardStyle}>
      <p style={{ fontSize: '24px' }}>Set up Two-factor Authentication {username}</p>
      <div style={{ marginTop: '50px' }}>
        {/* Prikazujemo QR kod */}
        <img src={qrValue} alt="QR Code" style={{ width: '256px', height: '256px' }} />
      </div>
      <input
        type="text"
        placeholder="Enter 2FA Code"
        value={text}
        onChange={handleInputChange}
        maxLength={6} // Postavljamo maksimalnu dužinu na 6 cifara
        style={{
          fontSize: '24px',
          marginTop: '20px',
          width: 'calc(100% - 20px)', // Promijenili smo širinu input polja tako da se uklapa u 6 mjesta
          maxWidth: '300px',
          textAlign: 'center'
        }}
      />
      <button onClick={handleAuthenticate} style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white', marginTop: '20px' }}>
        AUTHENTICATE
      </button>
    </div>
  );
}

export default QRCodeGenerator;
