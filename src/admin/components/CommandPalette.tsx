import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { tours } from "@/data/tours";
import { getEnquiries } from "../lib/enquiries";

interface CmdItem {
  label: string;
  hint?: string;
  group: string;
  icon: string;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const PAGE_LINKS: { label: string; hint: string; path: string; icon: string }[] = [
  { label: "Dashboard", hint: "Overview", path: "/admin", icon: "M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z" },
  { label: "Enquiries", hint: "Inbox", path: "/admin/enquiries", icon: "M1 4h14v9H1V4zm0 0l7 5.5L15 4" },
  { label: "Tours", hint: "Catalogue", path: "/admin/tours", icon: "M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8z" },
  { label: "Featured Tours", hint: "Home rail", path: "/admin/featured", icon: "M8 2l1.5 3 3.5.5-2.5 2.4.6 3.6L8 9.8l-3.1 1.7.6-3.6L3 5.5l3.5-.5z" },
  { label: "Destinations", hint: "Map pins", path: "/admin/destinations", icon: "M8 1a4 4 0 010 8c-2.2 0-6-3.4-6-4.5S5.8 1 8 1z" },
  { label: "Gallery", hint: "Photos", path: "/admin/gallery", icon: "M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z" },
  { label: "Page Content", hint: "Hero, footer", path: "/admin/content", icon: "M1 3h14M1 7h9M1 11h11" },
  { label: "Reviews", hint: "Testimonials", path: "/admin/reviews", icon: "M8 1l2 4h4l-3 3 1 4-4-2.5L4 12l1-4-3-3h4z" },
  { label: "Contact", hint: "Phone, social", path: "/admin/contact", icon: "M1 4h14v9H1V4zm6 4.5h4" },
  { label: "Analytics", hint: "Traffic data", path: "/admin/analytics", icon: "M1 12l4-5 3 2.5 3-6 4 3.5" },
  { label: "Site Health", hint: "Checks", path: "/admin/health", icon: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 3v4l2.5 2.5" },
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Build items
  const items: CmdItem[] = [];

  PAGE_LINKS.forEach((p) =>
    items.push({
      label: p.label,
      hint: p.hint,
      group: "Pages",
      icon: p.icon,
      action: () => {
        navigate(p.path);
        onClose();
      },
    }),
  );

  // Tours
  tours.slice(0, 10).forEach((t) =>
    items.push({
      label: t.name.split("—")[0].trim(),
      hint: `Tour · ${t.duration}d`,
      group: "Tours",
      icon: "M8 1l1.8 3.6L14 5.4l-3 2.9.7 4.1L8 10.4l-3.7 2 .7-4.1-3-2.9 4.2-.8z",
      action: () => {
        navigate(`/admin/tours/${t.id}`);
        onClose();
      },
    }),
  );

  // Enquiries
  getEnquiries()
    .slice(0, 5)
    .forEach((e) =>
      items.push({
        label: e.name,
        hint: `Enquiry · ${e.selectedTourNames[0] ?? "No tour"}`,
        group: "Enquiries",
        icon: "M1 4h14v9H1V4zm0 0l7 5.5L15 4",
        action: () => {
          navigate("/admin/enquiries");
          onClose();
        },
      }),
    );

  const filtered = query
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  // Group filtered items
  const groups: { label: string; items: CmdItem[] }[] = [];
  filtered.forEach((item) => {
    let g = groups.find((g) => g.label === item.group);
    if (!g) {
      g = { label: item.group, items: [] };
      groups.push(g);
    }
    g.items.push(item);
  });

  // Keyboard navigation
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((p) => Math.min(p + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((p) => Math.max(p - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[activeIdx]?.action();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!open) return null;

  let runningIdx = -1;

  return (
    <div className="admin-cmd-palette" onClick={onClose}>
      <div
        className="admin-cmd-palette__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          className="admin-cmd-palette__input"
          placeholder="Search pages, tours, enquiries…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(0);
          }}
          onKeyDown={onKey}
          aria-label="Command palette search"
        />
        <div className="admin-cmd-palette__results">
          {filtered.length === 0 ? (
            <div className="admin-cmd-palette__empty">
              No results for "{query}"
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.label}>
                <div className="admin-cmd-palette__group-label">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  runningIdx++;
                  const idx = runningIdx;
                  return (
                    <button
                      key={`${group.label}-${item.label}-${idx}`}
                      className={`admin-cmd-palette__item${idx === activeIdx ? " admin-cmd-palette__item--active" : ""}`}
                      onClick={item.action}
                      onMouseEnter={() => setActiveIdx(idx)}
                    >
                      <svg
                        className="admin-cmd-palette__item-icon"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d={item.icon} />
                      </svg>
                      <span className="admin-cmd-palette__item-label">
                        {item.label}
                      </span>
                      <span className="admin-cmd-palette__item-hint">
                        {item.hint}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
