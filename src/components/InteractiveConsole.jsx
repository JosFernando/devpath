import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ChevronRight, Monitor, RefreshCw, Smartphone, Terminal, Trash2 } from 'lucide-react';

function FormattedValue({ value }) {
  if (value === null) return <span className="italic text-neutral-500">null</span>;
  if (value === undefined) return <span className="italic text-neutral-500">undefined</span>;
  if (typeof value === 'string') return <span>&quot;{value}&quot;</span>;
  if (typeof value === 'object') {
    let output;
    try { output = JSON.stringify(value, null, 2); } catch { output = String(value); }
    return <span className="whitespace-pre-wrap">{output}</span>;
  }
  return <span>{String(value)}</span>;
}

export default function InteractiveConsole({ logs = [], onClearLogs, onEvaluate, iframeRef }) {
  const [activeTab, setActiveTab] = useState('terminal');
  const [viewportMode, setViewportMode] = useState('desktop');
  const [replInput, setReplInput] = useState('');
  const logsEndRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'terminal') logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, activeTab]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const command = replInput.trim();
    if (!command) return;
    onEvaluate?.(command);
    setReplInput('');
  };

  const reloadPreview = () => {
    if (iframeRef?.current) {
      const source = iframeRef.current.getAttribute('srcdoc') || '';
      iframeRef.current.removeAttribute('srcdoc');
      iframeRef.current.setAttribute('srcdoc', source);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden border-l border-neutral-800 bg-[#0b0b0b] text-neutral-300">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-neutral-800 bg-[#101010] px-2">
        <div className="flex h-full items-center">
          <button type="button" onClick={() => setActiveTab('terminal')} className={`flex h-full items-center gap-1.5 border-b-2 px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition ${activeTab === 'terminal' ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}>
            <Terminal className="h-3.5 w-3.5" /> Console
            {logs.length > 0 && <span className="bg-neutral-800 px-1.5 py-0.5 text-[8px] text-neutral-300">{logs.length}</span>}
          </button>
          <button type="button" onClick={() => setActiveTab('browser')} className={`flex h-full items-center gap-1.5 border-b-2 px-2.5 font-mono text-[10px] font-bold uppercase tracking-wider transition ${activeTab === 'browser' ? 'border-white text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}>
            <Monitor className="h-3.5 w-3.5" /> Preview
          </button>
        </div>

        {activeTab === 'terminal' ? (
          <button type="button" onClick={onClearLogs} className="p-2 text-neutral-500 transition hover:text-white" title="Limpar console"><Trash2 className="h-3.5 w-3.5" /></button>
        ) : (
          <div className="flex items-center">
            <button type="button" onClick={() => setViewportMode('desktop')} className={`p-2 ${viewportMode === 'desktop' ? 'text-white' : 'text-neutral-600 hover:text-neutral-300'}`} title="Desktop"><Monitor className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => setViewportMode('mobile')} className={`p-2 ${viewportMode === 'mobile' ? 'text-white' : 'text-neutral-600 hover:text-neutral-300'}`} title="Mobile"><Smartphone className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={reloadPreview} className="p-2 text-neutral-600 hover:text-white" title="Recarregar"><RefreshCw className="h-3.5 w-3.5" /></button>
          </div>
        )}
      </div>

      <div className={`min-h-0 flex-1 flex-col ${activeTab === 'terminal' ? 'flex' : 'hidden'}`}>
        <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-neutral-600">
          <span>JavaScript runtime</span><span>Logs em tempo real</span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-5">
          {logs.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-neutral-600">
              <Terminal className="mb-3 h-7 w-7" strokeWidth={1.3} />
              <p className="text-xs text-neutral-500">O console está pronto.</p>
              <p className="mt-1 max-w-[230px] text-[10px] leading-4">Execute o código ou teste uma expressão no campo abaixo.</p>
            </div>
          ) : logs.map((log, index) => {
            const error = log.level === 'error';
            const warning = log.level === 'warn';
            const input = log.level === 'input';
            const output = log.level === 'output';
            return (
              <div key={`${log.time}-${index}`} className={`group flex gap-2 border-b border-neutral-900 py-2 ${error ? 'text-red-400' : warning ? 'text-amber-300' : input ? 'text-white' : output ? 'text-neutral-200' : 'text-neutral-400'}`}>
                <span className="w-14 shrink-0 text-[8px] text-neutral-700">{log.time || '--:--:--'}</span>
                {error ? <AlertCircle className="mt-1 h-3 w-3 shrink-0" /> : input ? <ChevronRight className="mt-1 h-3 w-3 shrink-0" /> : <span className="w-3 shrink-0 text-neutral-700">›</span>}
                <div className="min-w-0 flex-1 overflow-x-auto break-words">{log.raw !== undefined ? <FormattedValue value={log.raw} /> : log.msg}</div>
              </div>
            );
          })}
          <div ref={logsEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex h-11 shrink-0 items-center gap-2 border-t border-neutral-800 bg-[#101010] px-3">
          <ChevronRight className="h-3.5 w-3.5 text-white" />
          <input value={replInput} onChange={(event) => setReplInput(event.target.value)} placeholder="Digite uma expressão…" className="min-w-0 flex-1 border-0 bg-transparent font-mono text-[11px] text-white outline-none placeholder:text-neutral-700" aria-label="Expressão JavaScript" />
          <button type="submit" className="border border-neutral-700 px-2 py-1 font-mono text-[9px] text-neutral-400 transition hover:border-neutral-400 hover:text-white">Enter</button>
        </form>
      </div>

      <div className={`min-h-0 flex-1 flex-col ${activeTab === 'browser' ? 'flex' : 'hidden'}`}>
        <div className="flex h-9 shrink-0 items-center gap-2 border-b border-neutral-800 bg-[#101010] px-3">
          <span className="h-2 w-2 rounded-full bg-neutral-600" />
          <div className="min-w-0 flex-1 truncate bg-neutral-900 px-2 py-1 font-mono text-[9px] text-neutral-500">devpath.local/preview</div>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-neutral-900 p-2">
          <div className={`h-full overflow-hidden bg-white transition-[width] ${viewportMode === 'mobile' ? 'w-[375px] max-w-full' : 'w-full'}`}>
            <iframe ref={iframeRef} title="Preview do desafio" className="h-full w-full border-0 bg-white" sandbox="allow-scripts allow-modals allow-same-origin" />
          </div>
        </div>
      </div>
    </div>
  );
}
