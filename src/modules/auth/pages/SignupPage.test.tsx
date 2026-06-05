import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from './SignupPage';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as useSignupMutationModule from '../hooks/useSignupMutation';

// Mock the useSignupMutation hook
const mockMutate = vi.fn();
const mockReset = vi.fn();

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useSignupMutationModule, 'useSignupMutation').mockReturnValue({
      data: undefined,
      variables: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isPending: false,
      isSuccess: false,
      status: 'idle',
      mutate: mockMutate,
      mutateAsync: vi.fn(),
      reset: mockReset,
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      submittedAt: 0,
    });
  });

  it('renders the signup form', () => {
    renderWithProviders(<SignupPage />);
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<SignupPage />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
    expect(await screen.findByText('Please confirm your password')).toBeInTheDocument();
  });

  it('calls mutate with form values on submit', async () => {
    renderWithProviders(<SignupPage />);
    fireEvent.input(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.input(screen.getByLabelText(/^Password$/i), {
      target: { value: 'password123' },
    });
    fireEvent.input(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        expect.any(Object)
      );
    });
  });
});
