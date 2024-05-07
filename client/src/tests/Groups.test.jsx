import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test } from 'vitest';
import Groups from '../components/Groups/Groups';
import sinon from 'sinon';

// Mocking the window object to include fetch
global.fetch = sinon.fake.resolves({
  json: () => Promise.resolve({}),
  ok: true
});

describe('Groups component', () => {
  test('renders component with initial elements', () => {
    render(<Groups />);
    
    const groupNameInput = screen.getByLabelText('Region');
    const selectChannel = screen.getByText('Select channel type');
    const selectCampaign = screen.getByText('Select campaign:');
    const selectRegion = screen.getByText('Select region');
    const createGroupButton = screen.getByText('Create Group');
    const assignGroupButton = screen.getByText('Assign Group');
    
    expect(groupNameInput).toBeTruthy();
    expect(selectChannel).toBeTruthy();
    expect(selectCampaign).toBeTruthy();
    expect(selectRegion).toBeTruthy();
    expect(createGroupButton).toBeTruthy();
    expect(assignGroupButton).toBeTruthy();
  });

  test('handles creating a group', async () => {
    const mockChannels = [{ id: 1, channel: 'Channel 1' }, { id: 2, channel: 'Channel 2' }];
    const mockCampaigns = [{ id: 1, name: 'Campaign 1' }, { id: 2, name: 'Campaign 2' }];
    const mockRegions = [{ id: 1, name: 'Region 1' }, { id: 2, name: 'Region 2' }];
    
    global.fetch = sinon.fake.resolves({
      json: () => Promise.resolve(mockChannels),
      ok: true
    });

    render(<Groups />);
    
    // Simulate user actions
    fireEvent.change(screen.getByText('Select channel type'), { target: { value: 'TV' } });
    await screen.findByText('Channel 1');
    fireEvent.click(screen.getByLabelText('Channel 1'));
    fireEvent.change(screen.getByText('Region'), { target: { value: 'Test Region' } });
    fireEvent.click(screen.getByText('Create Group'));

    // Assertions
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(global.fetch.getCall(0).args[0]).toBe('https://marketing-campaign-management-system-server.vercel.app/getchannel/TV');
    expect(global.fetch.getCall(1).args[0]).toBe('https://marketing-campaign-management-system-server.vercel.app/campaign');
    expect(global.fetch.getCall(2).args[0]).toBe('https://marketing-campaign-management-system-server.vercel.app/groups');
  });

  test('handles assigning a group to a campaign', async () => {
    const mockData = [{ id: 1, name: 'Campaign 1' }, { id: 2, name: 'Campaign 2' }];

    global.fetch = sinon.fake.resolves({
      json: () => Promise.resolve(mockData),
      ok: true
    });

    render(<Groups />);
    
    // Simulate user actions
    fireEvent.change(screen.getByText('Select region'), { target: { value: 'Test Region' } });
    await screen.findByText('Campaign 1');
    fireEvent.click(screen.getByLabelText('Campaign 1'));
    fireEvent.click(screen.getByText('Assign Group'));

    // Assertions
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch.getCall(0).args[0]).toBe('https://marketing-campaign-management-system-server.vercel.app/campaign/assigngroup');
  });
});
