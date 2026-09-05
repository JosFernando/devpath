import { Link } from 'react-router-dom';
import { ArrowRight, Check, FolderKanban, LockKeyhole } from 'lucide-react';

export default function ModuleProject({ project, currentStageId, unlocked, completed, pendingCount, onStart }) {
  if (!project?.projectBrief) return null;
  const brief = project.projectBrief;
  const isCurrent = project.id === currentStageId;

  return (
    <section className="space-y-6" aria-label="Plano do projeto do módulo">
      <div className="border border-emerald-200 bg-emerald-50 p-4">
        <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-emerald-800"><FolderKanban className="h-4 w-4" /> Projeto do módulo</p>
        <h2 className="mt-3 text-lg font-bold leading-6 tracking-tight">{project.title.replace(/^[^\p{L}\p{N}]+/u, '')}</h2>
        <p className="mt-3 text-xs leading-5 text-neutral-700">{brief.summary}</p>
        <p className="mt-3 text-xs font-semibold text-emerald-800">{project.estimatedMinutes} minutos estimados · {completed ? 'Desafio concluído' : 'Aplicação dos conhecimentos deste módulo'}</p>
      </div>

      <div>
        <h3 className="text-sm font-bold">O que você vai entregar</h3>
        <ul className="mt-3 space-y-3 text-xs leading-5 text-neutral-600">
          {brief.deliverables.map((item) => <li key={item} className="flex gap-2"><span aria-hidden="true" className="text-emerald-700">•</span><span>{item}</span></li>)}
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-bold">Construa etapa por etapa</h3>
        <ol className="mt-3 space-y-3">
          {brief.milestones.map((milestone, index) => (
            <li key={milestone.title} className="flex gap-3 rounded-lg border border-neutral-200 p-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded bg-neutral-950 text-[10px] font-bold text-white">{index + 1}</span>
              <div><h4 className="text-xs font-bold">{milestone.title}</h4><p className="mt-1 text-xs leading-5 text-neutral-600">{milestone.description}</p></div>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h3 className="text-sm font-bold">Critérios de entrega</h3>
        <p className="mt-2 text-xs leading-5 text-neutral-500">Execute os testes na guia Desafio e use estes critérios para revisar a entrega completa.</p>
        <ul className="mt-3 space-y-3 text-xs leading-5 text-neutral-600">
          {brief.rubric.map((item) => <li key={item} className="flex gap-2"><Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700" /><span>{item}</span></li>)}
        </ul>
      </div>

      {brief.stretchGoals?.length > 0 && <details className="rounded-lg border border-neutral-200 p-4"><summary className="cursor-pointer text-xs font-bold">Ir além · desafios opcionais</summary><ul className="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-neutral-600">{brief.stretchGoals.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-3 text-xs leading-5 text-neutral-500">As extensões são para prática e portfólio. Os testes de conclusão validam o enunciado principal.</p></details>}

      {isCurrent ? (
        <button type="button" onClick={onStart} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 text-xs font-bold text-white hover:bg-neutral-700">Implementar projeto <ArrowRight className="h-4 w-4" /></button>
      ) : unlocked ? (
        <Link to={`/playground/${project.id}?tab=project`} className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-neutral-950 px-4 text-xs font-bold text-white hover:bg-neutral-700">{completed ? 'Revisitar projeto' : 'Abrir projeto do módulo'} <ArrowRight className="h-4 w-4" /></Link>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"><p className="flex items-start gap-2 text-xs leading-5 text-neutral-600"><LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />{pendingCount} {pendingCount === 1 ? 'etapa preparatória pendente neste módulo' : 'etapas preparatórias pendentes neste módulo'}. Avance pelos desafios para liberar o projeto.</p><Link to={`/#${project.moduleId}`} className="mt-3 inline-flex min-h-11 items-center text-xs font-bold text-emerald-800 underline">Ver sequência do módulo</Link></div>
      )}
    </section>
  );
}
