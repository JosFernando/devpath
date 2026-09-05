export const STORAGE_KEY = 'devpath_roadmap_progress_v2';
export const BACKUP_KEY = `${STORAGE_KEY}_backup`;
export const RECOVERY_KEY = `${STORAGE_KEY}_recovery`;
export const BACKUP_SCHEMA_VERSION = 1;
export const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

const unsafeKeys = new Set(['__proto__', 'constructor', 'prototype']);
const validKey = (key) => typeof key === 'string' && key.length > 0 && !unsafeKeys.has(key);
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isStringMap = (value) => isRecord(value) && Object.entries(value).every(([key, text]) => validKey(key) && typeof text === 'string');
const uniqueIds = (value) => Array.isArray(value) ? [...new Set(value.filter(validKey))] : [];
const cleanRecord = (value, validator) => Object.fromEntries(
  isRecord(value) ? Object.entries(value).filter(([key, item]) => validKey(key) && validator(item)) : [],
);
const validAnswer = (answer) => typeof answer === 'string' || (Number.isInteger(answer) && answer >= 0);
const validCheck = (check) => isRecord(check) && validAnswer(check.answer) && typeof check.isCorrect === 'boolean'
  && Object.keys(check).every((key) => ['answer', 'isCorrect', 'answeredAt'].includes(key))
  && (check.answeredAt === undefined || (typeof check.answeredAt === 'string' && Number.isFinite(Date.parse(check.answeredAt))));
const validSubmission = (submission) => isStringMap(submission) && typeof submission.repoUrl === 'string' && submission.repoUrl.trim().length > 0;

export function localDateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function validDay(day) {
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const date = new Date(`${day}T12:00:00`);
  return Number.isFinite(date.getTime()) && localDateKey(date) === day;
}

export function getStreak(activityDays = [], now = new Date()) {
  const days = new Set(activityDays);
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  if (!days.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (days.has(localDateKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function recordActivity(state, now = new Date()) {
  const today = localDateKey(now);
  return state.activityDays.includes(today)
    ? state
    : { ...state, activityDays: [...state.activityDays, today].sort() };
}

export function getEarnedXp(state, catalog = {}) {
  const count = (ids, known) => known ? ids.filter((id) => known.includes(id)).length : ids.length;
  return count(state.completedStages, catalog.stageIds) * 25
    + count(state.completedLessons, catalog.lessonIds) * 15
    + count(Object.keys(state.projectSubmissions), catalog.projectIds) * 50;
}

export function createDefaultProgress(catalog = {}) {
  return {
    completedStages: [],
    currentStageId: catalog.stageIds?.[0] || 'js-1-variables-and-types',
    stageFiles: {},
    challengeContentVersion: 2,
    completedLessons: [],
    checklistDone: {},
    projectSubmissions: {},
    knowledgeChecks: {},
    activityDays: [],
    xp: 0,
    streak: 0,
    theme: 'dark',
  };
}

// Preserve IDs and code from older curricula. A content revision never resets work.
export function normalizeProgress(input, catalog = {}) {
  const defaults = createDefaultProgress(catalog);
  if (!isRecord(input)) return defaults;
  const progress = {
    ...defaults,
    completedStages: uniqueIds(input.completedStages),
    currentStageId: validKey(input.currentStageId) ? input.currentStageId : defaults.currentStageId,
    stageFiles: Object.fromEntries(Object.entries(cleanRecord(input.stageFiles, isRecord))
      .map(([stageId, files]) => [stageId, cleanRecord(files, (code) => typeof code === 'string')])),
    completedLessons: uniqueIds(input.completedLessons),
    checklistDone: cleanRecord(input.checklistDone, (value) => typeof value === 'boolean'),
    projectSubmissions: cleanRecord(input.projectSubmissions, validSubmission),
    knowledgeChecks: cleanRecord(input.knowledgeChecks, validCheck),
    activityDays: [...new Set(Array.isArray(input.activityDays) ? input.activityDays.filter(validDay) : [])].sort(),
    theme: input.theme === 'light' ? 'light' : 'dark',
  };
  progress.xp = getEarnedXp(progress, catalog);
  progress.streak = getStreak(progress.activityDays);
  return progress;
}

export function readStoredProgress(storage, catalog = {}) {
  let raw = null;
  try {
    if (!storage) throw new Error('Armazenamento indisponível.');
    raw = storage.getItem(STORAGE_KEY);
    if (!raw) return { progress: createDefaultProgress(catalog), error: null, recoveryRaw: null };
    const parsed = JSON.parse(raw);
    if (!isRecord(parsed)) throw new Error('Formato inválido.');
    const progress = normalizeProgress(parsed, catalog);
    try {
      parseProgressBackup(raw, catalog);
      return { progress, error: null, recoveryRaw: null };
    } catch {
      return {
        progress,
        error: 'Parte dos dados salvos está em um formato antigo ou inválido. Seu código válido foi recuperado e os dados originais serão preservados.',
        recoveryRaw: raw,
      };
    }
  } catch {
    return {
      progress: createDefaultProgress(catalog),
      error: raw
        ? 'Não foi possível ler o progresso salvo. Os dados originais serão preservados para recuperação.'
        : 'O armazenamento deste navegador não está disponível. Exporte um backup para guardar seu trabalho.',
      recoveryRaw: raw,
    };
  }
}

export function saveStoredProgress(storage, progress, recoveryRaw = null) {
  try {
    if (!storage) throw new Error('Armazenamento indisponível.');
    if (recoveryRaw !== null) storage.setItem(RECOVERY_KEY, recoveryRaw);
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return { success: true };
  } catch {
    return { success: false, error: 'Não foi possível salvar neste navegador. Exporte um backup para não perder suas alterações.' };
  }
}

export function exportProgressBackup(progress, now = new Date()) {
  return JSON.stringify({
    app: 'devpath',
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: now.toISOString(),
    progress,
  }, null, 2);
}

export function parseProgressBackup(json, catalog = {}) {
  if (typeof json !== 'string' || new TextEncoder().encode(json).length > MAX_BACKUP_BYTES) {
    throw new Error('Escolha um arquivo JSON de até 5 MB.');
  }
  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error('O arquivo não contém um JSON válido.');
  }
  if (!isRecord(parsed)) throw new Error('O arquivo não é um backup do DevPath.');
  let progress = parsed;
  if ('progress' in parsed || 'app' in parsed || 'schemaVersion' in parsed) {
    if (parsed.app !== 'devpath' || parsed.schemaVersion !== BACKUP_SCHEMA_VERSION || !isRecord(parsed.progress)) {
      throw new Error('O formato ou a versão deste backup não é compatível com o DevPath.');
    }
    progress = parsed.progress;
  }
  const validIds = (value) => Array.isArray(value) && value.every(validKey);
  const validMap = (value, validator) => isRecord(value) && Object.entries(value).every(([key, item]) => validKey(key) && validator(item));
  const rules = {
    completedStages: validIds,
    stageFiles: (value) => validMap(value, isStringMap),
    currentStageId: validKey,
    completedLessons: validIds,
    checklistDone: (value) => validMap(value, (done) => typeof done === 'boolean'),
    projectSubmissions: (value) => validMap(value, validSubmission),
    knowledgeChecks: (value) => validMap(value, validCheck),
    activityDays: (value) => Array.isArray(value) && value.every(validDay),
    theme: (value) => value === 'dark' || value === 'light',
    xp: (value) => Number.isFinite(value) && value >= 0,
    streak: (value) => Number.isFinite(value) && value >= 0,
    challengeContentVersion: (value) => Number.isInteger(value) && value >= 0,
  };
  if (!Object.hasOwn(progress, 'completedStages') || !Object.hasOwn(progress, 'stageFiles')) {
    throw new Error('O backup precisa conter o progresso e os rascunhos do DevPath.');
  }
  for (const [field, validate] of Object.entries(rules)) {
    if (Object.hasOwn(progress, field) && !validate(progress[field])) {
      throw new Error(`O campo "${field}" do backup está inválido. Nenhum dado foi alterado.`);
    }
  }
  if (Object.keys(progress).some((key) => unsafeKeys.has(key))) {
    throw new Error('O backup contém campos inválidos.');
  }
  return normalizeProgress(progress, catalog);
}

export function importProgressBackup(storage, json, currentProgress, catalog = {}, recoveryRaw = null) {
  let progress;
  try {
    progress = parseProgressBackup(json, catalog);
  } catch (error) {
    return { success: false, error: error.message };
  }
  try {
    if (!storage) throw new Error('Armazenamento indisponível.');
    // Store the current in-memory work too, including edits made while storage was full.
    storage.setItem(BACKUP_KEY, exportProgressBackup(currentProgress));
    if (recoveryRaw !== null) storage.setItem(RECOVERY_KEY, recoveryRaw);
    storage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return { success: true, progress };
  } catch {
    return { success: false, error: 'Não há espaço para guardar o backup anterior e importar. Exporte seu progresso atual antes de liberar espaço no navegador.' };
  }
}
