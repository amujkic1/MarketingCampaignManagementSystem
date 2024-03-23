import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '/HomePage.jsx';
import '/AuthStatus.jsx';

function App() {
  const [count, setCount] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Application status

  // // Function to login
  const login = () => {
    setIsLoggedIn(true);
  };

  // Logout feature
  const logout = () => {
    setIsLoggedIn(false);
  };
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
           {/* Show login button if user is not logged in */}
           {!isLoggedIn && (
          <button onClick={login}>
            Login
          </button>
        )}
        {/* Show logout button if user is logged in */}
        {isLoggedIn && (
          <button onClick={logout}>
            Logout
          </button>
        )}
      </div>
      {/* Show HomePage only if user is logged in */}
      {isLoggedIn && <HomePage />}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
