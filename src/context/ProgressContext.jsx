import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { roadmapCourse } from '../data/roadmapData';
import { curriculum } from '../data/curriculum';
import {
  exportProgressBackup,
  getEarnedXp,
  getStreak,
  importProgressBackup,
  readStoredProgress,
  recordActivity,
  saveStoredProgress,
} from '../lib/progressStorage';

const ProgressContext = createContext(null);
const stages = roadmapCourse?.stages || [];
const lessons = curriculum.flatMap((course) => course.modules.flatMap((module) => module.lessons || []));
const projects = curriculum.flatMap((course) => course.modules.flatMap((module) => module.projects || []));
const catalog = {
  stageIds: stages.map((stage) => stage.id),
  lessonIds: lessons.map((lesson) => lesson.id),
  projectIds: projects.map((project) => project.id),
};

function getStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

function sameFiles(first, second) {
  return first && second && Object.keys(first).length === Object.keys(second).length
    && Object.entries(first).every(([name, code]) => second[name] === code);
}

export function ProgressProvider({ children }) {
  const [loaded] = useState(() => readStoredProgress(getStorage(), catalog));
  const [state, setState] = useState(loaded.progress);
  const [storageError, setStorageError] = useState(loaded.error);
  const stateRef = useRef(state);
  const recoveryRawRef = useRef(loaded.recoveryRaw);

  // Save actual changes immediately, including the last keystroke before closing a tab.
  // Reading or upgrading a content version does not overwrite existing work.
  const updateState = useCallback((updater, activity = false) => {
    let nextState = typeof updater === 'function' ? updater(stateRef.current) : updater;
    if (nextState === stateRef.current) return;
    if (activity) nextState = recordActivity(nextState);
    nextState = { ...nextState, xp: getEarnedXp(nextState, catalog), streak: getStreak(nextState.activityDays) };
    stateRef.current = nextState;
    const result = saveStoredProgress(getStorage(), nextState, recoveryRawRef.current);
    if (result.success) recoveryRawRef.current = null;
    setStorageError(result.success ? null : result.error);
    setState(nextState);
  }, []);

  const isStageUnlocked = useCallback((stageId) => {
    const stage = stages.find((item) => item.id === stageId);
    return Boolean(stage && (state.completedStages.includes(stageId)
      || (stage.dependencies || []).every((id) => state.completedStages.includes(id))));
  }, [state.completedStages]);

  const isStageCompleted = useCallback((stageId) => state.completedStages.includes(stageId), [state.completedStages]);

  const visitStage = useCallback((stageId) => {
    if (!catalog.stageIds.includes(stageId)) return;
    updateState((previous) => previous.currentStageId === stageId ? previous : { ...previous, currentStageId: stageId });
  }, [updateState]);

  const completeStage = useCallback((stageId) => {
    updateState((previous) => {
      const stage = stages.find((item) => item.id === stageId);
      if (!stage || previous.completedStages.includes(stageId)) return previous;
      return { ...previous, completedStages: [...previous.completedStages, stageId], currentStageId: stageId };
    }, true);
  }, [updateState]);

  const saveStageFiles = useCallback((stageId, files) => {
    if (!catalog.stageIds.includes(stageId) || !files || typeof files !== 'object' || Array.isArray(files)) return;
    const entries = Object.entries(files);
    if (entries.some(([name, code]) => ['__proto__', 'constructor', 'prototype'].includes(name) || !name || typeof code !== 'string')) return;
    updateState((previous) => {
      if (sameFiles(previous.stageFiles[stageId], files)) return previous;
      return { ...previous, stageFiles: { ...previous.stageFiles, [stageId]: { ...files } } };
    }, true);
  }, [updateState]);

  const getStageFiles = useCallback((stageId) => {
    const stage = stages.find((item) => item.id === stageId);
    if (!stage) return {};
    return { ...(state.stageFiles[stageId] || stage.playground?.files || {}) };
  }, [state.stageFiles]);

  const hasStageDraft = useCallback((stageId) => {
    const savedFiles = state.stageFiles[stageId];
    const initialFiles = stages.find((stage) => stage.id === stageId)?.playground?.files || {};
    return Boolean(savedFiles && !sameFiles(savedFiles, initialFiles));
  }, [state.stageFiles]);

  const resetStageFiles = useCallback((stageId) => {
    updateState((previous) => {
      if (!Object.hasOwn(previous.stageFiles, stageId)) return previous;
      const stageFiles = { ...previous.stageFiles };
      delete stageFiles[stageId];
      return { ...previous, stageFiles };
    });
  }, [updateState]);

  const saveKnowledgeCheck = useCallback((stageId, answer, isCorrect) => {
    if (!catalog.stageIds.includes(stageId) || typeof isCorrect !== 'boolean') return;
    if (typeof answer !== 'string' && !(Number.isInteger(answer) && answer >= 0)) return;
    updateState((previous) => {
      const saved = previous.knowledgeChecks[stageId];
      if (saved?.answer === answer && saved.isCorrect === isCorrect) return previous;
      return {
        ...previous,
        knowledgeChecks: {
          ...previous.knowledgeChecks,
          [stageId]: { answer, isCorrect, answeredAt: new Date().toISOString() },
        },
      };
    }, true);
  }, [updateState]);

  const isLessonCompleted = useCallback((lessonId) => state.completedLessons.includes(lessonId), [state.completedLessons]);

  const toggleLessonComplete = useCallback((lessonId) => {
    if (!catalog.lessonIds.includes(lessonId)) return;
    updateState((previous) => ({
      ...previous,
      completedLessons: previous.completedLessons.includes(lessonId)
        ? previous.completedLessons.filter((id) => id !== lessonId)
        : [...previous.completedLessons, lessonId],
    }), true);
  }, [updateState]);

  const isChecklistItemDone = useCallback((lessonId, itemIndex) => (
    state.checklistDone[`${lessonId}_${itemIndex}`] || false
  ), [state.checklistDone]);

  const toggleChecklistItem = useCallback((lessonId, itemIndex) => {
    const lesson = lessons.find((item) => item.id === lessonId);
    if (!lesson || !Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex >= (lesson.assignment?.checklist?.length || 0)) return;
    const key = `${lessonId}_${itemIndex}`;
    updateState((previous) => ({ ...previous, checklistDone: { ...previous.checklistDone, [key]: !previous.checklistDone[key] } }), true);
  }, [updateState]);

  const submitProject = useCallback((projectId, submission) => {
    if (!catalog.projectIds.includes(projectId) || !submission || typeof submission.repoUrl !== 'string' || !submission.repoUrl.trim()) return;
    updateState((previous) => ({
      ...previous,
      projectSubmissions: {
        ...previous.projectSubmissions,
        [projectId]: {
          repoUrl: submission.repoUrl.trim(),
          liveUrl: typeof submission.liveUrl === 'string' ? submission.liveUrl.trim() : '',
          submittedAt: new Date().toISOString(),
        },
      },
    }), true);
  }, [updateState]);

  const getProjectSubmission = useCallback((projectId) => state.projectSubmissions[projectId] || null, [state.projectSubmissions]);

  const getCourseProgress = useCallback((courseId) => {
    const course = curriculum.find((item) => item.id === courseId);
    if (!course) return { total: 0, completed: 0, percentage: 0 };
    const courseLessons = course.modules.flatMap((module) => module.lessons || []);
    const courseProjects = course.modules.flatMap((module) => module.projects || []);
    const total = courseLessons.length + courseProjects.length;
    const completed = courseLessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length
      + courseProjects.filter((project) => state.projectSubmissions[project.id]).length;
    return { total, completed, percentage: total ? Math.round(completed / total * 100) : 0 };
  }, [state.completedLessons, state.projectSubmissions]);

  const toggleTheme = useCallback(() => {
    updateState((previous) => ({ ...previous, theme: previous.theme === 'dark' ? 'light' : 'dark' }));
  }, [updateState]);

  const exportProgress = useCallback(() => exportProgressBackup({
    ...stateRef.current,
    streak: getStreak(stateRef.current.activityDays),
  }), []);

  const importProgress = useCallback((json) => {
    const result = importProgressBackup(getStorage(), json, stateRef.current, catalog, recoveryRawRef.current);
    if (!result.success) return { success: false, error: result.error };
    stateRef.current = result.progress;
    recoveryRawRef.current = null;
    setStorageError(null);
    setState(result.progress);
    return { success: true };
  }, []);

  return (
    <ProgressContext.Provider value={{
      completedStages: state.completedStages,
      currentStageId: state.currentStageId,
      knowledgeChecks: state.knowledgeChecks,
      xp: state.xp,
      streak: getStreak(state.activityDays),
      theme: state.theme,
      storageError,
      isStageUnlocked,
      isStageCompleted,
      visitStage,
      completeStage,
      saveStageFiles,
      getStageFiles,
      hasStageDraft,
      resetStageFiles,
      saveKnowledgeCheck,
      isLessonCompleted,
      toggleLessonComplete,
      isChecklistItemDone,
      toggleChecklistItem,
      submitProject,
      getProjectSubmission,
      getCourseProgress,
      toggleTheme,
      exportProgress,
      importProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress deve ser usado dentro de ProgressProvider');
  return context;
}
