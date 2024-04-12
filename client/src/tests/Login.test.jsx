import { fireEvent, render, screen } from '@testing-library/react';
import {afterEach, describe, expect, test, vi} from "vitest"
import { BrowserRouter } from 'react-router-dom';
import Cookies from "js-cookie";
import Login from '../components/Login/Login';
import React, { useState, useEffect } from 'react'; // Dodana importacija useState i useEffect

describe('Login component', () => {
  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId('email-input'); // Promenjen selector
    const passwordInput = screen.getByTestId('password-input'); // Promenjen selector
    const loginButton = screen.getByTestId('login-button'); // Promenjen selector

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(loginButton).toBeTruthy();
  });

  test('enters credentials and submits form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId('email-input'); // Promenjen selector
    const passwordInput = screen.getByTestId('password-input'); // Promenjen selector
    const loginButton = screen.getByTestId('login-button'); // Promenjen selector

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit form
    fireEvent.click(loginButton);

    // Expectations for after form submission can be added here
  });
});