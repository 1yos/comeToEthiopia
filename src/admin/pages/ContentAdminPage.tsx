import { useState } from "react";
import { siteContent } from "@/data/content";
import { logActivity } from "../lib/activityLog";

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

const VERSION_KEY = "cte-content-versions";
const MAX_VERSIONS = 10;

interface ContentVersion {
  id: string;
  timestamp: string;
  heroTagline: string;
  heroSubline: string;
  footerTagline: string;
  footerMadeIn: string;
  aboutDesc: string;
}

function loadVersions(): ContentVersion[] {
  try {
    return JSON.parse(localStorage.getItem(VERSION_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveVersions(versions: ContentVersion[]): void {
  try {
    localStorage.setItem(VERSION_KEY, JSON.stringify(versions));
  } catch {
    /* ignore */
  }
}

export function ContentAdminPage() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Hero
  const [heroTagline, setHeroTagline] = useState(
    siteContent.hero?.eyebrow ?? "",
  );
  const [heroSubline, setHeroSubline] = useState(
    siteContent.hero?.headlineSubline ?? "",
  );

  // Footer
  const [footerTagline, setFooterTagline] = useState(
    siteContent.footer?.tagline ?? "",
  );
  const [footerMadeIn, setFooterMadeIn] = useState(
    siteContent.footer?.madeIn ?? "",
  );

  // About
  const [aboutDesc, setAboutDesc] = useState(
    "Come to Ethiopia Tours is owned and operated by a single professional Ethiopian guide based in Addis Ababa. No resellers. No middlemen.",
  );
  const [versions, setVersions] = useState<ContentVersion[]>(loadVersions);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const createSnapshot = (): ContentVersion => ({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    heroTagline,
    heroSubline,
    footerTagline,
    footerMadeIn,
    aboutDesc,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Save snapshot to version history
    const snapshot = createSnapshot();
    const updated = [snapshot, ...versions].slice(0, MAX_VERSIONS);
    setVersions(updated);
    saveVersions(updated);

    await new Promise((r) => setTimeout(r, 400));
    logActivity(
      "Content saved",
      "Updated hero, footer, and About page text",
      "/admin/content",
    );
    showToast("Content saved. Version stored in history.", "success");
  };

  const restoreVersion = (version: ContentVersion) => {
    setHeroTagline(version.heroTagline);
    setHeroSubline(version.heroSubline);
    setFooterTagline(version.footerTagline);
    setFooterMadeIn(version.footerMadeIn);
    setAboutDesc(version.aboutDesc);
    showToast("Version restored. Save to persist changes.", "success");
  };

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">Page content</div>
          <div className="admin-section-header__sub">
            Hero, footer, and About page text.
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Hero */}
          <div className="admin-card">
            <div className="admin-card__title">Hero section</div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="hero-tagline">
                Eyebrow label
              </label>
              <input
                id="hero-tagline"
                className="admin-input"
                value={heroTagline}
                onChange={(e) => setHeroTagline(e.target.value)}
                placeholder="e.g. Come to Ethiopia Tours"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="hero-subline">
                Subline (below headline)
              </label>
              <textarea
                id="hero-subline"
                className="admin-textarea"
                value={heroSubline}
                onChange={(e) => setHeroSubline(e.target.value)}
                rows={2}
                placeholder="The sentence below the year headline."
              />
              <span className="admin-input-hint">
                Keep under 20 words. No banned phrases.
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="admin-card">
            <div className="admin-card__title">Footer</div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="footer-tagline">
                Footer tagline
              </label>
              <input
                id="footer-tagline"
                className="admin-input"
                value={footerTagline}
                onChange={(e) => setFooterTagline(e.target.value)}
                placeholder="e.g. Ethiopia's oldest profession is hospitality."
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="footer-madein">
                Made in / credits line
              </label>
              <input
                id="footer-madein"
                className="admin-input"
                value={footerMadeIn}
                onChange={(e) => setFooterMadeIn(e.target.value)}
                placeholder="e.g. Made in Addis Ababa, Ethiopia"
              />
            </div>
          </div>

          {/* About */}
          <div className="admin-card">
            <div className="admin-card__title">
              About page — company description
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="about-desc">
                SEO description / meta description
              </label>
              <textarea
                id="about-desc"
                className="admin-textarea"
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
                rows={3}
              />
              <span className="admin-input-hint">
                Shown in search results. Keep under 160 characters.{" "}
                {aboutDesc.length}/160
              </span>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              Save content
            </button>
          </div>
        </div>
      </form>

      {/* Version history */}
      {versions.length > 0 && (
        <div className="admin-card" style={{ marginTop: 16 }}>
          <div className="admin-card__title">Version history</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {versions.map((v) => (
              <div key={v.id} className="admin-version-item">
                <div className="admin-version-item__info">
                  <div className="admin-version-item__time">
                    {new Date(v.timestamp).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="admin-version-item__detail">
                    Hero: "{v.heroTagline.slice(0, 40)}
                    {v.heroTagline.length > 40 ? "…" : ""}"
                  </div>
                </div>
                <button
                  className="admin-btn admin-btn--secondary admin-btn--sm"
                  onClick={() => restoreVersion(v)}
                >
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
