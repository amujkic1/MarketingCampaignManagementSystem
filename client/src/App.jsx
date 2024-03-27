import Login from "./components/Login/Login.jsx";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import QRCodeGenerator from "./components/Login/QRCode.jsx";

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/2fa" element={<QRCodeGenerator />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App