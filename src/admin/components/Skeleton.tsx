interface SkeletonProps {
  variant?: "text" | "title" | "circle" | "card";
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  style,
}: SkeletonProps) {
  const className = `admin-skeleton admin-skeleton--${variant}`;
  return (
    <div
      className={className}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

/** A row of skeleton text lines for table loading states. */
export function SkeletonRows({ count = 5, cols = 4 }: { count?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="admin-skeleton-row">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j}>
              <Skeleton
                variant="text"
                width={j === 0 ? "60%" : "40%"}
                style={{ marginBottom: 0 }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** A grid of skeleton stat cards for dashboard loading. */
export function SkeletonStats({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </>
  );
}
