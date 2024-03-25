import React from 'react';
import './App.css';
import './Home.css';
import logo from './logo/logo.png';
import '@fortawesome/fontawesome-free/css/all.css';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <ul>
            <li><a href="#">Home</a></li>
           
            <li><button>Login</button></li>
          </ul>
          <img src={logo} alt="Logo" className="logo" />
        </nav>
       
      </header>
      <div className="content">
      
          <h1>Streamline Your Marketing Campaigns</h1>
        </div>
        <div className="grid-container">
    <div className="grid-item">
      <h2>Powerful Features for Effective Campaign Management</h2>
    </div>
    <div className="grid-item">
      <h2>Effortlessly manage all your marketing campaigns in one</h2>
    </div>
    <div className="grid-item">
      <h2>Take your marketing campaigns to the next level with our comprehensive tools</h2>
    </div>
  </div>
  <div className="footer">
  <span>Contact us:</span>
  <div className="social-icons">
    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer noopener">
      <i className="fab fa-instagram"></i>
    </a>
    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopener">
      <i className="fab fa-facebook"></i>
    </a>
    <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener">
      <i className="fab fa-linkedin"></i>
    </a>
</div>

</div>

    </div>
  );
}

export default App;



