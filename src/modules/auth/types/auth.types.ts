export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'nurse' | 'patient';
}

export interface AuthState {
    user: AuthUser | null;
    token: string | null;
    login: (user: AuthUser) => void;
    logout: () => void;
}

export interface SignupRequest {
    email: string;
    password: string;
}
export interface SignupResponse {
    user: AuthUser;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
    token: string;
}
