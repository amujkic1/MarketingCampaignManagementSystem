import Login from "./components/Login/Login.jsx";
import Home from "./components/Home/Home.jsx"
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import QRCodeGenerator from "./components/Login/QRCode.jsx";
import SAHome from "./components/SAHome/SAHome.jsx"; 

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/2fa" element={<QRCodeGenerator />} />
          <Route path="/" element={<SAHome />} /> {/* Privremena ruta za testiranje */}
         <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App