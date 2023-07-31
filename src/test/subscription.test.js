import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For custom jest matchers
import { MemoryRouter } from 'react-router-dom';
import api from '../utils/axioswrapper.js';
import Services from '../pages/Services';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('../utils/helperFunc.js', () => ({
  getUserDetails: () => 'user123', 
}));

jest.mock('../utils/axioswrapper.js', () => ({
  post: jest.fn(),
}));

describe('Services Component', () => {
  it('should render the services list', async () => {
    const mockedServices = [
      { _id: '1', name: 'Service A', description: 'Lorem ipsum dolor sit amet.' },
      { _id: '2', name: 'Service B', description: 'Praesent non nulla eget ex.' },
    ];
    const mockPost = jest.fn().mockResolvedValueOnce({ data: mockedServices });
    jest.mock('../utils/axioswrapper.js', () => ({
      post: mockPost,
    }));

    render(<Services />, { wrapper: MemoryRouter });

    const serviceElements = await screen.findAllByRole('button', { name: /subscribe|unsubscribe/i });
    expect(serviceElements).toHaveLength(2);
  });

  it('should handle subscribe button click', async () => {
    const serviceId = '1';
    const updatedService = { _id: '1', name: 'Service A', description: 'Lorem ipsum dolor sit amet.', isSubscribed: true };
    const mockPost = jest.fn().mockResolvedValueOnce({ data: { currentSubscription: updatedService } });
    jest.mock('../utils/axioswrapper.js', () => ({
      post: mockPost,
    }));

    render(<Services />, { wrapper: MemoryRouter });

    const subscribeButton = await screen.findByRole('button', { name: /subscribe/i });
    fireEvent.click(subscribeButton);

    const updatedServiceElement = await screen.findByRole('button', { name: /unsubscribe/i });
    expect(updatedServiceElement).toBeInTheDocument();
  });

  it('should handle unsubscribe button click', async () => {
    const serviceId = '1';
    const updatedService = { _id: '1', name: 'Service A', description: 'Lorem ipsum dolor sit amet.', isSubscribed: false };
    const mockPost = jest.fn().mockResolvedValueOnce({ data: { updatedSubscription: updatedService } });
    jest.mock('../utils/axioswrapper.js', () => ({
      post: mockPost,
    }));

    render(<Services />, { wrapper: MemoryRouter });

    const unsubscribeButton = await screen.findByRole('button', { name: /unsubscribe/i });
    fireEvent.click(unsubscribeButton);

    const updatedServiceElement = await screen.findByRole('button', { name: /subscribe/i });
    expect(updatedServiceElement).toBeInTheDocument();
  });

  it('should handle logout button click', async () => {
    const mockPost = jest.fn().mockResolvedValueOnce({});
    jest.mock('../utils/axioswrapper.js', () => ({
      post: mockPost,
    }));

    const navigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => navigate,
    }));

    render(<Services />, { wrapper: MemoryRouter });

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
