import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated()) navigate("/admin", { replace: true });
    inputRef.current?.focus();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 380));
    const ok = login(password);
    setLoading(false);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
      inputRef.current?.focus();
    }
  };

  const onKeyUp = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState("CapsLock"));
  };

  return (
    <div className="cte-admin admin-login" data-theme="light">
      <div className="admin-login__card">
        {/* Logo mark */}
        <div className="admin-login__mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 14 14" fill="none">
            <path
              d="M7 1L2 4v6l5 3 5-3V4L7 1z"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M7 1v12M2 4l5 3 5-3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="admin-login__title">Sign in</h1>
        <p className="admin-login__sub">Come to Ethiopia Tours — Admin Panel</p>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="admin-login__error" role="alert">
              {error}
            </div>
          )}

          <div className="admin-field">
            <label htmlFor="admin-pw" className="admin-label">
              Password
            </label>
            <div className="admin-password-field">
              <input
                id="admin-pw"
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={onKeyUp}
                onKeyDown={onKeyUp}
                placeholder="Enter your password"
                className="admin-input"
                autoComplete="current-password"
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((p) => !p)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 1l14 14M8 4a4 4 0 014 4M4 4C2 5 1 7 1 8s3 5 7 5c1.2 0 2.3-.3 3.3-.8" />
                    <path d="M6 6a4 4 0 00-2 2c0 0 3 5 7 5 .5 0 1-.1 1.5-.2" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 8s3-5 7-5 7 5 7 5-3 5-7 5-7-5-7-5z" />
                    <circle cx="8" cy="8" r="2" />
                  </svg>
                )}
              </button>
            </div>
            {capsLockOn && (
              <div className="admin-caps-warning">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 1v6M6 9v.01" strokeLinecap="round" />
                </svg>
                Caps Lock is on
              </div>
            )}
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={loading || !password}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "11px",
              fontSize: "var(--a-text-base)",
              marginTop: 4,
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <p
          style={{
            fontSize: "var(--a-text-xs)",
            color: "var(--a-muted)",
            marginTop: "var(--a-space-5)",
            textAlign: "center",
          }}
        >
          Session expires after 8 hours.
        </p>
      </div>
    </div>
  );
}
