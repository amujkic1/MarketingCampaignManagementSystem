// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importajte biblioteku za rad s kolačićima
import './Navbar.css'; // Import CSS datoteke za stilizaciju

const Navbar = () => {
  // Dobivanje uloge korisnika iz kolačića
  const userRole = Cookies.get('role');
  // Provjera je li korisnik admin
  const isAdmin = userRole === 'admin';

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li>
          <Link to="/home">Home</Link>
        </li>
        {isAdmin && (
          <>
            <li>
              <Link to="/users">Users</Link>
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
          </>
        )}

      </ul>
    </nav>
  );
};

export default Navbar;
