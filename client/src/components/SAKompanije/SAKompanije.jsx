import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SAKompanije.css"; // Import CSS file

function SAKompanije() {
  const [logo, setLogo] = useState(null);
  const [phone, setPhone] = useState("");
  const [showAdminInfo, setShowAdminInfo] = useState(true); // Dodano stanje za prikazivanje/skrivanje admin-info card

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

  const handleAdminCreate = async () => {
    try {
      const username = document.getElementById("adminUsername").value;
      const password = document.getElementById("adminPassword").value;
      const email = document.getElementById("adminEmail").value;
      const phone = document.getElementById("adminPhone").value; // Dodano dobavljanje vrijednosti telefona

      const requestBody = {
        username: username,
        password: password,
        email: email,
        phone: phone
      };

      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/super/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Admin creation successful:', data);
       

        // Kopiranje vrijednosti username u polje administrator
        document.getElementById("administrator").value = username;

        // Isprazniti polja za unos emaila, korisničkog imena, lozinke i broja telefona
        document.getElementById("adminEmail").value = "";
        document.getElementById("adminUsername").value = "";
        document.getElementById("adminPassword").value = "";
        document.getElementById("adminPhone").value = "";

        // Sakrij admin-info card nakon uspješnog kreiranja admina
        setShowAdminInfo(false);

        // Dodajte dodatne korake koji su vam potrebni nakon uspješnog kreiranja admina
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
      const companyName = document.getElementById("companyName").value;
      const logoFile = document.getElementById("logo").files[0];
      const adminId = document.getElementById("administrator").value;
  
      const formData = new FormData();
      formData.append("name", companyName);
      formData.append("image", logoFile);
      formData.append("adminId", adminId);
  
      // Upload the image first
      const imageResponse = await fetch("https://marketing-campaign-management-system-server.vercel.app/upload", {
        method: "POST",
        body: formData,
      });
      const imageData = await imageResponse.json();
      const imageUrl = imageData.imageUrl;
  
      // Then create the company with the returned image URL
      const companyData = {
        name: companyName,
        username: adminId,
        logoUrl: imageUrl,
        //adminId: adminId,
      };
  
      const companyResponse = await fetch("https://marketing-campaign-management-system-server.vercel.app/super/company", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyData),
      });
      
      const companyResponseData = await companyResponse.json();
      alert(companyResponseData.message);
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
            <h2 className="text-center mb-4">Create Company</h2>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input type="text" className="form-control" id="companyName" />
                </div>
                <div className="form-group">
                  <label htmlFor="logo">Logo</label>
                  <div className="drop-area">
                    <input id="logo" className="inputImage" type="file" accept="image/*" onChange={handleImageChange} />
                    {logo && <img src={logo} alt="Company Logo" className="logo-image" />}
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="administrator">Administrator</label>
                  <input type="text" className="form-control" id="administrator" />
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
                          <input type="text" className="form-control" id="adminPhone" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="text-center">
                          <button className="btn btn-primary mt-2" style={{ backgroundColor: "#2B3D5B" }} onClick={handleAdminCreate}>Create Admin</button>
                        </div>
                      </div>
                    </div>
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
