import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, Circle, ExternalLink, BookOpen, Clock, 
  CheckSquare, ArrowRight, Share2, Sparkles, AlertCircle, ChevronRight 
} from 'lucide-react';
import { curriculum } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';

export default function LessonPage() {
  const { courseSlug, lessonId } = useParams();
  const navigate = useNavigate();
  const { 
    isLessonCompleted, 
    toggleLessonComplete, 
    isChecklistItemDone, 
    toggleChecklistItem 
  } = useProgress();

  const course = curriculum.find((c) => c.slug === courseSlug);
  if (!course) return <div>Curso não encontrado</div>;

  // Encontra a lição atual e o módulo correspondente
  let currentLesson = null;
  let currentModule = null;
  let prevItem = null;
  let nextItem = null;

  // Monta lista linear para navegação Próximo / Anterior
  const allItems = [];
  course.modules.forEach((mod) => {
    mod.lessons.forEach((l) => allItems.push({ type: 'lesson', data: l, modId: mod.id }));
    mod.projects.forEach((p) => allItems.push({ type: 'project', data: p, modId: mod.id }));
  });

  const currentIndex = allItems.findIndex((item) => item.data.id === lessonId);
  if (currentIndex !== -1) {
    currentLesson = allItems[currentIndex].data;
    currentModule = course.modules.find((m) => m.id === allItems[currentIndex].modId);
    prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
    nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;
  }

  if (!currentLesson) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-2">Lição não encontrada</h2>
        <Link to={`/curso/${courseSlug}`} className="text-emerald-400 hover:underline">
          Voltar para o curso
        </Link>
      </div>
    );
  }

  const isCompleted = isLessonCompleted(currentLesson.id);

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col">
      {/* Barra de Topo com Breadcrumbs */}
      <div className="border-b border-gray-800 bg-gray-900/70 px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-white transition-colors">Cursos</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link to={`/curso/${course.slug}`} className="hover:text-white transition-colors">{course.title}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-emerald-400 font-medium truncate">{currentLesson.title}</span>
        </div>

        <button
          onClick={() => toggleLessonComplete(currentLesson.id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            isCompleted
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
          <span>{isCompleted ? 'Concluída' : 'Marcar Concluída'}</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-10">
        {/* Cabeçalho da Lição */}
        <div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span className="font-semibold text-emerald-400 uppercase tracking-wider">{currentModule?.title}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentLesson.readingTimeMinutes} min de leitura</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {currentLesson.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed bg-gray-900/60 p-5 rounded-xl border border-gray-800">
            {currentLesson.summary}
          </p>
        </div>

        {/* O que você vai aprender */}
        <section className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Objetivos de Aprendizado
          </h2>
          <ul className="space-y-2.5">
            {currentLesson.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recursos Curados (Odin Project Style) */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Recursos Curados para Estudo
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Não reinventamos a roda. Abaixo estão os melhores materiais gratuitos da web, selecionados e organizados para esta etapa.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentLesson.externalResources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 hover:border-emerald-500/50 hover:bg-gray-900 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {res.source}
                    </span>
                    <span className="text-[11px] text-gray-500 uppercase font-semibold">
                      {res.type === 'reading' ? '📖 Leitura' : res.type === 'video' ? '📺 Vídeo' : '💻 Interativo'}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {res.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-2xl">
                    {res.summary}
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Abrir Documentação</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Tarefa Mão na Massa com Checklist */}
        <section className="bg-gradient-to-br from-emerald-950/20 to-gray-900/60 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Exercício Prático
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              {currentLesson.assignment.title}
            </h2>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              {currentLesson.assignment.instructions}
            </p>
          </div>

          {/* Checklist interativo */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Checklist de Conclusão Prática:
            </div>
            {currentLesson.assignment.checklist.map((item, idx) => {
              const done = isChecklistItemDone(currentLesson.id, idx);

              return (
                <button
                  key={idx}
                  onClick={() => toggleChecklistItem(currentLesson.id, idx)}
                  className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                    done
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                      : 'bg-gray-900/80 border-gray-800 text-gray-300 hover:border-gray-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <span className={`text-sm ${done ? 'line-through text-gray-400' : 'text-gray-200'}`}>
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Botão de Marcar Lição como Concluída */}
          <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-gray-400">
              Marque os itens do checklist acima antes de avançar para a próxima etapa.
            </div>
            <button
              onClick={() => toggleLessonComplete(currentLesson.id)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Lição Concluída! (Desmarcar)' : 'Concluir Lição'}</span>
            </button>
          </div>
        </section>

        {/* Rodapé de Navegação Anterior / Próximo */}
        <div className="border-t border-gray-800 pt-8 flex items-center justify-between gap-4">
          {prevItem ? (
            <Link
              to={
                prevItem.type === 'lesson'
                  ? `/curso/${course.slug}/licao/${prevItem.data.id}`
                  : `/curso/${course.slug}/projeto/${prevItem.data.id}`
              }
              className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <div className="text-left">
                <span className="block text-[10px] uppercase font-bold text-gray-500">Anterior</span>
                <span className="truncate max-w-[200px] block">{prevItem.data.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextItem ? (
            <Link
              to={
                nextItem.type === 'lesson'
                  ? `/curso/${course.slug}/licao/${nextItem.data.id}`
                  : `/curso/${course.slug}/projeto/${nextItem.data.id}`
              }
              className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors ml-auto"
            >
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-gray-500">Próximo</span>
                <span className="truncate max-w-[200px] block">{nextItem.data.title}</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

