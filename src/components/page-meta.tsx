import { useLocation } from "react-router";

import { absoluteUrl, pageTitle, site } from "@/data/site";
import type { JsonLd } from "@/lib/structured-data";

const DESCRIPTION_MAX = 160;

// Search results cut descriptions at about 160 characters; end on a word.
function clampDescription(text: string) {
  if (text.length <= DESCRIPTION_MAX) return text;
  const cut = text.slice(0, DESCRIPTION_MAX - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

// React 19 moves <title>, <meta>, and <link> into <head>. Render one per page.
// `title` gets " | Haven" added; `fullTitle` is used exactly as written.
// The canonical URL is the current path without the query string.
function PageMeta({
  title,
  fullTitle,
  description: rawDescription = site.description,
  image = site.seo.ogImage,
  imageAlt = site.seo.ogImageAlt,
  type = "website",
  noindex = false,
  jsonLd,
}: {
  title?: string;
  fullTitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  noindex?: boolean;
  jsonLd?: JsonLd | JsonLd[];
}) {
  const { pathname } = useLocation();
  const description = clampDescription(rawDescription);
  const resolvedTitle = fullTitle ?? pageTitle(title);
  const url = absoluteUrl(pathname);
  const imageUrl = absoluteUrl(image);
  const graphs = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <>
      <title>{resolvedTitle}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <link rel="canonical" href={url} />
      )}

      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.seo.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {!noindex &&
        graphs.map((graph, i) => (
          <script
            key={i}
            type="application/ld+json"
            // JSON.stringify output is data, not markup; "<" is escaped so a
            // value can't close the script tag.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(graph).replace(/</g, "\\u003c"),
            }}
          />
        ))}
    </>
  );
}

export default PageMeta;
