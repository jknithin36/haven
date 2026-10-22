// Build-time SEO files:
// - sitemap.xml from the routes and data files (homes, neighborhoods, guides,
//   agents)
// - robots.txt that points at the sitemap and keeps /admin out of search
// - %SITE_URL% in index.html replaced with the real site URL
// In dev, both files are served from memory.
//
// Homes added in the dashboard live in the browser (localStorage), so they
// can't be in a build-time sitemap. With a backend, generate the sitemap
// from your API instead (see docs/BACKEND.md).

import type { Plugin } from "vite";

import { agents } from "../src/data/agents.ts";
import { articles } from "../src/data/articles.ts";
import { neighborhoods } from "../src/data/neighborhoods.ts";
import { properties } from "../src/data/properties.ts";

type Entry = { path: string; lastmod?: string; priority: number };

// Public pages. /admin is left out on purpose.
const STATIC_ROUTES: Entry[] = [
  { path: "/", priority: 1 },
  { path: "/properties", priority: 0.9 },
  { path: "/neighborhoods", priority: 0.8 },
  { path: "/agents", priority: 0.7 },
  { path: "/guides", priority: 0.6 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.5 },
  { path: "/faq", priority: 0.5 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
];

function entries(): Entry[] {
  return [
    ...STATIC_ROUTES,
    ...properties.map((p) => ({
      path: `/properties/${p.slug}`,
      lastmod: p.listedAt,
      priority: 0.8,
    })),
    ...neighborhoods.map((n) => ({
      path: `/neighborhoods/${n.slug}`,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      path: `/guides/${a.slug}`,
      lastmod: a.date,
      priority: 0.6,
    })),
    ...agents.map((a) => ({ path: `/agents/${a.slug}`, priority: 0.6 })),
  ];
}

const escapeXml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function sitemapXml(siteUrl: string) {
  const urls = entries()
    .map((e) =>
      [
        "  <url>",
        `    <loc>${escapeXml(siteUrl + e.path)}</loc>`,
        e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : "",
        `    <priority>${e.priority.toFixed(1)}</priority>`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function robotsTxt(siteUrl: string) {
  return `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`;
}

export function seoPlugin(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/+$/, "");
  const files: Record<string, { type: string; body: () => string }> = {
    "/sitemap.xml": { type: "application/xml", body: () => sitemapXml(url) },
    "/robots.txt": { type: "text/plain", body: () => robotsTxt(url) },
  };

  return {
    name: "haven-seo",
    transformIndexHtml: {
      order: "pre",
      handler: (html) => html.replaceAll("%SITE_URL%", url),
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = req.url ? files[req.url] : undefined;
        if (!file) return next();
        res.setHeader("Content-Type", `${file.type}; charset=utf-8`);
        res.end(file.body());
      });
    },
    generateBundle() {
      for (const [path, file] of Object.entries(files)) {
        this.emitFile({
          type: "asset",
          fileName: path.slice(1),
          source: file.body(),
        });
      }
    },
  };
}
