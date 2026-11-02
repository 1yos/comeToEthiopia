import { Link } from "react-router-dom";
import { tours } from "@/data/tours";
import { destinations } from "@/data/destinations";

const QUICK_LINKS = [
  { label: "Add a tour", href: "/admin/tours/new", desc: "New itinerary" },
  { label: "Add a destination", href: "/admin/destinations/new", desc: "New map pin" },
  { label: "Upload a photo", href: "/admin/gallery", desc: "Gallery" },
  { label: "Edit hero headline", href: "/admin/content", desc: "Page copy" },
  { label: "Update contact details", href: "/admin/contact", desc: "Phone & email" },
  { label: "Edit reviews", href: "/admin/reviews", desc: "3 review cards" },
];

export function DashboardPage() {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-sub">Overview of your site content.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn admin-btn--secondary"
        >
          View live site →
        </a>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__accent" />
          <div className="admin-stat__number">{tours.length}</div>
          <div className="admin-stat__label">Tours</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__accent" style={{ backgroundColor: "var(--highland)" }} />
          <div className="admin-stat__number">{destinations.length}</div>
          <div className="admin-stat__label">Destinations</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__accent" style={{ backgroundColor: "var(--sulphur)" }} />
          <div className="admin-stat__number">30</div>
          <div className="admin-stat__label">Gallery photos</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__accent" style={{ backgroundColor: "var(--indigo)" }} />
          <div className="admin-stat__number">8</div>
          <div className="admin-stat__label">Pages</div>
        </div>
      </div>

      {/* Quick links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 12,
          marginBottom: 32,
        }}
      >
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            style={{ textDecoration: "none" }}
          >
            <div
              className="admin-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "var(--ochre)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(18,17,16,0.08)")
              }
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "var(--ochre)",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--ink)",
                    fontWeight: 500,
                  }}
                >
                  {link.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    color: "var(--ink)",
                    opacity: 0.4,
                  }}
                >
                  {link.desc}
                </div>
              </div>
              <span
                style={{
                  marginLeft: "auto",
                  color: "var(--ink)",
                  opacity: 0.25,
                  fontSize: 16,
                }}
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent tours */}
      <div className="admin-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div className="admin-card__title">Tours ({tours.length})</div>
          <Link to="/admin/tours" className="admin-btn admin-btn--secondary admin-btn--sm">
            Manage all
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Duration</th>
              <th>Difficulty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tours.slice(0, 8).map((tour) => (
              <tr key={tour.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <img
                      src={`/media/tours/${tour.imageSlot}`}
                      alt={tour.imageAlt}
                      className="admin-thumb"
                    />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--ink)" }}>
                      {tour.name}
                    </span>
                  </div>
                </td>
                <td style={{ color: "var(--ink)", opacity: 0.6, fontSize: 12 }}>
                  {tour.duration} {tour.duration === 1 ? "day" : "days"}
                </td>
                <td>
                  <span className={`admin-badge admin-badge--${tour.difficulty}`}>
                    {tour.difficulty}
                  </span>
                </td>
                <td>
                  <Link
                    to={`/admin/tours/${tour.id}`}
                    className="admin-btn admin-btn--secondary admin-btn--sm"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tours.length > 8 && (
          <div style={{ padding: "12px 0 0", textAlign: "center" }}>
            <Link
              to="/admin/tours"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ochre)",
                textDecoration: "none",
              }}
            >
              View all {tours.length} tours →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
