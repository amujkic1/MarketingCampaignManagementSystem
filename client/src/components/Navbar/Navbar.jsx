import React from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Importajte biblioteku za rad s kolačićima
import './Navbar.css'; // Import CSS datoteke za stilizaciju
import { useNavigate } from 'react-router-dom';
import "./Navbar.css";
const Navbar = () => {
  // Dobivanje uloge korisnika iz kolačića
  const userRole = Cookies.get('role');
  // Provjera je li korisnik admin
  const isAdmin = userRole === 'admin';
  const isSuperAdmin = userRole === 'super_admin'
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/logout', {
        method: 'POST',
        credentials: 'include', // Uključuje kolačiće u zahtjevu
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData.message); // Ispisuje poruku iz odgovora
        navigate('/');
        // Ovdje dodajte dodatne korake koji su vam potrebni nakon odjave korisnika

      } else {
        throw new Error('Logout failed'); // Bacanje greške ako odjava nije uspjela
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Ovdje možete prikazati obavijest korisniku o neuspješnoj odjavi
    }
  };

  return (
    <nav className="navbar" data-testid = "navigation">
      <ul className="navbar-list">
        {isSuperAdmin && (
          <li>
            <Link to="/sa-home" data-testid="sa-home">Home</Link>
          </li>
        )}
        {isAdmin && (
          <>
            <li>
              <Link to="/home" data-testid = "a-home">Home</Link>
            </li>
            <li>
              <Link to="/users" data-testid="a-users">Users</Link>
            </li>
            <li>
              <Link to="/media-types" data-testid="a-mediatypes" >Media Types</Link>
            </li>
            <li>
              <Link to="/channels" data-testid="a-channels">Channels</Link>
            </li>
            <li>
              <Link to="/campaigns" data-testid="a-campaigns">Campaigns</Link>
            </li>
            <li>
              <Link to="/firebase" data-testid="a-firebase">Upload</Link>
            </li>
          </>
        )}
      </ul>
      <button data-testid="logout" onClick={handleLogout}>Log out</button>
    </nav>
  );
};

export default Navbar;
