import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@app/providers/query-client';
import { ToastProvider, useToast } from '@/shared/components/Toaster/Toast';
import { setToastFn } from '@/shared/components/Toaster/Toast';

interface AppProvidersProps {
  children: ReactNode;
}


function ToastGlobalBridge() {
  const { showToast } = useToast();
  setToastFn(showToast);
  return null;
}

function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      <ToastGlobalBridge />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ToastProvider>
  );
}

export default AppProviders;
