import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Code2, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { roadmapCourse } from '../../data/roadmapData';

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const { completedStages, currentStageId, isStageCompleted, isStageUnlocked, hasStageDraft } = useProgress();
  const stages = roadmapCourse.stages;
  const completedCount = stages.filter((stage) => completedStages.includes(stage.id)).length;
  const progressPct = Math.round((completedCount / stages.length) * 100);
  const isPlayground = location.pathname.startsWith('/playground/');
  const activeStageId = isPlayground ? location.pathname.split('/').at(-1) : null;
  const activeStage = stages.find((stage) => stage.id === activeStageId);
  const nextStage = stages.find((stage) => stage.id === currentStageId && isStageUnlocked(stage.id) && !isStageCompleted(stage.id))
    || stages.find((stage) => isStageUnlocked(stage.id) && !isStageCompleted(stage.id));

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#f7f7f5]/95 text-neutral-950 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex shrink-0 items-center gap-2.5 rounded-lg" aria-label="DevPath — início">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-700 text-white">
            <Code2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-black tracking-[-0.04em]">DEVPATH</span>
        </Link>

        {isPlayground ? (
          <>
            <span className="hidden h-5 w-px bg-neutral-300 sm:block" />
            <Link to="/" className="hidden items-center gap-1.5 text-xs font-semibold text-neutral-500 transition hover:text-neutral-950 sm:flex">
              <ArrowLeft className="h-3.5 w-3.5" />
              Trilha
            </Link>
            <span className="hidden text-neutral-300 sm:block">/</span>
            <span className="min-w-0 truncate text-xs font-medium text-neutral-600">
              {activeStage ? `Aula ${activeStage.stepNumber} · ${activeStage.title.replace(/^[^\p{L}\p{N}]+/u, '')}` : 'Área de prática'}
            </span>
          </>
        ) : (
          <nav className="ml-6 hidden items-center gap-6 text-xs font-semibold text-neutral-500 md:flex" aria-label="Navegação principal">
            <a className="transition hover:text-neutral-950" href="#trilha">Trilha</a>
            <a className="transition hover:text-neutral-950" href="#metodo">Método</a>
            <a className="transition hover:text-neutral-950" href="#projeto-final">Projeto final</a>
          </nav>
        )}

        <div className="ml-auto flex items-center gap-3">
          {!isPlayground && <button ref={menuButtonRef} type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Fechar navegação' : 'Abrir navegação'} className="grid h-11 w-11 place-items-center rounded-lg hover:bg-neutral-200 md:hidden">{menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}</button>}
          {isPlayground && <Link to="/" aria-label="Voltar à trilha" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-neutral-200 sm:hidden"><ArrowLeft className="h-4 w-4" /></Link>}
          <div className="hidden items-center gap-3 sm:flex" role="progressbar" aria-label="Progresso na formação" aria-valuemin={0} aria-valuemax={stages.length} aria-valuenow={completedCount} aria-valuetext={`${completedCount} de ${stages.length} aulas concluídas`}>
            <div className="w-20"><div className="h-1.5 overflow-hidden rounded-full bg-neutral-200"><div className="h-full rounded-full bg-emerald-700 transition-[width] duration-500" style={{ width: `${progressPct}%` }} /></div></div>
            <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tabular-nums text-neutral-500">
              {progressPct === 100 && <Check className="h-3 w-3" />}
              {completedCount}/{stages.length}
            </span>
          </div>
          {!isPlayground && nextStage && (
            <Link to={`/playground/${nextStage.id}`} onClick={() => setMenuOpen(false)} className="inline-flex h-11 items-center gap-2 rounded-lg bg-neutral-950 px-3.5 text-xs font-bold text-white transition hover:bg-neutral-700">
              {completedCount || hasStageDraft(nextStage.id) ? 'Continuar' : 'Começar'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
      {!isPlayground && <nav id="mobile-navigation" hidden={!menuOpen} aria-label="Navegação no celular" className="mobile-navigation border-t border-neutral-200 bg-white px-4 py-3 md:hidden">{[['trilha', 'Trilha'], ['metodo', 'Método'], ['projeto-final', 'Projeto final']].map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className="inline-flex min-h-11 items-center rounded-lg px-4 py-3 text-sm font-semibold hover:bg-emerald-50">{label}</a>)}</nav>}
    </header>
  );
}
