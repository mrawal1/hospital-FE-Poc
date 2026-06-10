import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignupPage from './SignupPage';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as useSignupMutationModule from '../hooks/useSignupMutation';

const mockMutate = vi.fn();
const mockReset = vi.fn();

const baseMock = {
  data: undefined,
  variables: undefined,
  error: null,
  isError: false,
  isIdle: true,
  isPending: false,
  isSuccess: false,
  status: 'idle' as const,
  mutate: mockMutate,
  mutateAsync: vi.fn(),
  reset: mockReset,
  context: undefined,
  failureCount: 0,
  failureReason: null,
  isPaused: false,
  submittedAt: 0,
};

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/signup']}>
        <Routes>
          <Route path="/signup" element={ui} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useSignupMutationModule, 'useSignupMutation').mockReturnValue(baseMock as any);
  });

  it('renders the signup form', () => {
    renderWithProviders(<SignupPage />);
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  it('shows a link to the login page', () => {
    renderWithProviders(<SignupPage />);
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
  });

  it('validates required fields on empty submit', async () => {
    renderWithProviders(<SignupPage />);
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
    expect(await screen.findByText('Please confirm your password')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows error when passwords do not match', async () => {
    renderWithProviders(<SignupPage />);
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText(/Confirm Password/i), { target: { value: 'different99' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls mutate with correct values on valid submit', async () => {
    renderWithProviders(<SignupPage />);
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'test@example.com', password: 'password123' },
        expect.any(Object)
      );
    });
  });

  it('disables button and shows "Creating account..." while pending', () => {
    vi.spyOn(useSignupMutationModule, 'useSignupMutation').mockReturnValue({
      ...baseMock,
      isPending: true,
    } as any);
    renderWithProviders(<SignupPage />);
    const button = screen.getByRole('button', { name: /creating account/i });
    expect(button).toBeDisabled();
  });

  it('displays server error message when mutation fails', () => {
    const axiosError = Object.assign(new Error('Email already registered'), {
      isAxiosError: true,
      response: { data: { message: 'Email already registered' } },
    });
    vi.spyOn(useSignupMutationModule, 'useSignupMutation').mockReturnValue({
      ...baseMock,
      isError: true,
      error: axiosError,
    } as any);
    renderWithProviders(<SignupPage />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Email already registered');
  });

  it('displays success message when mutation succeeds', () => {
    vi.spyOn(useSignupMutationModule, 'useSignupMutation').mockReturnValue({
      ...baseMock,
      isSuccess: true,
    } as any);
    renderWithProviders(<SignupPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Account created successfully');
  });

  it('navigates to /dashboard on successful signup', async () => {
    vi.spyOn(useSignupMutationModule, 'useSignupMutation').mockReturnValue({
      ...baseMock,
      mutate: vi.fn().mockImplementation((_payload: unknown, options?: { onSuccess?: () => void }) => {
        options?.onSuccess?.();
      }),
    } as any);
    renderWithProviders(<SignupPage />);
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
    fireEvent.input(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });
});
