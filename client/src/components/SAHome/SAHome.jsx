import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import authMiddleware from '../middleware/authMiddleware'; // Uvoz authMiddleware.js

function SAHome() {

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('/admincompanies'); 
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  /*Hardkodirana lista kompanija*/

  /*const companies = [
    { id: 1, name: 'Company A', logo: 'https://png.pngtree.com/element_pic/16/11/03/dda587d35b48fd01947cf38931323161.jpg', admin: 'Admin A' },
    { id: 2, name: 'Company B', logo: 'https://png.pngtree.com/element_pic/00/16/07/115783931601b5c.jpg', admin: 'Admin B' },
    { id: 3, name: 'Company C', logo: 'https://png.pngtree.com/element_pic/16/11/03/dda587d35b48fd01947cf38931323161.jpg', admin: 'Admin C' },
    { id: 4, name: 'Company D', logo: 'https://png.pngtree.com/element_pic/00/16/07/115783931601b5c.jpg', admin: 'Admin D' },
  ]; */

  const styles = {
    homeContainer: {
      padding: '10px',
    },
    companiesList: {
      display: 'flex',
      justifyContent: 'center',
      background: 'none',
    },
    companyCard: {
      width: '240px',
      margin: '10px',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    companyContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    companyLogo: {
      width: 'auto', 
      height: '110px', 
      marginRight: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    },
    companyInfo: {
      flex: '1',
    },
    companyName: {
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    companyAdmin: {
      color: '#666',
      borderTop: '1px solid #ccc',
      paddingTop: '10px',
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
      <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ 
        position: 'fixed', 
        width: '100%', 
        top: 0, 
        zIndex: 1000,
        marginBottom: '2px' 
      }}>
        <div className="container-fluid justify-content-center">
          <a className="navbar-brand" href="/home">
            Home
          </a>
        </div>
      </nav>
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
                    {companies.map(company => (
                      <div key={company.id} style={styles.companyCard}>
                        <div style={styles.companyContent}>
                          <img src={company.logo} alt={company.name} style={styles.companyLogo} />
                          <div style={styles.companyInfo}>
                            <div style={styles.companyName}>{company.name}</div>
                            <div style={styles.companyAdmin}>{company.admin}</div>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default authMiddleware(SAHome); // Primjena authMiddleware na SAHome komponentu


