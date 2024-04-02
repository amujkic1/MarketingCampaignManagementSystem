import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx"
import MediaTypes from "./components/MediaTypes/MediaTypes.jsx";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import QRCodeGenerator from "./components/Login/QRCode.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import Channels from "./components/Channels/Channels.jsx";
import Campaigns from "./components/Campaigns/Camapigns.jsx";

function App() {

  return (
    <div>
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/2fa" element={<QRCodeGenerator />} />
          <Route path="/home" element={<Home />} />
          <Route path="/media-types" element={<MediaTypes />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/campaigns" element={<Campaigns/>}></Route>
        </Routes>
      </Router>
    </div>
  )
}

export default App