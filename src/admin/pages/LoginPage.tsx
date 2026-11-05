import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function LoginPage() {
  const [password, setPassword] = useState("");
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

  return (
    <div className="cte-admin admin-login">
      <div className="admin-login__card">
        {/* Logo mark */}
        <div className="admin-login__mark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
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
            <input
              id="admin-pw"
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="admin-input"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={loading || !password}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "11px",
              fontSize: 13,
              marginTop: 4,
            }}
          >
            {loading ? "Signing in…" : "Sign in →"}
          </button>
        </form>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--a-muted)",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Session expires after 8 hours.
        </p>
      </div>
    </div>
  );
}
