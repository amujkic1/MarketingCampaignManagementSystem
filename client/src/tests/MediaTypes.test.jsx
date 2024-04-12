import React from 'react';
import MediaTypes from '../components/MediaTypes/MediaTypes';
import {afterEach, describe, expect, test, vi} from "vitest"
import { BrowserRouter } from 'react-router-dom';
import Cookies from "js-cookie";
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// Testovi
test('adds new media type when add button is clicked', async () => {
    render(<MediaTypes />);
    fireEvent.click(screen.getByTestId('add-media-button'));
    await waitFor(() => {
      expect(screen.queryAllByText('Image')).not.toHaveLength(0);
    });
  });
  
  test('deletes media type when delete button is clicked', async () => {
    render(<MediaTypes />);
    const deleteButtons = screen.queryAllByTestId(/^delete-media-button-/);
    if (deleteButtons.length > 0) {
      fireEvent.click(deleteButtons[0]); // Assuming you want to delete the first media type
      await waitFor(() => {
        expect(screen.queryAllByTestId(/^delete-media-button-/)).toHaveLength(deleteButtons.length - 1);
      });
    }
  });
  
  test('opens update popup when edit button is clicked', async () => {
    render(<MediaTypes />);
    const editButtons = screen.queryAllByTestId(/^edit-media-button-/);
    if (editButtons.length > 0) {
      fireEvent.click(editButtons[0]); // Assuming you want to edit the first media type
      // Add your assertions for the update popup here
    }
  });
  
  test('closes update popup when close button is clicked', async () => {
    render(<MediaTypes />);
    const editButtons = screen.queryAllByTestId(/^edit-media-button-/);
    if (editButtons.length > 0) {
      fireEvent.click(editButtons[0]); // Open the update popup
      const closeButton = screen.getByTestId('close-popup-button');
      fireEvent.click(closeButton);
      // Add your assertions for closing the popup here
    }
  });
  
  // Ispravka JSX-a
  <select
    className="input-select"
    data-testid="media-type-select"
  >
    <option value="">Select media type</option>
    <option value="Image">Image</option>
    <option value="Image with text">Image with text</option>
    <option value="Video">Video</option>
    <option value="Link">Link</option>
  </select>
  