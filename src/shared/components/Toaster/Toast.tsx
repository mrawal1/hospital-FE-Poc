import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import './Toast.css';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type Toast = { id: string; message: string; type: ToastType };

// Global toast singleton logic
let toastFn: ((msg: string, type: ToastType) => void) | null = null;
export const setToastFn = (fn: typeof toastFn) => {
  toastFn = fn;
};
export const showGlobalToast = (msg: string, type: ToastType) => {
  if (toastFn) toastFn(msg, type);
};

const ToastContext = createContext<{
  showToast: (message: string, type: ToastType) => void;
} | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(message: string, type: ToastType) {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }

  // Register the showToast function globally for use outside React tree
  setToastFn(showToast);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
