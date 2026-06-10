import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginPage from './LoginPage';
import * as useLoginMutationModule from '../hooks/useLoginMutation';

const mockMutate = vi.fn();

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
  reset: vi.fn(),
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
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={ui} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useLoginMutationModule, 'useLoginMutation').mockReturnValue(baseMock as any);
  });

  it('renders email and password fields', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows a link to the signup page', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email format', async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'not-an-email' } });
    fireEvent.input(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('disables button and shows "Logging in..." while pending', () => {
    vi.spyOn(useLoginMutationModule, 'useLoginMutation').mockReturnValue({
      ...baseMock,
      isPending: true,
    } as any);
    renderWithProviders(<LoginPage />);
    const button = screen.getByRole('button', { name: /logging in/i });
    expect(button).toBeDisabled();
  });

  it('calls mutate with correct values on valid submit', async () => {
    renderWithProviders(<LoginPage />);
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'doc@hospital.com' } });
    fireEvent.input(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { email: 'doc@hospital.com', password: 'password123' },
        expect.any(Object)
      );
    });
  });

  it('navigates to /dashboard on successful login', async () => {
    vi.spyOn(useLoginMutationModule, 'useLoginMutation').mockReturnValue({
      ...baseMock,
      isSuccess: true,
    } as any);
    renderWithProviders(<LoginPage />);
    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  it('displays inline error alert on API failure', () => {
    const axiosError = Object.assign(new Error('Invalid credentials'), {
      isAxiosError: true,
      response: { data: { message: 'Invalid credentials' } },
    });
    vi.spyOn(useLoginMutationModule, 'useLoginMutation').mockReturnValue({
      ...baseMock,
      isError: true,
      error: axiosError,
    } as any);
    renderWithProviders(<LoginPage />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Invalid credentials');
  });
});
