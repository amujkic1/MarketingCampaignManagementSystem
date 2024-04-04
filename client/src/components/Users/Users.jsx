import React, { useState, useEffect } from 'react';
import bcrypt from 'bcryptjs'; // Importirajte bcryptjs
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateUsername, setUpdateUsername] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');
  const [updatePasswordVisible, setUpdatePasswordVisible] = useState('');
  const [updatePasswordHash, setUpdatePasswordHash] = useState('');
  const [updatePhone, setUpdatePhone] = useState('');

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const createUser = async () => {
    try {
      const response = await fetch('https://marketing-campaign-management-system-server.vercel.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
          phone: phone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      setUsername('');
      setEmail('');
      setPassword('');
      setPhone('');

      console.log('User successfully created!');
      getAllUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUpdateUsername(user.username);
    setUpdateEmail(user.email);
    setUpdatePasswordVisible(''); // Reset visible password
    setUpdatePasswordHash(user.password); // Set hashed password
    setUpdatePhone(user.phone);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleUpdateUser = async () => {
    try {
      // Hash the new password before saving
      const hashedPassword = await bcrypt.hash(updatePasswordVisible, 10);

      const response = await fetch(`https://marketing-campaign-management-system-server.vercel.app/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: updateUsername,
          email: updateEmail,
          password: hashedPassword, // Save the hashed password
          phone: updatePhone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      setIsPopupOpen(false);
      getAllUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="users-container">
      <div className="form-container">
        <div className="input-wrapper">
          <input
            className="input-name"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="input-name"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input-name"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            className="input-name"
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button
          className="btn-add"
          onClick={createUser}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ backgroundColor: isHovered ? '#415981' : '#2B3D5B' }}
        >
          Add User
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Password</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.phone}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEditClick(user)}>
                  ✏️
                  </button>
                  <button className="btn-delete" onClick={() => deleteUser(user.id)}>
                  🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPopupOpen && selectedUser && (
        <div className="popup-background">
          <div className="popup">
            <div className="popup-content">
              <div className="form-container">
                <div className="input-wrapper">
                  <input
                    className="input-name"
                    type="text"
                    placeholder="Username"
                    value={updateUsername}
                    onChange={(e) => setUpdateUsername(e.target.value)}
                  />
                  <input
                    className="input-name"
                    type="text"
                    placeholder="Email"
                    value={updateEmail}
                    onChange={(e) => setUpdateEmail(e.target.value)}
                  />
                  <input
                    className="input-name"
                    type="password"
                    placeholder="Password"
                    value={updatePasswordVisible} // Display visible password
                    onChange={(e) => setUpdatePasswordVisible(e.target.value)} // Update visible password
                  />
                  <input
                    className="input-name"
                    type="text"
                    placeholder="Phone"
                    value={updatePhone}
                    onChange={(e) => setUpdatePhone(e.target.value)}
                  />
                </div>
                <button
                  className="btn-update"
                  onClick={handleUpdateUser}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  style={{ backgroundColor: isHovered ? '#415981' : '#2B3D5B' }}
                >
                  Update User
                </button>
                <button className="btn-close" onClick={handleClosePopup}></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
