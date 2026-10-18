import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const prefix = "/ai-assistant-setup/";
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};
http
  .createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost");
    if (!url.pathname.startsWith(prefix)) {
      response.writeHead(404).end();
      return;
    }
    let relative =
      decodeURIComponent(url.pathname.slice(prefix.length)) || "index.html";
    if (relative.includes("..")) {
      response.writeHead(400).end();
      return;
    }
    let file = path.join(root, relative);
    try {
      if ((await stat(file)).isDirectory())
        file = path.join(file, "index.html");
      response.setHeader(
        "Content-Type",
        types[path.extname(file)] || "application/octet-stream",
      );
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end();
    }
  })
  .listen(4178, "127.0.0.1", () => console.log("Setup site ready"));
