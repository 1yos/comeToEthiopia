import { useState, useRef } from "react";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  region: string;
  category: "landscape" | "culture";
}

// Seed from the existing gallery data
const INITIAL: GalleryItem[] = [
  {
    id: "1",
    src: "/media/regions/Simien-Mountains-Ethiopia-Tours-and-Travel-Packages-480.webp",
    alt: "Simien Mountains escarpment at golden hour, northern Ethiopia",
    caption: "Simien Mountains",
    region: "4,543m · Northern Highlands",
    category: "landscape",
  },
  {
    id: "2",
    src: "/media/tours/3-Day-Expedition-to-Dallol-Salt-Flats-Danakil-Depression-Erta-Ale-Volcano-480.webp",
    alt: "Dallol hydrothermal field, acid pools and sulphur formations, Danakil Depression",
    caption: "Dallol",
    region: "−125m · Danakil Depression",
    category: "landscape",
  },
  {
    id: "3",
    src: "/media/regions/Erta-Ale-Volcano-Ethiopia-Tours-and-Holiday-Packages-480.webp",
    alt: "Erta Ale lava lake at night, Afar region, Ethiopia",
    caption: "Erta Ale lava lake",
    region: "Afar · Active since 1906",
    category: "landscape",
  },
  {
    id: "4",
    src: "/media/regions/Gonder-Fasiledes-Mountains-Ethiopia-Tour-Travel-Package-480.webp",
    alt: "Fasiledes castle walls at golden hour, Gondar, northern Ethiopia",
    caption: "Gondar — Fasiledes Castle",
    region: "17th century · Northern Ethiopia",
    category: "landscape",
  },
  {
    id: "5",
    src: "/media/tours/Lalibela-Ethiopia-Tours-480.webp",
    alt: "Lalibela rock-hewn churches, Amhara region, northern Ethiopia",
    caption: "Lalibela",
    region: "12th century · 2,630m",
    category: "landscape",
  },
  {
    id: "6",
    src: "/media/regions/Omo-Valley-Tribe-Ethiopia-Tour-Travel-Package-480.webp",
    alt: "Omo Valley tribeswomen in traditional dress, southern Ethiopia",
    caption: "Omo Valley",
    region: "Southern Ethiopia",
    category: "culture",
  },
  {
    id: "7",
    src: "/media/tours/Ethiopian-Wolf-Bale-Mountains-Sanetti-Plateau-480.jpg",
    alt: "Ethiopian wolf on Sanetti Plateau, Bale Mountains National Park",
    caption: "Ethiopian wolf",
    region: "Sanetti Plateau · ~500 remaining",
    category: "landscape",
  },
  {
    id: "8",
    src: "/media/tours/Harar-Walled-City-Ethiopia-Tours-480.jpg",
    alt: "Harar Gate, UNESCO walled city, eastern Ethiopia",
    caption: "Harar Gate",
    region: "16th century walls · 82 mosques",
    category: "culture",
  },
  {
    id: "9",
    src: "/media/tours/Konso-Stone-Terraces-Ethiopia-Tours-480.jpg",
    alt: "Konso stone terraces and fortified village, UNESCO World Heritage, southern Ethiopia",
    caption: "Konso terraces",
    region: "UNESCO · 400+ year tradition",
    category: "culture",
  },
  {
    id: "10",
    src: "/media/tours/Addis-Ababa-Coffee-Ceremony-Ethiopia-Tours-480.jpg",
    alt: "Ethiopian coffee ceremony, clay pot and cups, Addis Ababa",
    caption: "Coffee ceremony",
    region: "Three rounds · Abol, Tona, Baraka",
    category: "culture",
  },
];

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

export function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    category: "landscape",
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this photo from the gallery?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    showToast("Photo removed.", "success");
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    setItems((prev) => prev.map((i) => (i.id === editing.id ? editing : i)));
    setEditing(null);
    showToast("Photo updated.", "success");
  };

  const handleAdd = () => {
    if (
      !newItem.src?.trim() ||
      !newItem.caption?.trim() ||
      !newItem.alt?.trim()
    ) {
      showToast("Src, caption, and alt text are required.", "error");
      return;
    }
    const item: GalleryItem = {
      id: Date.now().toString(),
      src: newItem.src!,
      alt: newItem.alt!,
      caption: newItem.caption!,
      region: newItem.region ?? "",
      category: newItem.category ?? "landscape",
    };
    setItems((prev) => [item, ...prev]);
    setNewItem({ category: "landscape" });
    setAdding(false);
    showToast("Photo added to gallery.", "success");
  };

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">Gallery</div>
          <div className="admin-section-header__sub">
            {items.length} photos.
          </div>
        </div>
        <div className="admin-section-header__actions">
          <button
            className="admin-btn admin-btn--primary"
            onClick={() => setAdding(true)}
          >
            + Add photo
          </button>
        </div>
      </div>

      {/* Add photo form */}
      {adding && (
        <div className="admin-card" style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div className="admin-card__title" style={{ marginBottom: 0 }}>
              Add new photo
            </div>
            <button
              className="admin-modal__close"
              onClick={() => setAdding(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <div className="admin-field">
              <label className="admin-label">Image path *</label>
              <input
                className="admin-input"
                value={newItem.src ?? ""}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, src: e.target.value }))
                }
                placeholder="Enter path e.g. your-image-filename.webp"
              />
              <span className="admin-input-hint">
                Path relative to public/ directory.
              </span>
            </div>
            <div className="admin-field">
              <label className="admin-label">Caption *</label>
              <input
                className="admin-input"
                value={newItem.caption ?? ""}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, caption: e.target.value }))
                }
                placeholder="e.g. Simien Mountains"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Alt text *</label>
              <input
                className="admin-input"
                value={newItem.alt ?? ""}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, alt: e.target.value }))
                }
                placeholder="Descriptive text for screen readers"
              />
            </div>
            <div className="admin-field">
              <label className="admin-label">Region / sub-caption</label>
              <input
                className="admin-input"
                value={newItem.region ?? ""}
                onChange={(e) =>
                  setNewItem((p) => ({ ...p, region: e.target.value }))
                }
                placeholder="e.g. 4,543m · Northern Highlands"
              />
            </div>
            <div className="admin-field" style={{ marginBottom: 0 }}>
              <label className="admin-label">Category</label>
              <select
                className="admin-select"
                value={newItem.category ?? "landscape"}
                onChange={(e) =>
                  setNewItem((p) => ({
                    ...p,
                    category: e.target.value as GalleryItem["category"],
                  }))
                }
              >
                <option value="landscape">Landscape</option>
                <option value="culture">People & Culture</option>
              </select>
            </div>
          </div>

          {newItem.src && (
            <img
              src={newItem.src}
              alt={newItem.alt ?? "Preview"}
              style={{
                width: 120,
                height: 80,
                objectFit: "cover",
                marginTop: 12,
                display: "block",
                backgroundColor: "var(--indigo)",
              }}
            />
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button
              className="admin-btn admin-btn--primary"
              onClick={handleAdd}
            >
              Add to gallery
            </button>
            <button
              className="admin-btn admin-btn--secondary"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="admin-modal-backdrop" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <span className="admin-modal__title">Edit photo</span>
              <button
                className="admin-modal__close"
                onClick={() => setEditing(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="admin-modal__body">
              <img
                src={editing.src}
                alt={editing.alt}
                style={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  marginBottom: 16,
                  backgroundColor: "var(--indigo)",
                }}
              />
              <div className="admin-field">
                <label className="admin-label">Caption *</label>
                <input
                  className="admin-input"
                  value={editing.caption}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, caption: e.target.value } : p,
                    )
                  }
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Alt text *</label>
                <input
                  className="admin-input"
                  value={editing.alt}
                  onChange={(e) =>
                    setEditing((p) => (p ? { ...p, alt: e.target.value } : p))
                  }
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Region</label>
                <input
                  className="admin-input"
                  value={editing.region}
                  onChange={(e) =>
                    setEditing((p) =>
                      p ? { ...p, region: e.target.value } : p,
                    )
                  }
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">Category</label>
                <select
                  className="admin-select"
                  value={editing.category}
                  onChange={(e) =>
                    setEditing((p) =>
                      p
                        ? {
                            ...p,
                            category: e.target.value as GalleryItem["category"],
                          }
                        : p,
                    )
                  }
                >
                  <option value="landscape">Landscape</option>
                  <option value="culture">People & Culture</option>
                </select>
              </div>
            </div>
            <div className="admin-modal__footer">
              <button
                className="admin-btn admin-btn--secondary"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn--primary"
                onClick={handleSaveEdit}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 8,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              position: "relative",
              backgroundColor: "var(--indigo)",
              overflow: "hidden",
            }}
          >
            <img
              src={item.src}
              alt={item.alt}
              style={{
                display: "block",
                width: "100%",
                aspectRatio: "4/3",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(18,17,16,0.85) 0%, transparent 55%)",
                opacity: 0,
                transition: "opacity 0.2s",
              }}
              className="gallery-item-overlay"
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "8px 10px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: "var(--paper)",
                  lineHeight: 1.2,
                }}
              >
                {item.caption}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 9,
                  color: "var(--ochre)",
                  opacity: 0.8,
                  marginTop: 2,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {item.category}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                display: "flex",
                gap: 4,
              }}
            >
              <button
                className="admin-btn admin-btn--secondary admin-btn--sm"
                onClick={() => setEditing(item)}
                style={{
                  backgroundColor: "rgba(241,234,217,0.9)",
                  border: "none",
                  padding: "4px 8px",
                  fontSize: 10,
                }}
                aria-label={`Edit ${item.caption}`}
              >
                Edit
              </button>
              <button
                className="admin-btn admin-btn--danger admin-btn--sm"
                onClick={() => handleDelete(item.id)}
                style={{
                  backgroundColor: "rgba(192,57,43,0.9)",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  fontSize: 10,
                }}
                aria-label={`Delete ${item.caption}`}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Hidden file input for future upload support */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/webp,image/jpeg,image/jpg,image/png"
        style={{ display: "none" }}
        aria-hidden="true"
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
