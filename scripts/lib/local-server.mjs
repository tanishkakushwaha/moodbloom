import { createServer } from 'node:net';

export function findPort(port = 3000, last = 3010) {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', error => {
      if (error.code === 'EADDRINUSE' && port < last) findPort(port + 1, last).then(resolve, reject);
      else reject(error);
    });
    probe.listen(port, '127.0.0.1', () => probe.close(() => resolve(port)));
  });
}

export function localEndpoint(origin) {
  const url = new URL(origin);
  if (url.protocol !== 'http:' || !['localhost', '127.0.0.1'].includes(url.hostname) || url.username || url.password) {
    throw new Error('Integration checks require a local HTTP URL, such as http://localhost:3000.');
  }
  return `http://127.0.0.1:${url.port || 80}`;
}

export function describeFetchError(error, method, url) {
  const codes = new Set();
  const seen = new Set();
  function visit(value) {
    if (!value || seen.has(value)) return;
    seen.add(value);
    if (value.code) codes.add(value.code);
    visit(value.cause);
    for (const child of value.errors || []) visit(child);
  }
  visit(error);
  const cause = codes.size ? [...codes].join(', ') : error.name || 'network error';
  const hint = codes.has('ECONNREFUSED')
    ? 'No app server accepted the connection. It may be stopped or using another port.'
    : codes.has('EPERM') || codes.has('EACCES')
      ? 'This terminal’s policy blocks local network access.'
      : 'The app server could not be reached. Check its terminal output.';
  return `${method} ${url} failed (${cause}). ${hint}`;
}

export async function probeBloom(origin, timeout = 1200) {
  const response = await fetch(`${localEndpoint(origin)}/api/health`, { signal: AbortSignal.timeout(timeout) });
  if (!response.headers.get('content-type')?.includes('application/json')) return null;
  const data = await response.json();
  return data.app === 'bloom-mood-diary' ? { origin, healthy: response.ok && data.database === true } : null;
}
