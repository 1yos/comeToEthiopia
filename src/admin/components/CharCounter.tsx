interface CharCounterProps {
  value: string;
  max?: number;
  /** When to start warning (default: max * 0.8) */
  warnAt?: number;
}

/** Character counter for textareas, with warn/over states. */
export function CharCounter({ value, max, warnAt }: CharCounterProps) {
  if (!max) return null;
  const len = value.length;
  const warn = warnAt ?? Math.round(max * 0.8);
  const over = len > max;
  const warning = len > warn && !over;

  return (
    <span
      className={`admin-field__counter${warning ? " admin-field__counter--warn" : ""}${over ? " admin-field__counter--over" : ""}`}
    >
      {len}/{max}
    </span>
  );
}
