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
import AuthGuard from "./components/Auth/AuthGuard.jsx";
import UniqueCampaign from "./components/Campaigns/UniqueCampaign.jsx";
import Groups from "./components/Groups/Groups.jsx";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/2fa" element={<QRCodeGenerator />} />


          <Route path="/add-company" element={<AuthGuard roles={['super_admin']}>
            <Navbar />
            <SAKompanije />
          </AuthGuard>} />

          <Route path="/sa-home" element={<AuthGuard roles={['super_admin']}>
            <Navbar />
            <SAHome />
          </AuthGuard>} />

          <Route path="/home" element={<>
            <Navbar />
            <Home />
          </>} />
          <Route path="/media-types" element={<AuthGuard roles={['admin']}>
            <Navbar />
            <MediaTypes />
          </AuthGuard>} />

          <Route path="/channels" element={<AuthGuard roles={['admin']}>
            <Navbar />
            <Channels />
          </AuthGuard>} />

          <Route path="/campaigns" element={<AuthGuard roles={['admin']}>
            <Navbar />
            <Campaigns />
          </AuthGuard>
          } />

          <Route path="/users" element={<AuthGuard roles={['admin']}>
            <Navbar />
            <Users />
          </AuthGuard>
          } />

          <Route path="/campaign" element={<AuthGuard roles={['admin']}>
            <Navbar />
            <UniqueCampaign />
          </AuthGuard>
          } />

          <Route path="/groups" element={<AuthGuard roles={['admin']}>
            <Navbar />
            <Groups />
          </AuthGuard>
          } />
         

        </Routes>

      </Router>
    </div>
  )
}

export default App;
