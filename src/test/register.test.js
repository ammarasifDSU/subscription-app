import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For custom jest matchers

import Registration from '../pages/Registration';

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('../../utils/axioswrapper', () => ({
  post: jest.fn(),
}));

describe('Registration Component', () => {
  it('should render the registration form', () => {
    render(<Registration />);
    const usernameInput = screen.getByPlaceholderText('Username');
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const registerButton = screen.getByRole('button', { name: 'Register' });

    expect(usernameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  it('should show error message on registration failure', async () => {
    const errorMessage = 'Registration failed. Please try again.';
    const mockPost = jest.fn().mockRejectedValueOnce({ response: { data: { error: errorMessage } } });
    jest.mock('../../utils/axioswrapper', () => ({
      post: mockPost,
    }));

    render(<Registration />);
    const registerButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.click(registerButton);

    await waitFor(() => {
      const errorElement = screen.getByText(errorMessage);
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('should redirect to login page on successful registration', async () => {
    const mockPost = jest.fn().mockResolvedValueOnce({});
    jest.mock('../../utils/axioswrapper', () => ({
      post: mockPost,
    }));

    const navigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      useNavigate: () => navigate,
    }));

    render(<Registration />);
    const registerButton = screen.getByRole('button', { name: 'Register' });

    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/login');
    });
  });
});
