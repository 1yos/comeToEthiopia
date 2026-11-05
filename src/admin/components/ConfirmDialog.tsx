import { useEffect, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

/** Accessible confirmation modal with focus trapping and Escape to close. */
export function ConfirmDialog({
  open,
  title,
  message,
  itemName,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Focus the confirm button on open + trap Escape
  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const iconPath =
    variant === "danger"
      ? "M5 6l6 6m0-6l-6 6"
      : "M8 4v4M8 12v.01";

  return (
    <div
      className="admin-modal-backdrop"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="admin-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__body">
          <div className={`admin-confirm__icon admin-confirm__icon--${variant}`}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d={iconPath} />
            </svg>
          </div>
          <h3
            id="confirm-title"
            className="admin-modal__title"
            style={{ fontSize: 16, marginBottom: 8 }}
          >
            {title}
          </h3>
          <p style={{ fontSize: "var(--a-text-sm)", color: "var(--a-muted)", lineHeight: 1.5 }}>
            {message}
          </p>
          {itemName && <div className="admin-confirm__item">{itemName}</div>}
        </div>
        <div className="admin-modal__footer">
          <button className="admin-btn admin-btn--secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            className={`admin-btn admin-btn--${variant === "danger" ? "danger" : "accent"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
