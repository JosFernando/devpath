import React from 'react';
import { ArrowLeft, ArrowRight, Check, Code2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../../context/ProgressContext';
import { roadmapCourse } from '../../data/roadmapData';

export default function Navbar() {
  const location = useLocation();
  const { completedStages, isStageCompleted, isStageUnlocked } = useProgress();
  const stages = roadmapCourse.stages;
  const completedCount = completedStages.length;
  const progressPct = Math.round((completedCount / stages.length) * 100);
  const isPlayground = location.pathname.startsWith('/playground/');
  const activeStageId = isPlayground ? location.pathname.split('/').at(-1) : null;
  const activeStage = stages.find((stage) => stage.id === activeStageId);
  const nextStage = stages.find((stage) => isStageUnlocked(stage.id) && !isStageCompleted(stage.id));

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#f7f7f5]/95 text-neutral-950 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none" aria-label="DevPath — início">
          <span className="grid h-8 w-8 place-items-center bg-neutral-950 text-white">
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
              {activeStage ? `Aula ${activeStage.stepNumber} · ${activeStage.title}` : 'Playground'}
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
          <div className="hidden items-center gap-3 sm:flex">
            <div className="w-24"><div className="h-1 overflow-hidden bg-neutral-200"><div className="h-full bg-neutral-950 transition-[width] duration-500" style={{ width: `${progressPct}%` }} /></div></div>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold tabular-nums text-neutral-500">
              {progressPct === 100 && <Check className="h-3 w-3" />}
              {completedCount}/{stages.length}
            </span>
          </div>
          {!isPlayground && nextStage && (
            <Link to={`/playground/${nextStage.id}`} className="inline-flex h-9 items-center gap-2 bg-neutral-950 px-3.5 text-xs font-bold text-white transition hover:bg-neutral-700">
              {completedCount ? 'Continuar' : 'Começar'}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
