/**
 * CMS Auth — simple password-based auth stored in sessionStorage.
 * Password is set via VITE_ADMIN_PASSWORD env variable.
 * For production: VITE_ADMIN_PASSWORD must be set — login is blocked in prod without it.
 * For development: falls back to "admin123" if the env var is not set.
 */

const AUTH_KEY = "cte-admin-auth";
const SESSION_EXPIRY = 8 * 60 * 60 * 1000; // 8 hours

interface AuthSession {
  timestamp: number;
}

export function useAuth() {
  const isAuthenticated = (): boolean => {
    try {
      const raw = sessionStorage.getItem(AUTH_KEY);
      if (!raw) return false;
      const session: AuthSession = JSON.parse(raw);
      const age = Date.now() - session.timestamp;
      return age < SESSION_EXPIRY;
    } catch {
      return false;
    }
  };

  const login = (password: string): boolean => {
    const expected = import.meta.env.VITE_ADMIN_PASSWORD;

    // In production: if no password is set, block all logins.
    // In development: fall back to "admin123" with a console warning.
    const isCorrect = expected
      ? password === expected
      : !import.meta.env.PROD && password === "admin123";

    if (!expected && !import.meta.env.PROD) {
      console.warn(
        "[CTE Admin] VITE_ADMIN_PASSWORD is not set. " +
          "Add it to .env.local and set a strong password before deploying.",
      );
    }

    if (isCorrect) {
      try {
        const session: AuthSession = { timestamp: Date.now() };
        sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
    window.location.href = "/admin/login";
  };

  return { isAuthenticated, login, logout };
}
