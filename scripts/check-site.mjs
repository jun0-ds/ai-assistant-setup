import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { documents } from "./build-site.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const pages = [
  "index.html",
  "claude-guide/index.html",
  "codex-guide/index.html",
  ...documents.map((doc) => `guide/${doc.slug}.html`),
];
const errors = [];
const contents = new Map();
for (const page of pages) {
  try {
    contents.set(page, await readFile(path.join(root, page), "utf8"));
  } catch {
    errors.push(`${page}: missing generated page (run npm run build)`);
  }
}
for (const [page, html] of contents) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length)
    errors.push(`${page}: duplicate element id`);
  if (/<(?:script|link)[^>]+(?:src|href)="https?:/i.test(html))
    errors.push(`${page}: external runtime asset`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1].replaceAll("&amp;", "&");
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) continue;
    if (href.startsWith("/")) {
      errors.push(`${page}: root-relative URL breaks project hosting: ${href}`);
      continue;
    }
    const [urlPath, hash] = href.split("#");
    const target = urlPath
      ? path.posix.normalize(
          path.posix.join(
            path.posix.dirname(page),
            decodeURI(urlPath.split("?")[0]),
          ),
        )
      : page;
    try {
      await access(path.join(root, target));
    } catch {
      errors.push(`${page}: missing local target ${href}`);
      continue;
    }
    if (hash && target.endsWith(".html")) {
      const targetHtml =
        contents.get(target) ??
        (await readFile(path.join(root, target), "utf8"));
      const decoded = decodeURIComponent(hash);
      if (
        ![...targetHtml.matchAll(/\b(?:id|name)="([^"]+)"/g)].some(
          (item) => item[1] === decoded,
        )
      )
        errors.push(`${page}: missing fragment ${href}`);
    }
  }
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Checked ${pages.length} pages: local links, fragments, project-subpath URLs, runtime assets.`,
  );
