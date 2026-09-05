import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  ChevronDown,
  Code2,
  Compass,
  Lightbulb,
  MapPin,
} from 'lucide-react';

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

function findCodeLocation(task, result, files) {
  if (result?.location?.file) return result.location;

  const text = `${task.description || task.title || ''} ${result?.tip || ''}`;
  const markedTerms = [...text.matchAll(/`([^`]+)`/g)]
    .map((match) => match[1].trim())
    .filter((term) => term.length >= 2 && term.length <= 90);
  const identifiers = [...text.matchAll(/\b[$A-Z_a-z][$\w]*\b/g)]
    .map((match) => match[0])
    .filter((term) => term.length > 3 && !['function', 'return', 'const', 'class', 'style', 'script'].includes(term));
  const terms = [...new Set([...markedTerms, ...identifiers])];
  const fileNames = Object.keys(files || {});
  const preferredFile = task.file || (/\b(CSS|estilo|estilize)\b/i.test(text) ? 'style.css' : /<[^>]+>|\bHTML\b/i.test(text) ? 'index.html' : 'script.js');
  const orderedFiles = [preferredFile, ...fileNames.filter((name) => name !== preferredFile)].filter((name, index, list) => files?.[name] != null && list.indexOf(name) === index);

  let commentMatch = null;
  for (const file of orderedFiles) {
    const lines = String(files[file]).split('\n');
    let commentMatchInFile = null;
    for (const term of terms) {
      const exactTerm = term.replace(/^['"]|['"]$/g, '');
      if (!exactTerm) continue;
      const lineIndex = lines.findIndex((line) => line.includes(exactTerm));
      if (lineIndex === -1) continue;
      const location = { file, line: lineIndex + 1, column: Math.max(1, lines[lineIndex].indexOf(exactTerm) + 1) };
      if (!lines[lineIndex].trim().startsWith('//')) return location;
      commentMatchInFile ||= location;
      commentMatch ||= location;
    }
    if (file === preferredFile && commentMatchInFile) return commentMatchInFile;
  }

  return commentMatch || (files?.[preferredFile] != null ? { file: preferredFile } : fileNames[0] ? { file: fileNames[0] } : null);
}

function nextActionFor(result) {
  if (result?.action) return result.action;
  const message = result?.tip || '';
  if (/não encontramos|não foi encontrad|declare|crie a função|undefined|null/i.test(message)) return 'Implemente primeiro o elemento citado no requisito e execute o código novamente.';
  if (/esperad|recebemos|resultado incorreto|deve retornar/i.test(message)) return 'Teste com os valores mencionados, compare o resultado obtido com o esperado e ajuste apenas a regra que divergiu.';
  return 'Revise o requisito, confira nomes e valores exatamente como foram pedidos e execute novamente.';
}

function LocationButton({ location, onOpenLocation }) {
  if (!location) return null;
  const label = `${location.file}${location.line ? ` · linha ${location.line}` : ''}`;
  if (!onOpenLocation) return <span className="font-mono text-[10px] text-neutral-600">{label}</span>;
  return (
    <button type="button" onClick={() => onOpenLocation(location)} className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-950">
      {label} <Code2 className="h-3 w-3" />
    </button>
  );
}

export default function ValidationChecklist({
  tasks = [],
  taskResults = {},
  allPassed = false,
  files = {},
  runtimeError = null,
  guideSteps = [],
  onOpenLocation,
  onNextStage,
  hasNextStage,
}) {
  const [openHints, setOpenHints] = useState({});
  const [guideOpen, setGuideOpen] = useState(false);
  const [visibleHints, setVisibleHints] = useState(1);
  const passedCount = tasks.filter((task) => taskResults[task.id]?.pass).length;

  return (
    <div>
      <div className="mb-4 flex items-end justify-between border-b border-neutral-200 pb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">Checklist</p>
          <h3 className="mt-1 text-sm font-bold text-neutral-950">Complete o desafio</h3>
        </div>
        <span role="status" aria-live="polite" className="font-mono text-[11px] text-neutral-500">{passedCount}/{tasks.length} atendidos</span>
      </div>

      {runtimeError && (
        <div className="mb-4 border border-red-400 bg-red-50 p-4" role="alert">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center bg-red-600 text-white"><AlertCircle className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-red-700">Erro durante a execução</p>
              <p className="mt-2 break-words font-mono text-[11px] leading-5 text-red-900">{runtimeError.message}</p>
              <div className="mt-3 border-t border-red-200 pt-3">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-700"><MapPin className="h-3 w-3" /> Onde verificar</p>
                <div className="mt-1"><LocationButton location={runtimeError.location} onOpenLocation={onOpenLocation} /></div>
                <p className="mt-3 text-xs leading-5 text-red-800"><strong>Como corrigir:</strong> {runtimeError.action}</p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <div className="mt-3 border-t border-red-200 pt-3 text-red-900">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-600" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-wider text-red-700">O que encontramos</p>
                          <p className="mt-1 text-xs leading-5"><InlineText text={result.tip} /></p>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-3 bg-white/70 p-3">
                        <div>
                          <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500"><MapPin className="h-3 w-3" /> Onde verificar</p>
                          <div className="mt-1"><LocationButton location={findCodeLocation(task, result, files)} onOpenLocation={onOpenLocation} /></div>
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-neutral-500"><Compass className="h-3 w-3" /> Próximo passo</p>
                          <p className="mt-1 text-xs leading-5 text-neutral-700">{nextActionFor(result)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {task.hint && !passed && (
                    <div className="mt-3">
                      <button type="button" onClick={() => setOpenHints((current) => ({ ...current, [task.id]: !current[task.id] }))} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 transition hover:text-neutral-950" aria-expanded={hintOpen} aria-controls={`hint-${task.id}`}>
                        <Lightbulb className="h-3.5 w-3.5" />
                        {hintOpen ? 'Ocultar dica' : failed ? 'Ainda com dúvida? Ver dica' : 'Ver dica'}
                        <ChevronDown className={`h-3 w-3 transition ${hintOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {hintOpen && <div id={`hint-${task.id}`} className="mt-2 border-l-2 border-neutral-950 bg-neutral-100 p-3 text-xs leading-5 text-neutral-700"><InlineText text={task.hint} /></div>}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {guideSteps.length > 0 && !allPassed && (
        <div className="mt-4 border border-neutral-200 bg-[#f7f7f5]">
          <button type="button" onClick={() => setGuideOpen((open) => !open)} className="flex w-full items-center justify-between gap-3 p-3.5 text-left" aria-expanded={guideOpen} aria-controls="challenge-guide">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-neutral-700"><Compass className="h-3.5 w-3.5" /> Dicas progressivas</span>
            <ChevronDown className={`h-3.5 w-3.5 text-neutral-500 transition ${guideOpen ? 'rotate-180' : ''}`} />
          </button>
          {guideOpen && (
            <ol id="challenge-guide" className="border-t border-neutral-200 bg-white p-4">
              {guideSteps.slice(0, visibleHints).map((step, index) => (
                <li key={`${index}-${step}`} className="flex gap-3 border-b border-neutral-100 py-3 first:pt-0 last:border-b-0 last:pb-0">
                  <span className="grid h-5 w-5 shrink-0 place-items-center bg-neutral-950 font-mono text-[9px] font-bold text-white">{index + 1}</span>
                  <p className="text-xs leading-5 text-neutral-700"><InlineText text={String(step).replace(/^\s*💡\s*Dica\s*\d*:\s*/i, '')} /></p>
                </li>
              ))}
              {visibleHints < guideSteps.length && <li className="mt-3"><button type="button" onClick={() => setVisibleHints((count) => count + 1)} className="min-h-10 rounded-lg border border-neutral-300 px-3 text-xs font-bold hover:bg-neutral-100">Revelar próxima dica ({visibleHints}/{guideSteps.length})</button></li>}
            </ol>
          )}
        </div>
      )}

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
