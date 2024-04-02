// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import CSS datoteke za stilizaciju

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/media-types">Media Types</Link>
        </li>
        <li>
          <Link to="/channels">Channels</Link>
        </li>
        <li>
          <Link to="/campaigns">Campaigns</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
