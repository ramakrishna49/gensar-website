"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
  confirm: (message: string) => Promise<boolean>;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmResolve, setConfirmResolve] = useState<((v: boolean) => void) | null>(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const confirm = useCallback((message: string): Promise<boolean> => {
    setConfirmMessage(message);
    return new Promise((resolve) => {
      setConfirmResolve(() => resolve);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-5 py-3 rounded-lg shadow-lg text-sm font-medium text-white transition-all animate-slide-up ${
              t.type === "success" ? "bg-emerald-600" : t.type === "error" ? "bg-red-600" : "bg-slate-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>

      {confirmResolve && (
        <div className="fixed inset-0 bg-black/40 z-[200] flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <p className="text-slate-800 text-sm mb-5">{confirmMessage}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { confirmResolve(false); setConfirmResolve(null); setConfirmMessage(""); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => { confirmResolve(true); setConfirmResolve(null); setConfirmMessage(""); }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
