import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, BookOpen, Clock, ArrowRight, CheckCircle2, Star, Sparkles, Layers, ShieldCheck, Code2 } from 'lucide-react';
import { curriculum } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';

export default function HomePage() {
  const { getCourseProgress, isLessonCompleted, getProjectSubmission } = useProgress();

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-gray-800/80 bg-gradient-to-b from-gray-900/60 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Filosofia The Odin Project • 100% Gratuito & Aberto
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Aprenda a programar construindo <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">projetos reais</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
            Nada de quizzes de memorização ou tutoriais passivos. Um currículo estruturado que combina a melhor documentação aberta da internet (MDN, The Odin Project, freeCodeCamp) com projetos práticos do início ao fim.
          </p>

          {/* Destaques da Filosofia */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Aprender Fazendo</h4>
                <p className="text-xs text-gray-400 mt-0.5">Toda lição encerra com mãos no código e projetos.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Progressão em Espiral</h4>
                <p className="text-xs text-gray-400 mt-0.5">Conceitos revisitados em projetos cada vez mais complexos.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-900/50 border border-gray-800">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Erros e Debugging</h4>
                <p className="text-xs text-gray-400 mt-0.5">Aprender a ler erros e investigar como um dev de verdade.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção da Trilha de Cursos */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Trilha de Aprendizado</h2>
            <p className="text-sm text-gray-400 mt-1">Siga a ordem recomendada para construir uma base sólida.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {curriculum.map((course, idx) => {
            const progress = getCourseProgress(course.id);
            const isLocked = course.modules.length === 0;

            return (
              <div
                key={course.id}
                className={`rounded-2xl border transition-all flex flex-col justify-between ${
                  !isLocked
                    ? 'bg-gray-900/70 border-gray-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20'
                    : 'bg-gray-900/30 border-gray-800/40 opacity-70'
                }`}
              >
                <div className="p-6">
                  {/* Cabeçalho do Card */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="text-3xl p-3 rounded-2xl bg-gray-800/80 border border-gray-700/60 shadow-inner">
                      {course.icon}
                    </span>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        course.level === 'Iniciante'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : course.level === 'Intermédio'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      }`}
                    >
                      {course.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-6">
                    {course.description}
                  </p>

                  {/* Informações Rápidas */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>~{course.estimatedHours}h estimadas</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>{course.level}</span>
                    </div>
                  </div>

                  {/* Módulos incluídos (se houver) */}
                  {!isLocked && course.modules.length > 0 && (
                    <div className="space-y-2 border-t border-gray-800/80 pt-4">
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Conteúdo do Curso:
                      </div>
                      {course.modules.map((mod) => (
                        <div key={mod.id} className="text-xs text-gray-300 flex items-center justify-between">
                          <span className="truncate pr-2">{mod.title}</span>
                          <span className="text-gray-500 shrink-0">
                            {mod.lessons.length} lições • {mod.projects.length} projeto
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rodapé do Card com Progresso e Botão */}
                <div className="p-6 border-t border-gray-800/80 bg-gray-950/40 rounded-b-2xl">
                  {!isLocked ? (
                    <div>
                      <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-gray-400">Progresso</span>
                        <span className="font-bold text-emerald-400">{progress.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <Link
                        to={`/curso/${course.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-950/40"
                      >
                        <span>{progress.percentage > 0 ? 'Continuar Curso' : 'Iniciar Curso'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        🔒 Disponível após concluir Fundamentos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rodapé */}
      <footer className="mt-auto border-t border-gray-800/80 py-8 bg-gray-950 text-gray-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p>DevPath — Plataforma educacional aberta baseada na metodologia do The Odin Project.</p>
          <p className="mt-1">Todo o conteúdo referenciado pertence aos seus respectivos mantenedores (MDN, The Odin Project, freeCodeCamp).</p>
        </div>
      </footer>
    </div>
  );
}

