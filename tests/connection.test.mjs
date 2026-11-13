import test from 'node:test';
import assert from 'node:assert/strict';
import { localEndpoint, describeFetchError } from '../scripts/lib/local-server.mjs';

test('local test requests preserve the selected port and use IPv4 loopback', () => {
  assert.equal(localEndpoint('http://localhost:3000'), 'http://127.0.0.1:3000');
  assert.equal(localEndpoint('http://localhost:3007'), 'http://127.0.0.1:3007');
  assert.equal(localEndpoint('http://127.0.0.1:3001'), 'http://127.0.0.1:3001');
});

test('integration endpoints reject remote hosts, HTTPS, and URL credentials', () => {
  for (const value of ['https://localhost:3000', 'http://example.com:3000', 'http://user:password@localhost:3000']) {
    assert.throws(() => localEndpoint(value));
  }
});

test('connection failures show the attempted endpoint and underlying refused connection', () => {
  const cause = Object.assign(new Error('Connection refused'), { code: 'ECONNREFUSED' });
  const error = new TypeError('fetch failed', { cause });
  const message = describeFetchError(error, 'GET', 'http://127.0.0.1:3001/api/health');
  assert.match(message, /GET http:\/\/127\.0\.0\.1:3001\/api\/health/);
  assert.match(message, /ECONNREFUSED/);
  assert.match(message, /stopped or using another port/);
});

test('nested aggregate errors retain the operating-system error code', () => {
  const child = Object.assign(new Error('Access denied'), { code: 'EACCES' });
  const error = new TypeError('fetch failed', { cause: new AggregateError([child]) });
  const message = describeFetchError(error, 'GET', 'http://127.0.0.1:3000/api/health');
  assert.match(message, /EACCES/);
  assert.match(message, /policy blocks local network access/);
});
