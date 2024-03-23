import React from 'react';

const AuthStatus = ({ isLoggedIn, onLogout }) => {
  return (
    <div>
      {isLoggedIn ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <p>You are not logged in</p>
      )}
    </div>
  );
}

export default AuthStatus;
