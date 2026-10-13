import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  destinations as defaultDestinations,
  CATEGORY_LABELS,
  DESTINATION_CATEGORIES,
  ETHIOPIA_BOUNDS,
  type Destination,
  type DestinationCategory,
} from "@/data/destinations";
import { siteContent } from "@/data/content";
import { tours } from "@/data/tours";
import { ResponsiveImage, buildSrcSet } from "@/components/ResponsiveImage";
import { DURATION, EASE_FM } from "@/lib/motion";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Interactive map of Ethiopia.
 *
 * Real terrain tiles (OpenTopoMap over OpenStreetMap/SRTM data), colour-tuned
 * to the site's paper palette, with one custom pin per destination.
 *
 * ── CMS READY ──────────────────────────────────────────────────────────────
 * The component takes `destinations` as a prop, defaulting to the static file
 * in /src/data/destinations.ts. To go live with a CMS, fetch the array and
 * pass it in — nothing else changes:
 *
 *   <Map destinations={await getDestinations()} />
 *
 * Pins are rebuilt whenever the array changes, so a CMS can add, edit and
 * remove destinations at runtime without a page reload.
 */

/** Category → CSS variable. Keeps colour decisions in one place. */
const CATEGORY_COLOR: Record<DestinationCategory, string> = {
  nature: "var(--highland)",
  history: "var(--indigo)",
  culture: "var(--ochre)",
  expedition: "var(--sulphur)",
};

/**
 * The base map. Terrain (OpenTopoMap) is the only source — there is no API
 * key behind it, so it is the one layer we can rely on. Leaflet renders the
 * attribution control for us.
 */
const TILE_SOURCES = {
  terrain: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, SRTM &middot; style &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    maxZoom: 16,
    subdomains: "abc",
  },
} as const;

/** Pin hit area. Larger than the 30px dot so touch targets meet 44px. */
const PIN_HIT = 44;

export interface MapProps {
  /** CMS hook: replace with fetched data. Defaults to the static file. */
  destinations?: Destination[];
  /** Which pin is selected, controllable from outside. */
  activeId?: string | null;
  /** Fired when a pin or list row is chosen. */
  onSelect?: (destination: Destination | null) => void;
}


export function Map({
  destinations = defaultDestinations,
  activeId: controlledActiveId,
  onSelect,
}: MapProps) {
  const mapHostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const isMobile = useIsMobile();
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const sizeObserverRef = useRef<ResizeObserver | null>(null);

  const [internalActiveId, setInternalActiveId] = useState<string | null>(null);
  const activeId = controlledActiveId ?? internalActiveId;
  const [activeCategory, setActiveCategory] = useState<
    DestinationCategory | "all"
  >("all");
  const [tilesLoading, setTilesLoading] = useState(true);
  const [tilesFailed, setTilesFailed] = useState(false);

  const { map: mapContent } = siteContent;

  const visible = useMemo(
    () =>
      activeCategory === "all"
        ? destinations
        : destinations.filter((d) => d.category === activeCategory),
    [destinations, activeCategory],
  );

  const activeDestination =
    destinations.find((d) => d.id === activeId) ?? null;

  /**
   * Bounding box of whatever the sidebar is currently listing. Recomputed on
   * every filter change and read once for the opening animation.
   */
  const fitBounds = useMemo<L.LatLngBoundsExpression>(() => {
    if (visible.length === 0) {
      return [
        [ETHIOPIA_BOUNDS.south, ETHIOPIA_BOUNDS.west],
        [ETHIOPIA_BOUNDS.north, ETHIOPIA_BOUNDS.east],
      ];
    }

    const lats = visible.map((d) => d.lat);
    const lngs = visible.map((d) => d.lng);
    const pad = 0.18; // breathing room so pins clear the map's inner edge
    const south = Math.min(...lats);
    const north = Math.max(...lats);
    const west = Math.min(...lngs);
    const east = Math.max(...lngs);
    const latPad = Math.max((north - south) * pad, 0.6);
    const lngPad = Math.max((east - west) * pad, 0.6);

    return [
      [south - latPad, west - lngPad],
      [north + latPad, east + lngPad],
    ];
  }, [visible]);

  // Read inside the one-shot opening animation without dep churn.
  const fitBoundsRef = useRef(fitBounds);
  fitBoundsRef.current = fitBounds;

  const select = (destination: Destination | null) => {
    setInternalActiveId(destination?.id ?? null);
    onSelect?.(destination);
  };

  // Markers and key handlers are created once, so they read the latest
  // callback through a ref instead of capturing a stale `onSelect`.
  const selectRef = useRef(select);
  selectRef.current = select;

  // ── Map instance: created once, survives re-renders ──────────────────────
  useEffect(() => {
    const host = mapHostRef.current;
    if (!host || mapRef.current) return;

    const map = L.map(host, {
      center: [9.145, 40.4897],
      zoom: 6,
      minZoom: 5,
      maxZoom: 12,
      zoomControl: false, // added explicitly below, positioned top-right
      attributionControl: true, // OSM/OpenTopoMap licences require it
      // Page scroll stays page scroll until the visitor opts in by clicking.
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    // Keep Leaflet's own credit, drop the default "Leaflet | " duplication
    map.attributionControl.setPrefix(
      '<a href="https://leafletjs.com" title="Leaflet">Leaflet</a>',
    );

    // Scroll-wheel zoom is an opt-in: the page must keep scrolling while the
    // visitor is just reading past the map. On click (or keyboard focus) the
    // map takes the wheel, which also means Lenis has to stop handling it —
    // Lenis calls preventDefault on wheel events unless the path contains
    // `data-lenis-prevent` (see src/hooks/useLenis.ts). Leaving the map
    // hands page scroll back to Lenis.
    const enableWheel = () => {
      map.scrollWheelZoom.enable();
      host.setAttribute("data-lenis-prevent", "");
    };

    const disableWheel = () => {
      map.scrollWheelZoom.disable();
      host.removeAttribute("data-lenis-prevent");
    };

    map.on("click", enableWheel);
    // focusin fires when the container or a marker takes keyboard focus
    host.addEventListener("focusin", enableWheel);
    host.addEventListener("mouseleave", disableWheel);

    // Leaflet measures its container once on mount. The page fades in, the
    // preloader unmounts and webfonts land afterwards, so measure again on any
    // container resize, on window load, and once after the first paint.
    const invalidate = () => map.invalidateSize({ animate: false });

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(invalidate);
      observer.observe(host);
      sizeObserverRef.current = observer;
    }

    window.addEventListener("load", invalidate);
    const settleTimer = window.setTimeout(invalidate, 400);
    void document.fonts?.ready.then(() => invalidate());

    mapRef.current = map;

    return () => {
      window.removeEventListener("load", invalidate);
      window.clearTimeout(settleTimer);
      host.removeEventListener("focusin", enableWheel);
      host.removeEventListener("mouseleave", disableWheel);
      disableWheel(); // the host survives StrictMode's simulated unmount
      sizeObserverRef.current?.disconnect();
      sizeObserverRef.current = null;
      map.remove();
      mapRef.current = null;
      tileLayerRef.current = null;
      markersRef.current = {};
    };
  }, []);

  // ── Tile layer: terrain is the only base map, added once on mount ────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const source = TILE_SOURCES.terrain;

    if (tileLayerRef.current) map.removeLayer(tileLayerRef.current);

    const layer = L.tileLayer(source.url, {
      attribution: source.attribution,
      maxZoom: source.maxZoom,
      subdomains: source.subdomains,
      detectRetina: true,
    });

    // The first tile response settles the loading veil either way — a slow or
    // blocked CDN must never leave the placeholder shimmering forever.
    // Note: no `tileloadstart` listener. It fires again on every pan, and the
    // veil must only ever appear during the first load.
    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      setTilesLoading(false);
    };

    layer.on("load", settle);
    layer.on("tileload", settle);
    layer.on("tileerror", () => {
      setTilesFailed(true);
      settle();
    });

    setTilesFailed(false);
    setTilesLoading(true);
    layer.addTo(map);
    tileLayerRef.current = layer;

    // Keep the frame inside the Ethiopian neighbourhood when panning out.
    map.setMaxBounds([
      [ETHIOPIA_BOUNDS.south - 3, ETHIOPIA_BOUNDS.west - 3],
      [ETHIOPIA_BOUNDS.north + 3, ETHIOPIA_BOUNDS.east + 3],
    ]);
  }, []);

  // ── Pins: rebuilt whenever the destination list changes (CMS-friendly) ───
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    visible.forEach((destination, index) => {
      const color = CATEGORY_COLOR[destination.category];
      const label = destination.numeral ?? String(index + 1);

      const icon = L.divIcon({
        className: `cte-marker${destination.featured ? " cte-marker--featured" : ""}`,
        html:
          `<span class="cte-marker__inner" style="--dot-color: ${color}">` +
          (destination.featured
            ? '<span class="cte-marker__pulse"></span>'
            : "") +
          `<span class="cte-marker__dot">${label}</span></span>`,
        iconSize: [PIN_HIT, PIN_HIT],
        iconAnchor: [PIN_HIT / 2, PIN_HIT / 2],
      });

      const marker = L.marker([destination.lat, destination.lng], {
        icon,
        title: destination.name,
        alt: `${destination.name}, Ethiopia`,
        keyboard: true,
        riseOnHover: true,
      }).addTo(map);

      marker.on("click", () => selectRef.current(destination));

      markersRef.current[destination.id] = marker;
    });
  }, [visible]);


  // ── Selected pin styling, driven by `activeId` ───────────────────────────
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const element = marker.getElement();
      if (element) {
        element.classList.toggle("cte-marker--active", id === activeId);
      }
    });

    const target = activeId ? markersRef.current[activeId] : null;
    if (target && mapRef.current) {
      mapRef.current.panTo(target.getLatLng(), { animate: true, duration: 0.6 });
    }
  }, [activeId, visible]);

  // ── Escape closes the detail card ────────────────────────────────────────
  useEffect(() => {
    if (!activeDestination) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectRef.current(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeDestination]);

  /**
   * Opening move: ease from the country view into the destination bounds.
   * Runs once — later filtering uses the explicit "Fit" button instead, so the
   * map never jumps while the visitor is reading.
   */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const timer = window.setTimeout(() => {
      map.flyToBounds(fitBoundsRef.current, {
        padding: [48, 48],
        duration: 1.2,
      });
    }, 600);

    return () => window.clearTimeout(timer);
  }, []);

  /** Frame every visible destination using the current filter. */
  const fitVisible = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyToBounds(fitBounds, { padding: [48, 48], duration: 0.8 });
  };

  return (
    <section
      id="map"
      aria-label="Interactive map of Ethiopia"
      style={{
        backgroundColor: "var(--paper)",
        padding: "clamp(48px, 6vh, 80px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Ge'ez — same treatment as every other paper section */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-5%",
          right: "-3%",
          fontFamily: "var(--font-geez)",
          fontSize: "clamp(180px, 28vw, 400px)",
          color: "var(--ink)",
          opacity: 0.03,
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {mapContent.geezDecorator} {/* TODO-REVIEW */}
      </div>

      <SectionHeader
        label={mapContent.sectionLabel}
        headline={mapContent.headline}
        subline={mapContent.subline}
      />

      <div
        className="map-layout"
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "minmax(260px, 340px) 1fr",
          gap: "clamp(20px, 2.5vw, 40px)",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 80px)",
          alignItems: "start",
          position: "relative",
          zIndex: 1,
        }}
      >
        <DestinationPanel
          destinations={visible}
          total={destinations.length}
          activeId={activeId}
          activeCategory={activeCategory}
          hint={mapContent.defaultPrompt}
          onCategoryChange={setActiveCategory}
          onSelect={select}
          onFit={fitVisible}
        />

        <div style={{ position: "relative" }}>
          <div
            ref={mapHostRef}
            role="application"
            className="cte-map"
            aria-label="Interactive map of Ethiopia. Each pin is a destination you can visit. Press Escape to close the detail card."
            data-cursor="map"
            data-cursor-label="Drag"
            style={{
              width: "100%",
              height: "clamp(420px, 66vh, 680px)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 6px 32px rgba(18,17,16,0.14)",
              border: "1px solid rgba(18,17,16,0.08)",
              backgroundColor: "var(--paper)",
            }}
          />

          {tilesLoading && !tilesFailed && (
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                pointerEvents: "none",
                background:
                  "linear-gradient(115deg, var(--paper) 30%, rgba(241,234,217,0.6) 50%, var(--paper) 70%)",
                backgroundSize: "220% 100%",
                animation: "cteMapSheen 1.9s ease-in-out infinite",
              }}
            />
          )}

          <MapControls onFit={fitVisible} />

          {tilesFailed && <TileErrorNotice message={mapContent.tilesError} />}

          <AnimatePresence>
            {activeDestination && (
              <DestinationCard
                key={activeDestination.id}
                destination={activeDestination}
                onClose={() => select(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}


/* ══════════════════════════════════════════════════════════════════════════
   Sub-components
   Kept in this file on purpose: they exist only for the map and share its
   palette, tokens and localStorage-free state.
   ══════════════════════════════════════════════════════════════════════════ */

function SectionHeader({
  label,
  headline,
  subline,
}: {
  label: string;
  headline: string;
  subline: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(24px, 5vw, 60px) 1fr",
        gap: 0,
        padding: "0 clamp(24px, 6vw, 80px)",
        marginBottom: "clamp(40px, 5vh, 72px)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          writingMode: "vertical-rl",
          fontFamily: "var(--font-body)",
          fontSize: 10,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--ochre)",
          alignSelf: "start",
          paddingTop: 4,
        }}
      >
        {label}
      </div>
      <div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 72, "wght" 600',
            fontSize: "clamp(2.5rem, 6vw, 7rem)",
            color: "var(--ink)",
            lineHeight: 1.0,
            letterSpacing: "-0.025em",
            marginBottom: 16,
          }}
        >
          {headline}
        </h2>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(13px, 1.2vw, 15px)",
            color: "var(--ink)",
            opacity: 0.6,
            maxWidth: 540,
            lineHeight: 1.7,
          }}
        >
          {subline}
        </p>
      </div>
    </div>
  );
}

/**
 * A single control on the map plate. All colour and hover state lives in the
 * `.cte-map-btn` class so keyboard focus gets the same treatment as hover.
 */
function MapButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="cte-map-btn"
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        minWidth: 34,
        height: 34,
        padding: "0 12px",
        cursor: "none",
        fontSize: 10,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </button>
  );
}


/**
 * Overlay controls on the map plate.
 *
 * Zoom is provided by Leaflet's own control (top-right), which keeps its
 * keyboard bindings and screen-reader labels — this component adds only the
 * "fit" action, styled to the site palette.
 */
function MapControls({ onFit }: { onFit: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 800,
        display: "flex",
        gap: 6,
      }}
    >
      <MapButton label="Fit all destinations" onClick={onFit}>
        Fit
      </MapButton>
    </div>
  );
}

/** Shown when every tile request fails — the plate is never just blank. */
function TileErrorNotice({ message }: { message: string }) {
  return (
    <div
      role="status"
      style={{
        position: "absolute",
        bottom: 16,
        left: 16,
        right: 16,
        zIndex: 800,
        padding: "12px 16px",
        borderRadius: 6,
        backgroundColor: "var(--indigo)",
        color: "var(--paper)",
        fontFamily: "var(--font-body)",
        fontSize: 12,
        lineHeight: 1.5,
        boxShadow: "0 10px 30px rgba(18,17,16,0.3)",
      }}
    >
      {message}
    </div>
  );
}


/**
 * The text half of the map: category filters plus a plain list of
 * destinations. Kept as real buttons so the whole section is reachable by
 * keyboard and by screen reader, not only by mouse on the map.
 */
function DestinationPanel({
  destinations,
  total,
  activeId,
  activeCategory,
  hint,
  onCategoryChange,
  onSelect,
  onFit,
}: {
  destinations: Destination[];
  total: number;
  activeId: string | null;
  activeCategory: DestinationCategory | "all";
  hint?: string;
  onCategoryChange: (category: DestinationCategory | "all") => void;
  onSelect: (destination: Destination | null) => void;
  onFit: () => void;
}) {
  const categoriesWithContent = DESTINATION_CATEGORIES.filter((category) =>
    destinations.some((d) => d.category === category),
  );

  return (
    <div>
      {/* Filters — only categories that actually have destinations appear */}
      <div
        role="group"
        aria-label="Filter destinations by type"
        style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}
      >
        <FilterChip
          active={activeCategory === "all"}
          count={total}
          onClick={() => onCategoryChange("all")}
        >
          All
        </FilterChip>
        {categoriesWithContent.map((category) => (
          <FilterChip
            key={category}
            active={activeCategory === category}
            count={destinations.filter((d) => d.category === category).length}
            color={CATEGORY_COLOR[category]}
            onClick={() => onCategoryChange(category)}
          >
            {CATEGORY_LABELS[category]}
          </FilterChip>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(18,17,16,0.12)",
        }}
      >
        <span style={panelMetaStyle}>
          {destinations.length} place{destinations.length === 1 ? "" : "s"}
        </span>
        <button type="button" onClick={onFit} style={panelLinkStyle}>
          Fit map
        </button>
      </div>

      {/* Prompt shown until something is selected */}
      {hint && !activeId && destinations.length > 0 && (
        <p
          style={{
            margin: "0 0 8px",
            fontFamily: "var(--font-body)",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ochre)",
          }}
        >
          {hint}
        </p>
      )}

      {destinations.length === 0 ? (
        <p style={panelEmptyStyle}>
          Nothing in this category yet. Try another filter.
        </p>
      ) : (
        <ul style={panelListStyle}>
          {destinations.map((destination, index) => (
            <DestinationRow
              key={destination.id}
              destination={destination}
              index={index}
              selected={destination.id === activeId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const panelMetaStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink)",
  opacity: 0.5,
};

const panelLinkStyle: React.CSSProperties = {
  border: "none",
  background: "none",
  cursor: "none",
  padding: 0,
  fontFamily: "var(--font-body)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ochre)",
};

const panelEmptyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 13,
  lineHeight: 1.6,
  color: "var(--ink)",
  opacity: 0.6,
  padding: "16px 0",
};

const panelListStyle: React.CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  maxHeight: "clamp(320px, 58vh, 620px)",
  overflowY: "auto",
};


/** One destination in the sidebar list. Clicking toggles the selection. */
function DestinationRow({
  destination,
  index,
  selected,
  onSelect,
}: {
  destination: Destination;
  index: number;
  selected: boolean;
  onSelect: (destination: Destination | null) => void;
}) {
  return (
    <li>
      <button
        type="button"
        className="dest-row"
        data-selected={selected}
        aria-pressed={selected}
        onClick={() => onSelect(selected ? null : destination)}
        style={{
          display: "block",
          width: "100%",
          textAlign: "left",
          border: "none",
          borderBottom: "1px solid rgba(18,17,16,0.08)",
          background: "transparent",
          cursor: "none",
          padding: "12px 10px",
          borderRadius: 4,
        }}
      >
        <span style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span
            style={{
              fontFamily: "var(--font-geez)",
              fontSize: 12,
              // Indigo for legibility — the category ring lives on the pin
              color: "var(--indigo)",
              minWidth: 20,
            }}
          >
            {destination.numeral ?? index + 1}
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontVariationSettings: '"opsz" 24, "wght" 500',
              fontSize: 15,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
            }}
          >
            {destination.name}
          </span>
        </span>
        <span
          style={{
            display: "block",
            marginTop: 3,
            marginLeft: 30,
            fontFamily: "var(--font-body)",
            fontSize: 11,
            lineHeight: 1.5,
            color: "var(--ink)",
            opacity: 0.55,
          }}
        >
          {destination.tagline}
        </span>
      </button>
    </li>
  );
}

function FilterChip({
  active,
  count,
  color,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  color?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        border: `1px solid ${active ? "transparent" : "rgba(18,17,16,0.2)"}`,
        // Indigo when selected: paper text on ochre/sulphur would fail AA.
        backgroundColor: active ? "var(--indigo)" : "transparent",
        color: active ? "var(--paper)" : "var(--ink)",
        borderRadius: 999,
        padding: "5px 11px",
        cursor: "none",
        fontFamily: "var(--font-body)",
        fontSize: 11,
        letterSpacing: "0.02em",
        transition: `background-color ${DURATION.micro}s ease, color ${DURATION.micro}s ease`,
      }}
    >
      {/* Category swatch — the outline keeps it visible on the active chip */}
      {color && (
        <span
          aria-hidden="true"
          style={{
            width: 7,
            height: 7,
            borderRadius: 999,
            backgroundColor: color,
            outline:
              "1px solid color-mix(in srgb, var(--paper) 65%, transparent)",
            outlineOffset: 1,
          }}
        />
      )}
      {children}
      <span style={{ opacity: 0.65, fontSize: 10 }}>{count}</span>
    </button>
  );
}

/**
 * Detail card for the selected destination.
 *
 * Deliberately not a modal: the map stays pan/zoomable behind it, which is how
 * people actually browse a map. Escape closes it (handled by the parent) and
 * the close button is a real button with an accessible name.
 */
function DestinationCard({
  destination,
  onClose,
}: {
  destination: Destination;
  onClose: () => void;
}) {
  const image = destination.image
    ? buildSrcSet(destination.imageFolder ?? "regions", destination.image)
    : null;

  const relatedTours = (destination.tourIds ?? [])
    .map((id) => tours.find((tour) => tour.id === id))
    .filter((tour): tour is (typeof tours)[number] => Boolean(tour));

  const facts: Array<[string, string]> = [];
  if (destination.bestSeason) facts.push(["Best season", destination.bestSeason]);
  if (destination.altitude) facts.push(["Altitude", destination.altitude]);
  if (destination.daysNeeded) facts.push(["Days needed", destination.daysNeeded]);
  if (destination.howToGetThere)
    facts.push(["Getting there", destination.howToGetThere]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: DURATION.ui, ease: EASE_FM.outCubic }}
      aria-label={`${destination.name} details`}
      className="map-card"
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        width: 320,
        maxHeight: "calc(100% - 32px)",
        // The body scrolls; the header and close button stay pinned
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 900,
        borderRadius: 10,
        backgroundColor: "var(--paper)",
        boxShadow: "0 18px 48px rgba(18,17,16,0.28)",
        border: "1px solid rgba(18,17,16,0.08)",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close details"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          border: "none",
          borderRadius: 999,
          width: 26,
          height: 26,
          cursor: "none",
          backgroundColor: "color-mix(in srgb, var(--paper) 88%, transparent)",
          color: "var(--ink)",
          fontFamily: "var(--font-body)",
          fontSize: 15,
          lineHeight: 1,
          boxShadow: "0 2px 8px rgba(18,17,16,0.18)",
        }}
      >
        ×
      </button>

      {image && destination.imageAlt && (
        <div style={{ height: 150, flexShrink: 0 }}>
          <ResponsiveImage
            src={image.src}
            srcSet={image.srcSet}
            lqip={image.lqip}
            alt={destination.imageAlt}
            width={640}
            height={300}
            sizes="320px"
          />
        </div>
      )}

      <div
        style={{
          padding: image ? "14px 16px 16px" : "40px 40px 16px 16px",
          overflowY: "auto",
          flex: "1 1 auto",
          minHeight: 0,
        }}
      >
        {destination.geezName && (
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-geez)",
              fontSize: 15,
              // Matches the ochre section labels used site-wide
              color: "var(--ochre)",
              marginBottom: 2,
            }}
          >
            {destination.geezName}
          </span>
        )}

        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontVariationSettings: '"opsz" 32, "wght" 600',
            fontSize: 21,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
            marginBottom: 6,
          }}
        >
          {destination.name}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--ink)",
            opacity: 0.6,
            marginBottom: 12,
          }}
        >
          {destination.tagline}
        </p>



        {destination.description.split("\n\n").map((paragraph, index) => (
          <p
            key={index}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 12.5,
              lineHeight: 1.65,
              color: "var(--ink)",
              marginBottom: 10,
            }}
          >
            {paragraph}
          </p>
        ))}

        {facts.length > 0 && (
          <dl
            style={{
              margin: "14px 0 0",
              paddingTop: 12,
              borderTop: "1px solid rgba(18,17,16,0.12)",
              display: "grid",
              gap: 8,
            }}
          >
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ochre)",
                  }}
                >
                  {label}
                </dt>
                <dd
                  style={{
                    margin: "2px 0 0",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    lineHeight: 1.55,
                    color: "var(--ink)",
                  }}
                >
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        {relatedTours.length > 0 && (
          <ul
            style={{
              listStyle: "none",
              margin: "14px 0 0",
              padding: 0,
              display: "grid",
              gap: 6,
            }}
          >
            {relatedTours.map((tour) => (
              <li key={tour.id}>
                <a
                  href={tour.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    // Long tour names are clamped so the list stays scannable
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "var(--indigo)",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  {tour.duration}-day tour: {tour.name}
                </a>
              </li>
            ))}
          </ul>
        )}

        {destination.liveUrl && (
          <a
            href={destination.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 14,
              fontFamily: "var(--font-body)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              // Ink on ochre = 5.9:1; paper on ochre fails AA at this size
              color: "var(--ink)",
              backgroundColor: "var(--ochre)",
              padding: "8px 14px",
              borderRadius: 4,
              textDecoration: "none",
            }}
          >
            See tours here
          </a>
        )}
      </div>
    </motion.aside>
  );
}

