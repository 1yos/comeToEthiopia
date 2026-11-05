import { useState, useEffect, useRef } from "react";

const AUTH_KEY = "cte-admin-auth";
const SESSION_EXPIRY = 8 * 60 * 60 * 1000; // 8 hours
const WARNING_BEFORE = 5 * 60 * 1000; // 5 minutes before expiry

interface AuthSession {
  timestamp: number;
}

/**
 * Shows a warning toast 5 minutes before the 8-hour session expires.
 * Offers "Stay signed in" which refreshes the session timestamp.
 */
export function SessionWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const dismissed = useRef(false);

  useEffect(() => {
    const check = () => {
      if (dismissed.current) return;
      try {
        const raw = sessionStorage.getItem(AUTH_KEY);
        if (!raw) return;
        const session: AuthSession = JSON.parse(raw);
        const age = Date.now() - session.timestamp;
        const remaining = SESSION_EXPIRY - age;
        if (remaining > 0 && remaining < WARNING_BEFORE) {
          setShowWarning(true);
        }
      } catch {
        /* ignore */
      }
    };

    check();
    const interval = setInterval(check, 30000); // check every 30s
    return () => clearInterval(interval);
  }, []);

  const staySignedIn = () => {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY);
      if (!raw) return;
      const session: AuthSession = JSON.parse(raw);
      session.timestamp = Date.now();
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
    } catch {
      /* ignore */
    }
    setShowWarning(false);
    dismissed.current = true;
  };

  if (!showWarning) return null;

  return (
    <div className="admin-toast admin-toast--info" style={{ left: "var(--a-space-6)", right: "var(--a-space-6)", maxWidth: 480, marginLeft: "auto" }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--a-warning)" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4.5v3.5M8 11v.01" />
      </svg>
      <span style={{ flex: 1 }}>Your session expires in less than 5 minutes.</span>
      <button className="admin-toast__undo" onClick={staySignedIn}>
        Stay signed in
      </button>
      <button
        className="admin-toast__undo"
        onClick={() => {
          setShowWarning(false);
          dismissed.current = true;
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
