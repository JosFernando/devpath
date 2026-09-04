import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle2, ChevronRight, Code2, Clock, 
  HelpCircle, ChevronDown, ChevronUp, Globe, Send, Sparkles, ExternalLink 
} from 'lucide-react';
import { curriculum } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function ProjectPage() {
  const { courseSlug, projectId } = useParams();
  const { getProjectSubmission, submitProject } = useProgress();

  const [expandedHints, setExpandedHints] = useState({});
  const [repoUrl, setRepoUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  const course = curriculum.find((c) => c.slug === courseSlug);
  if (!course) return <div>Curso não encontrado</div>;

  let currentProject = null;
  let currentModule = null;

  course.modules.forEach((mod) => {
    const p = mod.projects?.find((item) => item.id === projectId);
    if (p) {
      currentProject = p;
      currentModule = mod;
    }
  });

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-2">Projeto não encontrado</h2>
        <Link to={`/curso/${courseSlug}`} className="text-emerald-400 hover:underline">Voltar para o curso</Link>
      </div>
    );
  }

  const existingSubmission = getProjectSubmission(currentProject.id);

  const toggleHint = (step) => {
    setExpandedHints((prev) => ({
      ...prev,
      [step]: !prev[step]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!repoUrl.trim()) return;

    submitProject(currentProject.id, {
      repoUrl: repoUrl.trim(),
      liveUrl: liveUrl.trim()
    });

    setSubmittedFeedback(true);
    setTimeout(() => setSubmittedFeedback(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col">
      {/* Breadcrumbs */}
      <div className="border-b border-gray-800 bg-gray-900/70 px-4 sm:px-8 py-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-white transition-colors">Cursos</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <Link to={`/curso/${course.slug}`} className="hover:text-white transition-colors">{course.title}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
          <span className="text-emerald-400 font-medium truncate">{currentProject.title}</span>
        </div>

        {existingSubmission && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Projeto Entregue</span>
          </span>
        )}
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-10">
        {/* Cabeçalho do Projeto */}
        <div>
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span className="font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Projeto de Encerramento
            </span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>~{currentProject.estimatedTimeHours}h estimadas</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {currentProject.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
            {currentProject.overview}
          </p>
        </div>

        {/* O que você vai praticar */}
        <section className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Conceitos Testados Neste Projeto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentProject.learningGoals.map((goal, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-300 bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
                <span className="text-emerald-400 font-bold shrink-0">✓</span>
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Requisitos Obrigatórios */}
        <section className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              📋 Requisitos de Aceitação (O que deve fazer)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Seu projeto só estará pronto para entrega quando cumprir todos os critérios abaixo.
            </p>
          </div>

          <ul className="space-y-3 pt-2">
            {currentProject.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-200 bg-gray-950/60 p-3.5 rounded-xl border border-gray-800">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>

          {currentProject.bonusTasks && currentProject.bonusTasks.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                ⭐ Desafios Extras (Opcional para ir além):
              </h3>
              <ul className="space-y-2">
                {currentProject.bonusTasks.map((bonus, i) => (
                  <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                    <span className="text-amber-400">★</span>
                    <span>{bonus}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Dicas Progressivas (Spoiler Accordions) */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              Dicas Progressivas (Sem dar a solução pronta)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Ficou travado? Abra as dicas uma a uma. Cada dica aponta a direção conceitual sem entregar o código pronto.
            </p>
          </div>

          <div className="space-y-3">
            {currentProject.progressiveHints.map((hintObj) => {
              const isExpanded = !!expandedHints[hintObj.step];

              return (
                <div
                  key={hintObj.step}
                  className="rounded-xl border border-gray-800 bg-gray-900/70 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleHint(hintObj.step)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-800/40 transition-colors"
                  >
                    <span className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="text-amber-400 font-bold">{hintObj.title}</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-4 pt-0 text-sm text-gray-300 leading-relaxed border-t border-gray-800/60 bg-gray-950/40">
                      <p className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs sm:text-sm">
                        {hintObj.hint}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Formulário de Submissão do Projeto */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-950 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Entrega do Projeto
            </span>
            <h2 className="text-xl font-bold text-white mt-1">
              Submeta seu Repositório do GitHub
            </h2>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              {currentProject.submission.instructions}
            </p>
          </div>

          {existingSubmission ? (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Projeto Submetido com Sucesso!</span>
              </div>
              <div className="text-xs text-gray-300 flex flex-col gap-1">
                <div>
                  <strong>Repositório:</strong>{' '}
                  <a
                    href={existingSubmission.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 underline"
                  >
                    {existingSubmission.repoUrl}
                  </a>
                </div>
                {existingSubmission.liveUrl && (
                  <div>
                    <strong>Deploy ao Vivo:</strong>{' '}
                    <a
                      href={existingSubmission.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 underline"
                    >
                      {existingSubmission.liveUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <GithubIcon className="w-4 h-4 text-gray-400" />
                  <span>Link do Repositório no GitHub *</span>
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/seu-usuario/meu-projeto-todo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  required
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span>Link do Deploy / Demonstração ao Vivo (Opcional)</span>
                </label>
                <input
                  type="url"
                  placeholder="https://meu-projeto-todo.vercel.app ou GitHub Pages"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Marcar Projeto como Entregue</span>
              </button>
            </form>
          )}

          {submittedFeedback && (
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold animate-pulse">
              🎉 Parabéns! Sua entrega foi gravada com sucesso no seu histórico de progresso!
            </div>
          )}
        </section>

        {/* Voltar ao Curso */}
        <div className="pt-4 border-t border-gray-800">
          <Link
            to={`/curso/${course.slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a grade do curso</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
