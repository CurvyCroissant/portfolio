import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const base = '/portfolio';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405).end(); return; }
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); } catch { response.writeHead(400).end(); return; }
  if (pathname === base) { response.writeHead(301, { Location: `${base}/` }).end(); return; }
  let file = path.resolve(root, `.${pathname.startsWith(`${base}/`) ? pathname.slice(base.length) : '/404.html'}`);
  if (!file.startsWith(`${root}${path.sep}`) && file !== root) { response.writeHead(403).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!pathname.endsWith('/')) { response.writeHead(301, { Location: `${pathname}/` }).end(); return; }
    file = path.join(file, 'index.html');
  }
  let status = pathname.startsWith(`${base}/`) ? 200 : 404;
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) { file = path.join(root, '404.html'); status = 404; }
  if (!fs.existsSync(file)) { response.writeHead(404).end(); return; }
  response.writeHead(status, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
  if (request.method === 'HEAD') response.end(); else fs.createReadStream(file).pipe(response);
});
server.listen(Number(process.env.PORT ?? 4321), '127.0.0.1', () => console.info(`Portfolio preview: http://127.0.0.1:${server.address().port}${base}/`));
