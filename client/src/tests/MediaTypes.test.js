import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MediaTypes from '../components/MediaTypes/MediaTypes';

// Mocked data
const mockedTypes = [
  { id: 1, name: 'Image' },
  { id: 2, name: 'Video' },
];

const mockFetchSuccess = (data) => {
  return Promise.resolve({
    json: () => Promise.resolve(data),
    ok: true,
  });
};

const mockFetchFailure = (errorMessage) => {
  return Promise.resolve({
    json: () => Promise.resolve({ message: errorMessage }),
    ok: false,
  });
};

describe('MediaTypes Component', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchSuccess(mockedTypes));
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  test('renders media types correctly', async () => {
    render(<MediaTypes />);

    await waitFor(() => {
      mockedTypes.forEach((type) => {
        expect(screen.getByText(type.name)).toBeInTheDocument();
      });
    });
  });

  test('displays error message when failed to fetch media types', async () => {
    global.fetch.mockImplementation(() => mockFetchFailure('Failed to fetch media'));

    render(<MediaTypes />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch media/i)).toBeInTheDocument();
    });
  });

  test('allows adding a new media type', async () => {
    render(<MediaTypes />);

    const addButton = screen.getByText('Add');
    const inputField = screen.getByPlaceholderText('Select media type');
    fireEvent.change(inputField, { target: { value: 'New Type' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Type')).toBeInTheDocument();
    });
  });

  test('allows deleting a media type', async () => {
    render(<MediaTypes />);

    const deleteButton = screen.getAllByText('🗑️')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(mockedTypes[0].name)).not.toBeInTheDocument();
    });
  });

  // You can add more tests for updating media type, handling popup, etc.
});
