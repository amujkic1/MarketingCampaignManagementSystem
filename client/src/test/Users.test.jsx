import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Users from '../components/Users/Users';
import { describe, expect, test } from 'vitest';


describe('Users component', () => {
  test('renders the Users component', () => {
    const { getByText } = render(<Users />);
    const addUserButton = getByText('Add User');
    expect(addUserButton).toBeTruthy();
  });

  test('creates a new user', async () => {
    const { getByPlaceholderText, getByText } = render(<Users />);
    const usernameInput = getByPlaceholderText('Username');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const phoneInput = getByPlaceholderText('Phone');
  
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.change(phoneInput, { target: { value: '' } });
  
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
  
    const addUserButton = getByText('Add User');
    fireEvent.click(addUserButton);
  
    await waitFor(() => {
      expect(usernameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
      expect(phoneInput.value).toBe('');
    });
  });
/*
  test('deletes a user', async () => {
    const { getAllByRole, queryByText } = render(<Users />);
    const deleteButtons = getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(queryByText('user')).toBeNull();
    });
  });

  
  
test('updates a user', async () => {
  const { getAllByRole, getByPlaceholderText, getByText, queryByText } = render(<Users />);
  const editButtons = getAllByRole('button', { name: 'Edit' });
  fireEvent.click(editButtons[0]);

  // Assuming there's an edit user modal or form with input fields
  const usernameInput = getByPlaceholderText('New Username');
  fireEvent.change(usernameInput, { target: { value: 'updatedUser' } });

  const saveButton = getByText('Save');
  fireEvent.click(saveButton);

  await waitFor(() => {
    expect(queryByText('updatedUser')).toBeInTheDocument();
  });
});
*/
});
