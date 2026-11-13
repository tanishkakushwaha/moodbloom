import assert from 'node:assert/strict';

const redirectStatuses = new Set([301, 302, 303, 307, 308]);

// Next.js can flush a loading boundary before auth() finishes. Its redirect()
// then arrives as an HTML meta refresh, rather than an HTTP Location header.
// Require Next's explicit redirect marker; a login link alone is insufficient.
export function redirectLocation({ status, headers, data }) {
  if (redirectStatuses.has(status)) return headers.get('location');
  if (status !== 200 || typeof data !== 'string') return null;

  for (const [tag] of data.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = new Map();
    for (const match of tag.matchAll(/([a-z][a-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)) {
      attributes.set(match[1].toLowerCase(), match[2] ?? match[3]);
    }
    if (attributes.get('id') !== '__next-page-redirect') continue;
    if (attributes.get('http-equiv')?.toLowerCase() !== 'refresh') continue;
    const refresh = attributes.get('content')?.match(/^\s*[01]\s*;\s*url\s*=\s*(\S.*?)\s*$/i);
    if (refresh) return refresh[1].replaceAll('&amp;', '&');
  }
  return null;
}

export function assertLoginRedirect(response, origin) {
  const location = redirectLocation(response);
  let destination;
  try {
    if (location) destination = new URL(location, origin);
  } catch {
    // Invalid destinations must fail the assertion below.
  }
  assert.ok(
    destination?.origin === new URL(origin).origin && destination?.pathname === '/login',
    `Anonymous dashboard must redirect to /login via HTTP or streamed HTML (status ${response.status}, redirect ${location ?? 'none'})`,
  );
  assert.ok(
    typeof response.data !== 'string' || !/class=["'][^"']*\bapp-shell\b[^"']*["']/i.test(response.data),
    'Anonymous dashboard response must not render the authenticated app shell',
  );
}
