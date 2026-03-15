"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

import { toastSlide } from "@/lib/motion";

export type ToastVariant = "success" | "warning" | "error" | "info";

interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastRecord extends ToastInput {
  id: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timeoutsRef = useRef<Record<string, number>>({});

  const dismissToast = (id: string) => {
    if (timeoutsRef.current[id]) {
      window.clearTimeout(timeoutsRef.current[id]);
      delete timeoutsRef.current[id];
    }

    setToasts((state) => state.filter((toast) => toast.id !== id));
  };

  const showToast = ({ duration = 3000, variant = "info", ...toast }: ToastInput) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    setToasts((state) => [...state, { id, variant, ...toast }].slice(-3));

    timeoutsRef.current[id] = window.setTimeout(() => {
      dismissToast(id);
    }, duration);

    return id;
  };

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, []);

  return (
    <ToastContext.Provider value={{ dismissToast, showToast }}>
      {children}
      <div className="toast-viewport" aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast toast--${toast.variant}`}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={toastSlide}
            >
              <div className="toast__copy">
                <span className="toast__title">{toast.title}</span>
                {toast.description ? (
                  <span className="toast__description">{toast.description}</span>
                ) : null}
              </div>
              <button
                className="toast__close"
                onClick={() => dismissToast(toast.id)}
                type="button"
              >
                Close
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
