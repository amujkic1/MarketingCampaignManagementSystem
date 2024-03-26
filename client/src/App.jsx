import Login from "./login/Login.jsx";
import './App.css';

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  /* const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/users') // Assuming your Express server is running on localhost:3002
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);
  */

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
