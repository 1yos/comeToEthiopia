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
    await new Promise((r) => setTimeout(r, 400)); // brief delay prevents brute force
    const ok = login(password);
    setLoading(false);
    if (ok) {
      navigate("/admin", { replace: true });
    } else {
      setError("Incorrect password.");
      setPassword("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="cte-admin admin-login">
      {/* Ghost Ge'ez watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "-3%",
          fontFamily: "var(--font-geez)",
          fontSize: "clamp(160px, 24vw, 320px)",
          lineHeight: 1,
          color: "var(--paper)",
          opacity: 0.04,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        ፊደል {/* TODO-REVIEW */}
      </div>

      <div className="admin-login__card">
        <div className="admin-login__logo">Come to Ethiopia</div>
        <div className="admin-login__subtitle">Admin Panel</div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="admin-login__error" role="alert">
              {error}
            </div>
          )}

          <div className="admin-field">
            <label htmlFor="admin-password" className="admin-label">
              Password
            </label>
            <input
              id="admin-password"
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="admin-input"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={loading || !password}
            style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          >
            {loading ? "Checking…" : "Sign in →"}
          </button>
        </form>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 11,
            color: "var(--ink)",
            opacity: 0.35,
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
