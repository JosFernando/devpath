import React from 'react';
import { Link } from 'react-router-dom';

export default function BeginnerGuide({ guide, stageId, previousStage }) {
  return (
    <section className="beginner-guide space-y-6" aria-label="Explicação passo a passo">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
        <h3>Vamos entender do começo</h3>
        <p>{guide.idea}</p>
      </div>
      <section>
        <h3>O que você precisa saber antes</h3>
        <p>{guide.before}</p>
        {previousStage && <Link className="mt-3 inline-block text-sm font-semibold text-emerald-800 underline underline-offset-4" to={`/playground/${previousStage.id}`}>Rever aula anterior: {previousStage.title}</Link>}
      </section>
      <section>
        <h3>{guide.code ? 'Um exemplo pequeno' : 'Um exemplo do projeto'}</h3>
        {guide.code ? <pre tabIndex={0} aria-label="Código do exemplo" className="overflow-x-auto rounded-lg bg-neutral-950 p-4 text-neutral-100"><code>{guide.code}</code></pre> : <p>{guide.exampleInput}</p>}
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <h4 className="font-bold text-emerald-950">Resultado esperado</h4>
          <p className="whitespace-pre-wrap">{guide.output}</p>
        </div>
      </section>
      <section>
        <h3>Entenda passo a passo</h3>
        <ol className="list-decimal space-y-3 pl-6 marker:font-bold marker:text-emerald-800">
          {guide.steps.map((step, index) => <li key={index} className="pl-1">{step}</li>)}
        </ol>
      </section>
      <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <h3>Um erro comum e como evitar</h3>
        <p>{guide.mistake}</p>
      </section>
      <section className="rounded-lg border border-neutral-300 p-4">
        <h3>Sua vez: pense um pouco</h3>
        <p>{guide.practice}</p>
        <details key={stageId} className="mt-4">
          <summary className="cursor-pointer font-semibold text-emerald-800">Ver resposta explicada</summary>
          <p className="mt-3">{guide.answer}</p>
        </details>
      </section>
      <p className="text-neutral-600">Não precisa decorar. Releia o exemplo quando precisar e avance uma ideia por vez.</p>
    </section>
  );
}
