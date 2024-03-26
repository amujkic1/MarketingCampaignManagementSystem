import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import Cookies from 'js-cookie';

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrValue, setQRValue] = useState('');
  const [username, setUsername] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  useEffect(() => {
    const usernameCookie = Cookies.get('username');
    setUsername(usernameCookie);
  }, []);

  const handleInputChange = (event) => {
    // Provjera da li je uneseni tekst validan broj i ograničenje na 6 cifara
    const inputText = event.target.value.replace(/\D/g, '').slice(0, 6);
    setText(inputText);
  };

  const handleSetQRCode = () => {
    fetch('http://localhost:3000/qrimage', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        const { success, image} = res.json();
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

  const handleLogout = () => {
    console.log("Korisnik se odjavio");
  };

  const handleTwoFactorUpdate = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const cardStyle = {
    backgroundColor: '#dddee5c6',
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
      <p style={{ fontSize: '24px' }}>Welcome {username}</p>
      <button onClick={handleLogout} style={logoutButtonStyle}>
        LOGOUT
      </button>
      <br />
      <button onClick={handleTwoFactorUpdate} style={twoFactorButtonStyle}>
        {twoFactorEnabled ? 'DISABLE 2FA' : 'ENABLE 2FA'}
      </button>
      <div style={{ marginTop: '50px' }}>
        <QRCode value={qrValue} size={256} />
      </div>
      <input
        type="text"
        placeholder="Enter 2FA Code"
        value={text}
        onChange={handleInputChange}
        style={{ fontSize: '24px', marginTop: '20px', width: '80%', maxWidth: '300px', textAlign: 'center' }}
      />
      <br />
      <button onClick={handleSetQRCode} style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white', marginTop: '20px' }}>
        SET
      </button>
    </div>
  );
}

export default QRCodeGenerator;
