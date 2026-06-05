import React from 'react';
import TextField from '@shared/components/TextField';
import { loginFields } from '../../../schema/loginFields';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


import {
  loginSchema,
  type LoginFormValues,
} from '@modules/auth/validations/login.validation';
import { useLoginMutation } from '@modules/auth/hooks/useLoginMutation';

function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useLoginMutation();


  // Redirect to dashboard after successful login
  React.useEffect(() => {
    if (loginMutation.isSuccess) {
      navigate('/dashboard');
    }
  }, [loginMutation.isSuccess, navigate]);

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(
      { email: values.email, password: values.password },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };


  return (
    <main className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1>MyHospital</h1>
          <p>Log in to manage your appointments and records.</p>
        </header>

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {loginFields.map((field: any) => (
            <TextField
              key={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              autoComplete={field.autoComplete}
              error={errors && typeof errors === 'object' && field.name in errors ? (errors as any)[field.name]?.message : undefined}
              {...register(field.name)}
            />
          ))}
          <button
            type="submit"
            className="login-button"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <footer className="login-footer">
          <span>Don't have an account? </span>
          <Link to="/signup">Sign up</Link>
        </footer>
      </div>
    </main>
  );
}

export default LoginPage;
