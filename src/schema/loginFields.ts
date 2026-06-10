export interface LoginFieldConfig {
  name: 'email' | 'password';
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
}

export const loginFields: LoginFieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Your password',
    autoComplete: 'current-password',
  },
];
