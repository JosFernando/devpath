import React, { useRef, useState } from 'react';
import { Download, HardDrive, Upload, X } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';
import { jsRoadmapCourse } from '../../data/roadmapData';

const MAX_BACKUP_BYTES = 5 * 1024 * 1024;

export default function ProgressTools() {
  const { exportProgress, importProgress, storageError } = useProgress();
  const fileInputRef = useRef(null);
  const [pendingBackup, setPendingBackup] = useState(null);
  const [notice, setNotice] = useState(null);
  const [reading, setReading] = useState(false);

  const downloadBackup = () => {
    try {
      const blob = new Blob([exportProgress()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `devpath-progresso-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice({ type: 'success', message: 'Download iniciado. Guarde o arquivo para recuperar suas aulas e seu código.' });
    } catch {
      setNotice({ type: 'error', message: 'Não foi possível baixar a cópia. Tente novamente.' });
    }
  };

  const readBackup = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setNotice(null);
    setPendingBackup(null);
    setReading(true);
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error('Escolha um arquivo de progresso de até 5 MB.');
      const json = await file.text();
      let parsed;
      try {
        parsed = JSON.parse(json);
      } catch {
        throw new Error('Este arquivo não contém JSON válido. Escolha uma cópia exportada pelo DevPath.');
      }
      const progress = parsed?.progress || parsed;
      if (!progress || !Array.isArray(progress.completedStages) || !progress.stageFiles || typeof progress.stageFiles !== 'object' || Array.isArray(progress.stageFiles)) {
        throw new Error('Este arquivo não parece ser uma cópia do DevPath.');
      }
      const validIds = new Set(jsRoadmapCourse.stages.map((stage) => stage.id));
      const completed = new Set(progress.completedStages.filter((id) => validIds.has(id))).size;
      const drafts = Object.keys(progress.stageFiles).filter((id) => validIds.has(id)).length;
      setPendingBackup({ json, name: file.name, completed, drafts });
    } catch (error) {
      setNotice({ type: 'error', message: error.message || 'Não foi possível ler o arquivo.' });
    } finally {
      setReading(false);
    }
  };

  const restoreBackup = () => {
    const result = importProgress(pendingBackup.json);
    if (result.success) {
      setPendingBackup(null);
      setNotice({ type: 'success', message: 'Progresso restaurado. Suas aulas e seus arquivos já estão disponíveis.' });
    } else {
      setNotice({ type: 'error', message: result.error || 'Não foi possível restaurar esta cópia.' });
    }
  };

  return (
    <section aria-labelledby="progress-tools-title" className="mt-7 rounded-xl border border-neutral-200 bg-white p-4">
      <h3 id="progress-tools-title" className="flex items-center gap-2 text-xs font-bold"><HardDrive className="h-4 w-4 text-emerald-700" aria-hidden="true" /> Seu progresso, com você</h3>
      <p className="mt-2 text-xs leading-5 text-neutral-600">Aulas e código ficam neste navegador. Baixe uma cópia para guardar ou continuar em outro dispositivo.</p>
      {storageError && <p role="alert" className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">{storageError} Baixe uma cópia antes de fechar esta página.</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={downloadBackup} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-neutral-300 px-3 text-xs font-semibold transition hover:bg-neutral-50"><Download className="h-3.5 w-3.5" aria-hidden="true" /> Baixar cópia</button>
        <button type="button" disabled={reading} onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-60"><Upload className="h-3.5 w-3.5" aria-hidden="true" /> {reading ? 'Lendo arquivo…' : 'Restaurar'}</button>
        <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={readBackup} className="hidden" aria-label="Selecionar cópia do progresso" />
      </div>
      {pendingBackup && <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-start justify-between gap-2"><h4 className="min-w-0 break-words text-xs font-bold">Restaurar {pendingBackup.name}?</h4><button type="button" onClick={() => { setPendingBackup(null); setNotice(null); }} aria-label="Cancelar restauração" className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg hover:bg-amber-100"><X className="h-4 w-4" /></button></div>
        <p className="mt-2 text-xs leading-5 text-amber-950">O arquivo contém {pendingBackup.completed} aulas concluídas e código salvo de {pendingBackup.drafts} etapas. Restaurar substitui o progresso atual neste navegador.</p>
        <p className="mt-2 text-xs leading-5 text-amber-950">Você pode baixar uma cópia do progresso atual antes de continuar.</p>
        <button type="button" onClick={restoreBackup} className="mt-3 min-h-11 rounded-lg bg-neutral-950 px-3 text-xs font-semibold text-white hover:bg-neutral-700">Confirmar restauração</button>
      </div>}
      {notice && <p role={notice.type === 'error' ? 'alert' : 'status'} className={`mt-3 text-xs leading-5 ${notice.type === 'error' ? 'text-red-700' : 'text-emerald-800'}`}>{notice.message}</p>}
    </section>
  );
}
