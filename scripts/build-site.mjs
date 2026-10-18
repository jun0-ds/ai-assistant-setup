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
    step: 1,
  },
  { source: "prompts/start.md", slug: "start", label: "첫 요청", step: 2 },
  { source: "CONTEXT.md", slug: "router", label: "상황별 안내" },
  {
    source: "stages/01-diagnose/CONTEXT.md",
    slug: "diagnose",
    label: "컴퓨터 상태 확인",
    step: 3,
  },
  {
    source: "stages/02-workspace/CONTEXT.md",
    slug: "workspace",
    label: "작업공간 준비",
    step: 4,
  },
  { source: "stages/03-paseo/CONTEXT.md", slug: "paseo", label: "Paseo 준비", step: 5 },
  {
    source: "stages/04-mobile/CONTEXT.md",
    slug: "mobile",
    label: "휴대폰 연결〔선택〕",
    step: 6,
  },
  {
    source: "stages/05-first-task/CONTEXT.md",
    slug: "first-task",
    label: "첫 작업과 정리",
    step: 7,
  },
  {
    source: "stages/06-maintenance/CONTEXT.md",
    slug: "maintenance",
    label: "업데이트와 관리",
    step: 8,
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
const documentTitle = (doc) => doc.step ? `${doc.step}. ${doc.label}` : doc.label;
const documentGroup = (doc) => doc.step <= 2 ? "직접 준비" : doc.step || doc.slug === "router" ? "에이전트와 진행" : "필요할 때";

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
  const version = (await readFile(path.join(root, "VERSION"), "utf8")).trim();
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
      version,
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
    const navigation = ["직접 준비", "에이전트와 진행", "필요할 때"].map((group) =>
      `<div class="nav-group"><p class="nav-group-title">${group}</p>${documents
        .filter((item) => documentGroup(item) === group)
        .map((item) => `<a href="${item.slug}.html"${item.slug === doc.slug ? ' aria-current="page"' : ""}>${escapeHtml(documentTitle(item))}</a>`)
        .join("\n")}</div>`).join("\n");
    const adjacent = [doc.step && documents.find((item) => item.step === doc.step - 1), doc.step && documents.find((item) => item.step === doc.step + 1)];
    const stepNavigation = adjacent.map((item, index) => item
      ? `<a href="${item.slug}.html">${index === 0 ? "← 이전 안내:" : "다음 안내:"} ${escapeHtml(documentTitle(item))}${index === 1 ? " →" : ""}</a>` : "").join("\n");
    const audience = doc.step <= 2 ? "직접 준비해요" : documentGroup(doc) === "에이전트와 진행"
      ? "첫 요청을 받은 에이전트가 읽어요. 현재 상태에 맞는 단계부터 진행하고, 필요한 로그인·기기 조작을 함께해요."
      : "진행 중 필요할 때 찾아보는 참고 안내예요.";
    await writeFile(
      path.join(root, `guide/${doc.slug}.html`),
      apply(documentTemplate, {
        title: escapeHtml(documentTitle(doc)),
        audience,
        stepNavigation,
        version,
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
