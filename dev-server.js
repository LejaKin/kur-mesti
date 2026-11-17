// Vietinis serveris testavimui (be Vercel): node dev-server.js  →  http://localhost:3000
// API raktą skaito iš .env failo (ANTHROPIC_API_KEY=...) arba aplinkos kintamojo.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const { default: handler } = await import("./api/classify.js");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".webmanifest": "application/manifest+json" };

http.createServer(async (req, res) => {
  if (req.url.startsWith("/api/classify")) {
    let body = "";
    for await (const chunk of req) body += chunk;
    try { req.body = JSON.parse(body || "{}"); } catch { req.body = {}; }
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
    return handler(req, res);
  }
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p === "/") p = "/index.html";
  const file = path.join("public", path.normalize(p));
  if (!file.startsWith("public") || !fs.existsSync(file)) { res.statusCode = 404; return res.end("Nerasta"); }
  res.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
}).listen(process.env.PORT || 3000, () => console.log("http://localhost:" + (process.env.PORT || 3000)));
