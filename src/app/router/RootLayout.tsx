import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
  return (
    <Suspense fallback={<div role="status" aria-live="polite">Loading...</div>}>
      <Outlet />
    </Suspense>
  );
}
