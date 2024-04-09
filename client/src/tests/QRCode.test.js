import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QRCodeGenerator from '../components/QRCodeGenerator/QRCodeGenerator';

// Mocked data
const mockedQRImage = 'mocked_qr_image.png';

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

describe('QRCodeGenerator Component', () => {
  test('renders QR code generator form correctly', () => {
    render(<QRCodeGenerator />);
    const qrCodeImage = screen.getByAltText('QR Code');
    const inputField = screen.getByPlaceholderText('Enter 2FA Code');
    const authenticateButton = screen.getByText('AUTHENTICATE');

    expect(qrCodeImage).toBeInTheDocument();
    expect(inputField).toBeInTheDocument();
    expect(authenticateButton).toBeInTheDocument();
  });

  test('allows user to input authentication code', () => {
    render(<QRCodeGenerator />);
    const inputField = screen.getByPlaceholderText('Enter 2FA Code');

    fireEvent.change(inputField, { target: { value: '123456' } });

    expect(inputField).toHaveValue('123456');
  });

  test('displays error message when authentication fails', async () => {
    render(<QRCodeGenerator />);
    const inputField = screen.getByPlaceholderText('Enter 2FA Code');
    const authenticateButton = screen.getByText('AUTHENTICATE');

    fireEvent.change(inputField, { target: { value: 'invalid_code' } });
    fireEvent.click(authenticateButton);

    await waitFor(() => {
      expect(screen.getByText(/Authentication code is invalid/i)).toBeInTheDocument();
    });
  });

  test('fetches QR code image successfully', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchSuccess({ success: true, image: mockedQRImage }));

    render(<QRCodeGenerator />);

    await waitFor(() => {
      expect(screen.getByAltText('QR Code')).toHaveAttribute('src', mockedQRImage);
    });

    global.fetch.mockRestore();
  });

  test('handles failure to fetch QR code image', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(() => mockFetchFailure('Unable to fetch QR image'));

    render(<QRCodeGenerator />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to fetch QR image/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  // Add more tests as needed for different scenarios
});
