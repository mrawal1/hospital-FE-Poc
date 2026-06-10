export interface SignupFieldConfig {
  name: 'email' | 'password' | 'confirmPassword';
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
}

export const signupFields: SignupFieldConfig[] = [
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
    placeholder: 'At least 6 characters',
    autoComplete: 'new-password',
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Re-enter your password',
    autoComplete: 'new-password',
  },
];
