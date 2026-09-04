import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  FolderKanban,
  LockKeyhole,
  Play,
  TerminalSquare,
} from 'lucide-react';
import { jsRoadmapCourse } from '../data/roadmapData';
import { useProgress } from '../context/ProgressContext';

const cleanTitle = (title) => title.replace(/^[^\p{L}\p{N}]+/u, '');
const cleanModuleName = (name) => name.replace(/^\d+\.\s*/, '');

export default function RoadmapPage() {
  const { completedStages, isStageUnlocked, isStageCompleted } = useProgress();
  const stages = jsRoadmapCourse.stages;
  const completedCount = completedStages.length;
  const progressPct = Math.round((completedCount / stages.length) * 100);
  const totalMinutes = stages.reduce((total, stage) => total + stage.estimatedMinutes, 0);
  const nextStage = stages.find((stage) => isStageUnlocked(stage.id) && !isStageCompleted(stage.id)) || stages.at(-1);
  const currentModuleId = nextStage?.moduleId || jsRoadmapCourse.modules[0].id;
  const [openModules, setOpenModules] = useState(() => new Set([currentModuleId]));

  const modules = jsRoadmapCourse.modules.map((module, moduleIndex) => {
    const moduleStages = stages.filter((stage) => stage.moduleId === module.id);
    const done = moduleStages.filter((stage) => isStageCompleted(stage.id)).length;
    return {
      ...module,
      index: moduleIndex,
      stages: moduleStages,
      done,
      percentage: Math.round((done / moduleStages.length) * 100),
      minutes: moduleStages.reduce((sum, stage) => sum + stage.estimatedMinutes, 0),
    };
  });

  const toggleModule = (moduleId) => {
    setOpenModules((current) => {
      const updated = new Set(current);
      if (updated.has(moduleId)) updated.delete(moduleId);
      else updated.add(moduleId);
      return updated;
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f7f7f5] text-neutral-950">
      <main>
        <section className="border-b border-neutral-200">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div>
              <div className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                <span className="h-px w-8 bg-neutral-950" />
                Formação JavaScript · 2026
              </div>
              <h1 className="max-w-4xl text-[clamp(3rem,7vw,6.7rem)] font-black leading-[0.9] tracking-[-0.07em]">
                Aprenda código.<br />Construa de verdade.
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                Uma formação prática do primeiro <code className="border border-neutral-300 bg-white px-1.5 py-0.5 font-mono text-sm text-neutral-950">const</code> até uma aplicação completa. Leia o essencial, programe no navegador e valide cada passo.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to={`/playground/${nextStage.id}`} className="inline-flex h-12 items-center gap-3 bg-neutral-950 px-5 text-sm font-bold text-white transition hover:bg-neutral-700">
                  <Play className="h-4 w-4 fill-current" />
                  {completedCount ? 'Continuar formação' : 'Começar a primeira aula'}
                </Link>
                <a href="#trilha" className="inline-flex h-12 items-center gap-2 border border-neutral-300 bg-white px-5 text-sm font-bold transition hover:border-neutral-950">
                  Ver programa <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <aside className="border border-neutral-300 bg-white p-6 sm:p-7" aria-label="Seu progresso">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">Próxima aula</p>
                  <h2 className="mt-3 text-xl font-bold leading-tight tracking-[-0.025em]">{cleanTitle(nextStage.title)}</h2>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-neutral-300 font-mono text-sm font-bold">{String(nextStage.stepNumber).padStart(2, '0')}</span>
              </div>
              <div className="mt-7">
                <div className="mb-2 flex justify-between text-xs text-neutral-500"><span>{completedCount} de {stages.length} aulas</span><span className="font-bold text-neutral-950">{progressPct}%</span></div>
                <div className="h-2 bg-neutral-100"><div className="h-full bg-neutral-950 transition-[width] duration-500" style={{ width: `${progressPct}%` }} /></div>
              </div>
              <div className="mt-6 grid grid-cols-3 border-t border-neutral-200 pt-5 text-center">
                <div className="border-r border-neutral-200"><strong className="block text-xl tracking-tight">{jsRoadmapCourse.modules.length}</strong><span className="text-[10px] uppercase tracking-wider text-neutral-500">Módulos</span></div>
                <div className="border-r border-neutral-200"><strong className="block text-xl tracking-tight">{stages.length}</strong><span className="text-[10px] uppercase tracking-wider text-neutral-500">Desafios</span></div>
                <div><strong className="block text-xl tracking-tight">{Math.ceil(totalMinutes / 60)}h</strong><span className="text-[10px] uppercase tracking-wider text-neutral-500">Prática</span></div>
              </div>
            </aside>
          </div>
        </section>

        <section id="metodo" className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 md:grid-cols-3">
              {[
                { number: '01', icon: BookOpen, title: 'Aprenda o essencial', text: 'Teoria curta, exemplos comentados e referências confiáveis.' },
                { number: '02', icon: Code2, title: 'Pratique no editor', text: 'Monaco Editor, arquivos reais e preview no próprio navegador.' },
                { number: '03', icon: TerminalSquare, title: 'Valide e avance', text: 'Testes automáticos, feedback imediato e checkpoints por módulo.' },
              ].map((item) => (
                <div key={item.number} className="bg-white p-6 sm:p-8">
                  <div className="flex items-center justify-between"><item.icon className="h-5 w-5" strokeWidth={1.7} /><span className="font-mono text-[10px] text-neutral-400">{item.number}</span></div>
                  <h3 className="mt-8 text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trilha" className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-24">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Roadmap completo</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">Do zero ao deploy.</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-500">Siga a ordem recomendada. Uma nova aula é liberada quando o desafio anterior é validado.</p>
            <div className="mt-8 space-y-2">
              {modules.map((module) => (
                <button key={module.id} type="button" onClick={() => { setOpenModules((current) => new Set(current).add(module.id)); document.getElementById(module.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} className="flex w-full items-center gap-3 py-1.5 text-left text-xs text-neutral-500 transition hover:text-neutral-950">
                  <span className={`h-1.5 w-1.5 ${module.percentage === 100 ? 'bg-neutral-950' : 'border border-neutral-400'}`} />
                  <span className="min-w-0 flex-1 truncate">{cleanModuleName(module.name)}</span>
                  <span className="font-mono text-[10px]">{module.done}/{module.stages.length}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-4">
            {modules.map((module) => {
              const isOpen = openModules.has(module.id);
              const moduleLocked = !module.stages.some((stage) => isStageUnlocked(stage.id));
              return (
                <article id={module.id} key={module.id} className="scroll-mt-28 border border-neutral-300 bg-white">
                  <button type="button" onClick={() => toggleModule(module.id)} className="flex w-full items-center gap-5 p-5 text-left sm:p-6" aria-expanded={isOpen}>
                    <span className="font-mono text-xs text-neutral-400">{String(module.index + 1).padStart(2, '0')}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold tracking-[-0.025em]">{cleanModuleName(module.name)}</h3>
                        {module.percentage === 100 && <span className="border border-neutral-950 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">Concluído</span>}
                        {module.id === currentModuleId && module.percentage !== 100 && <span className="bg-neutral-950 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Em curso</span>}
                      </div>
                      <p className="mt-1 truncate text-xs text-neutral-500">{module.desc}</p>
                    </div>
                    <div className="hidden items-center gap-6 text-[11px] text-neutral-500 sm:flex"><span>{module.stages.length} aulas</span><span>{module.minutes} min</span></div>
                    {moduleLocked ? <LockKeyhole className="h-4 w-4 text-neutral-400" /> : <ChevronDown className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} />}
                  </button>
                  <div className="h-1 bg-neutral-100"><div className="h-full bg-neutral-950 transition-[width]" style={{ width: `${module.percentage}%` }} /></div>

                  {isOpen && (
                    <div className="border-t border-neutral-200">
                      {module.stages.map((stage, stageIndex) => {
                        const completed = isStageCompleted(stage.id);
                        const unlocked = isStageUnlocked(stage.id);
                        const current = nextStage?.id === stage.id && !completed;
                        const isProject = stage.isCapstone || stage.category.toLowerCase().includes('projeto');
                        const isCheckpoint = stageIndex === module.stages.length - 1;
                        const row = (
                          <>
                            <span className={`grid h-9 w-9 shrink-0 place-items-center border text-xs font-bold ${completed ? 'border-neutral-950 bg-neutral-950 text-white' : 'border-neutral-300 text-neutral-500'}`}>
                              {completed ? <Check className="h-4 w-4" /> : unlocked ? String(stage.stepNumber).padStart(2, '0') : <LockKeyhole className="h-3.5 w-3.5" />}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className={`text-sm font-semibold ${unlocked ? 'text-neutral-950' : 'text-neutral-400'}`}>{cleanTitle(stage.title)}</h4>
                                {current && <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">A seguir</span>}
                                {isProject && <span className="border border-neutral-300 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">Projeto</span>}
                              </div>
                              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                                <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> Aula + desafio</span>
                                <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {stage.estimatedMinutes} min</span>
                                {isCheckpoint && <span className="inline-flex items-center gap-1"><FolderKanban className="h-3 w-3" /> Checkpoint do módulo</span>}
                              </div>
                            </div>
                            {unlocked && <ArrowRight className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-950" />}
                          </>
                        );
                        return unlocked ? (
                          <Link key={stage.id} to={`/playground/${stage.id}`} className={`group flex items-center gap-4 border-b border-neutral-200 p-4 transition last:border-b-0 hover:bg-neutral-50 sm:px-6 ${current ? 'bg-[#f7f7f5]' : ''}`}>{row}</Link>
                        ) : (
                          <div key={stage.id} className="flex items-center gap-4 border-b border-neutral-200 p-4 opacity-70 last:border-b-0 sm:px-6">{row}</div>
                        );
                      })}
                    </div>
                  )}
                </article>
              );
            })}

            <article id="projeto-final" className="scroll-mt-28 border border-neutral-950 bg-neutral-950 p-6 text-white sm:p-8">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Projeto final · Capstone</p>
                  <h3 className="mt-3 max-w-2xl text-2xl font-black tracking-[-0.035em]">Uma aplicação completa, não mais um exercício isolado.</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">Arrays, DOM, eventos, persistência e arquitetura reunidos num gerenciador de tarefas pronto para portfólio.</p>
                </div>
                <Link to="/playground/js-17-grand-capstone-app" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 bg-white px-4 text-xs font-bold text-neutral-950 transition hover:bg-neutral-200">Ver projeto <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span className="font-bold text-neutral-950">DEVPATH</span><span>Aprenda · Pratique · Valide · Construa</span></div>
      </footer>
    </div>
  );
}
