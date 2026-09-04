import React, { createContext, useContext, useState, useEffect } from 'react';
import { roadmapCourse } from '../data/roadmapData';
import { curriculum } from '../data/curriculum';

const ProgressContext = createContext(null);
const STORAGE_KEY = 'devpath_roadmap_progress_v2';
const CHALLENGE_CONTENT_VERSION = 2;

export function ProgressProvider({ children }) {
  const [state, setState] = useState(() => {
    const defaultState = {
      completedStages: [],
      currentStageId: roadmapCourse?.stages?.[0]?.id || 'js-1-variables-and-types',
      stageFiles: {},
      challengeContentVersion: CHALLENGE_CONTENT_VERSION,
      completedLessons: [],
      checklistDone: {},
      projectSubmissions: {},
      xp: 0,
      streak: 1,
      theme: 'dark'
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const validIds = new Set(roadmapCourse?.stages?.map((s) => s.id) || []);
          const completed = Array.isArray(parsed.completedStages)
            ? parsed.completedStages.filter((id) => validIds.has(id))
            : [];
          
          const currentStageValid = validIds.has(parsed.currentStageId);

          const hasCurrentChallengeContent = parsed.challengeContentVersion === CHALLENGE_CONTENT_VERSION;

          return {
            ...defaultState,
            ...parsed,
            // A versão anterior abria vários desafios com a solução pronta.
            // Invalidamos somente esse progresso e preservamos lições/projetos.
            completedStages: hasCurrentChallengeContent ? completed : [],
            currentStageId: hasCurrentChallengeContent && currentStageValid ? parsed.currentStageId : defaultState.currentStageId,
            stageFiles: hasCurrentChallengeContent && parsed.stageFiles && typeof parsed.stageFiles === 'object' ? parsed.stageFiles : {},
            challengeContentVersion: CHALLENGE_CONTENT_VERSION,
            completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
            checklistDone: parsed.checklistDone && typeof parsed.checklistDone === 'object' ? parsed.checklistDone : {},
            projectSubmissions: parsed.projectSubmissions && typeof parsed.projectSubmissions === 'object' ? parsed.projectSubmissions : {},
            xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
            streak: typeof parsed.streak === 'number' ? parsed.streak : 1
          };
        }
      }
    } catch (e) {
      console.error('Erro ao ler progresso do localStorage:', e);
    }
    return defaultState;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Erro ao salvar progresso no localStorage:', e);
    }
  }, [state]);

  // Verifica se uma etapa está desbloqueada
  // ==========================================
  // MÉTODOS DO ROADMAP & PLAYGROUND
  // ==========================================

  const isStageUnlocked = (stageId) => {
    const stage = roadmapCourse?.stages?.find((s) => s.id === stageId);
    if (!stage) return false;
    if (!stage.dependencies || stage.dependencies.length === 0) return true;
    return stage.dependencies.every((depId) => state.completedStages.includes(depId));
  };

  const isStageCompleted = (stageId) => {
    return Array.isArray(state.completedStages) && state.completedStages.includes(stageId);
  };

  // Concluir uma etapa
  const completeStage = (stageId) => {
    setState((prev) => {
      if (prev.completedStages.includes(stageId)) return prev;

      const newCompleted = [...prev.completedStages, stageId];
      const stages = roadmapCourse?.stages || [];
      const currentIdx = stages.findIndex((s) => s.id === stageId);
      const nextStage = stages[currentIdx + 1];

      return {
        ...prev,
        completedStages: newCompleted,
        currentStageId: nextStage ? nextStage.id : stageId,
        xp: prev.xp + 25
      };
    });
  };

  // Salva o código que o aluno editou
  const saveStageFiles = (stageId, files) => {
    setState((prev) => ({
      ...prev,
      stageFiles: {
        ...(prev.stageFiles || {}),
        [stageId]: files
      }
    }));
  };

  // Recupera os arquivos da etapa (ou o starter padrão)
  const getStageFiles = (stageId) => {
    const stage = roadmapCourse?.stages?.find((s) => s.id === stageId);
    if (!stage) return {};
    if (state.stageFiles && state.stageFiles[stageId]) {
      return state.stageFiles[stageId];
    }
    return stage.playground?.files || {};
  };

  // Reseta os arquivos para o código original
  const resetStageFiles = (stageId) => {
    setState((prev) => {
      const newFiles = { ...(prev.stageFiles || {}) };
      delete newFiles[stageId];
      return { ...prev, stageFiles: newFiles };
    });
  };

  // Alterna tema claro / escuro
  // ==========================================
  // MÉTODOS DO CURRÍCULO (ODIN PROJECT STYLE)
  // ==========================================

  const isLessonCompleted = (lessonId) => {
    return state.completedLessons?.includes(lessonId) || false;
  };

  const toggleLessonComplete = (lessonId) => {
    setState((prev) => {
      const current = prev.completedLessons || [];
      const exists = current.includes(lessonId);
      const updated = exists ? current.filter((id) => id !== lessonId) : [...current, lessonId];
      return {
        ...prev,
        completedLessons: updated,
        xp: exists ? Math.max(0, prev.xp - 15) : prev.xp + 15
      };
    });
  };

  const isChecklistItemDone = (lessonId, itemIndex) => {
    const key = `${lessonId}_${itemIndex}`;
    return state.checklistDone?.[key] || false;
  };

  const toggleChecklistItem = (lessonId, itemIndex) => {
    const key = `${lessonId}_${itemIndex}`;
    setState((prev) => ({
      ...prev,
      checklistDone: {
        ...(prev.checklistDone || {}),
        [key]: !prev.checklistDone?.[key]
      }
    }));
  };

  const submitProject = (projectId, submission) => {
    setState((prev) => ({
      ...prev,
      projectSubmissions: {
        ...(prev.projectSubmissions || {}),
        [projectId]: {
          ...submission,
          submittedAt: new Date().toISOString()
        }
      },
      xp: prev.xp + 50
    }));
  };

  const getProjectSubmission = (projectId) => {
    return state.projectSubmissions?.[projectId] || null;
  };

  const getCourseProgress = (courseId) => {
    const course = curriculum.find((c) => c.id === courseId);
    if (!course) return { total: 0, completed: 0, percentage: 0 };

    let totalItems = 0;
    let completedItems = 0;

    course.modules.forEach((mod) => {
      if (mod.lessons) {
        totalItems += mod.lessons.length;
        mod.lessons.forEach((l) => {
          if (state.completedLessons?.includes(l.id)) completedItems++;
        });
      }
      if (mod.projects) {
        totalItems += mod.projects.length;
        mod.projects.forEach((p) => {
          if (state.projectSubmissions?.[p.id]) completedItems++;
        });
      }
    });

    const percentage = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
    return { total: totalItems, completed: completedItems, percentage };
  };

  const toggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        completedStages: state.completedStages,
        currentStageId: state.currentStageId,
        xp: state.xp,
        streak: state.streak,
        theme: state.theme,
        isStageUnlocked,
        isStageCompleted,
        completeStage,
        saveStageFiles,
        getStageFiles,
        resetStageFiles,
        isLessonCompleted,
        toggleLessonComplete,
        isChecklistItemDone,
        toggleChecklistItem,
        submitProject,
        getProjectSubmission,
        getCourseProgress,
        toggleTheme
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress deve ser usado dentro de ProgressProvider');
  }
  return context;
}
