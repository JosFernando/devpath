import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BACKUP_KEY,
  RECOVERY_KEY,
  STORAGE_KEY,
  createDefaultProgress,
  exportProgressBackup,
  getStreak,
  importProgressBackup,
  normalizeProgress,
  parseProgressBackup,
  readStoredProgress,
  recordActivity,
  saveStoredProgress,
} from '../src/lib/progressStorage.js';

const catalog = { stageIds: ['first', 'second'], lessonIds: ['lesson'], projectIds: ['project'] };
const defaults = () => createDefaultProgress(catalog);

function memoryStorage(initial = {}, failKey = null) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem(key, value) {
      if (key === failKey) throw new Error('QuotaExceededError');
      values.set(key, value);
    },
  };
}

test('an older content version keeps completed stages, drafts and the last visited lesson', () => {
  const legacy = {
    ...defaults(),
    challengeContentVersion: 1,
    completedStages: ['first', 'first', 'retired-stage'],
    currentStageId: 'second',
    stageFiles: { first: { 'script.js': 'const trabalho = "preservado";' }, 'retired-stage': { 'notes.txt': 'minhas notas' } },
  };
  const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(legacy) });
  const loaded = readStoredProgress(storage, catalog);
  assert.deepEqual(loaded.progress.completedStages, ['first', 'retired-stage']);
  assert.deepEqual(loaded.progress.stageFiles, legacy.stageFiles);
  assert.equal(loaded.progress.currentStageId, 'second');
  assert.equal(loaded.progress.xp, 25);
  assert.equal(storage.getItem(STORAGE_KEY), JSON.stringify(legacy));
});

test('invalid local values never leak into arrays, boolean maps or earned statistics', () => {
  const state = normalizeProgress({
    completedStages: ['first', null, 4, 'first'],
    completedLessons: false,
    stageFiles: [],
    checklistDone: { ok: true, invalid: 'yes' },
    projectSubmissions: { project: { repoUrl: 'https://example.com/repo' }, invalid: true },
    knowledgeChecks: { first: { answer: 1, isCorrect: false }, invalid: [] },
    activityDays: ['2026-02-30', 123, null],
    xp: 999999,
    streak: 99,
    theme: 'whatever',
  }, catalog);
  assert.deepEqual(state.completedStages, ['first']);
  assert.deepEqual(state.completedLessons, []);
  assert.deepEqual(state.checklistDone, { ok: true });
  assert.deepEqual(state.stageFiles, {});
  assert.equal(state.xp, 75);
  assert.equal(state.streak, 0);
  assert.equal(state.theme, 'dark');
  assert.deepEqual(state.activityDays, []);
});

test('corrupt JSON is not overwritten while reading and is copied before saving new work', () => {
  const original = '{"completedStages":["first"]';
  const storage = memoryStorage({ [STORAGE_KEY]: original });
  const loaded = readStoredProgress(storage, catalog);
  assert.ok(loaded.error);
  assert.equal(storage.getItem(STORAGE_KEY), original);
  assert.equal(loaded.recoveryRaw, original);
  const result = saveStoredProgress(storage, loaded.progress, loaded.recoveryRaw);
  assert.equal(result.success, true);
  assert.equal(storage.getItem(RECOVERY_KEY), original);
});

test('a failed recovery backup leaves the original data untouched', () => {
  const original = 'corrupt but recoverable';
  const storage = memoryStorage({ [STORAGE_KEY]: original }, RECOVERY_KEY);
  const result = saveStoredProgress(storage, defaults(), original);
  assert.equal(result.success, false);
  assert.equal(storage.getItem(STORAGE_KEY), original);
});

test('partially damaged drafts keep valid files and preserve the original source for recovery', () => {
  const original = JSON.stringify({
    completedStages: ['first', null],
    stageFiles: { first: { 'script.js': 'const meuCodigo = 1;', 'invalid.js': 42 }, second: null },
  });
  const storage = memoryStorage({ [STORAGE_KEY]: original });
  const loaded = readStoredProgress(storage, catalog);
  assert.deepEqual(loaded.progress.completedStages, ['first']);
  assert.deepEqual(loaded.progress.stageFiles, { first: { 'script.js': 'const meuCodigo = 1;' } });
  assert.equal(loaded.recoveryRaw, original);
  assert.ok(loaded.error);
  assert.equal(saveStoredProgress(storage, loaded.progress, loaded.recoveryRaw).success, true);
  assert.equal(storage.getItem(RECOVERY_KEY), original);
});

test('a full backup round trip preserves code, theory answers and course work', () => {
  const original = normalizeProgress({
    ...defaults(),
    completedStages: ['first'],
    completedLessons: ['lesson'],
    stageFiles: { second: { 'script.js': 'console.log("Olá 👋");\n' } },
    knowledgeChecks: { second: { answer: 2, isCorrect: true, answeredAt: '2026-09-05T12:00:00.000Z' } },
    projectSubmissions: { project: { repoUrl: 'https://example.com/repo', liveUrl: '' } },
    activityDays: ['2026-09-05'],
  }, catalog);
  const parsed = parseProgressBackup(exportProgressBackup(original), catalog);
  assert.deepEqual(parsed, original);
  assert.equal(parsed.xp, 90);
  assert.deepEqual(parsed.completedStages, ['first']);
});

test('import rejects unrelated, malformed and incompatible files before any storage write', () => {
  const storage = memoryStorage({ [STORAGE_KEY]: 'original' });
  const invalidFiles = [
    'null', '[]', '{}', 'not JSON',
    JSON.stringify({ completedStages: 'first', stageFiles: {} }),
    JSON.stringify({ completedStages: [], stageFiles: { first: { 'script.js': 42 } } }),
    JSON.stringify({ completedStages: [], stageFiles: {}, knowledgeChecks: { first: { answer: {}, isCorrect: true } } }),
    JSON.stringify({ completedStages: [], stageFiles: {}, activityDays: ['2026-02-30'] }),
    JSON.stringify({ app: 'devpath', schemaVersion: 999, progress: defaults() }),
    '{"completedStages":[],"stageFiles":{"__proto__":{"polluted":"yes"}}}',
  ];
  for (const json of invalidFiles) {
    const result = importProgressBackup(storage, json, defaults(), catalog);
    assert.equal(result.success, false, json);
    assert.equal(storage.getItem(STORAGE_KEY), 'original');
    assert.equal(storage.getItem(BACKUP_KEY), null);
  }
  assert.equal({}.polluted, undefined);
});

test('an imported backup keeps a restorable copy of the current unsaved work', () => {
  const current = { ...defaults(), stageFiles: { first: { 'script.js': 'const local = 1;' } } };
  const incoming = { ...defaults(), completedStages: ['first'] };
  const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(defaults()) });
  const result = importProgressBackup(storage, exportProgressBackup(incoming), current, catalog);
  assert.equal(result.success, true);
  assert.deepEqual(parseProgressBackup(storage.getItem(BACKUP_KEY), catalog), current);
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)), result.progress);
});

test('import aborts if the backup or final write fails, preserving active progress', () => {
  for (const failKey of [BACKUP_KEY, STORAGE_KEY]) {
    const original = JSON.stringify({ ...defaults(), completedStages: ['first'] });
    const storage = memoryStorage({ [STORAGE_KEY]: original }, failKey);
    const result = importProgressBackup(storage, exportProgressBackup(defaults()), defaults(), catalog);
    assert.equal(result.success, false);
    assert.equal(storage.getItem(STORAGE_KEY), original);
  }
});

test('blocked storage reports a recoverable error without throwing', () => {
  assert.ok(readStoredProgress(null, catalog).error);
  assert.equal(saveStoredProgress(null, defaults()).success, false);
  assert.equal(importProgressBackup(null, exportProgressBackup(defaults()), defaults(), catalog).success, false);
});

test('activity counts distinct local days and streaks expire after a missed day', () => {
  const today = new Date(2026, 8, 5, 16);
  const first = recordActivity(defaults(), today);
  assert.deepEqual(first.activityDays, ['2026-09-05']);
  assert.equal(recordActivity(first, today), first);
  assert.equal(getStreak([], today), 0);
  assert.equal(getStreak(['2026-09-03', '2026-09-04'], today), 2);
  assert.equal(getStreak(['2026-09-03', '2026-09-04', '2026-09-05'], today), 3);
  assert.equal(getStreak(['2026-09-03'], today), 0);
  assert.equal(getStreak(['2026-09-06'], today), 0);
});
