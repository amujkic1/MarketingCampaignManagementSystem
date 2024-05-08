import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Users from './Users';

describe('Users component', () => {
  test('renders the Users component', () => {
    const { getByText } = render(<Users />);
    const addUserButton = getByText('Add User');
    expect(addUserButton).toBeInTheDocument();
  });

  test('creates a new user', async () => {
    const { getByPlaceholderText, getByText } = render(<Users />);
    const usernameInput = getByPlaceholderText('Username');
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const phoneInput = getByPlaceholderText('Phone');
    const addUserButton = getByText('Add User');

    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    fireEvent.click(addUserButton);

    await waitFor(() => {
      expect(usernameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(phoneInput).toHaveValue('');
    });
  });

  test('deletes a user', async () => {
    const { getByText } = render(<Users />);
    const deleteUserButton = getByText('🗑️');
    fireEvent.click(deleteUserButton);
    // You can add assertions here to verify that the user has been deleted from the UI
  });

  test('updates a user', async () => {
    const { getByText, getByPlaceholderText } = render(<Users />);
    const editUserButton = getByText('✏️');
    fireEvent.click(editUserButton);

    const updateUsernameInput = getByPlaceholderText('Username');
    const updateEmailInput = getByPlaceholderText('Email');
    const updatePasswordInput = getByPlaceholderText('Password');
    const updatePhoneInput = getByPlaceholderText('Phone');
    const updateUserButton = getByText('Update User');

    fireEvent.change(updateUsernameInput, { target: { value: 'updatedUser' } });
    fireEvent.change(updateEmailInput, { target: { value: 'updated@example.com' } });
    fireEvent.change(updatePasswordInput, { target: { value: 'updatedpassword' } });
    fireEvent.change(updatePhoneInput, { target: { value: '9876543210' } });

    fireEvent.click(updateUserButton);

    // You can add assertions here to verify that the user has been updated
  });
});
