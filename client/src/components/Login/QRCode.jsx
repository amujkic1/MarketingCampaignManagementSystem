import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import Cookies from 'js-cookie';

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrValue, setQRValue] = useState('');

  useEffect(() => {
    handleSetQRCode();
  }, []);

  const handleInputChange = (event) => {
    const inputText = event.target.value.replace(/\D/g, '').slice(0, 6);
    setText(inputText);
  };

  const handleSetQRCode = () => {
    fetch('https://marketing-campaign-management-system-server.vercel.app/qrimage', {
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
    fetch('https://marketing-campaign-management-system-server.vercel.app/set2FA?code=' + text, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `uname=${encodeURIComponent(Cookies.get('uname'))}`
      },
      credentials: 'include'
    })
      .then(async res => {
        const { success } = await res.json();
        if (success) {
          alert('Authentication successful');
        } else {
          alert('Authentication failed');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const cardStyle = {
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '400px',
    margin: 'auto',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    overflow: 'hidden'
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

  return (
    <div style={cardStyle}>
      <p style={{ fontSize: '24px' }}>Set up Two-factor Authentication</p>
      <div style={{ marginTop: '50px' }}>
        <QRCode value={qrValue} size={256} />
      </div>
      <input
        type="text"
        placeholder="Enter 2FA Code"
        value={text}
        onChange={handleInputChange}
        maxLength={6}
        style={{
          fontSize: '24px',
          marginTop: '20px',
          width: 'calc(100% - 20px)',
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
