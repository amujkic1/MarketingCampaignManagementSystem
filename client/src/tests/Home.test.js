import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../components/Home/Home';

jest.mock('components/Home', () => ({
    ...jest.requireActual('components/Home'),
    fetchUsers: jest.fn(),
    fetchCampaigns: jest.fn(),
})); 

describe('Home Component', () => {
  // Test renderiranja komponente bez grešaka
  test('renders without errors', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome, Admin/i)).toBeInTheDocument();
    });
  });

  // Testiranje prikaza poruke dobrodošlice
  test('displays welcome message', async () => {
    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText(/Welcome, Admin/i)).toBeInTheDocument();
    });
  });

  // Testiranje dohvaćanja i prikaza korisnika
  test('displays users data', async () => {
    const usersData = [
      { id: 1, username: 'user1', email: 'user1@example.com', phone: '123456789' },
      { id: 2, username: 'user2', email: 'user2@example.com', phone: '987654321' }
    ];
    Home.fetchUsers.mockResolvedValueOnce(usersData);

    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText(/Users/i)).toBeInTheDocument();
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });
  });

  // Testiranje dohvaćanja i prikaza kampanja
  test('displays campaigns data', async () => {
    const campaignsData = [
      { id: 1, name: 'Campaign 1', channels: 'Email', mediatypes: 'Text', durationfrom: '2024-01-01', durationto: '2024-01-31' },
      { id: 2, name: 'Campaign 2', channels: 'Social Media', mediatypes: 'Image', durationfrom: '2024-02-01', durationto: '2024-02-29' }
    ];
    Home.fetchCampaigns.mockResolvedValueOnce(campaignsData);

    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText(/Campaigns/i)).toBeInTheDocument();
      expect(screen.getByText('Campaign 1')).toBeInTheDocument();
      expect(screen.getByText('Campaign 2')).toBeInTheDocument();
    });
  });

  // Testiranje prikaza greške ako dođe do problema prilikom dohvaćanja korisnika
  test('displays error message when users fetch fails', async () => {
    Home.fetchUsers.mockRejectedValueOnce(new Error('Failed to fetch users'));

    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText(/Error fetching users/i)).toBeInTheDocument();
    });
  });

  // Testiranje prikaza greške ako dođe do problema prilikom dohvaćanja kampanja
  test('displays error message when campaigns fetch fails', async () => {
    Home.fetchCampaigns.mockRejectedValueOnce(new Error('Failed to fetch campaigns'));

    render(<Home />);
    await waitFor(() => {
      expect(screen.getByText(/Error fetching campaigns/i)).toBeInTheDocument();
    });
  });
});
