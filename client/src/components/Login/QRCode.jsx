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
    handleSetQRCode();
  }, []); // Prilikom prvog prikaza, [] će se izvršiti samo jednom

  const handleInputChange = (event) => {
    // Provjera da li je uneseni tekst validan broj i ograničenje na 6 cifara
    const inputText = event.target.value.replace(/\D/g, '').slice(0, 6);
    console.log(inputText)
    setText(inputText);
  };

  const handleSetQRCode = () => {

    const username = encodeURIComponent(Cookies.get('uname'));

    fetch('http://localhost:3000/qrimage', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ uname: username })
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

    const username = encodeURIComponent(Cookies.get('uname'));
    const userRole = encodeURIComponent(Cookies.get('role'));

    fetch('http://localhost:3000/set2FA?code=' + text, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ uname: username })
    })
      .then(async res => {
        const { success } = await res.json();
        if (success) {
          if (userRole === "admin") {
            navigate('/home')
          } else {
            navigate('/sa-home')
          }
        } else {
          setErrorMessage('Authentication code is invalid.');
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
    backgroundColor: '#DDDEE5', // Siva boja za karticu
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

  return (
    <div style={{ backgroundColor: 'linear-gradient(to right, #DDDEE5, #2B3D5B)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            textAlign: 'center',
            backgroundColor: '#fefeffc6', // Stil za input polja kada su u fokusu
            color: '#3a3a3cc6', // Boja teksta ostaje bijela
            outline: 'none', // Sklanjamo outline prilikom fokusa
            border: 'none', // Sklanjamo border prilikom fokusa
            borderRadius: '5px', // Dodajemo blagi border radius
          }}
        />
        <button onClick={handleAuthenticate} style={{ ...buttonStyle, backgroundColor: '#007bff', color: 'white', marginTop: '20px' }}>
          AUTHENTICATE
        </button>
      </div>
    </div>
  );
}

export default QRCodeGenerator;
