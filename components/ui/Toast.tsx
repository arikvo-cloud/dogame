"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  show: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
let nextId = 1;

/**
 * Lightweight toast system. Wrap the app in <ToastProvider> and call
 * useToast().show("message", "success"). Auto-dismiss in 3.5s.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback(
    (message: string, variant: ToastVariant = "success") => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // No-op fallback so components don't crash if not under provider
    return { show: () => {} };
  }
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: ReactNode }> = {
  success: {
    bg: "bg-success-tint",
    border: "border-success",
    icon: <Check className="w-4 h-4 text-success-deep" strokeWidth={3} />,
  },
  error: {
    bg: "bg-danger-tint",
    border: "border-danger",
    icon: <X className="w-4 h-4 text-danger" strokeWidth={3} />,
  },
  warning: {
    bg: "bg-warning-tint",
    border: "border-warning",
    icon: <AlertTriangle className="w-4 h-4 text-warning-deep" strokeWidth={3} />,
  },
  info: {
    bg: "bg-accent-tint",
    border: "border-accent-soft",
    icon: <Info className="w-4 h-4 text-accent-deep" strokeWidth={3} />,
  },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const v = variantStyles[toast.variant];
  return (
    <motion.div
      role="status"
      layout
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={cn(
        "pointer-events-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-[18px] border-2 shadow-[var(--shadow-clay-lg)]",
        v.bg,
        v.border
      )}
    >
      <span aria-hidden className="shrink-0">
        {v.icon}
      </span>
      <span className="font-display font-extrabold text-ink text-sm flex-1">
        {toast.message}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="סגירה"
        className="text-ink-soft hover:text-ink p-0.5 rounded"
      >
        <X className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </motion.div>
  );
}
