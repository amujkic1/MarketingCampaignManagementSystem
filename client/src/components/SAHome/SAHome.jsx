import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function SAHome() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = () => {

    const username = encodeURIComponent(Cookies.get('uname'));

    fetch('https://marketing-campaign-management-system-server.vercel.app/admincompanies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username: username })      
    })
    .then(async response => {
      if (response.ok) {
        const data = await response.json();
        setCompanies(data); // Postavljanje podataka u stanje companies
      } else {
        throw new Error('Failed to fetch companies.');
      }
    })
    .catch(error => {
      console.error('Error fetching companies:', error);
    });
  }
  const isValidUrl = (url) => {
    // Regular expression to validate URL
    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlRegex.test(url);
  };
    

  const renderCompanyCards = () => {
    return companies.map((company) => (
      <div key={company.id} style={styles.companyCard}>
        <div style={styles.companyContent}>
          <div style={styles.companyInfo}>
            <div style={styles.companyName}>{company.name}</div>
            <div style={styles.companyAdmin}>{company.admin}</div>
          </div>
          {isValidUrl(company.logo) ? ( // Check if company.logo is a valid URL
            <img src={company.logo} alt={company.name} style={styles.companyLogo} />
          ) : (
            <div>No logo available</div>
          )}
        </div>
      </div>
    ));
  };

  const styles = {
    homeContainer: {
      padding: '10px',
      width: '100%', // Proširujemo na cijelu širinu ekrana
      maxWidth: 'none', // Uklanjamo ograničenje maksimalne širine
    },
    companiesList: {
      display: 'flex',
      justifyContent: 'center',
      background: 'none',
      flexWrap: 'wrap', // Dodajemo prelamanje na više redova
    },
    companyCard: {
      width: '240px',
      margin: '10px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      flexBasis: 'calc(20% - 20px)', // Postavljamo širinu kartice na 20% s razmakom od 20px
    },
    companyContent: {
      display: 'flex',
      flexDirection: 'column', // Postavljamo kolone
      alignItems: 'center',
    },
    companyLogo: {
      width: 'auto', 
      height: '110px', 
      marginBottom: '10px', // Pomicanje slike od naziva kompanije
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    companyInfo: {
      textAlign: 'center', // Centriranje teksta
    },
    companyName: {
      marginBottom: '5px', // Manji razmak između naziva kompanije i administratora
      fontWeight: 'bold',
    },
    companyAdmin: {
      color: '#666',
    },
    addCompanyBtn: {
      display: 'block',
      width: '150px',
      margin: '20px auto',
      padding: '10px',
      textAlign: 'center',
      backgroundColor: '#2B3D5B',
      color: '#f3f3f3',
      borderColor: '#2B3D5B',
      textDecoration: 'none',
      borderRadius: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    'addCompanyBtn:hover': {
      color: '#ffffff',
      backgroundColor: '#41526f',
      borderColor: '#2B3D5B',
    },
    'addCompanyBtn:focus': {
      outline: 'none',
      color: '#ffffff',
      backgroundColor: '#2B3D5B',
      borderColor: '#2B3D5B',
    }
  };

  return (
    <div>
      <div style={{ paddingTop: '2px' }}>
        <div className="container">
          <div className="row justify-content-center align-items-center vh-100">
            <div className="col-12">
              <div className='card my-5' style={{ 
                background: '#DDDEE5', 
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' 
              }}>
                <div style={styles.homeContainer}>
                  <h2>COMPANIES</h2>
                  <div style={styles.companiesList}>
                    {renderCompanyCards()} {/* Prikazivanje kartica */}
                  </div>
                  <Link to="/add-company" style={styles.addCompanyBtn}>Add company</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SAHome;
