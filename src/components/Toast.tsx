import React from 'react';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../types';

interface Props {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto px-4 py-2.5 rounded-2xl bg-slate-900/90 dark:bg-zinc-950/90 text-white text-xs font-medium backdrop-blur-xl shadow-2xl border border-white/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-2 fade-in"
        >
          {toast.type === 'warning' ? (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : toast.type === 'info' ? (
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};
