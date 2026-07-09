import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  /** Absolute or root-relative social share image. */
  image?: string;
}

const SITE = "Lynx Racing";
const DEFAULT_IMAGE = "/renders/hero-og.jpg";
const DEFAULT_DESCRIPTION =
  "UNSW Lynx Racing — students engineering Australia's first electric racing superbike concept for the MotoStudent competition.";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Lightweight per-page SEO for the SPA: sets the document title plus the core
 * description / Open Graph / Twitter tags on mount. Avoids pulling in a helmet
 * dependency for what is a small, fixed set of tags.
 */
export function useSeo({ title, description = DEFAULT_DESCRIPTION, image = DEFAULT_IMAGE }: SeoOptions) {
  useEffect(() => {
    const fullTitle = title.includes(SITE) ? title : `${title} — ${SITE}`;
    document.title = fullTitle;

    setMeta("property", "og:title", fullTitle);
    setMeta("name", "twitter:title", fullTitle);

    // Always set description tags (with a sensible default) so a route without
    // its own description never inherits the previous route's metadata.
    setMeta("name", "description", description);
    setMeta("property", "og:description", description);
    setMeta("name", "twitter:description", description);

    setMeta("property", "og:image", image);
    setMeta("name", "twitter:image", image);
  }, [title, description, image]);
}
