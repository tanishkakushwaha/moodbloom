import test from 'node:test';
import assert from 'node:assert/strict';
import { assertLoginRedirect, redirectLocation } from '../scripts/lib/redirect.mjs';

const origin = 'http://localhost:3000';
const response = (status, data = '', location) => ({ status, data, headers: new Headers(location ? { location } : {}) });

// Matches the markup emitted by Next.js make-get-server-inserted-html.
const streamed = '<html><body><p>A moment for you…</p><meta id="__next-page-redirect" http-equiv="refresh" content="1;url=/login"/></body></html>';

test('accepts an HTTP redirect to the same-origin login page', () => {
  for (const status of [302, 303, 307, 308]) {
    assert.doesNotThrow(() => assertLoginRedirect(response(status, '', '/login'), origin));
  }
});

test('accepts the Next.js streamed redirect with a 200 response', () => {
  assert.equal(redirectLocation(response(200, streamed)), '/login');
  assert.doesNotThrow(() => assertLoginRedirect(response(200, streamed), origin));
});

test('recognizes reordered attributes, single quotes, and permanent redirects', () => {
  const markup = "<meta content='0;url=/login?returnTo=%2Fdashboard' HTTP-EQUIV='refresh' id='__next-page-redirect'>";
  assert.doesNotThrow(() => assertLoginRedirect(response(200, markup), origin));
});

test('rejects plain 200 pages, login links, and unmarked refreshes', () => {
  for (const markup of ['', '<a href="/login">Log in</a>', '<meta http-equiv="refresh" content="1;url=/login">']) {
    assert.throws(() => assertLoginRedirect(response(200, markup), origin));
  }
});

test('rejects redirects to another host or to the protected page', () => {
  for (const location of ['https://untrusted.example/login', '//untrusted.example/login', '/dashboard', '/login/other']) {
    assert.throws(() => assertLoginRedirect(response(307, '', location), origin));
  }
});

test('does not accept an error page containing a redirect marker', () => {
  assert.throws(() => assertLoginRedirect(response(500, streamed), origin));
});

test('fails if protected dashboard markup is rendered alongside a redirect', () => {
  const leakedShell = `<div class="app-shell">Private dashboard</div>${streamed}`;
  assert.throws(() => assertLoginRedirect(response(200, leakedShell), origin));
});
