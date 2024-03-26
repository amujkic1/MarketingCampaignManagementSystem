import React, { useState } from 'react';
import QRCode from 'qrcode.react';

function QRCodeGenerator() {
  const [text, setText] = useState('');
  const [qrValue, setQRValue] = useState('');
  const [username, setUsername] = useState('user1');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSetQRCode = () => {
    setQRValue(text);
  };

  const handleLogout = () => {
    
    console.log("Korisnik se odjavio");
  };

  const handleTwoFactorUpdate = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const pageStyle = {
    textAlign: 'center',
    backgroundColor: '#a6e3e9', 
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoutButtonStyle = {
    fontSize: '24px',
    margin: '20px',
    backgroundColor: '#ffcccc', 
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const twoFactorButtonStyle = {
    fontSize: '24px',
    marginTop: '20px',
    backgroundColor: '#7CFC00', 
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div style={pageStyle}>
      <p style={{ fontSize: '24px' }}>Welcome {username}</p>
      <button onClick={handleLogout} style={logoutButtonStyle}>
        LOGOUT
      </button>
      <button onClick={handleTwoFactorUpdate} style={twoFactorButtonStyle}>
        {twoFactorEnabled ? 'DISABLE 2FA' : 'UPDATE/ENABLE 2FA'}
      </button>
      <div style={{ marginTop: '50px' }}>
        <QRCode value={qrValue} size={256} />
      </div>
      <input
        type="text"
        placeholder="2A Code"
        value={text}
        onChange={handleInputChange}
        style={{ fontSize: '24px', marginTop: '20px', width: '80%', maxWidth: '400px' }}
      />
      <br />
      <button onClick={handleSetQRCode} style={{ fontSize: '24px', marginTop: '20px' }}>
        SET
      </button>
    </div>
  );
}

export default QRCodeGenerator;