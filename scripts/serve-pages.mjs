import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const host = process.env.PLAYWRIGHT_HOST ?? "127.0.0.1";
const port = Number(process.env.PLAYWRIGHT_PORT ?? 4174);
const root = resolve(process.env.STATIC_ROOT ?? "/tmp/kleinkunst-pages-e2e");

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

createServer((request, response) => {
  const url = new URL(request.url ?? "/", `http://${host}:${port}`);
  const pathname = decodeURIComponent(url.pathname);
  const filePath = resolvePath(pathname);

  if (!filePath) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const type = contentTypes[extname(filePath)] ?? "application/octet-stream";
  response.writeHead(200, { "Content-Type": type });
  createReadStream(filePath).pipe(response);
}).listen(port, host);

function resolvePath(pathname) {
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const candidates = [];
  const direct = join(root, safePath);

  candidates.push(direct);

  if (!extname(direct)) {
    candidates.push(join(direct, "index.html"));
  }

  for (const candidate of candidates) {
    const resolved = resolve(candidate);

    if (!resolved.startsWith(root) || !existsSync(resolved)) {
      continue;
    }

    const stat = statSync(resolved);

    if (stat.isDirectory()) {
      const indexPath = join(resolved, "index.html");
      if (existsSync(indexPath)) {
        return indexPath;
      }
      continue;
    }

    return resolved;
  }

  return null;
}
