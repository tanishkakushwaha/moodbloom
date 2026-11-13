import test from 'node:test';
import assert from 'node:assert/strict';
import { signupSchema, loginFormSchema, dateSchema, diarySchema, moodSchema, profileSchema } from '../src/lib/validation.ts';
import { hashPassword, verifyPassword } from '../src/lib/password.ts';
import { getStreak } from '../src/lib/utils.ts';
test('passwords use random salts, validate correctly, and reject a wrong password', async () => {
    const a = await hashPassword('a long private phrase');
    const b = await hashPassword('a long private phrase');
    assert.notEqual(a, b);
    assert.ok(await verifyPassword('a long private phrase', a));
    assert.equal(await verifyPassword('a wrong private phrase', a), false);
    assert.equal(await verifyPassword('anything', 'malformed'), false);
});
test('signup normalizes email and rejects weak passwords', () => {
    const u = signupSchema.parse({ name: '  Tanishka ', email: ' Tanishka@Example.com ', password: 'a long private phrase' });
    assert.equal(u.name, 'Tanishka');
    assert.equal(u.email, 'tanishka@example.com');
    assert.equal(signupSchema.safeParse({ ...u, password: 'short' }).success, false);
});
test('dates reject rollover and malformed values', () => {
    assert.ok(dateSchema.safeParse('2024-02-29').success);
    for (const value of ['2026-02-29', '2026-04-31', '2026-13-01', '2026-2-01', 'not-a-date'])
        assert.equal(dateSchema.safeParse(value).success, false, value);
});
test('diary validation rejects empty, oversized, or invalid input', () => {
    const entry = { title: 'A moment', content: 'A little thought.', date: '2026-11-13', mood: 'calm', tags: ['gratitude'] };
    assert.ok(diarySchema.safeParse(entry).success);
    assert.equal(diarySchema.safeParse({ ...entry, title: '  ' }).success, false);
    assert.equal(diarySchema.safeParse({ ...entry, content: 'x'.repeat(50001) }).success, false);
    assert.equal(diarySchema.safeParse({ ...entry, tags: Array(9).fill('tag') }).success, false);
    assert.equal(diarySchema.safeParse({ ...entry, mood: 'unknown' }).success, false);
});
test('moods have a bounded note and a known feeling', () => {
    assert.ok(moodSchema.safeParse({ date: '2026-11-13', mood: 'happy' }).success);
    assert.equal(moodSchema.safeParse({ date: '2026-11-13', mood: 'happy', note: 'x'.repeat(501) }).success, false);
    assert.equal(moodSchema.safeParse({ date: '2026-11-13', mood: 'other' }).success, false);
});
test('streak supports yesterday, breaks at gaps, and ignores duplicates', () => {
    assert.equal(getStreak(['2026-11-13', '2026-11-12', '2026-11-12', '2026-11-11'], '2026-11-13'), 3);
    assert.equal(getStreak(['2026-11-12', '2026-11-11'], '2026-11-13'), 2);
    assert.equal(getStreak(['2026-11-13', '2026-11-11'], '2026-11-13'), 1);
    assert.equal(getStreak(['2026-11-10'], '2026-11-13'), 0);
    assert.equal(getStreak(['2026-10-31', '2026-11-01'], '2026-11-01'), 2);
});
test('profile images allow only HTTPS, and theme is constrained', () => {
    assert.equal(profileSchema.safeParse({ name: 'Tanishka', image: 'javascript:alert(1)' }).success, false);
    assert.equal(profileSchema.safeParse({ name: 'Tanishka', image: 'http://example.com/me.png' }).success, false);
    assert.ok(profileSchema.safeParse({ name: 'Tanishka', image: 'https://example.com/me.png', theme: 'dark' }).success);
});

test('login form permits an empty signup-only name and normalizes its email', () => {
    const result = loginFormSchema.parse({name: '', email: '  PERSON@Example.com ', password: 'old-pass'});
    assert.equal(result.name, '');
    assert.equal(result.email, 'person@example.com');
    assert.equal(signupSchema.safeParse(result).success, false);
});
