import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(rootDir, 'dist');
const publicDir = existsSync(distDir) ? distDir : rootDir;
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function parseDotEnv(value) {
  const env = {};

  value.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const match = trimmed.match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (!match) return;

    const key = match[1];
    let rawValue = match[2].trim();

    if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      rawValue = rawValue.slice(1, -1);
    } else {
      rawValue = rawValue.replace(/\s+#.*$/, '');
    }

    env[key] = rawValue.replace(/\\n/g, '\n');
  });

  return env;
}

function getRuntimeEnv() {
  const envPath = join(rootDir, '.env');
  const fileEnv = existsSync(envPath) ? parseDotEnv(readFileSync(envPath, 'utf8')) : {};
  const mergedEnv = { ...process.env, ...fileEnv };
  const runtimeEnv = {};

  Object.entries(mergedEnv).forEach(([key, value]) => {
    if ((key.startsWith('COUPON_') || key.startsWith('VITE_COUPON_')) && value) {
      runtimeEnv[key] = String(value);
    }
  });

  return runtimeEnv;
}

function send(res, statusCode, contentType, body) {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Cache-Control': contentType.includes('text/javascript') ? 'no-store' : 'public, max-age=300',
  });
  res.end(body);
}

function sendRuntimeEnv(res) {
  const body = `window.__IVS_RUNTIME_ENV__ = ${JSON.stringify(getRuntimeEnv())};\n`;
  send(res, 200, 'text/javascript; charset=utf-8', body);
}

function getStaticPath(urlPath) {
  const requestedPath = decodeURIComponent(urlPath.split('?')[0]);
  const cleanPath = normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = resolve(publicDir, `.${cleanPath}`);

  if (!filePath.startsWith(publicDir)) return null;
  if (existsSync(filePath) && statSync(filePath).isFile()) return filePath;

  return null;
}

const server = createServer((req, res) => {
  const urlPath = req.url || '/';

  if (urlPath.split('?')[0] === '/runtime-env.js') {
    sendRuntimeEnv(res);
    return;
  }

  const staticPath = getStaticPath(urlPath === '/' ? '/index.html' : urlPath);
  if (staticPath) {
    const ext = extname(staticPath);
    send(res, 200, mimeTypes[ext] || 'application/octet-stream', readFileSync(staticPath));
    return;
  }

  const fallbackPath = join(publicDir, 'index.html');
  if (existsSync(fallbackPath)) {
    send(res, 200, 'text/html; charset=utf-8', readFileSync(fallbackPath));
    return;
  }

  send(res, 404, 'text/plain; charset=utf-8', 'Not found');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[IVS] Server listening on http://0.0.0.0:${port}`);
  console.log(`[IVS] Serving files from ${publicDir}`);
  console.log('[IVS] Runtime coupon codes loaded =', Object.keys(getRuntimeEnv()));
});
