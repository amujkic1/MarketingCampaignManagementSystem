import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SAKompanije.css"; // Import CSS file
import { useNavigate } from 'react-router-dom';

function SAKompanije() {
  const [logo, setLogo] = useState(null);
  const [phone, setPhone] = useState("");
  const [showAdminInfo, setShowAdminInfo] = useState(true);
  const [adminInputEnabled, setAdminInputEnabled] = useState(false);
  const [administrator, setAdministrator] = useState("");
  const [niche, setNiche] = useState("");
  const [headquarters, setHeadquarters] = useState("");
  const [adminCreated, setAdminCreated] = useState(false); // Dodato stanje za označavanje da li je admin kreiran
  const navigate = useNavigate();

  const handleAdminCreate = async () => {
    try {
      const username = document.getElementById("adminUsername").value;
      const password = document.getElementById("adminPassword").value;
      const email = document.getElementById("adminEmail").value;
      const phone = document.getElementById("adminPhone").value;
  
      const requestBody = {
        username: username,
        password: password,
        email: email,
        phone: phone
      };
  
      const response = await fetch('http://localhost:3000/super/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Admin creation successful:', data);
  
        setAdministrator(username); // Set administrator state to the entered username
        setAdminCreated(true); // Postavljamo stanje da je admin kreiran
  
        // Enable input for administrator and disable admin info fields
        setAdminInputEnabled(false);
        setShowAdminInfo(false);
  
        // Clear admin input fields
        document.getElementById("adminEmail").value = "";
        document.getElementById("adminUsername").value = "";
        document.getElementById("adminPassword").value = "";
        document.getElementById("adminPhone").value = "";
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      alert('Error creating admin.');
    }
  };
  

  const handleCreateCompany = async () => {
    try {
      const name = document.getElementById("companyName").value;
      const username = document.getElementById("administrator").value;
      const niche = document.getElementById("niche").value;
      const headquarters = document.getElementById("headquarters").value;

      const companyResponse = await fetch("http://localhost:3000/super/company", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, username, niche, headquarters })
      });

      const companyResponseData = await companyResponse.json();
      navigate('/sa-home');
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Error creating company.");
    }
  };

  return (
    <div className="full-screen-container">
      <div className="homeContainer">
        <div className="cardA my-5" style={{ background: "#DDDEE5", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
          <div className="card-body-all">
          <h2 style={{ fontFamily: 'Calibri, sans-serif' }}>Create company</h2>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input type="text" className="form-control" id="companyName" />
                </div>
                <div className="form-group">
                  <label htmlFor="niche">Niche</label>
                  <input
                    type="text"
                    className="form-control"
                    id="niche"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="headquarters">Headquarter</label>
                  <input
                    type="text"
                    className="form-control"
                    id="headquarters"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="administrator">Administrator</label>
                  <input
                    type="text"
                    className="form-control"
                    id="administrator"
                    value={administrator}
                    readOnly={!adminInputEnabled}
                  />
                  {showAdminInfo && (
                    <div className="admin-info card">
                      <div className="card-body">
                        <div className="form-group">
                          <label htmlFor="adminEmail">Email</label>
                          <input type="email" className="form-control" id="adminEmail" placeholder="Email" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="adminUsername">Username</label>
                          <input type="text" className="form-control" id="adminUsername" placeholder="Username" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="adminPassword">Password</label>
                          <input type="password" className="form-control" id="adminPassword" placeholder="Password" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="adminPhone">Phone</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adminPhone"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div className="text-center">
                          <button
                            className="btn btn-primary mt-2"
                            style={{ backgroundColor: "#2B3D5B" }}
                            onClick={() => {
                              handleAdminCreate();
                              setAdminInputEnabled(true);
                            }}
                          >
                            Create Admin
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {adminCreated && ( // Prikazujemo poruku samo ako je admin kreiran
                    <p className="text-center text-success mt-3">Admin successfully created.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="text-center">
              <button className="btn btn-primary mt-2" style={{ backgroundColor: "#2B3D5B" }} onClick={handleCreateCompany}>Create Company</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SAKompanije;
