import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css';

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {

    fetch('https://marketing-campaign-management-system-server\\.vercel\\.app/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ emailOrPhone, password })
    })
      .then(async response => {
        if (response.ok) {
          const { message, username, authToken, role } = await response.json();
          console.log('Login successful');
          console.log(response);
          setErrorMessage('');
          Cookies.set('uname', username);
          Cookies.set('token', authToken);
          Cookies.set('role', role);
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

    const username = encodeURIComponent(Cookies.get('uname'));
    const userRole = encodeURIComponent(Cookies.get('role'));

    fetch('https://marketing-campaign-management-system-server\\.vercel\\.app/set2FA?code=' + authCode, {
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

    const username = encodeURIComponent(Cookies.get('uname'));

    fetch('https://marketing-campaign-management-system-server\\.vercel\\.app/getUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ uname: username })
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
                  <input className='form-control' id='auth-code' type='text' value={authCode} onChange={handleAuthCodeChange} maxLength={6} />
                  <div className="text-center mt-3"> {/* Move text-center to this div */}
                    <button className='btn btn-primary px-5' type='button' onClick={handleAuthenticate} style={{ backgroundColor: "#2B3D5B" }}>
                      Log in
                    </button>
                  </div>
                </div>
              )}




              {!showAuthCodeInput && (
                <button className='btn btn-primary mx-2 px-5' type='button' onClick={handleLogin} style={{ backgroundColor: "#2B3D5B" }}>
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
