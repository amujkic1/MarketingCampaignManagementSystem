import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils'; // Import act from react-dom/test-utils
import { BrowserRouter } from 'react-router-dom';
import { describe, test, vi, expect } from 'vitest';
import SAHome from '../components/SAHome/SAHome';
import fetchCompanies from '../components/SAHome/SAHome';
import Cookies from "js-cookie";

describe('SAHome component', () => {
  test('renders SAHome component', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SAHome />
        </BrowserRouter>
      );
    });

    const saHomeElement = screen.getByText('Companies');
    expect(saHomeElement).toBeTruthy();
  });

  test('fetches companies on component mount', async () => {
    const mockCompanies = [
      { id: 1, name: 'Company A', niche: 'Niche A', headquarters: 'HQ A', admin_user_id: 1 },
      { id: 2, name: 'Company B', niche: 'Niche B', headquarters: 'HQ B', admin_user_id: 2 },
    ];

    window.fetch = vi.fn().mockResolvedValue(createFetchResponse(mockCompanies));

    await act(async () => {
      render(
        <BrowserRouter>
          <SAHome />
        </BrowserRouter>
      );
    });
/*
    expect(window.fetch).toHaveBeenCalledWith(
      'https://marketing-campaign-management-system-server.vercel.app/admincompanies',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ username: 'mockUsername' }),
      })
    );
    */
    vi.spyOn(Cookies, 'get').mockImplementation(() => 'Admin');
    fetchCompanies()

    const companyAElement = screen.getByText('Company A');
    const companyBElement = screen.getByText('Company B');
    expect(companyAElement).toBeTruthy();
    expect(companyBElement).toBeTruthy();
  });

  test('renders "Add company" link', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SAHome />
        </BrowserRouter>
      );
    });

    const addCompanyLink = screen.getByText('Add company');
    expect(addCompanyLink).toBeTruthy();
  });

  test('navigates to "/add-company" when "Add company" link is clicked', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <SAHome />
        </BrowserRouter>
      );
    });

    const addCompanyLink = screen.getByText('Add company');
    expect(addCompanyLink).toBeTruthy();

    addCompanyLink.click();

    expect(window.location.pathname).toEqual('/add-company');
  });
});

function createFetchResponse(data) {
  return { json: () => new Promise((resolve) => resolve(data)) };
}