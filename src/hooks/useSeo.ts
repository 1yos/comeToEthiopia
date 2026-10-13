import { useEffect } from "react";

export interface SeoOptions {
  /** Full document title. Convention: `"<page> — Come to Ethiopia Tours"`. */
  title?: string;
  /** Meta description, also mirrored to og:description. */
  description?: string;
  /**
   * Site-relative path for the canonical/og:url tag (e.g. "/tours/x").
   * Omit until the canonical strategy is settled (open question in
   * docs/pages-plan.md §5) — omitting leaves no canonical tag, same as today.
   */
  canonical?: string;
  /** Block indexing (404). Cleared automatically on the next page's effect. */
  noindex?: boolean;
  /** Structured data object, serialized to a JSON-LD script tag. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string) {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

const JSON_LD_ID = "seo-jsonld";

/**
 * Per-page SEO head tags. Every page component calls this once; the effect
 * makes the document match its options idempotently (create-or-update, and
 * remove tags a previous page left behind — e.g. the 404's noindex).
 *
 * - title → document.title
 * - description → meta[name=description] + og:description
 * - canonical → link[rel=canonical] + og:url (removed when omitted)
 * - noindex → meta[name=robots] (removed when omitted)
 * - jsonLd → script#seo-jsonld[type=application/ld+json] (removed when omitted)
 *
 * Also mirrors og:title/og:type/og:site_name and twitter:card basics.
 * No og:image yet — decided alongside prerendering (Phase 4).
 */
export function useSeo(options: SeoOptions = {}) {
  const { title, description, canonical, noindex, jsonLd } = options;
  // Serialize so inline object literals don't re-fire the effect every render.
  const jsonLdString =
    jsonLd === undefined ? undefined : JSON.stringify(jsonLd);

  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:description", description);
    }

    if (title) {
      upsertMeta("property", "og:title", title);
      upsertMeta("property", "og:type", "website");
      upsertMeta("property", "og:site_name", "Come to Ethiopia Tours");
      upsertMeta("name", "twitter:card", "summary");
    }

    if (canonical) {
      const href = /^https?:/.test(canonical)
        ? canonical
        : `${window.location.origin}${
            canonical.startsWith("/") ? canonical : `/${canonical}`
          }`;
      upsertCanonical(href);
      upsertMeta("property", "og:url", href);
    } else {
      document.head.querySelector('link[rel="canonical"]')?.remove();
      removeMeta("property", "og:url");
    }

    if (noindex) {
      upsertMeta("name", "robots", "noindex, nofollow");
    } else {
      removeMeta("name", "robots");
    }

    let jsonLdTag = document.getElementById(
      JSON_LD_ID,
    ) as HTMLScriptElement | null;
    if (jsonLdString) {
      if (!jsonLdTag) {
        jsonLdTag = document.createElement("script");
        jsonLdTag.id = JSON_LD_ID;
        jsonLdTag.type = "application/ld+json";
        document.head.appendChild(jsonLdTag);
      }
      jsonLdTag.textContent = jsonLdString;
    } else {
      jsonLdTag?.remove();
    }
  }, [title, description, canonical, noindex, jsonLdString]);
}
