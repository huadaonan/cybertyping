import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Run the deployed bundle's actual API guards without mounting the UI.
const bundle = readFileSync(new URL('./index-9d92e3d2-r2.js', import.meta.url), 'utf8');
function between(start, end) {
  const index = bundle.indexOf(start);
  assert.ok(index >= 0, start);
  const finish = bundle.indexOf(end, index + start.length);
  assert.ok(finish > index, end);
  return bundle.slice(index, finish);
}
const api = between('const Gc=', ',af=') + ';';
const errorType = between('class Om extends Error', 'function Cr()');
const refresh = between('async function jv()', 'async function Ci(');
const request = between('async function Ci(', 'let zl=null;');
const health = between('async function qv()', 'const Xv=');
function context(hostname) {
  const calls = [];
  const sandbox = {
    location: { hostname }, AbortController, setTimeout, clearTimeout,
    fetch: async (...args) => { calls.push(args); return { ok: true }; },
    Cr() { throw new Error('The public static site must not access saved login tokens'); }
  };
  vm.createContext(sandbox);
  vm.runInContext(`${api}${errorType}let Ea=null,zl=null;${refresh}${request}${health}`, sandbox);
  return { sandbox, calls };
}

test('public static deployments never request the visitor’s local backend', async () => {
  for (const host of ['cybertyping.huadaonan.workers.dev', 'cybertype.tingchaolou.com', 'localhost.example.com', 'example.com']) {
    const { sandbox, calls } = context(host);
    assert.equal(await vm.runInContext('qv()', sandbox), false);
    assert.equal(await vm.runInContext('jv()', sandbox), false);
    await assert.rejects(vm.runInContext('Ci("POST", "/api/v1/auth/login", {})', sandbox), error => error.code === 'BACKEND_NOT_CONFIGURED');
    assert.equal(calls.length, 0);
  }
});

test('explicit localhost development retains its existing backend health check', async () => {
  for (const host of ['localhost', '127.0.0.1', '[::1]']) {
    const { sandbox, calls } = context(host);
    assert.equal(await vm.runInContext('qv()', sandbox), true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][0], 'http://localhost:8080/healthz');
  }
});
