import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DoctorProfileForm from './DoctorProfileForm';
import * as useCreateDoctorMutationModule from '../hooks/useCreateDoctorMutation';

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
      <MemoryRouter initialEntries={['/create-doctor']}>
        <Routes>
          <Route path="/create-doctor" element={ui} />
          <Route path="/doctors" element={<div>Doctors List</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('DoctorProfileForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useCreateDoctorMutationModule, 'useCreateDoctorMutation').mockReturnValue(baseMock as any);
  });

  it('renders name, speciality, and email fields', () => {
    renderWithProviders(<DoctorProfileForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Speciality/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save profile/i })).toBeInTheDocument();
  });

  it('shows all validation errors on empty submit and does not call API', async () => {
    renderWithProviders(<DoctorProfileForm />);
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Speciality is required')).toBeInTheDocument();
    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows email validation error for invalid email format', async () => {
    renderWithProviders(<DoctorProfileForm />);
    fireEvent.input(screen.getByLabelText(/Name/i), { target: { value: 'Dr. Smith' } });
    fireEvent.input(screen.getByLabelText(/Speciality/i), { target: { value: 'Cardiology' } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls mutate with correct payload on valid submit', async () => {
    renderWithProviders(<DoctorProfileForm />);
    fireEvent.input(screen.getByLabelText(/Name/i), { target: { value: 'Dr. Smith' } });
    fireEvent.input(screen.getByLabelText(/Speciality/i), { target: { value: 'Cardiology' } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'smith@hospital.com' } });
    fireEvent.click(screen.getByRole('button', { name: /save profile/i }));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { name: 'Dr. Smith', speciality: 'Cardiology', email: 'smith@hospital.com' }
      );
    });
  });

  it('disables button and shows "Saving..." while pending', () => {
    vi.spyOn(useCreateDoctorMutationModule, 'useCreateDoctorMutation').mockReturnValue({
      ...baseMock,
      isPending: true,
    } as any);
    renderWithProviders(<DoctorProfileForm />);
    const button = screen.getByRole('button', { name: /saving/i });
    expect(button).toBeDisabled();
  });

  it('navigates to /doctors on success', async () => {
    vi.spyOn(useCreateDoctorMutationModule, 'useCreateDoctorMutation').mockReturnValue({
      ...baseMock,
      isSuccess: true,
    } as any);
    renderWithProviders(<DoctorProfileForm />);
    await waitFor(() => {
      expect(screen.getByText('Doctors List')).toBeInTheDocument();
    });
  });

  it('displays server error message on API failure', () => {
    vi.spyOn(useCreateDoctorMutationModule, 'useCreateDoctorMutation').mockReturnValue({
      ...baseMock,
      isError: true,
      error: new Error('Email already exists'),
    } as any);
    renderWithProviders(<DoctorProfileForm />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Email already exists');
  });
});
