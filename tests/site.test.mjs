import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { buildSite, documents } from "../scripts/build-site.mjs";

test("builds working relative document links and one shared handoff prompt", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "setup-site-"));
  try {
    await mkdir(path.join(root, "site"), { recursive: true });
    await writeFile(
      path.join(root, "site/home.md"),
      "# 에이전트와 시작해요\n\n컴퓨터에서 첫 대화를 시작해요.",
    );
    for (const doc of documents) {
      const file = path.join(root, doc.source);
      await mkdir(path.dirname(file), { recursive: true });
      await writeFile(
        file,
        doc.source === "prompts/start.md"
          ? "# 첫 요청\n\n```text\n정본을 읽고 도와줘요.\n```\n"
          : "# 안내\n\n## 설치\n\n[문제 해결](../references/troubleshooting.md)\n",
      );
    }
    // This source's relative link is valid from guides/.
    await writeFile(
      path.join(root, "guides/first-agent.md"),
      '# 최초 설치\n\n## Claude\n\n[도움](../references/troubleshooting.md#설치)\n\n<a id="codex"></a>\n\n## Codex\n',
    );
    await buildSite(root);
    const home = await readFile(path.join(root, "index.html"), "utf8");
    assert.match(home, /정본을 읽고 도와줘요/);
    assert.match(home, /href="guide\/first-agent.html/);
    assert.doesNotMatch(home, /src="https?:\/\//);
    const install = await readFile(
      path.join(root, "guide/first-agent.html"),
      "utf8",
    );
    assert.match(install, /href="troubleshooting.html#%EC%84%A4%EC%B9%98"/);
    assert.match(install, /id="claude"/);
    assert.equal([...install.matchAll(/id="codex"/g)].length, 1);
    assert.match(install, /href="\.\.\/index.html"/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
