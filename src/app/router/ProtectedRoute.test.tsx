import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { tokenService } from '@shared/services/token-service';

vi.mock('@shared/services/token-service', () => ({
  tokenService: {
    isAuthenticated: vi.fn(),
    getToken: vi.fn(() => null),
    setToken: vi.fn(),
    removeToken: vi.fn(),
  },
}));

function renderRoute(isAuthenticated: boolean) {
  vi.mocked(tokenService.isAuthenticated).mockReturnValue(isAuthenticated);
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('redirects unauthenticated user to /login', () => {
    renderRoute(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('renders the outlet for an authenticated user', () => {
    renderRoute(true);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects when token is absent (no token in storage)', () => {
    vi.mocked(tokenService.isAuthenticated).mockReturnValue(false);
    renderRoute(false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });
});
