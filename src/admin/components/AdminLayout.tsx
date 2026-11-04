import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getUnreadCount } from "../lib/enquiries";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
  badge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="admin-nav__icon">
        <path
          d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"
          opacity=".5"
        />
        <path d="M3 3h3v3H3V3zm7 0h3v3h-3V3zM3 10h3v3H3v-3zm7 0h3v3h-3v-3z" />
      </svg>
    ),
  },
  {
    section: "Enquiries",
    label: "Enquiries",
    href: "/admin/enquiries",
    badge: true,
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <rect x="1" y="3" width="14" height="10" />
        <path d="M1 3l7 6 7-6" />
      </svg>
    ),
  },
  {
    section: "Content",
    label: "Tours",
    href: "/admin/tours",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <path d="M2 12L8 4l6 8" />
        <circle cx="8" cy="4" r="1.2" />
      </svg>
    ),
  },
  {
    label: "Featured Tours",
    href: "/admin/featured",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" />
      </svg>
    ),
  },
  {
    label: "Destinations",
    href: "/admin/destinations",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <circle cx="8" cy="7" r="3" />
        <path d="M8 2a5 5 0 010 10c-2.5 0-6-3-6-5s3.5-5 6-5z" />
      </svg>
    ),
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <rect x="1" y="1" width="6" height="6" />
        <rect x="9" y="1" width="6" height="6" />
        <rect x="1" y="9" width="6" height="6" />
        <rect x="9" y="9" width="6" height="6" />
      </svg>
    ),
  },
  {
    section: "Site",
    label: "Page Content",
    href: "/admin/content",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <path d="M2 4h12M2 8h8M2 12h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "/admin/contact",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <rect x="1" y="3" width="14" height="10" />
        <path d="M1 3l7 6 7-6" />
      </svg>
    ),
  },
  {
    section: "Insights",
    label: "Analytics",
    href: "/admin/analytics",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <path
          d="M2 12l3-4 3 2 3-5 3 3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Site Health",
    href: "/admin/health",
    icon: (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        className="admin-nav__icon"
      >
        <circle cx="8" cy="8" r="6" />
        <path d="M8 5v3l2 2" strokeLinecap="round" />
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
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Poll unread count every 15s
  useEffect(() => {
    const refresh = () => setUnread(getUnreadCount());
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, []);

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

        {/* Unread enquiries badge */}
        {unread > 0 && (
          <Link
            to="/admin/enquiries"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink)",
              backgroundColor: "var(--ochre)",
              padding: "4px 10px",
              textDecoration: "none",
            }}
          >
            {unread} new {unread === 1 ? "enquiry" : "enquiries"}
          </Link>
        )}

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
                    {item.badge && unread > 0 && (
                      <span
                        style={{
                          marginLeft: "auto",
                          backgroundColor: "var(--ochre)",
                          color: "var(--ink)",
                          fontFamily: "var(--font-body)",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "1px 6px",
                          minWidth: 18,
                          textAlign: "center",
                        }}
                      >
                        {unread}
                      </span>
                    )}
                  </Link>
                </li>
              </li>
            );
          })}
        </ul>

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
