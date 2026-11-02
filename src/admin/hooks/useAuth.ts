/**
 * CMS Auth — simple password-based auth stored in sessionStorage.
 * Password is set via VITE_ADMIN_PASSWORD env variable.
 * For production: set VITE_ADMIN_PASSWORD in your deployment env.
 * Default dev password: admin123 (change before deploying)
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
    const expected =
      import.meta.env.VITE_ADMIN_PASSWORD ?? "admin123";
    if (password === expected) {
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
