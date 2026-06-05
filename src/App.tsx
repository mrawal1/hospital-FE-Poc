import './App.css';
import { Suspense } from 'react';
import AppRouter from '@app/router/AppRouter';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppRouter />
    </Suspense>
  );
}

export default App;
