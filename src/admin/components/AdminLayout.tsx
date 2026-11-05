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

const Icon = ({ d, size = 16 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="admin-nav__icon"
  >
    <path d={d} />
  </svg>
);

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <Icon d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z" />,
  },
  {
    section: "Enquiries",
    label: "Enquiries",
    href: "/admin/enquiries",
    badge: true,
    icon: <Icon d="M1 4h14v9H1V4zm0 0l7 5.5L15 4" />,
  },
  {
    section: "Content",
    label: "Tours",
    href: "/admin/tours",
    icon: (
      <Icon d="M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8z" />
    ),
  },
  {
    label: "Featured",
    href: "/admin/featured",
    icon: (
      <Icon d="M8 2l1.5 3 3.5.5-2.5 2.4.6 3.6L8 9.8l-3.1 1.7.6-3.6L3 5.5l3.5-.5z" />
    ),
  },
  {
    label: "Destinations",
    href: "/admin/destinations",
    icon: (
      <Icon d="M8 1a4 4 0 010 8c-2.2 0-6-3.4-6-4.5S5.8 1 8 1zm0 3a1 1 0 100 2 1 1 0 000-2z" />
    ),
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: <Icon d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z" />,
  },
  {
    section: "Site",
    label: "Page Content",
    href: "/admin/content",
    icon: <Icon d="M1 3h14M1 7h9M1 11h11" />,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: <Icon d="M8 1l2 4h4l-3 3 1 4-4-2.5L4 12l1-4-3-3h4z" />,
  },
  {
    label: "Contact",
    href: "/admin/contact",
    icon: <Icon d="M1 4h14v9H1V4zm6 4.5h4" />,
  },
  {
    section: "Insights",
    label: "Analytics",
    href: "/admin/analytics",
    icon: <Icon d="M1 12l4-5 3 2.5 3-6 4 3.5" />,
  },
  {
    label: "Site Health",
    href: "/admin/health",
    icon: <Icon d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3v4l2.5 2.5" />,
  },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) navigate("/admin/login", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const refresh = () => setUnread(getUnreadCount());
    refresh();
    const iv = setInterval(refresh, 15000);
    return () => clearInterval(iv);
  }, []);

  if (!isAuthenticated()) return null;

  let lastSection = "";

  return (
    <div className="cte-admin admin-shell">
      {/* ── Topbar ── */}
      <header className="admin-topbar" role="banner">
        {/* Brand */}
        <Link to="/admin" className="admin-topbar__brand">
          <div className="admin-topbar__logo-mark" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
          <div>
            <div className="admin-topbar__logo-text">Come to Ethiopia</div>
            <div className="admin-topbar__logo-sub">Admin</div>
          </div>
        </Link>

        {/* Right actions */}
        <div className="admin-topbar__actions">
          {unread > 0 && (
            <Link to="/admin/enquiries" className="admin-topbar__badge">
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  display: "block",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              {unread} new {unread === 1 ? "enquiry" : "enquiries"}
            </Link>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="admin-topbar__btn"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M2 6h8M6 2l4 4-4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            View site
          </a>
          <button className="admin-topbar__btn" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      {/* ── Sidebar ── */}
      <nav className="admin-sidebar" aria-label="Admin navigation">
        <ul className="admin-nav" role="list" style={{ listStyle: "none" }}>
          {NAV.map((item) => {
            const showSection = item.section && item.section !== lastSection;
            if (item.section) lastSection = item.section;
            const isActive =
              item.href === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.href);

            return (
              <li key={item.href} style={{ listStyle: "none" }}>
                {showSection && (
                  <div className="admin-nav__section">{item.section}</div>
                )}
                <li
                  className={`admin-nav__item${isActive ? " admin-nav__item--active" : ""}`}
                  style={{ listStyle: "none" }}
                >
                  <Link to={item.href}>
                    {item.icon}
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && unread > 0 && (
                      <span className="admin-nav__count">{unread}</span>
                    )}
                  </Link>
                </li>
              </li>
            );
          })}
        </ul>

        <div className="admin-sidebar-footer">CTE Admin v1.0</div>
      </nav>

      {/* ── Main ── */}
      <main className="admin-main" id="admin-content">
        {children}
      </main>
    </div>
  );
}
