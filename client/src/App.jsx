import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3002/users') // Assuming your Express server is running on localhost:3002
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>Username:</strong> {user.username}, <strong>Email:</strong> {user.email}, <strong>Phone:</strong> {user.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
