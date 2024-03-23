import React from 'react';
import './Home.css'; // loading style for home component
const Home = ({ isLoggedIn }) => {
    return (
      <div className="home-container">
        <div className="header">
          <img src="logo/logo.png" alt="Logo" className="logo" />
          <nav className="menu">
            <ul>
              <li><a href="/">Home</a></li>
              {isLoggedIn ? (
                <>
                  <li><a href="/profile">Profile</a></li>
                  <li><a href="/logout">Logout</a></li>
                </>
              ) : (
                <li><a href="/login">Login</a></li>
              )}
            </ul>
          </nav>
        </div>
        <div className="visual">
          <h1>Welcome to Management System!</h1>
        </div>
        <div className="contact">
          <p>Contact us:</p>
          <div className="social-icons">
            <a href="https://www.instagram.com/"><img src="images/instagram.png" alt="Instagram" /></a>
            <a href="https://www.facebook.com/"><img src="images/facebook.png" alt="Facebook" /></a>
            <a href="https://www.linkedin.com/home"><img src="images/linkedln.png" alt="LinkedIn" /></a>
          </div>
        </div>
      </div>
    );
  }

export default Home;
