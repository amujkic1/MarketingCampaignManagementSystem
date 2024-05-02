import React, { useState, useEffect } from 'react';

function Home() {
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Dohvat podataka o korisnicima
    fetchUsers();
    // Dohvat podataka o kampanjama
    fetchCampaigns();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server\\.vercel\\.app/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server\\.vercel\\.app/campaign');
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      const campaignData = await response.json();
      setCampaigns(campaignData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  return (
    <div style={{ paddingTop: '56px' }}>
      <div className="container">
        <div className="row justify-content-center align-items-center vh-100">
            <div className='card my-5' style={{ 
              background: '#DDDEE5',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div className='card-body p-5 d-flex flex-column align-items-center'>
                <h2 className="fw-bold mb-4 text-uppercase text-center">Welcome, Admin</h2>
                <p className="text-muted text-center mb-5">Explore the possibilities with us!</p>

                {/* Tablica s korisnicima */}
                <div className="table-responsive mb-4" style={{ maxWidth: '100%', width: '100%' }}> 
                  <h3 className="text-center mb-3">Users</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.email}</td>
                          <td>{user.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Tablica s kampanjama */}
                <div className="table-responsive" style={{ maxWidth: '100%', width: '100%' }}> {/* Promijenjena maksimalna širina */}
                  <h3 className="text-center mb-3">Campaigns</h3>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Channels</th>
                        <th>Media Types</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(campaign => (
                        <tr key={campaign.id}>
                          <td>{campaign.id}</td>
                          <td>{campaign.name}</td>
                          <td>{campaign.channels}</td>
                          <td>{campaign.mediatypes}</td>
                          <td>{campaign.durationfrom}</td>
                          <td>{campaign.durationto}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Home;
