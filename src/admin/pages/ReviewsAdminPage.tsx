import { useState } from "react";

interface Review {
  id: string;
  author: string;
  location: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: "1",
    author: "Thomas Lindqvist",
    location: "Stockholm, Sweden",
    date: "3 weeks ago",
    rating: 5,
    text: "Did the 7-day northern circuit in January for Timkat. Our guide knew every priest by name in Lalibela and got us into the morning service at 5:40am before the tourist groups arrived. The Simien day was cold and worth every layer. Genuinely the best-organised trip I have taken.",
    avatar: "TL",
  },
  {
    id: "2",
    author: "Amina Osei",
    location: "Accra, Ghana",
    date: "a month ago",
    rating: 5,
    text: "We booked the Danakil 3-day expedition in February. The logistics in that region are complicated — armed escort, convoy timing, the Erta Ale trek at night. Everything ran on time. Woke up 10 metres from a boiling lava lake. Nothing else to say.",
    avatar: "AO",
  },
  {
    id: "3",
    author: "Kenji Watanabe",
    location: "Tokyo, Japan",
    date: "2 months ago",
    rating: 5,
    text: "Solo traveller, first time in Ethiopia. The guide adjusted the pace every day without me having to ask — more time at Debre Birhan Selassie, less at the souvenir shops. The coffee ceremony in a local home on day one set the tone for the whole trip. Highly recommend.",
    avatar: "KW",
  },
];

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`admin-toast admin-toast--${type}`} role="status">
      {message}
    </div>
  );
}

export function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const update = (id: string, field: keyof Review, value: string | number) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const r of reviews) {
      if (!r.author.trim() || !r.text.trim()) {
        showToast("Author name and review text are required for all reviews.", "error");
        return;
      }
    }
    await new Promise((res) => setTimeout(res, 400));
    showToast("Reviews saved (write to JSON to persist).", "success");
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reviews</h1>
          <p className="admin-page-sub">
            The three review cards shown on the home page.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} noValidate>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.map((review, idx) => (
            <div key={review.id} className="admin-card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "var(--indigo)",
                    color: "var(--paper)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                >
                  {review.avatar}
                </div>
                <div className="admin-card__title" style={{ marginBottom: 0 }}>
                  Review {idx + 1}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div className="admin-field" style={{ marginBottom: 0 }}>
                  <label className="admin-label" htmlFor={`review-author-${review.id}`}>
                    Author name *
                  </label>
                  <input
                    id={`review-author-${review.id}`}
                    className="admin-input"
                    value={review.author}
                    onChange={(e) => update(review.id, "author", e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: 0 }}>
                  <label className="admin-label" htmlFor={`review-location-${review.id}`}>
                    Location
                  </label>
                  <input
                    id={`review-location-${review.id}`}
                    className="admin-input"
                    value={review.location}
                    onChange={(e) => update(review.id, "location", e.target.value)}
                    placeholder="e.g. Stockholm, Sweden"
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: 0 }}>
                  <label className="admin-label" htmlFor={`review-date-${review.id}`}>
                    Date label
                  </label>
                  <input
                    id={`review-date-${review.id}`}
                    className="admin-input"
                    value={review.date}
                    onChange={(e) => update(review.id, "date", e.target.value)}
                    placeholder="e.g. 3 weeks ago"
                  />
                </div>
                <div className="admin-field" style={{ marginBottom: 0 }}>
                  <label className="admin-label" htmlFor={`review-avatar-${review.id}`}>
                    Avatar initials
                  </label>
                  <input
                    id={`review-avatar-${review.id}`}
                    className="admin-input"
                    value={review.avatar}
                    maxLength={2}
                    onChange={(e) => update(review.id, "avatar", e.target.value.toUpperCase())}
                    placeholder="e.g. TL"
                  />
                </div>
              </div>

              <div className="admin-field">
                <label className="admin-label" htmlFor={`review-text-${review.id}`}>
                  Review text *
                </label>
                <textarea
                  id={`review-text-${review.id}`}
                  className="admin-textarea"
                  value={review.text}
                  onChange={(e) => update(review.id, "text", e.target.value)}
                  rows={4}
                  placeholder="The review text. Specific, no banned phrases."
                />
                <span className="admin-input-hint">
                  {review.text.split(/\s+/).filter(Boolean).length} words.
                  Keep under 60 for best layout.
                </span>
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" className="admin-btn admin-btn--primary">
              Save reviews
            </button>
          </div>
        </div>
      </form>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
