import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch('https://marketingcampaignmanagementsystem-1.onrender.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ emailOrPhone, password })
    })
      .then(async response => {
        if (response.ok) {
          const { message, username, authToken } = await response.json();
          console.log('Login successful');
          setErrorMessage('');
          Cookies.set('uname', username);
          Cookies.set('token', authToken);
          handleTwoFACheck();
        } else {
          return response.json().then(data => {
            throw new Error(data.message);
          });
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        setErrorMessage('Failed to login. Please try again.');
      });
  };

  const handleAuthenticate = () => {
    fetch('https://marketingcampaignmanagementsystem-1.onrender.com/set2FA?code=' + authCode, {
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
          navigate('/home')
          //alert('successful auth');
        } else {
          setErrorMessage('Authentication code is invalid.');
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
          if (enabled) {
            console.log('2FA enabled');
            setShowAuthCodeInput(true);
          } else {
            console.log('2FA not enabled');
            navigate('/2fa');
          }
        } else {
          console.log('2FA check failed');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleAuthCodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Uklanja sve osim brojeva
    setAuthCode(value);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col-12">
          <div className='card my-5'>
            <div className='card-body p-5 d-flex flex-column align-items-center'>
              <h2 className="fw-bold mb-2 text-uppercase">Log in</h2>
              <p className="text-muted text-center mb-5">Please enter your email and password!</p>

              <div className='mb-4 mx-5 w-100'>
                <label className='form-label' htmlFor='email'>Email or phone number</label>
                <input className='form-control' id='email' type='email' value={emailOrPhone} onChange={e => setEmailOrPhone(e.target.value)} />
              </div>
              <div className='mb-4 mx-5 w-100'>
                <label className='form-label' htmlFor='password'>Password</label>
                <input className='form-control' id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
              </div>
           
              {showAuthCodeInput && (
                <div className='mb-4 mx-5 w-100'>
                  <label className='form-label' htmlFor='auth-code'>Authentication Code</label>
                  <div className="text-center"> {/* Dodali smo text-center na ovaj div */}
                    <input className='form-control' id='auth-code' type='text' value={authCode} onChange={handleAuthCodeChange} maxLength={6} />
                    <button className='btn btn-primary mx-2 px-5 mt-3' type='button' onClick={handleAuthenticate}>
                      Log in
                    </button>
                  </div>
                </div>
              )}


            
              {!showAuthCodeInput && (
                <button className='btn btn-primary mx-2 px-5' type='button' onClick={handleLogin}>
                  Log in
                </button>
              )}
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              <div className='d-flex flex-row mt-3 mb-5'></div>
              <div>
                <p className="mb-0">Don't have an account? <a href="#!" className="text-muted fw-bold">Sign Up</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
