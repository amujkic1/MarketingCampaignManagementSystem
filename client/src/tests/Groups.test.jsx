import { fireEvent, render, screen } from '@testing-library/react';
import {afterEach, describe, expect, test, vi} from "vitest"
import { BrowserRouter } from 'react-router-dom';
import Cookies from "js-cookie";
import Groups from '../components/Groups/Groups';
import React, { useState, useEffect } from 'react'; // Dodana importacija useState i useEffect

describe('Groups component', () => {
  test('renders without crashing', () => {
    render(<Groups />);
    const groupNameInput = screen.getByPlaceholderText('Region');
    expect(groupNameInput).toBeInTheDocument();
  });

  test('updates group name', () => {
    render(<Groups />);
    const groupNameInput = screen.getByPlaceholderText('Region');
    fireEvent.change(groupNameInput, { target: { value: 'New Group Name' } });
    expect(groupNameInput.value).toBe('New Group Name');
  });

  test('updates selected channel', () => {
    render(<Groups />);
    const channelSelect = screen.getByLabelText('Select channel type');
    fireEvent.change(channelSelect, { target: { value: 'TV' } });
    expect(channelSelect.value).toBe('TV');
  });

  test('adds channel to group', () => {
    render(<Groups />);
    const channelSelect = screen.getByLabelText('Select channel type');
    fireEvent.change(channelSelect, { target: { value: 'TV' } });
    const checkbox = screen.getByLabelText('TV');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('creates group', async () => {
    render(<Groups />);
    const groupNameInput = screen.getByPlaceholderText('Region');
    const createButton = screen.getByText('Create Group');
    fireEvent.change(groupNameInput, { target: { value: 'New Group' } });
    fireEvent.click(createButton);
    // Add assertions for successful group creation alert message
  });

  test('updates selected campaign', () => {
    render(<Groups />);
    const checkbox = screen.getByLabelText('Campaign Name');
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('updates selected region', () => {
    render(<Groups />);
    const regionSelect = screen.getByLabelText('Select region');
    fireEvent.change(regionSelect, { target: { value: 'Region Name' } });
    expect(regionSelect.value).toBe('Region Name');
  });

  test('assigns group to campaign', async () => {
    render(<Groups />);
    const assignButton = screen.getByText('Assign Group');
    fireEvent.click(assignButton);
    // Add assertions for successful group assignment alert message
  });
});

