import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '../dist');
const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.json': 'application/json',
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let file = path.resolve(root, '.' + pathname);
      if (!file.startsWith(root + path.sep) && file !== root) {
        res.writeHead(403).end();
        return;
      }
      if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
      res.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
      res.end(await readFile(file));
    } catch {
      res.writeHead(404).end('Not found');
    }
  })
  .listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173'));
