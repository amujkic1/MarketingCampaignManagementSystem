import Login from "./components/Login/Login.jsx";
import './App.css';
import QRCode from "./components/Login/QRCode.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/2fa" element={<QRCode />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App