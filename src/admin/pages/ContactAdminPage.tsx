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

export function ContactAdminPage() {
  const { planTrip, footer } = siteContent;

  const [whatsapp, setWhatsapp] = useState(planTrip.form.whatsappNumber);
  const [email, setEmail] = useState(planTrip.form.emailAddress);
  const [instagram, setInstagram] = useState(
    footer.links.find((l) => l.label === "Instagram")?.href ?? "",
  );
  const [tiktok, setTiktok] = useState(
    footer.links.find((l) => l.label === "TikTok")?.href ?? "",
  );
  const [youtube, setYoutube] = useState(
    footer.links.find((l) => l.label === "YouTube")?.href ?? "",
  );
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim() || !email.trim()) {
      showToast("WhatsApp number and email are required.", "error");
      return;
    }
    await new Promise((r) => setTimeout(r, 400));
    showToast("Contact details saved (write to JSON to persist).", "success");
  };

  return (
    <div>
      <div className="admin-section-header">
        <div className="admin-section-header__left">
          <div className="admin-section-header__title">Contact details</div>
          <div className="admin-section-header__sub">
            Phone, email, and social media links used across the site.
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Direct contact */}
          <div className="admin-card">
            <div className="admin-card__title">Direct contact</div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="contact-whatsapp">
                WhatsApp / phone number *
              </label>
              <input
                id="contact-whatsapp"
                className="admin-input"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+251903182009"
              />
              <span className="admin-input-hint">
                Include country code. Used in WhatsApp links across the site.
              </span>
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="contact-email">
                Email address *
              </label>
              <input
                id="contact-email"
                className="admin-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cometoethiopiatours@gmail.com"
              />
            </div>
          </div>

          {/* Social links */}
          <div className="admin-card">
            <div className="admin-card__title">Social media links</div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="contact-instagram">
                Instagram URL
              </label>
              <input
                id="contact-instagram"
                className="admin-input"
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://www.instagram.com/cometoethiopiatours/"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="contact-tiktok">
                TikTok URL
              </label>
              <input
                id="contact-tiktok"
                className="admin-input"
                type="url"
                value={tiktok}
                onChange={(e) => setTiktok(e.target.value)}
                placeholder="https://www.tiktok.com/@cometo.ethiopia.tours"
              />
            </div>

            <div className="admin-field">
              <label className="admin-label" htmlFor="contact-youtube">
                YouTube URL
              </label>
              <input
                id="contact-youtube"
                className="admin-input"
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://www.youtube.com/@CometoEthiopiatours"
              />
            </div>
          </div>

          {/* Preview */}
          <div className="admin-card">
            <div className="admin-card__title">
              Preview — how these appear on the site
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  label: "WhatsApp",
                  value: whatsapp,
                  href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
                },
                { label: "Email", value: email, href: `mailto:${email}` },
                { label: "Instagram", value: instagram, href: instagram },
                { label: "TikTok", value: tiktok, href: tiktok },
                { label: "YouTube", value: youtube, href: youtube },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <div
                    key={item.label}
                    style={{ display: "flex", gap: 12, alignItems: "baseline" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 9,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--a-accent)",
                        minWidth: 80,
                        flexShrink: 0,
                      }}
                    >
                      {item.label}
                    </span>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 13,
                        color: "var(--a-text)",
                        textDecoration: "none",
                        borderBottom: "1px solid var(--a-border-md)",
                        paddingBottom: 1,
                        wordBreak: "break-all",
                      }}
                    >
                      {item.value}
                    </a>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              Save contact details
            </button>
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
