import { useState, useEffect } from "react";
import { tours } from "@/data/tours";
import { destinations } from "@/data/destinations";

interface HealthItem {
  id: string;
  category: "image" | "todo" | "info";
  severity: "warning" | "ok" | "info";
  message: string;
  detail?: string;
  file?: string;
}

// Check all tour image slots exist by attempting to load them
async function checkImages(): Promise<HealthItem[]> {
  const results: HealthItem[] = [];

  for (const tour of tours) {
    const src = `/media/tours/${tour.imageSlot}`;
    try {
      const res = await fetch(src, { method: "HEAD" });
      if (!res.ok) {
        results.push({
          id: `img-tour-${tour.id}`,
          category: "image",
          severity: "warning",
          message: `Missing image: ${tour.imageSlot}`,
          detail: `Tour: ${tour.name}`,
          file: `src/data/tours.ts`,
        });
      }
    } catch {
      results.push({
        id: `img-tour-${tour.id}`,
        category: "image",
        severity: "warning",
        message: `Could not check: ${tour.imageSlot}`,
        detail: `Tour: ${tour.name}`,
      });
    }
  }

  return results;
}

function buildHealthReport(): HealthItem[] {
  const items: HealthItem[] = [];

  // Tour stats
  items.push({
    id: "info-tours",
    category: "info",
    severity: "ok",
    message: `${tours.length} tours in catalogue`,
    detail: `${tours.filter((t) => t.difficulty === "easy").length} easy · ${tours.filter((t) => t.difficulty === "moderate").length} moderate · ${tours.filter((t) => t.difficulty === "demanding").length} demanding`,
  });

  // Destinations
  items.push({
    id: "info-dest",
    category: "info",
    severity: "ok",
    message: `${destinations.length} destinations on map`,
    detail: `${destinations.filter((d) => d.featured).length} featured`,
  });

  // Tours missing taglines
  const noTagline = tours.filter((t) => !t.tagline.trim());
  if (noTagline.length > 0) {
    items.push({
      id: "warn-tagline",
      category: "todo",
      severity: "warning",
      message: `${noTagline.length} tour${noTagline.length > 1 ? "s" : ""} missing taglines`,
      detail: noTagline.map((t) => t.name).join(", "),
      file: "src/data/tours.ts",
    });
  }

  // Tours with fewer than 3 highlights
  const fewHighlights = tours.filter((t) => t.highlights.length < 3);
  if (fewHighlights.length > 0) {
    items.push({
      id: "warn-highlights",
      category: "todo",
      severity: "warning",
      message: `${fewHighlights.length} tour${fewHighlights.length > 1 ? "s" : ""} with fewer than 3 highlights`,
      detail: fewHighlights.map((t) => t.name).join(", "),
      file: "src/data/tours.ts",
    });
  }

  // Tours missing bestSeason
  const noSeason = tours.filter((t) => !t.bestSeason);
  if (noSeason.length > 0) {
    items.push({
      id: "warn-season",
      category: "todo",
      severity: "warning",
      message: `${noSeason.length} tour${noSeason.length > 1 ? "s" : ""} missing best season`,
      detail: noSeason.map((t) => t.name).join(", "),
      file: "src/data/tours.ts",
    });
  }

  // Destinations missing images
  const destNoImage = destinations.filter((d) => !d.image);
  if (destNoImage.length > 0) {
    items.push({
      id: "warn-dest-img",
      category: "image",
      severity: "warning",
      message: `${destNoImage.length} destination${destNoImage.length > 1 ? "s" : ""} without images`,
      detail: destNoImage.map((d) => d.name).join(", "),
      file: "src/data/destinations.ts",
    });
  }

  // Destinations missing descriptions
  const destNoDesc = destinations.filter((d) => !d.description?.trim());
  if (destNoDesc.length > 0) {
    items.push({
      id: "warn-dest-desc",
      category: "todo",
      severity: "warning",
      message: `${destNoDesc.length} destination${destNoDesc.length > 1 ? "s" : ""} missing descriptions`,
      detail: destNoDesc.map((d) => d.name).join(", "),
      file: "src/data/destinations.ts",
    });
  }

  // TODO-REVIEW reminder
  items.push({
    id: "info-todo-review",
    category: "todo",
    severity: "info",
    message: "Amharic/Ge'ez strings need native-speaker verification",
    detail:
      'All strings marked TODO-REVIEW in the source files. Search for "TODO-REVIEW" across src/ to find them.',
    file: "src/**/*.tsx",
  });

  // All pages list
  const PAGES = [
    { path: "/", label: "Home" },
    { path: "/tours", label: "Tours" },
    { path: "/destinations", label: "Destinations" },
    { path: "/when-to-go", label: "When to Go" },
    { path: "/plan", label: "Plan Trip" },
    { path: "/about", label: "About" },
    { path: "/culture", label: "Culture" },
    { path: "/gallery", label: "Gallery" },
    { path: "/traveler-info", label: "Before You Fly" },
  ];

  for (const page of PAGES) {
    items.push({
      id: `page-${page.path}`,
      category: "info",
      severity: "ok",
      message: page.label,
      detail: page.path,
    });
  }

  return items;
}

const CATEGORY_LABELS = {
  image: "Images",
  todo: "Content gaps",
  info: "Site info",
};

const SEVERITY_COLORS = {
  warning: "var(--a-warning)",
  ok: "var(--a-success)",
  info: "var(--a-sidebar)",
};

export function SiteHealthPage() {
  const [items, setItems] = useState<HealthItem[]>([]);
  const [imageItems, setImageItems] = useState<HealthItem[]>([]);
  const [checkingImages, setCheckingImages] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    "all" | "image" | "todo" | "info"
  >("all");

  useEffect(() => {
    setItems(buildHealthReport());
  }, []);

  const runImageCheck = async () => {
    setCheckingImages(true);
    const results = await checkImages();
    setImageItems(results);
    setCheckingImages(false);
  };

  const allItems = [...items, ...imageItems];
  const filtered =
    activeCategory === "all"
      ? allItems
      : allItems.filter((i) => i.category === activeCategory);

  const warningCount = allItems.filter((i) => i.severity === "warning").length;

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">
            Site health
            {warningCount > 0 && (
              <span
                style={{
                  display: "inline-block",
                  marginLeft: 10,
                  backgroundColor: "var(--a-warning)",
                  color: "var(--a-text)",
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "20px",
                  verticalAlign: "middle",
                }}
              >
                {warningCount} {warningCount === 1 ? "issue" : "issues"}
              </span>
            )}
          </div>
          <div className="admin-section-header__sub">
            Content gaps, missing assets, and pending verification items.
          </div>
        </div>
        <div className="admin-section-header__actions">
          <button
            className="admin-btn admin-btn--secondary"
            onClick={runImageCheck}
            disabled={checkingImages}
          >
            {checkingImages ? "Checking images…" : "Check images"}
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="admin-filter-bar">
        <div className="admin-filter-bar__chips">
          {(["all", "image", "todo", "info"] as const).map((cat) => {
            const count =
              cat === "all"
                ? allItems.length
                : allItems.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`admin-filter-chip${activeCategory === cat ? " admin-filter-chip--active" : ""}`}
              >
                {cat === "all" ? "All" : CATEGORY_LABELS[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty__text">No items in this category.</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filtered.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "12px 20px",
                  borderBottom:
                    i < filtered.length - 1
                      ? "1px solid var(--a-border)"
                      : "none",
                  alignItems: "flex-start",
                }}
              >
                {/* Severity dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: SEVERITY_COLORS[item.severity],
                    flexShrink: 0,
                    marginTop: 5,
                  }}
                  aria-hidden="true"
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 13,
                      color: "var(--a-text)",
                      lineHeight: 1.4,
                    }}
                  >
                    {item.message}
                  </div>
                  {item.detail && (
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                        color: "var(--a-text)",
                        opacity: 0.5,
                        marginTop: 3,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.detail}
                    </div>
                  )}
                  {item.file && (
                    <div
                      style={
                        {
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                          color: "var(--a-accent)",
                          opacity: 0.7,
                          marginTop: 2,
                          fontStyle: "italic",
                        } as React.CSSProperties
                      }
                    >
                      {item.file}
                    </div>
                  )}
                </div>

                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: SEVERITY_COLORS[item.severity],
                    flexShrink: 0,
                    paddingTop: 3,
                  }}
                >
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
