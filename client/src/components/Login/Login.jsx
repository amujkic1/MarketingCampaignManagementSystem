import React, { useState } from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  function handleLogin() {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emailOrPhone, password })
    })
      .then( async response => {
        if (response.ok) {
          const { message, username, token} = await response.json();
          // Ovdje možete obraditi odgovor ako je prijava uspješna
          console.log('Login successful');
          // Resetovanje polja za unos
          setEmailOrPhone('');
          setPassword('');
          setErrorMessage('');
          Cookies.set('uname', username);
          Cookies.set('token', token);
          navigate('/2fa');
        } else {
          // Ovdje možete obraditi grešku ako prijava nije uspjela
          return response.json().then(data => {
            throw new Error(data.message);
          });
        }
      })
      .catch(error => {
        // Ovdje se hvataju sve vrste grešaka
        console.error('Login error:', error);
        setErrorMessage('Failed to login. Please try again.');
      });
  }

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

              <p className="small mb-3 pb-lg-2"><a className="text-muted" href="#!">Forgot password?</a></p>
              <button className='btn btn-primary mx-2 px-5' type='button' onClick={handleLogin}>
                Log in
              </button>
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
