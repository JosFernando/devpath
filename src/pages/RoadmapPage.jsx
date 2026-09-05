import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  ExternalLink,
  FolderKanban,
  LockKeyhole,
  Play,
  RotateCcw,
  Search,
  X,
  TerminalSquare,
} from 'lucide-react';
import { jsRoadmapCourse } from '../data/roadmapData';
import { useProgress } from '../context/ProgressContext';
import ProgressTools from '../components/common/ProgressTools';

const cleanTitle = (title) => title.replace(/^[^\p{L}\p{N}]+/u, '');
const cleanModuleName = (name) => name.replace(/^\d+\.\s*/, '');
const normalize = (value = '') => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const isProjectStage = (stage) => stage.isCapstone || normalize(stage.category).includes('projeto');
const formatDuration = (minutes) => minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h${minutes % 60 ? ` ${minutes % 60}min` : ''}`;

export default function RoadmapPage() {
  const { completedStages, currentStageId, isStageUnlocked, isStageCompleted, hasStageDraft } = useProgress();
  const stages = jsRoadmapCourse.stages;
  const completedCount = stages.filter((stage) => completedStages.includes(stage.id)).length;
  const progressPct = Math.round((completedCount / stages.length) * 100);
  const totalMinutes = stages.reduce((total, stage) => total + stage.estimatedMinutes, 0);
  const pendingStage = stages.find((stage) => isStageUnlocked(stage.id) && !isStageCompleted(stage.id));
  const savedStage = stages.find((stage) => stage.id === currentStageId && isStageUnlocked(stage.id) && !isStageCompleted(stage.id));
  const nextStage = savedStage || pendingStage || stages.at(-1);
  const projectCount = stages.filter(isProjectStage).length;
  const completedMinutes = stages.filter((stage) => isStageCompleted(stage.id)).reduce((total, stage) => total + stage.estimatedMinutes, 0);
  const capstoneStage = stages.filter((stage) => stage.isCapstone).at(-1);
  const currentModuleId = nextStage?.moduleId || jsRoadmapCourse.modules[0].id;
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [kind, setKind] = useState('all');
  const [duration, setDuration] = useState('all');
  const filtering = query.trim() !== '' || status !== 'all' || kind !== 'all' || duration !== 'all';
  const [openModules, setOpenModules] = useState(() => new Set([currentModuleId]));

  const modules = jsRoadmapCourse.modules.map((module, moduleIndex) => {
    const moduleStages = stages.filter((stage) => stage.moduleId === module.id);
    const done = moduleStages.filter((stage) => isStageCompleted(stage.id)).length;
    return {
      ...module,
      index: moduleIndex,
      stages: moduleStages,
      project: moduleStages.find((stage) => stage.id === module.projectStageId) || moduleStages.filter(isProjectStage).at(-1),
      done,
      percentage: moduleStages.length ? Math.round((done / moduleStages.length) * 100) : 0,
      minutes: moduleStages.reduce((sum, stage) => sum + stage.estimatedMinutes, 0),
    };
  });

  const phases = (jsRoadmapCourse.phases?.length ? jsRoadmapCourse.phases : [{
    id: 'formacao-completa',
    title: 'Do zero ao domínio',
    description: 'Construa uma base sólida, resolva desafios e reúna o que aprendeu em projetos completos.',
    moduleIds: modules.map((module) => module.id),
  }]).map((phase) => {
    const phaseModules = modules.filter((module) => phase.moduleIds.includes(module.id));
    const phaseStages = phaseModules.flatMap((module) => module.stages);
    const done = phaseStages.filter((stage) => isStageCompleted(stage.id)).length;
    return {
      ...phase,
      modules: phaseModules,
      stageCount: phaseStages.length,
      done,
      percentage: phaseStages.length ? Math.round((done / phaseStages.length) * 100) : 0,
      current: phase.moduleIds.includes(currentModuleId),
      nextModule: phaseModules.find((module) => module.percentage < 100) || phaseModules[0],
      projectsDone: phaseStages.filter((stage) => isProjectStage(stage) && isStageCompleted(stage.id)).length,
      projectCount: phaseStages.filter(isProjectStage).length,
    };
  }).filter((phase) => phase.modules.length > 0);

  const visibleModules = modules.map((module) => ({ ...module, visibleStages: module.stages.filter((stage) => {
    const searchText = normalize(`${stage.title} ${module.name} ${module.level || ''} ${(module.outcomes || []).join(' ')} ${stage.category} ${stage.instruction?.learningObjective || ''} ${stage.projectBrief?.summary || ''}`);
    const matchesQuery = normalize(query).split(/\s+/).filter(Boolean).every((word) => searchText.includes(word));
    const matchesStatus = status === 'all'
      || (status === 'completed' && isStageCompleted(stage.id))
      || (status === 'available' && isStageUnlocked(stage.id) && !isStageCompleted(stage.id))
      || (status === 'locked' && !isStageUnlocked(stage.id));
    const matchesKind = kind === 'all' || (kind === 'project' ? isProjectStage(stage) : !isProjectStage(stage));
    const matchesDuration = duration === 'all' || stage.estimatedMinutes <= Number(duration);
    return matchesQuery && matchesStatus && matchesKind && matchesDuration;
  }) })).filter((module) => module.visibleStages.length > 0);
  const resultCount = visibleModules.reduce((sum, module) => sum + module.visibleStages.length, 0);

  const updateFilter = (setter, value) => {
    setter(value);
    setOpenModules(new Set(modules.map((module) => module.id)));
  };

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setKind('all');
    setDuration('all');
  };

  const goToModule = (moduleId) => {
    clearFilters();
    setOpenModules((current) => new Set(current).add(moduleId));
    requestAnimationFrame(() => {
      const heading = document.getElementById(`${moduleId}-heading`);
      heading?.focus({ preventScroll: true });
      document.getElementById(moduleId)?.scrollIntoView({ block: 'start' });
    });
  };

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
      <main id="main-content" tabIndex={-1}>
        <section className="roadmap-hero border-b border-neutral-200">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div>
              <div className="mb-8 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                <span className="h-px w-8 bg-neutral-950" />
                Formação especializada em JavaScript
              </div>
              <h1 className="max-w-4xl text-[clamp(3rem,7vw,6.7rem)] font-black leading-[0.9] tracking-[-0.07em]">
                Do zero<br /><span className="text-emerald-700">ao master.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
                Do primeiro <code className="border border-neutral-300 bg-white px-1.5 py-0.5 font-mono text-sm text-neutral-950">const</code> à arquitetura de aplicações: uma formação etapa por etapa, com fundamentos, exemplos comentados e desafios progressivos. Feche cada módulo com um projeto que coloca suas habilidades em prática.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to={`/playground/${nextStage.id}`} className="inline-flex h-12 items-center gap-3 bg-neutral-950 px-5 text-sm font-bold text-white transition hover:bg-neutral-700">
                  <Play className="h-4 w-4 fill-current" />
                  {progressPct === 100 ? 'Revisitar projeto final' : completedCount || hasStageDraft(nextStage.id) ? 'Continuar de onde parei' : 'Começar a primeira aula'}
                </Link>
                <a href="#trilha" className="inline-flex h-12 items-center gap-2 border border-neutral-300 bg-white px-5 text-sm font-bold transition hover:border-neutral-950">
                  Ver programa <ArrowRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-neutral-600">
                <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" /> {projectCount} projetos práticos</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" /> Código salvo neste navegador</span>
              </div>
            </div>

            <aside className="border border-neutral-300 bg-white p-6 sm:p-7" aria-label="Seu progresso">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">{progressPct === 100 ? 'Formação concluída' : 'Seu próximo passo'}</p>
                  <h2 className="mt-3 text-xl font-bold leading-tight tracking-[-0.025em]">{progressPct === 100 ? 'Você completou a trilha.' : cleanTitle(nextStage.title)}</h2>
                  <p className="mt-3 text-xs leading-5 text-neutral-500">{progressPct === 100 ? 'Revisite os projetos, experimente outras soluções e transforme seu código em portfólio.' : `${cleanModuleName(nextStage.moduleName)} · ${formatDuration(nextStage.estimatedMinutes)}`}</p>
                  {progressPct !== 100 && hasStageDraft(nextStage.id) && <p className="mt-2 text-xs font-semibold text-emerald-700">Seu rascunho está salvo</p>}
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center border border-neutral-300 font-mono text-sm font-bold">{String(nextStage.stepNumber).padStart(2, '0')}</span>
              </div>
              <div className="mt-7">
                <div className="mb-2 flex justify-between text-xs text-neutral-500"><span>{completedCount} de {stages.length} aulas</span><span className="font-bold text-neutral-950">{progressPct}%</span></div>
                <div role="progressbar" aria-label="Aulas concluídas" aria-valuemin={0} aria-valuemax={stages.length} aria-valuenow={completedCount} aria-valuetext={`${completedCount} de ${stages.length} aulas concluídas`} className="h-2 overflow-hidden rounded-full bg-emerald-50"><div className="h-full rounded-full bg-emerald-700 transition-[width] duration-500" style={{ width: `${progressPct}%` }} /></div>
                <p className="mt-3 text-xs leading-5 text-neutral-500">{progressPct === 100 ? 'Todos os desafios foram validados.' : `Cerca de ${formatDuration(totalMinutes - completedMinutes)} de conteúdo pela frente. Cada aula no seu tempo.`}</p>
              </div>
              <div className="mt-6 grid grid-cols-3 border-t border-neutral-200 pt-5 text-center">
                <div className="border-r border-neutral-200"><strong className="block text-xl tracking-tight">{jsRoadmapCourse.modules.length}</strong><span className="text-[10px] uppercase tracking-wider text-neutral-500">Módulos</span></div>
                <div className="border-r border-neutral-200"><strong className="block text-xl tracking-tight">{stages.length}</strong><span className="text-[10px] uppercase tracking-wider text-neutral-500">Desafios</span></div>
                <div><strong className="block text-xl tracking-tight">{formatDuration(totalMinutes)}</strong><span className="text-[10px] uppercase tracking-wider text-neutral-500">Estimativa</span></div>
              </div>
            </aside>
          </div>
        </section>

        <section id="metodo" className="border-b border-neutral-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 md:grid-cols-3">
              {[
                { number: '01', icon: BookOpen, title: 'Entenda os fundamentos', text: 'Objetivos claros, teoria explicada, exemplos comentados e referências para aprofundar cada assunto.' },
                { number: '02', icon: Code2, title: 'Pratique no editor', text: 'Escreva seu código, teste ideias e veja o resultado no próprio navegador.' },
                { number: '03', icon: TerminalSquare, title: 'Construa e avance', text: 'Valide os desafios e conclua o projeto do módulo. Integre os conceitos antes de avançar para o próximo nível.' },
              ].map((item) => (
                <div key={item.number} className="bg-white p-6 sm:p-8">
                  <div className="flex items-center justify-between"><item.icon className="h-5 w-5" strokeWidth={1.7} /><span className="font-mono text-[10px] text-neutral-400">{item.number}</span></div>
                  <h3 className="mt-8 text-base font-bold tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-500">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-5 border border-neutral-200 bg-[#f7f7f5] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="max-w-3xl">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-neutral-500">Fonte aberta em destaque</p>
                <h3 className="mt-2 text-lg font-bold tracking-[-0.025em]">Uma trilha prática com referências do The Odin Project.</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{jsRoadmapCourse.source.note} Em cada aula, a guia <strong className="text-neutral-950">Fontes</strong> leva ao conteúdo original correspondente.</p>
              </div>
              <a href={jsRoadmapCourse.source.url} target="_blank" rel="noreferrer" className="inline-flex h-11 shrink-0 items-center justify-center gap-2 border border-neutral-950 bg-white px-4 text-xs font-bold text-neutral-950 transition hover:bg-neutral-950 hover:text-white">
                Visitar The Odin Project <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="progression-heading" className="border-b border-neutral-200">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="mb-6 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Uma formação, níveis de autonomia</p>
              <h2 id="progression-heading" className="mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl">Saiba de onde partir e o que vai construir.</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">Cada fase amplia suas habilidades. Acompanhe as etapas e os projetos concluídos para chegar ao próximo nível com uma base sólida.</p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {phases.map((phase, index) => (
                <li key={phase.id} className={`flex min-w-0 flex-col rounded-xl border p-5 ${phase.current && phase.percentage !== 100 ? 'border-emerald-700 bg-white' : 'border-neutral-200 bg-white/70'}`}>
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider">
                    <span className="font-mono text-neutral-500">Fase {String(index + 1).padStart(2, '0')}</span>
                    <span className={phase.percentage === 100 || phase.current ? 'text-emerald-700' : 'text-neutral-500'}>{phase.percentage === 100 ? 'Concluída' : phase.current ? 'Você está aqui' : phase.done ? 'Em progresso' : 'A construir'}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">{phase.title}</h3>
                  <p className="mt-2 flex-1 text-xs leading-6 text-neutral-600">{phase.description}</p>
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between gap-2 text-[11px] text-neutral-600"><span>{phase.done}/{phase.stageCount} etapas</span><strong className="text-neutral-950">{phase.percentage}%</strong></div>
                    <div role="progressbar" aria-label={`Progresso da fase ${phase.title}`} aria-valuemin={0} aria-valuemax={phase.stageCount} aria-valuenow={phase.done} aria-valuetext={`${phase.done} de ${phase.stageCount} etapas concluídas`} className="h-1.5 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-emerald-700 transition-[width]" style={{ width: `${phase.percentage}%` }} /></div>
                    <p className="mt-2 text-[11px] text-neutral-500">{phase.modules.length} {phase.modules.length === 1 ? 'módulo' : 'módulos'} · {phase.projectsDone}/{phase.projectCount} projetos concluídos</p>
                  </div>
                  <button type="button" onClick={() => goToModule(phase.nextModule.id)} className="mt-3 inline-flex min-h-11 items-center justify-between gap-2 text-left text-xs font-bold text-emerald-800" aria-label={`${phase.percentage === 100 ? 'Revisar' : 'Explorar'} a fase ${phase.title}`}>
                    {phase.percentage === 100 ? 'Revisar esta fase' : 'Explorar esta fase'} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="trilha" className="mx-auto grid min-w-0 grid-cols-1 max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-24">
          <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Roadmap completo</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">Um passo de cada vez.</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-500">Siga a sequência de aulas e desafios. Conclua o projeto ao fim de cada módulo e avance quando os pré-requisitos forem validados.</p>
            <nav aria-label="Módulos da formação" className="mt-6 grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {modules.map((module) => (
                <button key={module.id} type="button" onClick={() => goToModule(module.id)} className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs leading-5 transition hover:bg-white hover:text-neutral-950 ${module.id === currentModuleId ? 'bg-emerald-50 font-semibold text-emerald-800' : 'text-neutral-600'}`} aria-label={`${cleanModuleName(module.name)}, ${module.done} de ${module.stages.length} aulas concluídas`}>
                  <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${module.percentage === 100 ? 'bg-emerald-700' : 'border border-neutral-400'}`} />
                  <span className="min-w-0 flex-1">{cleanModuleName(module.name)}</span>
                  <span className="font-mono text-[10px]">{module.done}/{module.stages.length}</span>
                </button>
              ))}
            </nav>
            <ProgressTools />
          </aside>

          <div className="min-w-0 space-y-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
              <label htmlFor="lesson-search" className="mb-3 block text-sm font-bold">Explore o que você vai aprender</label>
              <div className="flex flex-col gap-3">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-neutral-400" aria-hidden="true" />
                  <input id="lesson-search" type="search" value={query} onChange={(event) => updateFilter(setQuery, event.target.value)} placeholder="Buscar aula, assunto ou módulo…" className="h-11 w-full rounded-lg border border-neutral-300 bg-neutral-50 pl-10 pr-3 text-sm" />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-xs font-medium text-neutral-600">Progresso
                    <select value={status} onChange={(event) => updateFilter(setStatus, event.target.value)} className="mt-1.5 h-11 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-2 text-xs">
                      <option value="all">Todas as aulas</option><option value="available">Disponíveis</option><option value="completed">Concluídas</option><option value="locked">A desbloquear</option>
                    </select>
                  </label>
                  <label className="text-xs font-medium text-neutral-600">Tipo de prática
                    <select value={kind} onChange={(event) => updateFilter(setKind, event.target.value)} className="mt-1.5 h-11 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-2 text-xs">
                      <option value="all">Aulas e projetos</option><option value="lesson">Aulas com desafio</option><option value="project">Projetos</option>
                    </select>
                  </label>
                  <label className="text-xs font-medium text-neutral-600">Tempo estimado
                    <select value={duration} onChange={(event) => updateFilter(setDuration, event.target.value)} className="mt-1.5 h-11 w-full min-w-0 rounded-lg border border-neutral-300 bg-white px-2 text-xs">
                      <option value="all">Qualquer duração</option><option value="20">Até 20 minutos</option><option value="30">Até 30 minutos</option><option value="60">Até 1 hora</option>
                    </select>
                  </label>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-neutral-500">
                <span role="status" aria-live="polite">{resultCount} de {stages.length} {resultCount === 1 ? 'etapa encontrada' : 'etapas encontradas'}</span>
                {filtering ? <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center gap-1 font-semibold text-emerald-700"><X className="h-3 w-3" aria-hidden="true" /> Limpar filtros</button> : <button type="button" onClick={() => setOpenModules(openModules.size === modules.length ? new Set() : new Set(modules.map((module) => module.id)))} className="min-h-11 font-semibold text-emerald-700">{openModules.size === modules.length ? 'Recolher módulos' : 'Expandir módulos'}</button>}
              </div>
            </div>
            {visibleModules.length === 0 && <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center"><Search className="mx-auto mb-3 h-6 w-6 text-neutral-400" aria-hidden="true" /><h3 className="font-bold">{status === 'completed' && completedCount === 0 ? 'Sua primeira conquista vem aí' : 'Nenhuma etapa com estes filtros'}</h3><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-neutral-600">{status === 'completed' && completedCount === 0 ? 'Conclua um desafio no editor para ver seu progresso aqui.' : 'Tente um assunto mais amplo ou altere os filtros para encontrar outras aulas e projetos.'}</p><button type="button" onClick={clearFilters} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 text-sm font-semibold"><RotateCcw className="h-4 w-4" aria-hidden="true" /> Mostrar toda a trilha</button></div>}
            {visibleModules.map((module) => {
              const isOpen = openModules.has(module.id);
              const moduleLocked = !module.stages.some((stage) => isStageUnlocked(stage.id));
              return (
                <article id={module.id} key={module.id} className="overflow-hidden rounded-xl scroll-mt-28 border border-neutral-200 bg-white shadow-sm">
                  <button id={`${module.id}-heading`} type="button" onClick={() => toggleModule(module.id)} className="flex w-full items-center gap-3 p-5 text-left sm:gap-5 sm:p-6" aria-expanded={isOpen} aria-controls={`${module.id}-lessons`}>
                    <span className="font-mono text-xs text-neutral-400">{String(module.index + 1).padStart(2, '0')}</span>
                    <div className="min-w-0 flex-1">
                      {module.level && <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">{module.level}</p>}
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold tracking-[-0.025em]">{cleanModuleName(module.name)}</h3>
                        {module.percentage === 100 && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-800">Concluído</span>}
                        {module.id === currentModuleId && module.percentage !== 100 && <span className="rounded-full bg-emerald-700 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white">Seu próximo passo</span>}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-neutral-600">{module.desc}</p>
                      <p className="mt-2 text-[11px] text-neutral-500">{module.done}/{module.stages.length} concluídas · {formatDuration(module.minutes)} estimados{filtering && ` · ${module.visibleStages.length} nos filtros`}</p>
                    </div>
                    {moduleLocked && <LockKeyhole className="hidden h-4 w-4 shrink-0 text-neutral-400 sm:block" aria-label="Aulas a desbloquear" />}
                    <ChevronDown className={`h-4 w-4 shrink-0 transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  <div aria-hidden="true" className="h-1 bg-neutral-100"><div className="h-full bg-emerald-700 transition-[width]" style={{ width: `${module.percentage}%` }} /></div>

                    <div id={`${module.id}-lessons`} hidden={!isOpen} className="border-t border-neutral-200">
                      <div className="grid gap-5 border-b border-neutral-200 bg-[#f7f7f5] p-5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] sm:p-6">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-950">Ao concluir este módulo</h4>
                          {module.outcomes?.length ? (
                            <ul className="mt-3 space-y-2">
                              {module.outcomes.map((outcome) => <li key={outcome} className="flex items-start gap-2 text-xs leading-5 text-neutral-600"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden="true" /><span>{outcome}</span></li>)}
                            </ul>
                          ) : <p className="mt-3 text-xs leading-5 text-neutral-600">{module.desc}</p>}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-950">Antes de começar</h4>
                          <ul className="mt-3 space-y-2 text-xs leading-5 text-neutral-600">
                            {(module.prerequisites?.length ? module.prerequisites : [module.index === 0 ? 'Nenhuma experiência com programação. Comece pela primeira aula.' : `Conclua as etapas anteriores: ${cleanModuleName(modules[module.index - 1].name)}.`]).map((prerequisite) => (
                              <li key={prerequisite}>{cleanModuleName(modules.find((item) => item.id === prerequisite)?.name || prerequisite)}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {module.visibleStages.map((stage) => {
                        const completed = isStageCompleted(stage.id);
                        const unlocked = isStageUnlocked(stage.id);
                        const current = nextStage?.id === stage.id && !completed;
                        const isProject = isProjectStage(stage);
                        const isCheckpoint = stage.id === module.stages.at(-1)?.id;
                        const prerequisite = stages.find((item) => stage.dependencies?.includes(item.id) && !isStageCompleted(item.id));
                        if (stage.id === module.project?.id) {
                          return (
                            <section key={stage.id} aria-labelledby={`${stage.id}-project-title`} className="border-b border-neutral-200 bg-emerald-50/60 p-5 last:border-b-0 sm:p-6">
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-800"><FolderKanban className="h-4 w-4" aria-hidden="true" /> Projeto do módulo</p>
                                <span className="text-[10px] font-semibold text-emerald-800">{completed ? 'Projeto concluído' : unlocked ? 'Disponível para construir' : 'Desbloqueie nas etapas anteriores'}</span>
                              </div>
                              <h4 id={`${stage.id}-project-title`} className="mt-3 text-base font-bold tracking-tight">{cleanTitle(stage.title)}</h4>
                              <p className="mt-2 text-xs leading-6 text-neutral-600">{stage.projectBrief?.summary || stage.instruction?.learningObjective || 'Reúna os conceitos deste módulo em uma entrega prática e valide seu aprendizado.'}</p>
                              {stage.projectBrief?.deliverables?.length > 0 && (
                                <div className="mt-4">
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">O que você vai entregar</p>
                                  <ul className="mt-2 space-y-1.5">
                                    {stage.projectBrief.deliverables.slice(0, 3).map((deliverable) => <li key={deliverable} className="flex items-start gap-2 text-xs leading-5 text-neutral-600"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden="true" /><span>{deliverable}</span></li>)}
                                  </ul>
                                </div>
                              )}
                              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-600">
                                  <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" aria-hidden="true" /> {formatDuration(stage.estimatedMinutes)}</span>
                                  <span>Etapa {stage.stepNumber} · Fechamento do módulo</span>
                                  {!completed && hasStageDraft(stage.id) && <span className="font-semibold text-emerald-700">Rascunho salvo</span>}
                                </div>
                                {unlocked ? (
                                  <Link to={`/playground/${stage.id}`} aria-current={current ? 'step' : undefined} aria-label={`${completed ? 'Revisitar projeto' : 'Abrir projeto'}: ${cleanTitle(stage.title)}`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 text-xs font-bold text-white transition hover:bg-emerald-900">{completed ? 'Revisitar projeto' : 'Abrir projeto'} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
                                ) : (
                                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600"><LockKeyhole className="h-4 w-4 shrink-0" aria-hidden="true" /> Projeto a desbloquear</span>
                                )}
                              </div>
                              {!unlocked && <p className="mt-3 text-[11px] leading-5 text-neutral-600">{prerequisite ? `Conclua a etapa ${prerequisite.stepNumber}: ${cleanTitle(prerequisite.title)} para continuar até este projeto.` : 'Conclua os desafios anteriores para abrir o projeto.'}</p>}
                            </section>
                          );
                        }
                        const row = (
                          <>
                            <span aria-hidden="true" className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border text-xs font-bold ${completed ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-neutral-300 text-neutral-500'}`}>
                              {completed ? <Check className="h-4 w-4" /> : unlocked ? String(stage.stepNumber).padStart(2, '0') : <LockKeyhole className="h-3.5 w-3.5" />}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className={`text-sm font-semibold ${unlocked ? 'text-neutral-950' : 'text-neutral-600'}`}>{cleanTitle(stage.title)}</h4>
                                {current && <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">A seguir</span>}
                                {completed && <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Concluída</span>}
                                {isProject && <span className="border border-neutral-300 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">Projeto</span>}
                              </div>
                              {stage.instruction?.learningObjective && <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-600">{stage.instruction.learningObjective}</p>}
                              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
                                <span className="inline-flex items-center gap-1"><BookOpen className="h-3 w-3" /> {isProject ? 'Projeto prático' : 'Aula + desafio'}</span>
                                <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" /> {stage.estimatedMinutes} min</span>
                                {isCheckpoint && <span className="inline-flex items-center gap-1"><FolderKanban className="h-3 w-3" /> Checkpoint do módulo</span>}
                                {!completed && hasStageDraft(stage.id) && <span className="font-medium text-emerald-700">Rascunho salvo</span>}
                              </div>
                              {!unlocked && prerequisite && <p className="mt-2 text-[11px] leading-5 text-neutral-500">Disponível após a aula {prerequisite.stepNumber}: {cleanTitle(prerequisite.title)}</p>}
                            </div>
                            {unlocked && <ArrowRight className="h-4 w-4 text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-950" />}
                          </>
                        );
                        return unlocked ? (
                          <Link key={stage.id} to={`/playground/${stage.id}`} aria-current={current ? 'step' : undefined} className={`group flex items-start gap-3 border-b border-neutral-200 p-4 transition last:border-b-0 hover:bg-emerald-50/70 sm:gap-4 sm:px-6 ${current ? 'bg-emerald-50/50' : ''}`}>{row}</Link>
                        ) : (
                          <div key={stage.id} className="flex items-start gap-3 border-b border-neutral-200 bg-neutral-50/50 p-4 last:border-b-0 sm:gap-4 sm:px-6">{row}</div>
                        );
                      })}
                    </div>
                </article>
              );
            })}

            <article id="projeto-final" className="scroll-mt-28 rounded-xl border border-neutral-950 bg-neutral-950 p-6 text-white sm:p-8">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Projeto final · Capstone</p>
                  <h3 className="mt-3 max-w-2xl text-2xl font-black tracking-[-0.035em]">{capstoneStage ? cleanTitle(capstoneStage.title) : 'Reúna tudo em uma aplicação sua.'}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">{capstoneStage?.projectBrief?.summary || capstoneStage?.instruction?.learningObjective || 'Integre as habilidades da formação em um projeto completo, com requisitos claros e validação prática.'}</p>
                </div>
                {capstoneStage && (isStageUnlocked(capstoneStage.id) ? (
                  <Link to={`/playground/${capstoneStage.id}`} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 text-xs font-bold text-neutral-950 transition hover:bg-neutral-200">{isStageCompleted(capstoneStage.id) ? 'Revisitar projeto' : 'Abrir projeto'} <ArrowRight className="h-4 w-4" /></Link>
                ) : (
                  <button type="button" onClick={() => goToModule(capstoneStage.moduleId)} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-neutral-600 px-4 text-xs font-bold text-white transition hover:bg-neutral-800">Ver pré-requisitos <ArrowRight className="h-4 w-4" /></button>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-8 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span className="font-bold text-neutral-950">DEVPATH</span><span>Aprenda · Pratique · Valide · Construa</span><a href={jsRoadmapCourse.source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold transition hover:text-neutral-950">Referências: The Odin Project <ExternalLink className="h-3 w-3" /></a></div>
      </footer>
    </div>
  );
}
