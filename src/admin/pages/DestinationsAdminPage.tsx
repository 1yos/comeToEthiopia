import { useState, useEffect, useRef } from "react";
import { destinations as hardcodedDestinations } from "@/data/destinations";
import type { Destination } from "@/data/destinations";

type EditingDest = Partial<Destination> & { _isNew?: boolean };

const CATEGORY_OPTIONS = [
  { value: "nature", label: "Nature" },
  { value: "history", label: "History" },
  { value: "culture", label: "Culture" },
  { value: "expedition", label: "Expedition" },
] as const;

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div className={`admin-toast admin-toast--${type}`} role="status">
      {message}
    </div>
  );
}

export function DestinationsAdminPage() {
  const [data, setData] = useState<Destination[]>(hardcodedDestinations);
  const [editing, setEditing] = useState<EditingDest | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Leaflet map for visual pin placement ──────────────────────────────
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    import("leaflet").then((L) => {
      const map = L.map(mapRef.current!, {
        center: [9.0, 40.0],
        zoom: 5,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      leafletMap.current = map;

      // Add existing pins
      data.forEach((dest) => {
        const OCHRE = "#B8742A"; // matches --ochre; Leaflet options don't accept CSS vars
        const marker = L.circleMarker([dest.lat, dest.lng], {
          radius: 7,
          color: OCHRE,
          fillColor: OCHRE,
          fillOpacity: 0.8,
          weight: 1.5,
        }).addTo(map);
        marker.bindPopup(`<strong>${dest.name}</strong><br/>${dest.category}`);
        markersRef.current.push(marker);
      });

      // Click to add new pin
      map.on("click", (e: any) => {
        setEditing({
          _isNew: true,
          lat: parseFloat(e.latlng.lat.toFixed(5)),
          lng: parseFloat(e.latlng.lng.toFixed(5)),
          category: "nature",
          featured: false,
        });
      });
    });

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  const handleSave = () => {
    if (!editing) return;
    if (!editing.name?.trim()) {
      showToast("Name is required.", "error");
      return;
    }
    if (!editing.lat || !editing.lng) {
      showToast("Coordinates are required.", "error");
      return;
    }

    if (editing._isNew) {
      const newDest: Destination = {
        id: editing
          .name!.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        name: editing.name!,
        lat: editing.lat!,
        lng: editing.lng!,
        category: (editing.category as Destination["category"]) ?? "nature",
        tagline: editing.tagline ?? "",
        description: editing.description ?? "",
        featured: editing.featured ?? false,
        numeral: editing.numeral,
        geezName: editing.geezName,
        bestSeason: editing.bestSeason,
        howToGetThere: editing.howToGetThere,
        daysNeeded: editing.daysNeeded,
        altitude: editing.altitude,
        image: editing.image,
        imageFolder: editing.imageFolder as Destination["imageFolder"],
        imageAlt: editing.imageAlt,
      };
      setData((prev) => [...prev, newDest]);
    } else {
      setData((prev) =>
        prev.map((d) => (d.id === editing.id ? { ...d, ...editing } : d)),
      );
    }

    setEditing(null);
    showToast("Destination saved (write to JSON to persist).", "success");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this destination? This cannot be undone.")) return;
    setData((prev) => prev.filter((d) => d.id !== id));
    showToast("Destination deleted.", "success");
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Destinations</h1>
          <p className="admin-page-sub">
            {data.length} destinations on the map. Click the map to add a new
            pin.
          </p>
        </div>
        <button
          className="admin-btn admin-btn--primary"
          onClick={() =>
            setEditing({
              _isNew: true,
              lat: 9.0,
              lng: 40.0,
              category: "nature",
              featured: false,
            })
          }
        >
          + Add destination
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: editing ? "1fr clamp(300px, 35%, 420px)" : "1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Map */}
        <div className="admin-card" style={{ padding: 0, overflow: "hidden" }}>
          <div
            ref={mapRef}
            style={{ height: 480, width: "100%" }}
            aria-label="Destination map — click to add a new pin"
          />
          <div
            style={{
              padding: "10px 14px",
              fontFamily: "var(--font-body)",
              fontSize: 11,
              color: "var(--ink)",
              opacity: 0.45,
              borderTop: "1px solid rgba(18,17,16,0.08)",
            }}
          >
            Click anywhere on the map to drop a new destination pin.
          </div>
        </div>

        {/* Edit panel */}
        {editing && (
          <div className="admin-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div className="admin-card__title" style={{ marginBottom: 0 }}>
                {editing._isNew ? "New destination" : `Edit: ${editing.name}`}
              </div>
              <button
                className="admin-modal__close"
                onClick={() => setEditing(null)}
                aria-label="Close edit panel"
              >
                ×
              </button>
            </div>

            <div className="admin-field">
              <label className="admin-label">Name *</label>
              <input
                className="admin-input"
                value={editing.name ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Lalibela"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Tagline</label>
              <input
                className="admin-input"
                value={editing.tagline ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, tagline: e.target.value }))
                }
                placeholder="12 words max, sensory and specific"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label">Description</label>
              <textarea
                className="admin-textarea"
                value={editing.description ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                placeholder="1–2 paragraphs about this destination"
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Latitude *</label>
                <input
                  type="number"
                  step="0.00001"
                  className="admin-input"
                  value={editing.lat ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({
                      ...p,
                      lat: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Longitude *</label>
                <input
                  type="number"
                  step="0.00001"
                  className="admin-input"
                  value={editing.lng ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({
                      ...p,
                      lng: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label className="admin-label">Category *</label>
              <select
                className="admin-select"
                value={editing.category ?? "nature"}
                onChange={(e) =>
                  setEditing((p) => ({
                    ...p,
                    category: e.target.value as Destination["category"],
                  }))
                }
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Best season</label>
                <input
                  className="admin-input"
                  value={editing.bestSeason ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, bestSeason: e.target.value }))
                  }
                  placeholder="e.g. Oct – Apr"
                />
              </div>
              <div className="admin-field" style={{ marginBottom: 0 }}>
                <label className="admin-label">Altitude</label>
                <input
                  className="admin-input"
                  value={editing.altitude ?? ""}
                  onChange={(e) =>
                    setEditing((p) => ({ ...p, altitude: e.target.value }))
                  }
                  placeholder="e.g. 2,630m"
                />
              </div>
            </div>

            <div className="admin-field" style={{ marginTop: 12 }}>
              <label className="admin-label">Image filename</label>
              <input
                className="admin-input"
                value={editing.image ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="e.g. Lalibela-Ethiopia-Tours (no -480.webp)"
              />
              <span className="admin-input-hint">
                Without the -480.webp suffix.
              </span>
            </div>

            <div className="admin-field">
              <label className="admin-label">Image alt text</label>
              <input
                className="admin-input"
                value={editing.imageAlt ?? ""}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, imageAlt: e.target.value }))
                }
                placeholder="Descriptive alt text"
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <input
                type="checkbox"
                id="dest-featured"
                checked={editing.featured ?? false}
                onChange={(e) =>
                  setEditing((p) => ({ ...p, featured: e.target.checked }))
                }
                style={{ width: 16, height: 16, accentColor: "var(--ochre)" }}
              />
              <label
                htmlFor="dest-featured"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  color: "var(--ink)",
                  cursor: "pointer",
                }}
              >
                Featured destination
              </label>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="admin-btn admin-btn--primary"
                onClick={handleSave}
                style={{ flex: 1, justifyContent: "center" }}
              >
                {editing._isNew ? "Add pin" : "Save changes"}
              </button>
              {!editing._isNew && editing.id && (
                <button
                  className="admin-btn admin-btn--danger"
                  onClick={() => {
                    handleDelete(editing.id!);
                    setEditing(null);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Destinations list */}
      <div className="admin-card" style={{ marginTop: 16 }}>
        <div className="admin-card__title">All destinations</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Coordinates</th>
              <th>Featured</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((dest) => (
              <tr key={dest.id}>
                <td style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>
                  {dest.name}
                </td>
                <td>
                  <span
                    className="admin-badge admin-badge--easy"
                    style={{ textTransform: "capitalize" }}
                  >
                    {dest.category}
                  </span>
                </td>
                <td
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 11,
                    opacity: 0.5,
                  }}
                >
                  {dest.lat.toFixed(3)}, {dest.lng.toFixed(3)}
                </td>
                <td
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    opacity: 0.5,
                  }}
                >
                  {dest.featured ? "Yes" : "—"}
                </td>
                <td>
                  <button
                    className="admin-btn admin-btn--secondary admin-btn--sm"
                    onClick={() => setEditing({ ...dest })}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
