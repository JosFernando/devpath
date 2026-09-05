import { useState } from 'react';
import { BrainCircuit, CheckCircle2, RotateCcw } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';

export default function KnowledgeCheck({ stageId, question }) {
  const { knowledgeChecks, saveKnowledgeCheck } = useProgress();
  const saved = knowledgeChecks?.[stageId];
  const [answer, setAnswer] = useState(saved?.answer ?? null);
  const [submitted, setSubmitted] = useState(Boolean(saved));
  if (!question?.options?.length) return null;
  const correct = answer === question.correctIndex;

  function submit(event) {
    event.preventDefault();
    if (answer === null) return;
    setSubmitted(true);
    saveKnowledgeCheck(stageId, answer, correct);
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-bold text-emerald-800"><BrainCircuit className="h-4 w-4" /> Confira o que aprendeu</p>
      <fieldset>
        <legend className="mb-3 whitespace-pre-wrap text-sm font-semibold leading-6 text-neutral-900">{question.question}</legend>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <label key={option} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-xs leading-5 transition ${answer === index ? 'border-emerald-700 bg-white text-neutral-950' : 'border-emerald-100 bg-white/70 text-neutral-700'}`}>
              <input type="radio" name={`knowledge-${stageId}`} value={index} checked={answer === index} disabled={submitted} onChange={() => setAnswer(index)} className="mt-1 accent-emerald-700" />
              <span className="whitespace-pre-wrap">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {submitted ? (
        <div className="mt-4" role="status">
          <p className={`flex items-center gap-2 text-xs font-bold ${correct ? 'text-emerald-800' : 'text-amber-800'}`}>{correct && <CheckCircle2 className="h-4 w-4" />}{correct ? 'Isso mesmo!' : 'Vamos rever este conceito.'}</p>
          <p className="mt-2 text-xs leading-6 text-neutral-700">{question.explanation}</p>
          <button type="button" onClick={() => { setSubmitted(false); setAnswer(null); }} className="mt-3 inline-flex min-h-9 items-center gap-2 text-xs font-bold text-emerald-800"><RotateCcw className="h-3.5 w-3.5" /> Tentar de novo</button>
        </div>
      ) : <button type="submit" disabled={answer === null} className="mt-4 min-h-10 rounded-lg bg-emerald-700 px-4 text-xs font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40">Verificar resposta</button>}
      <p className="mt-3 text-[11px] leading-5 text-neutral-500">Use esta pergunta para revisar. A conclusão da aula depende do desafio no editor.</p>
    </form>
  );
}
