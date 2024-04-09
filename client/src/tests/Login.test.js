import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login/Login';

describe('Login Component', () => {
  test('renders login form correctly', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/Email or phone number/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByText(/Log in/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('allows user to input email and password', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/Email or phone number/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('displays error message when login fails', async () => {
    render(<Login />);
    const loginButton = screen.getByText(/Log in/i);
    
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to login/i)).toBeInTheDocument();
    });
  });

  test('allows user to input authentication code', () => {
    render(<Login />);
    const authCodeInput = screen.getByLabelText(/Authentication Code/i);

    fireEvent.change(authCodeInput, { target: { value: '123456' } });

    expect(authCodeInput).toHaveValue('123456');
  });

  test('displays authentication code input when 2FA is enabled', async () => {
    render(<Login />);
    const authCodeInput = screen.getByLabelText(/Authentication Code/i);

    expect(authCodeInput).not.toBeVisible();

    // Simulate 2FA being enabled
    fireEvent.change(window.location, { href: 'http://localhost/2fa' });

    await waitFor(() => {
      expect(authCodeInput).toBeVisible();
    });
  });

});
