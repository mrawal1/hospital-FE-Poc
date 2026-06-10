import TextField from '@shared/components/TextField';
import { signupFields } from '../../../schema/signupFields';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';

import {
  signupSchema,
  type SignupFormValues,
} from '@modules/auth/validations/signup.validation';
import { useSignupMutation } from '@modules/auth/hooks/useSignupMutation';

function SignupPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const signupMutation = useSignupMutation();

  const onSubmit = (values: SignupFormValues) => {
    signupMutation.mutate(
      { email: values.email, password: values.password },
      
      { onSuccess: () => { reset(); navigate('/dashboard'); } },)
  
  };

  const serverError = signupMutation.isError
    ? isAxiosError(signupMutation.error)
      ? (signupMutation.error.response?.data?.message ??
        signupMutation.error.message)
      : 'Unexpected error. Please try again.'
    : null;

  return (
    <main className="signup-page">
      <div className="signup-card">
        <header className="signup-header">
          <h1>MyHospital</h1>
          <p>Create your account to manage appointments and records.</p>
        </header>

        <form
          className="signup-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {signupFields.map((field) => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              error={errors[field.name]?.message}
              {...register(field.name)}
            />
          ))}

          {serverError && (
            <p className="signup-error" role="alert">
              {serverError}
            </p>
          )}
          {signupMutation.isSuccess && (
            <p className="signup-success" role="status">
              Account created successfully.
            </p>
          )}

          <button
            type="submit"
            className="signup-button"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <footer className="signup-footer">
          <span>Already have an account? </span>
          <Link to="/login">Log in</Link>
        </footer>
      </div>
    </main>
  );
}

export default SignupPage;
