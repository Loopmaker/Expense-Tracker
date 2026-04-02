import type { ToastState } from '../../hooks/useToast';

interface ToastProps {
  toast: ToastState;
}

export function Toast({ toast }: ToastProps) {
  return (
    <div className={`toast ${toast.visible ? 'show' : ''}`}>
      {toast.message}
    </div>
  );
}
