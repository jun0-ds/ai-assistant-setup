import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";

export const documents = [
  {
    source: "guides/first-agent.md",
    slug: "first-agent",
    label: "첫 에이전트 설치",
  },
  { source: "prompts/start.md", slug: "start", label: "첫 요청" },
  { source: "CONTEXT.md", slug: "router", label: "상황별 안내" },
  {
    source: "stages/01-diagnose/CONTEXT.md",
    slug: "diagnose",
    label: "컴퓨터 상태 확인",
  },
  {
    source: "stages/02-workspace/CONTEXT.md",
    slug: "workspace",
    label: "작업공간 준비",
  },
  { source: "stages/03-paseo/CONTEXT.md", slug: "paseo", label: "Paseo 준비" },
  {
    source: "stages/04-mobile/CONTEXT.md",
    slug: "mobile",
    label: "휴대폰 연결",
  },
  {
    source: "stages/05-first-task/CONTEXT.md",
    slug: "first-task",
    label: "첫 작업과 정리",
  },
  {
    source: "stages/06-maintenance/CONTEXT.md",
    slug: "maintenance",
    label: "업데이트와 관리",
  },
  {
    source: "references/windows-paths.md",
    slug: "windows-paths",
    label: "Windows 실행 경로",
  },
  {
    source: "references/paseo-network.md",
    slug: "paseo-network",
    label: "Paseo 연결 주소",
  },
  {
    source: "references/troubleshooting.md",
    slug: "troubleshooting",
    label: "문제 해결",
  },
  {
    source: "references/wsl-migration.md",
    slug: "wsl-migration",
    label: "WSL로 옮기기",
  },
  { source: "references/sources.md", slug: "sources", label: "공식 자료" },
  {
    source: "references/workspace.md",
    slug: "workspace-files",
    label: "작업 파일과 보관",
  },
];
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const apply = (template, values) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ?? "");

function rendererFor(source) {
  const parser = new Marked({ gfm: true });
  parser.use(gfmHeadingId());
  parser.use({
    walkTokens(token) {
      if (token.type !== "link" && token.type !== "image") return;
      const href = token.href;
      if (!href || /^(?:[a-z]+:|#|\/)/i.test(href)) return;
      const match = href.match(/^([^?#]*)(.*)$/);
      const target = path.posix.normalize(
        path.posix.join(path.posix.dirname(source), match[1]),
      );
      const doc = documents.find((item) => item.source === target);
      // Every guide lives at one depth; preserve fragments and downloads.
      token.href = doc
        ? `${doc.slug}.html${match[2]}`
        : `../${target}${match[2]}`;
    },
  });
  return parser;
}

export async function buildSite(root = projectRoot) {
  const homeTemplate = await readFile(
    path.join(projectRoot, "site/templates/home.html"),
    "utf8",
  );
  const documentTemplate = await readFile(
    path.join(projectRoot, "site/templates/document.html"),
    "utf8",
  );
  const intro = await readFile(path.join(root, "site/home.md"), "utf8");
  const promptSource = await readFile(
    path.join(root, "prompts/start.md"),
    "utf8",
  );
  const promptBlock = new Marked()
    .lexer(promptSource)
    .find((token) => token.type === "code");
  if (!promptBlock?.text.trim())
    throw new Error(
      "prompts/start.md needs a fenced block containing the first request.",
    );
  const prompt = promptBlock.text;
  await mkdir(path.join(root, "guide"), { recursive: true });
  await writeFile(
    path.join(root, "index.html"),
    apply(homeTemplate, {
      intro: new Marked().parse(intro).replace("<h1>", '<h1 id="intro-title">'),
      prompt: escapeHtml(prompt),
    }),
  );
  for (const doc of documents) {
    const markdown = await readFile(path.join(root, doc.source), "utf8");
    const rendered = rendererFor(doc.source).parse(markdown);
    const authoredAnchors = new Set(
      [...rendered.matchAll(/<a\b[^>]*\bid="([^"]+)"/g)].map(
        (match) => match[1],
      ),
    );
    const content = rendered.replace(
      /<h([1-6]) id="([^"]+)">/g,
      (heading, depth, id) =>
        authoredAnchors.has(id) ? `<h${depth}>` : heading,
    );
    const navigation = documents
      .map(
        (item) =>
          `<a href="${item.slug}.html"${item.slug === doc.slug ? ' aria-current="page"' : ""}>${escapeHtml(item.label)}</a>`,
      )
      .join("\n");
    await writeFile(
      path.join(root, `guide/${doc.slug}.html`),
      apply(documentTemplate, {
        title: escapeHtml(doc.label),
        source: doc.source,
        navigation,
        content,
      }),
    );
  }
  return documents.length + 1;
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  console.log(`Built ${await buildSite()} static pages from Markdown.`);
}
