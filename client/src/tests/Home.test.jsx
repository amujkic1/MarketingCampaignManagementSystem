import { render, screen } from '@testing-library/react';
import {afterEach, describe, expect, test, vi} from "vitest"
import { BrowserRouter } from 'react-router-dom';
import Cookies from "js-cookie";
import Home from '../components/Home/Home';
import React, { useState, useEffect } from 'react'; // Dodana importacija useState i useEffect

describe('Home component', () => {
  test('renders Home component', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const homeElement = screen.getByTestId('home-component-wrapper');

    expect(homeElement).toBeDefined();
  });

  test('displays users table', async () => {
    const mockUsers = [
      { id: 1, username: 'user1', email: 'user1@example.com', phone: '123456789' },
      { id: 2, username: 'user2', email: 'user2@example.com', phone: '987654321' }
    ];
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers
    });
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    const usersTable = await screen.findByText('Users');
    expect(usersTable).toBeTruthy();
    mockUsers.forEach(user => {
      expect(screen.getByText(user.username)).toBeTruthy();
      expect(screen.getByText(user.email)).toBeTruthy();
      expect(screen.getByText(user.phone)).toBeTruthy();
    });
    });
  
});

