import { fireEvent, render, screen } from '@testing-library/react';
import { describe, test } from "vitest"
import { BrowserRouter } from 'react-router-dom';
import Groups from '../components/Groups/Groups';
import React from 'react'; // Dodana importacija useEffect

describe('Groups component', () => {
  test('renders without crashing', () => {
    render(<BrowserRouter><Groups /></BrowserRouter>);
    const groupNameInput = screen.getByPlaceholderText('Region');
    expect(groupNameInput).toBeDefined();
  });

  test('updates group name', () => {
    render(<BrowserRouter><Groups /></BrowserRouter>);
    const groupNameInput = screen.getByPlaceholderText('Region');
    fireEvent.change(groupNameInput, { target: { value: 'New Group Name' } });
    expect(groupNameInput.value).toBe('New Group Name');
  });

  test('updates selected channel', () => {
    render(<BrowserRouter><Groups /></BrowserRouter>);
    const channelSelect = screen.getByLabelText('Select channel type:');
    fireEvent.change(channelSelect, { target: { value: 'TV' } });
    expect(channelSelect.value).toBe('TV');
  });

  test('adds channel to group', () => {
    render(<BrowserRouter><Groups /></BrowserRouter>);
    const selectElement = screen.getByText('Select channel type');
    fireEvent.change(selectElement, { target: { value: 'TV' } });
    const checkbox = screen.getByText('TV');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
});

  test('creates group', async () => {
    render(<BrowserRouter><Groups /></BrowserRouter>);
    const groupNameInput = screen.getByPlaceholderText('Region');
    const createButton = screen.getByText('Create Group');
    fireEvent.change(groupNameInput, { target: { value: 'New Group' } });
    fireEvent.click(createButton);
    // Add assertions for successful group creation alert message
  });


  test('updates selected campaign', () => {
    render(<BrowserRouter><Groups /></BrowserRouter>);
    const checkbox = screen.getByLabelText(/Select campaign:/i);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('updates selected region', () => {
    render(<BrowserRouter><Groups /></BrowserRouter>);
    const selectElement = screen.getByLabelText('Select region');
    fireEvent.change(selectElement, { target: { value: 'Region Name' } });
    expect(selectElement.value).toBe('Region Name');
  });


  test('assigns group to campaign', async () => {
    render(<BrowserRouter><Groups /></BrowserRouter>);
    const assignButton = screen.getByText('Assign Group');
    fireEvent.click(assignButton);
    // Add assertions for successful group assignment alert message
  });
});
