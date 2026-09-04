import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Compass, BookOpen, Clock, ArrowLeft, CheckCircle2, Circle, ArrowRight, Code2, ExternalLink } from 'lucide-react';
import { curriculum } from '../data/curriculum';
import { useProgress } from '../context/ProgressContext';

export default function CoursePage() {
  const { courseSlug } = useParams();
  const navigate = useNavigate();
  const { isLessonCompleted, getProjectSubmission, getCourseProgress } = useProgress();

  const course = curriculum.find((c) => c.slug === courseSlug);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-2">Curso não encontrado</h2>
        <Link to="/" className="text-emerald-400 hover:underline">Voltar para a página inicial</Link>
      </div>
    );
  }

  const progress = getCourseProgress(course.id);

  return (
    <div className="min-h-screen bg-[#090d16] text-gray-100 flex flex-col">
      {/* Header do Curso */}
      <section className="border-b border-gray-800 bg-gray-900/50 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-emerald-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para todos os cursos</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl p-3.5 rounded-2xl bg-gray-800/80 border border-gray-700/60 shadow-lg shrink-0">
                {course.icon}
              </span>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                  {course.level} • ~{course.estimatedHours} horas
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{course.title}</h1>
                <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Barra de Progresso do Curso */}
            <div className="bg-gray-800/60 border border-gray-700/60 rounded-xl p-4 min-w-[220px] shrink-0">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-gray-300 font-medium">Progresso do Curso</span>
                <span className="font-bold text-emerald-400">{progress.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="text-[11px] text-gray-400 text-right">
                {progress.completed} de {progress.total} itens concluídos
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Módulos e Lições */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-10">
        {course.modules.map((module) => (
          <div key={module.id} className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-800 bg-gray-900/90">
              <h2 className="text-xl font-bold text-white tracking-tight">{module.title}</h2>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">{module.overview}</p>
            </div>

            <div className="divide-y divide-gray-800/60">
              {/* Lições */}
              {module.lessons.map((lesson, idx) => {
                const completed = isLessonCompleted(lesson.id);

                return (
                  <Link
                    key={lesson.id}
                    to={`/curso/${course.slug}/licao/${lesson.id}`}
                    className="flex items-center justify-between p-5 hover:bg-gray-800/40 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="shrink-0">
                        {completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-600 group-hover:text-gray-400 transition-colors" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500">Lição {idx + 1}</span>
                          <span className="text-xs text-gray-500">• {lesson.readingTimeMinutes} min de estudo</span>
                        </div>
                        <h3 className={`text-base font-semibold truncate transition-colors ${
                          completed ? 'text-gray-300 line-through decoration-emerald-500/50' : 'text-white group-hover:text-emerald-400'
                        }`}>
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate mt-0.5 max-w-xl">
                          {lesson.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {completed && (
                        <span className="hidden sm:inline-flex text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          Concluída
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                );
              })}

              {/* Projetos do Módulo */}
              {module.projects && module.projects.map((project) => {
                const submission = getProjectSubmission(project.id);
                const isDone = !!submission;

                return (
                  <Link
                    key={project.id}
                    to={`/curso/${course.slug}/projeto/${project.id}`}
                    className="flex items-center justify-between p-5 bg-emerald-950/20 hover:bg-emerald-950/30 border-t-2 border-emerald-500/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                        <Code2 className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                            PROJETO MÃO NA MASSA
                          </span>
                          <span className="text-xs text-gray-500">• ~{project.estimatedTimeHours}h estimadas</span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {project.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate mt-0.5 max-w-xl">
                          {project.overview}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      {isDone ? (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Entregue</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-gray-200 bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                          <span>Construir</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

