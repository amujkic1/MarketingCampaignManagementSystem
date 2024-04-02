import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SAKompanije.css"; // Import CSS file

function SAKompanije() {
  const [logo, setLogo] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      setLogo(event.target.result);
    };

    reader.readAsDataURL(file);

    // Sakrijemo opciju "Choose file" nakon što je slika odabrana
    e.target.style.display = "none";
  };

  return (
    <div>
      <div style={{ paddingTop: "2px" }}>
        <div className="container">
          <div className="row justify-content-center align-items-center vh-100">
            <div className="col-12">
              <div
                className="card my-5"
                style={{
                  background: "#DDDEE5",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="homeContainer">
                  <h2>Create Company</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="companyName">Ime kompanije</label>
                        <input
                          type="text"
                          className="form-control"
                          id="companyName"
                        />
                        <div className="logologo">
                          <label htmlFor="logo">Logo</label>
                          <div className="drop-area">
                            <input
                                className="inputImage"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            {/* Prikazujemo odabranu sliku */}
                            {logo && (
                              <img
                                src={logo}
                                alt="Company Logo"
                                className="logo-image"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="admin" className="admino">Administrator</label>
                        <input
                          type="text"
                          className="form-control"
                          id="administrator"
                        />
                        <div className="admin-info card">
                          <div className="card-body">
                            <div className="form-group">
                              <label htmlFor="adminEmail">Email</label>
                              <input
                                type="email"
                                className="form-control"
                                id="adminEmail"
                                placeholder="Email"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="adminUsername">Username</label>
                              <input
                                type="text"
                                className="form-control"
                                id="adminUsername"
                                placeholder="Username"
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="adminPassword">Password</label>
                              <input
                                type="password"
                                className="form-control"
                                id="adminPassword"
                                placeholder="Password"
                              />
                            </div>
                            <div className="text-center">
                              {" "}
                              {/* Centriranje sadržaja */}
                              <button className="btn btn-primary mt-2">
                                Create
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link to="/IlhaninaHomePage" className="addCompanyBtn">
                    Create Company
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SAKompanije;
