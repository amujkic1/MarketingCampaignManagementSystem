import Login from "./components/Login/Login.jsx";
import './App.css';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
