import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PatientRegistrationForm from './PatientRegistrationForm';
import * as useCreatePatientMutationModule from '../hooks/useCreatePatientMutation';

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
      <MemoryRouter initialEntries={['/register-patient']}>
        <Routes>
          <Route path="/register-patient" element={ui} />
          <Route path="/patients" element={<div>Patients List</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('PatientRegistrationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(useCreatePatientMutationModule, 'useCreatePatientMutation').mockReturnValue(
      baseMock as ReturnType<typeof useCreatePatientMutationModule.useCreatePatientMutation>
    );
  });

  it('renders all form fields and submit button', () => {
    renderWithProviders(<PatientRegistrationForm />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Blood Group/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register patient/i })).toBeInTheDocument();
  });

  it('shows required validation errors on empty submit', async () => {
    renderWithProviders(<PatientRegistrationForm />);
    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(await screen.findByText('Phone is required')).toBeInTheDocument();
    expect(await screen.findByText('Date of birth is required')).toBeInTheDocument();
    expect(await screen.findByText('Address is required')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows email validation error for invalid email', async () => {
    renderWithProviders(<PatientRegistrationForm />);
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'bad-email' } });
    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));
    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('shows phone validation error for invalid phone', async () => {
    renderWithProviders(<PatientRegistrationForm />);
    fireEvent.input(screen.getByLabelText(/Phone Number/i), { target: { value: 'abc' } });
    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));
    expect(await screen.findByText('Enter a valid phone number')).toBeInTheDocument();
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it('calls mutate with correct payload on valid submit', async () => {
    renderWithProviders(<PatientRegistrationForm />);
    fireEvent.input(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.input(screen.getByLabelText(/Phone Number/i), { target: { value: '+1234567890' } });
    fireEvent.input(screen.getByLabelText(/Date of Birth/i), { target: { value: '1990-05-15' } });
    fireEvent.input(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.click(screen.getByRole('button', { name: /register patient/i }));
    await screen.findByRole('button', { name: /register patient/i });
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1234567890',
        dateOfBirth: '1990-05-15',
        address: '123 Main St',
        gender: 'male',
      })
    );
  });

  it('disables button and shows loading text while pending', () => {
    vi.spyOn(useCreatePatientMutationModule, 'useCreatePatientMutation').mockReturnValue({
      ...baseMock,
      isPending: true,
    } as ReturnType<typeof useCreatePatientMutationModule.useCreatePatientMutation>);
    renderWithProviders(<PatientRegistrationForm />);
    const btn = screen.getByRole('button', { name: /registering/i });
    expect(btn).toBeDisabled();
  });

  it('shows server error message when mutation fails', () => {
    vi.spyOn(useCreatePatientMutationModule, 'useCreatePatientMutation').mockReturnValue({
      ...baseMock,
      isError: true,
      error: new Error('Server error'),
    } as ReturnType<typeof useCreatePatientMutationModule.useCreatePatientMutation>);
    renderWithProviders(<PatientRegistrationForm />);
    expect(screen.getByRole('alert')).toHaveTextContent('Unexpected error. Please try again.');
  });
});
