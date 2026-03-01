import { useState, useCallback } from 'react';
import { Notification } from '../types';

interface Toast extends Notification {
  dismiss: () => void;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();

    const newToast: Toast = {
      ...toast,
      id,
      timestamp,
      dismiss: () => {
        setToasts(prev => prev.filter(t => t.id !== id));
      },
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);

    return newToast;
  }, []);

  const showSuccess = useCallback((title: string, message?: string) => {
    return addToast({ type: 'success', title, message: message || '' });
  }, [addToast]);

  const showError = useCallback((title: string, message?: string) => {
    return addToast({ type: 'error', title, message: message || '' });
  }, [addToast]);

  const showWarning = useCallback((title: string, message?: string) => {
    return addToast({ type: 'warning', title, message: message || '' });
  }, [addToast]);

  const showInfo = useCallback((title: string, message?: string) => {
    return addToast({ type: 'info', title, message: message || '' });
  }, [addToast]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAll,
  };
}


