// Tiny zero-dependency static server for previewing site/.
import http from 'http';
import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'site');
const PORT = 8787;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

http
  .createServer((req, res) => {
    let urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (urlPath !== '/' && !urlPath.endsWith('/')) {
      // extension-less path that is a page directory → redirect to trailing slash
      if (fs.existsSync(path.join(ROOT, urlPath, 'index.html'))) {
        res.writeHead(301, { Location: urlPath + '/' }).end();
        return;
      }
    }
    if (urlPath.endsWith('/')) urlPath += 'index.html';
    let file = path.join(ROOT, urlPath);
    if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`serving site/ at http://localhost:${PORT}`));
