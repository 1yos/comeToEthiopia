import { useState } from "react";
import { siteContent } from "@/data/content";

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

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 2: write to /public/cms/content.json
    await new Promise((r) => setTimeout(r, 400));
    showToast("Content saved (write to JSON to persist).", "success");
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Page content</h1>
          <p className="admin-page-sub">Hero, footer, and About page text.</p>
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

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
