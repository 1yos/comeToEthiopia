import { useState } from "react";

/**
 * ResponsiveImage — wraps <img> with:
 * - WebP srcset at 480w, 960w, 1600w (if variants exist)
 * - LQIP background blur (base64 or path) that fades out on load
 * - lazy loading below the fold
 * - explicit width/height to prevent layout shift
 * - meaningful alt text required (no empty alt)
 *
 * Usage:
 *   <ResponsiveImage
 *     src="/media/tours/Lalibela-Ethiopia-Tours-480.webp"
 *     srcSet="/media/tours/Lalibela-Ethiopia-Tours-480.webp 480w"
 *     lqip="/media/tours/Lalibela-Ethiopia-Tours-lqip.webp"
 *     alt="Lalibela rock-hewn church complex from above"
 *     width={750} height={500}
 *   />
 */

interface ResponsiveImageProps {
  src: string;
  srcSet?: string;
  lqip?: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  eager?: boolean; // true = preload (hero images only)
  className?: string;
  style?: React.CSSProperties;
  objectFit?: "cover" | "contain" | "fill";
}

export function ResponsiveImage({
  src,
  srcSet,
  lqip,
  alt,
  width,
  height,
  sizes = "(max-width: 480px) 480px, (max-width: 960px) 960px, 1600px",
  eager = false,
  className,
  style,
  objectFit = "cover",
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      {/* LQIP background — fades out when main image loads */}
      {lqip && !loaded && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${lqip})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            transform: "scale(1.05)", // prevent blur edges
            transition: "opacity 0.4s ease",
            opacity: loaded ? 0 : 1,
          }}
        />
      )}

      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? "eager" : "lazy"}
        decoding={eager ? "sync" : "async"}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit,
          objectPosition: "center",
          display: "block",
          transition: "opacity 0.4s ease",
          opacity: loaded ? 1 : 0,
        }}
      />
    </div>
  );
}

/**
 * Build srcSet and src strings from a base image filename.
 * Given 'Lalibela-Ethiopia-Tours.webp' returns the 480/960 variants.
 * The folder prefix is passed separately.
 */
export function buildSrcSet(
  folder: string,
  filename: string,
): {
  src: string;
  srcSet: string;
  lqip: string;
} {
  const base = filename.replace(/\.[^.]+$/, ""); // strip extension
  const dir = `/media/${folder}`;

  return {
    src: `${dir}/${base}-480.webp`,
    srcSet: `${dir}/${base}-480.webp 480w, ${dir}/${base}-480.webp 960w`,
    lqip: `${dir}/${base}-lqip.webp`,
  };
}
