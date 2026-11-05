import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { getUnreadCount, getEnquiries, type Enquiry } from "../lib/enquiries";
import { CommandPalette } from "./CommandPalette";
import { SessionWarning } from "./SessionWarning";

/* ── Icons ──────────────────────────────────────────────────────────────── */
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

/* ── Navigation config ──────────────────────────────────────────────────── */
interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  section?: string;
  badge?: boolean;
}

const NAV: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <Icon d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z" />,
  },
  {
    section: "Inbox",
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
    section: "Settings",
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

/* ── Breadcrumb mapping ────────────────────────────────────────────────── */
const BREADCRUMBS: Record<string, { label: string; parent?: string }> = {
  "/admin": { label: "Dashboard" },
  "/admin/enquiries": { label: "Enquiries", parent: "Inbox" },
  "/admin/tours": { label: "Tours", parent: "Content" },
  "/admin/featured": { label: "Featured Tours", parent: "Content" },
  "/admin/destinations": { label: "Destinations", parent: "Content" },
  "/admin/gallery": { label: "Gallery", parent: "Content" },
  "/admin/content": { label: "Page Content", parent: "Settings" },
  "/admin/reviews": { label: "Reviews", parent: "Settings" },
  "/admin/contact": { label: "Contact Details", parent: "Settings" },
  "/admin/analytics": { label: "Analytics", parent: "Insights" },
  "/admin/health": { label: "Site Health", parent: "Insights" },
};

function getBreadcrumbs(
  pathname: string,
): { label: string; isCurrent: boolean }[] {
  // Tour edit page
  if (pathname.startsWith("/admin/tours/") && pathname !== "/admin/tours") {
    const isNew = pathname.endsWith("/new");
    return [
      { label: "Content", isCurrent: false },
      { label: "Tours", isCurrent: false },
      { label: isNew ? "Add Tour" : "Edit Tour", isCurrent: true },
    ];
  }
  const match = BREADCRUMBS[pathname];
  if (!match) return [{ label: "Admin", isCurrent: true }];
  const crumbs: { label: string; isCurrent: boolean }[] = [];
  if (match.parent) crumbs.push({ label: match.parent, isCurrent: false });
  crumbs.push({ label: match.label, isCurrent: true });
  return crumbs;
}

/* ── Notifications dropdown ──────────────────────────────────────────────── */
function NotificationsDropdown({
  enquiries,
  onClose,
}: {
  enquiries: Enquiry[];
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const recent = enquiries.filter((e) => e.status === "new").slice(0, 6);

  const ago = (iso: string) => {
    const s = (Date.now() - new Date(iso).getTime()) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
  };

  return (
    <div className="admin-notifications" role="menu">
      <div className="admin-notifications__header">
        <span className="admin-notifications__title">
          {recent.length} new {recent.length === 1 ? "enquiry" : "enquiries"}
        </span>
        {recent.length > 0 && (
          <button
            className="admin-btn admin-btn--ghost admin-btn--sm"
            onClick={() => {
              navigate("/admin/enquiries");
              onClose();
            }}
          >
            View all
          </button>
        )}
      </div>
      <div className="admin-notifications__list">
        {recent.length === 0 ? (
          <div className="admin-notifications__empty">
            No new enquiries. You're all caught up.
          </div>
        ) : (
          recent.map((enq) => (
            <Link
              key={enq.id}
              to="/admin/enquiries"
              className="admin-notification"
              onClick={onClose}
            >
              <div className="admin-notification__avatar">
                {enq.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="admin-notification__body">
                <div className="admin-notification__name">{enq.name}</div>
                <div className="admin-notification__detail">
                  {enq.selectedTourNames[0] ??
                    enq.tourFreeText ??
                    "No specific tour"}
                </div>
                <div className="admin-notification__time">
                  {ago(enq.timestamp)} ago
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Main layout ────────────────────────────────────────────────────────── */
export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggle } = useTheme();

  const [unread, setUnread] = useState(0);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("cte-admin-sidebar") === "collapsed";
    } catch {
      return false;
    }
  });
  const [compact, setCompact] = useState(() => {
    try {
      return localStorage.getItem("cte-admin-density") === "compact";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated()) navigate("/admin/login", { replace: true });
  }, [isAuthenticated, navigate]);

  // Data refresh
  useEffect(() => {
    const refresh = () => {
      setUnread(getUnreadCount());
      setEnquiries(getEnquiries());
    };
    refresh();
    const iv = setInterval(refresh, 15000);
    return () => clearInterval(iv);
  }, []);

  // Sidebar collapse persistence
  useEffect(() => {
    try {
      localStorage.setItem(
        "cte-admin-sidebar",
        collapsed ? "collapsed" : "expanded",
      );
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  // Density persistence
  useEffect(() => {
    try {
      localStorage.setItem(
        "cte-admin-density",
        compact ? "compact" : "comfortable",
      );
    } catch {
      /* ignore */
    }
  }, [compact]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  // Command palette keyboard shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((p) => !p);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close notifications on outside click
  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  if (!isAuthenticated()) return null;

  const crumbs = getBreadcrumbs(location.pathname);
  let lastSection = "";

  const shellClass = [
    "cte-admin admin-shell",
    collapsed ? "admin-shell--collapsed" : "",
    mobileOpen ? "admin-shell--mobile-open" : "",
    compact ? "admin-shell--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClass}>
      {/* ── Mobile overlay ── */}
      <div
        className={`admin-mobile-overlay${mobileOpen ? " admin-mobile-overlay--open" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Topbar ── */}
      <header className="admin-topbar" role="banner">
        {/* Brand + mobile menu */}
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <button
            className="admin-mobile-menu-btn"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle navigation"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M2 4h14M2 9h14M2 14h14" />
            </svg>
          </button>
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
        </div>

        {/* Sidebar collapse toggle (desktop only) */}
        <button
          className="admin-sidebar-toggle"
          onClick={() => setCollapsed((p) => !p)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{ display: mobileOpen ? "none" : "flex" }}
        >
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
            {collapsed ? <path d="M5 2l5 6-5 6" /> : <path d="M11 2L6 8l5 6" />}
          </svg>
        </button>

        {/* Breadcrumbs */}
        <nav className="admin-breadcrumbs" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--a-space-2)",
              }}
            >
              {i > 0 && <span className="admin-breadcrumb__sep">/</span>}
              <span
                className={`admin-breadcrumb${c.isCurrent ? " admin-breadcrumb--current" : ""}`}
              >
                {c.label}
              </span>
            </span>
          ))}
        </nav>

        {/* Right actions */}
        <div className="admin-topbar__actions">
          {/* Command palette trigger */}
          <button
            className="admin-cmd-trigger"
            onClick={() => setCmdOpen(true)}
            aria-label="Open command palette"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="7" cy="7" r="5" />
              <path d="M11 11l3 3" strokeLinecap="round" />
            </svg>
            <span className="admin-cmd-trigger__label">Search…</span>
            <span className="admin-cmd-trigger__hint">⌘K</span>
          </button>

          {/* Notifications bell */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              className="admin-topbar__icon-btn"
              onClick={() => setNotifOpen((p) => !p)}
              aria-label={`${unread} unread enquiries`}
            >
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
                <path d="M8 1.5a4 4 0 00-4 4v3l-1.5 2.5h11L12 8.5v-3a4 4 0 00-4-4z" />
                <path d="M6 13a2 2 0 004 0" />
              </svg>
              {unread > 0 && <span className="admin-topbar__badge-dot" />}
            </button>
            {notifOpen && (
              <NotificationsDropdown
                enquiries={enquiries}
                onClose={() => setNotifOpen(false)}
              />
            )}
          </div>

          {/* Theme toggle */}
          <button
            className="admin-theme-toggle"
            onClick={toggle}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
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
                <path d="M13 9.5a5 5 0 11-6.5-6.5 6 6 0 106.5 6.5z" />
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
                <circle cx="8" cy="8" r="3" />
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4" />
              </svg>
            )}
          </button>

          {/* Density toggle */}
          <button
            className="admin-theme-toggle"
            onClick={() => setCompact((p) => !p)}
            aria-label={
              compact
                ? "Switch to comfortable density"
                : "Switch to compact density"
            }
            title={compact ? "Comfortable density" : "Compact density"}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {compact ? (
                <>
                  <rect x="2" y="3" width="12" height="10" rx="1" />
                  <path d="M2 7h12M2 10h12" />
                </>
              ) : (
                <>
                  <rect x="2" y="2" width="12" height="12" rx="1" />
                  <path d="M2 6h12M2 10h12" />
                </>
              )}
            </svg>
          </button>

          {/* View site */}
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
            <span>View site</span>
          </a>

          {/* Sign out */}
          <button className="admin-topbar__btn" onClick={logout}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 2H2v8h3M7 6h4M9 4l2 2-2 2" />
            </svg>
            <span>Sign out</span>
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
                <div
                  className={`admin-nav__item${isActive ? " admin-nav__item--active" : ""}`}
                  style={{ position: "relative" }}
                >
                  <Link to={item.href}>
                    {item.icon}
                    <span className="admin-nav__label">{item.label}</span>
                    {item.badge && unread > 0 && (
                      <span className="admin-nav__count">{unread}</span>
                    )}
                  </Link>
                  {collapsed && (
                    <span className="admin-nav__tooltip">{item.label}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {/* Profile block */}
        <Link
          to="/admin"
          className="admin-profile"
          style={{ textDecoration: "none" }}
        >
          <div className="admin-profile__avatar">G</div>
          <div className="admin-profile__info">
            <div className="admin-profile__name">Guide</div>
            <div className="admin-profile__role">Administrator</div>
          </div>
        </Link>

        <div className="admin-sidebar-footer">CTE Admin v2.0</div>
      </nav>

      {/* ── Main ── */}
      <main className="admin-main" id="admin-content">
        {children}
      </main>

      {/* ── Command palette ── */}
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />

      {/* ── Session expiry warning ── */}
      <SessionWarning />
    </div>
  );
}
