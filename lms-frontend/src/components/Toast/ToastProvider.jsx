import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,        // ← NEW
} from "react";
import { createPortal } from "react-dom";
import "./toast.css";

const ToastCtx = createContext(null);

/* ── hook ─────────────────────────────────────────────── */
export function useToast() {
  return useContext(ToastCtx);
}

let id = 0;

/* ── provider ─────────────────────────────────────────── */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  /* push a toast */
  const push = useCallback((message, type = "error", ttl = 5000) => {
    const next = { id: ++id, message, type };
    setToasts(t => [...t, next]);

    /* auto-dismiss */
    setTimeout(() => {
      setToasts(t => t.filter(x => x.id !== next.id));
    }, ttl);
  }, []);

  /* manual dismiss */
  const dismiss = id => setToasts(t => t.filter(x => x.id !== id));

  /* listen for global CustomEvents (eg. axios, non-React code) */
  useEffect(() => {
    const handler = e => push(e.detail.message, e.detail.type);
    window.addEventListener("__toast__", handler);
    return () => window.removeEventListener("__toast__", handler);
  }, [push]);

  /* render */
  return (
    <ToastCtx.Provider value={push}>
      {children}

      {createPortal(
        <div className="toast-stack">
          {toasts.map(t => (
            <div
              key={t.id}
              className={`toast ${t.type}`}
              onClick={() => dismiss(t.id)}
            >
              {t.message}
            </div>
          ))}
        </div>,
        document.body
      )}
    </ToastCtx.Provider>
  );
}
