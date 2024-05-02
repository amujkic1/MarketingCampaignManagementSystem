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

    fetch('https://marketing-campaign-management-system-server\\.vercel\\.app/admincompanies', {
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
        setCompanies(data); 
      } else {
        throw new Error('Failed to fetch companies.');
      }
    })
    .catch(error => {
      console.error('Error fetching companies:', error);
    });
  }    

  const renderCompanyCards = () => {
    return companies.map((company) => (
      <div key={company.id} style={styles.companyCard}>
        <div style={styles.companyContent}>
          <div style={styles.companyInfo}>
            <div style={styles.companyName}>{company.name}</div>
            <div style={styles.companyDetail}> {company.niche}</div>
            <div style={styles.companyDetail}> {company.headquarters}</div>
          </div>
        </div>
      </div>
    ));
  };

  const styles = {
    homeContainer: {
      padding: '10px',
      width: '100%', 
      maxWidth: 'none',
    },
    companiesList: {
      display: 'flex',
      justifyContent: 'center',
      background: 'none',
      flexWrap: 'wrap',
    },
    companyCard: {
      width: 'calc(25% - 20px)', // Postavljamo širinu na 25% sa razmakom od 20px između
      margin: '10px',
      padding: '20px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    companyContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: '100%', // Postavljamo visinu sadržaja na 100% kako bi se vertikalno centrirao
    },
    companyInfo: {
      textAlign: 'center',
    },
    companyName: {
      marginBottom: '10px',
      fontWeight: 'bold',
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    companyDetail: {
      color: '#666',
      marginBottom: '5px',
      fontStyle: 'italic',
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
            <div className='card my-5' style={{ 
              background: '#DDDEE5', 
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' 
            }}>
              <div style={styles.homeContainer}>
                <h2 style={{ fontFamily: 'Calibri, sans-serif' }}>Companies</h2>
                <div style={styles.companiesList}>
                  {renderCompanyCards()}
                </div>
                <Link to="/add-company" style={styles.addCompanyBtn}>Add company</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SAHome;
