import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx"
import SAKompanije from "./components/SAKompanije/SAKompanije.jsx";
import MediaTypes from "./components/MediaTypes/MediaTypes.jsx";

import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import QRCodeGenerator from "./components/Login/QRCode.jsx";
import SAHome from "./components/SAHome/SAHome.jsx"; 

import Navbar from "./components/Navbar/Navbar.jsx";
import Channels from "./components/Channels/Channels.jsx";
import Campaigns from "./components/Campaigns/Camapigns.jsx";
import Users from "./components/Users/Users.jsx";


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/2fa" element={<QRCodeGenerator />} />

          <Route path="/add-company" element={<>
            <Navbar />
            <SAKompanije />
          </>} />

          <Route path="/sa-home" element={<>
            <Navbar />
            <SAHome />
          </>} />

          <Route path="/home" element={<>
            <Navbar />
            <Home />
          </>} />
          <Route path="/media-types" element={<>
            <Navbar />
            <MediaTypes />
          </>} />
          <Route path="/channels" element={<>
            <Navbar />
            <Channels />
          </>} />
          <Route path="/campaigns" element={<>
            <Navbar />
            <Campaigns />
            
          </>
        } />
        <Route path="/users" element={<>
            <Navbar />
            <Users />
            </>
        } />

        </Routes>
        
      </Router>
    </div>
  )
}

export default App;
