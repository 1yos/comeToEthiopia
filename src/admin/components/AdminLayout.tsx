import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="admin-nav__icon">
        <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z" opacity=".5" /><path d="M3 3h3v3H3V3zm7 0h3v3h-3V3zM3 10h3v3H3v-3zm7 0h3v3h-3v-3z" />
      </svg>
    ),
  },
  {
    section: "Content",
    label: "Tours",
    href: "/admin/tours",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="admin-nav__icon">
        <path d="M2 12L8 4l6 8" /><circle cx="8" cy="4" r="1.2" />
      </svg>
    ),
  },
  {
    label: "Destinations",
    href: "/admin/destinations",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="admin-nav__icon">
        <circle cx="8" cy="7" r="3" /><path d="M8 2a5 5 0 010 10c-2.5 0-6-3-6-5s3.5-5 6-5z" />
      </svg>
    ),
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="admin-nav__icon">
        <rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" /><rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" />
      </svg>
    ),
  },
  {
    section: "Site",
    label: "Page Content",
    href: "/admin/content",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="admin-nav__icon">
        <path d="M2 4h12M2 8h8M2 12h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="admin-nav__icon">
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/admin/contact",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="admin-nav__icon">
        <rect x="1" y="3" width="14" height="10" /><path d="M1 3l7 6 7-6" />
      </svg>
    ),
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated()) return null;

  let lastSection = "";

  return (
    <div className="cte-admin admin-shell">
      {/* Top bar */}
      <header className="admin-topbar" role="banner">
        <Link to="/admin" className="admin-topbar__logo">
          Come to Ethiopia Tours
        </Link>
        <span className="admin-topbar__badge">Admin</span>
        <div className="admin-topbar__spacer" />
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-topbar__btn"
        >
          View site
        </a>
        <button className="admin-topbar__btn" onClick={logout}>
          Sign out
        </button>
      </header>

      {/* Sidebar */}
      <nav className="admin-sidebar" aria-label="Admin navigation">
        <ul className="admin-nav" role="list">
          {NAV_ITEMS.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            const isActive =
              item.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                {showSection && (
                  <div className="admin-nav__section">{item.section}</div>
                )}
                <li
                  className={`admin-nav__item${isActive ? " admin-nav__item--active" : ""}`}
                >
                  <Link to={item.href}>
                    {item.icon}
                    {item.label}
                  </Link>
                </li>
              </li>
            );
          })}
        </ul>

        {/* Bottom: version info */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid rgba(241,234,217,0.08)",
            fontFamily: "var(--font-body)",
            fontSize: 10,
            color: "rgba(241,234,217,0.2)",
            letterSpacing: "0.1em",
          }}
        >
          CTE Admin v1.0
        </div>
      </nav>

      {/* Main content */}
      <main className="admin-main" id="admin-content">
        {children}
      </main>
    </div>
  );
}
