import React from 'react';
import { render, screen} from '@testing-library/react';
import SAKompanije from '../components/SAKompanije/SAKompanije';
import { describe, expect, test} from 'vitest';
import { BrowserRouter } from 'react-router-dom';

describe('SAKompanije component', () => {
  test('renders SAKompanije component', () => {
    render(
      <BrowserRouter>
        <SAKompanije />
      </BrowserRouter>
    );
    const companyNameInput = screen.getByLabelText('Company Name');
    const nicheInput = screen.getByLabelText('Niche');
    const headquartersInput = screen.getByLabelText('Headquarter');
    const adminInput = screen.getByLabelText('Administrator');
    const adminEmailInput = screen.getByPlaceholderText('Email');
    const adminUsernameInput = screen.getByPlaceholderText('Username');
    const adminPasswordInput = screen.getByPlaceholderText('Password');
    const adminPhoneInput = screen.getByPlaceholderText('Phone');
    const createCompanyButton = screen.getByText('Create Company');

    expect(companyNameInput).toBeTruthy()
    expect(nicheInput).toBeTruthy()
    expect(headquartersInput).toBeTruthy()
    expect(adminInput).toBeTruthy()
    expect(adminEmailInput).toBeTruthy()
    expect(adminUsernameInput).toBeTruthy()
    expect(adminPasswordInput).toBeTruthy()
    expect(adminPhoneInput).toBeTruthy()
    expect(createCompanyButton).toBeTruthy()
    // vi.assertDefined(nicheInput);
    // vi.assertDefined(headquartersInput);
    // vi.assertDefined(adminInput);
    // vi.assertDefined(adminEmailInput);
    // vi.assertDefined(adminUsernameInput);
    // vi.assertDefined(adminPasswordInput);
    // vi.assertDefined(adminPhoneInput);
    // vi.assertDefined(createCompanyButton);
  });

  // test('creates company on button click', async () => {
  //   const fetchMock = vi.mockGlobal(window, 'fetch', () => Promise.resolve({ ok: true }));
  //   render(
  //     <BrowserRouter>
  //       <SAKompanije />
  //     </BrowserRouter>
  //   );

  //   const companyNameInput = screen.getByLabelText('Company Name');
  //   const nicheInput = screen.getByLabelText('Niche');
  //   const headquartersInput = screen.getByLabelText('Headquarter');
  //   const createCompanyButton = screen.getByText('Create Company');

  //   fireEvent.change(companyNameInput, { target: { value: 'Test Company' } });
  //   fireEvent.change(nicheInput, { target: { value: 'Test Niche' } });
  //   fireEvent.change(headquartersInput, { target: { value: 'Test Headquarters' } });

  //   fireEvent.click(createCompanyButton);

  //   vi.assertCalled(fetchMock);
  //   vi.assertCalledWith(fetchMock, 'https://marketing-campaign-management-system-server.vercel.app/super/company', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       name: 'Test Company',
  //       username: '',
  //       niche: 'Test Niche',
  //       headquarters: 'Test Headquarters',
  //     }),
  //   });
  // });

  // test('creates admin on button click', async () => {
//     const fetchMock = vi.mockGlobal(window, 'fetch', () => Promise.resolve({ ok: true }));
//     render(
//       <BrowserRouter>
//         <SAKompanije />
//       </BrowserRouter>
//     );

//     const adminUsernameInput = screen.getByPlaceholderText('Username');
//     const adminPasswordInput = screen.getByPlaceholderText('Password');
//     const adminEmailInput = screen.getByPlaceholderText('Email');
//     const adminPhoneInput = screen.getByPlaceholderText('Phone');
//     const createAdminButton = screen.getByText('Create Admin');

//     fireEvent.change(adminUsernameInput, { target: { value: 'testAdmin' } });
//     fireEvent.change(adminPasswordInput, { target: { value: 'testPassword' } });
//     fireEvent.change(adminEmailInput, { target: { value: 'test@example.com' } });
//     fireEvent.change(adminPhoneInput, { target: { value: '123456789' } });

//     fireEvent.click(createAdminButton);

//     vi.assertCalled(fetchMock);
//     vi.assertCalledWith(fetchMock, 'https://marketing-campaign-management-system-server.vercel.app/super/admin', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         username: 'testAdmin',
//         password: 'testPassword',
//         email: 'test@example.com',
//         phone: '123456789',
//       }),
//     });
//   });
});
