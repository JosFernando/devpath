import React, { useState } from 'react';
import { AlertCircle, ArrowRight, Check, ChevronDown, Lightbulb } from 'lucide-react';

function InlineText({ text, inverted = false }) {
  if (!text) return null;
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index} className={`mx-0.5 border px-1 py-0.5 font-mono text-[11px] ${inverted ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-neutral-100 text-neutral-950'}`}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className={inverted ? 'font-bold text-white' : 'font-bold text-neutral-950'}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

export default function ValidationChecklist({ tasks = [], taskResults = {}, allPassed = false, onNextStage, hasNextStage }) {
  const [openHints, setOpenHints] = useState({});
  const passedCount = tasks.filter((task) => taskResults[task.id]?.pass).length;

  return (
    <div>
      <div className="mb-4 flex items-end justify-between border-b border-neutral-200 pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">Checklist</p>
          <h3 className="mt-1 text-sm font-bold text-neutral-950">Complete o desafio</h3>
        </div>
        <span className="font-mono text-[11px] text-neutral-500">{passedCount}/{tasks.length}</span>
      </div>

      <ol className="space-y-3">
        {tasks.map((task, index) => {
          const result = taskResults[task.id];
          const passed = result?.pass;
          const failed = result && !result.pass;
          const hintOpen = Boolean(openHints[task.id]);

          return (
            <li key={task.id || index} className={`border p-3.5 ${passed ? 'border-neutral-950 bg-neutral-950 text-white' : failed ? 'border-red-300 bg-red-50' : 'border-neutral-200 bg-white'}`}>
              <div className="flex items-start gap-3">
                <span className={`grid h-6 w-6 shrink-0 place-items-center border font-mono text-[10px] font-bold ${passed ? 'border-white bg-white text-neutral-950' : failed ? 'border-red-500 text-red-600' : 'border-neutral-300 text-neutral-500'}`}>
                  {passed ? <Check className="h-3.5 w-3.5" /> : failed ? '!' : String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs leading-5 ${passed ? 'text-neutral-200' : 'text-neutral-700'}`}><InlineText text={task.description || task.title} inverted={passed} /></p>

                  {failed && result.tip && (
                    <div className="mt-3 flex gap-2 border-t border-red-200 pt-3 text-xs leading-5 text-red-700">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <p><InlineText text={result.tip} /></p>
                    </div>
                  )}

                  {task.hint && !passed && (
                    <div className="mt-3">
                      <button type="button" onClick={() => setOpenHints((current) => ({ ...current, [task.id]: !current[task.id] }))} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 transition hover:text-neutral-950" aria-expanded={hintOpen}>
                        <Lightbulb className="h-3.5 w-3.5" />
                        {hintOpen ? 'Ocultar dica' : 'Preciso de uma dica'}
                        <ChevronDown className={`h-3 w-3 transition ${hintOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {hintOpen && <div className="mt-2 border-l-2 border-neutral-950 bg-neutral-100 p-3 text-xs leading-5 text-neutral-700"><InlineText text={task.hint} /></div>}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {allPassed && (
        <div className="mt-4 border border-neutral-950 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center bg-neutral-950 text-white"><Check className="h-4 w-4" /></span>
            <div><h4 className="text-sm font-bold text-neutral-950">Desafio concluído</h4><p className="mt-0.5 text-xs text-neutral-500">Todos os testes passaram. Seu progresso foi salvo.</p></div>
          </div>
          {hasNextStage && onNextStage && (
            <button type="button" onClick={onNextStage} className="mt-4 flex h-10 w-full items-center justify-center gap-2 bg-neutral-950 px-4 text-xs font-bold text-white transition hover:bg-neutral-700">Próxima aula <ArrowRight className="h-4 w-4" /></button>
          )}
        </div>
      )}
    </div>
  );
}
