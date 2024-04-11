import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar/Navbar';
import {afterEach, describe, expect, test, vi} from "vitest"
import { BrowserRouter } from 'react-router-dom';
import Cookies from "js-cookie";

describe('Navbar component', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('renders Navbar component', () => {
    render(
      <BrowserRouter>
      <Navbar />
      </BrowserRouter>
    )
    const navbarElement = screen.getByTestId('navigation'); 
    expect(navbarElement).toBeDefined();
  });
 
  test('renders Logout button', () => {
    render(
      <BrowserRouter>
      <Navbar />
      </BrowserRouter>
    )
  const logoutBttn = screen.getByTestId('logout'); 
    expect(logoutBttn).toBeDefined();
  });

  
test('renders Home link for super admin', () => {
  vi.spyOn(Cookies, 'get').mockImplementation(() => 'super_admin');
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const homeLink = screen.getByTestId('sa-home');
    expect(homeLink).toBeDefined();
    expect(Cookies.get).toHaveBeenCalledOnce(); //check if mock is called 
  });
  
  test('renders Home link for admin', () => {
    vi.spyOn(Cookies, 'get').mockImplementation(() => 'admin'); // Simulacija ulogu admina
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const homeLink = screen.getByTestId('a-home'); // Pronađite link s tekstom "Home"
    expect(homeLink).toBeDefined(); // Provjerite je li link definiran
    expect(Cookies.get).toHaveBeenCalledOnce(); // Provjerite je li se funkcija Cookies.get pozvala samo jednom
  });

  test('renders Users link for admin', () => {
    vi.spyOn(Cookies, 'get').mockImplementation(() => 'admin'); 
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const usersLink = screen.getByTestId('a-users'); 
    expect(usersLink).toBeDefined(); 
    expect(Cookies.get).toHaveBeenCalledOnce();
  });
  
  test('renders Media Types link for admin', () => {
    vi.spyOn(Cookies, 'get').mockImplementation(() => 'admin');
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const mediaTypesLink = screen.getByTestId('a-mediatypes'); 
    expect(mediaTypesLink).toBeDefined();
    expect(Cookies.get).toHaveBeenCalledOnce();
  });
  
  test('renders Channels link for admin', () => {
    vi.spyOn(Cookies, 'get').mockImplementation(() => 'admin'); 
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const channelsLink = screen.getByTestId('a-channels'); 
    expect(channelsLink).toBeDefined(); 
    expect(Cookies.get).toHaveBeenCalledOnce();
  });
  
  test('renders Campaigns link for admin', () => {
    vi.spyOn(Cookies, 'get').mockImplementation(() => 'admin'); 
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const campaignsLink = screen.getByTestId('a-campaigns'); 
    expect(campaignsLink).toBeDefined(); 
    expect(Cookies.get).toHaveBeenCalledOnce();
  });
  
  test('renders Upload link for admin', () => {
    vi.spyOn(Cookies, 'get').mockImplementation(() => 'admin'); 
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
    const uploadLink = screen.getByTestId('a-firebase');
    expect(uploadLink).toBeDefined(); 
    expect(Cookies.get).toHaveBeenCalledOnce(); 
  });
  

});
