import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Check, CheckCheck, Copy, FileCode2, Loader2, Play, RotateCcw, Wand2 } from 'lucide-react';

const fileLabel = (fileName) => {
  if (fileName.endsWith('.js')) return 'JS';
  if (fileName.endsWith('.html')) return '<>';
  if (fileName.endsWith('.css')) return '#';
  return '•';
};

const fileLanguage = (fileName) => {
  if (fileName.endsWith('.js')) return 'javascript';
  if (fileName.endsWith('.html')) return 'html';
  if (fileName.endsWith('.css')) return 'css';
  return 'plaintext';
};

export default function CodecademyEditor({
  stageId,
  storageError,
  files,
  activeFile,
  onFileChange,
  onCodeChange,
  onResetFile,
  onRun,
  isRunning,
  allPassed,
  focusLocation,
  onDiagnosticsChange,
}) {
  const editorRef = useRef(null);
  const onRunRef = useRef(onRun);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [simpleEditor, setSimpleEditor] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  const codeContent = files[activeFile] || '';

  useEffect(() => {
    onRunRef.current = onRun;
  }, [onRun]);

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    setEditorReady(true);
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: true,
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current?.());
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 1600);
    } catch { setCopyError(true); }
  };

  useEffect(() => {
    if (!editorRef.current || focusLocation?.file !== activeFile) return;
    const lineNumber = Math.max(1, focusLocation.line || 1);
    const column = Math.max(1, focusLocation.column || 1);
    const frame = requestAnimationFrame(() => {
      editorRef.current?.focus();
      editorRef.current?.setPosition({ lineNumber, column });
      editorRef.current?.revealLineInCenter(lineNumber);
    });
    return () => cancelAnimationFrame(frame);
  }, [activeFile, focusLocation]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#111111] text-neutral-200">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-neutral-800 bg-[#0b0b0b]">
        <div className="flex min-w-0 flex-1 self-stretch overflow-x-auto">
          {Object.keys(files).map((fileName) => {
            const active = fileName === activeFile;
            return (
              <button
                key={fileName}
                type="button"
                onClick={() => onFileChange(fileName)}
                className={`flex shrink-0 items-center gap-2 border-r border-neutral-800 px-3.5 font-mono text-[11px] transition ${active ? 'border-t-2 border-t-white bg-[#151515] text-white' : 'border-t-2 border-t-transparent text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'}`}
              >
                <span className={`grid h-4 min-w-4 place-items-center text-[8px] font-bold ${active ? 'text-white' : 'text-neutral-600'}`}>{fileLabel(fileName)}</span>
                {fileName}
              </button>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 px-2">
          <button type="button" aria-pressed={simpleEditor} onClick={() => setSimpleEditor((value) => !value)} className="px-2 py-2 text-[10px] text-neutral-400 hover:text-white" title="Alternar editor simples, sem carregamento externo">{simpleEditor ? 'Avançado' : 'Simples'}</button>
          <button type="button" disabled={simpleEditor || !editorReady || isRunning} onClick={() => editorRef.current?.getAction('editor.action.formatDocument')?.run()} className="p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-white disabled:opacity-30" title="Formatar código" aria-label="Formatar código">
            <Wand2 className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={copyCode} className="p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-white" title="Copiar arquivo" aria-label="Copiar arquivo">
            {copied ? <CheckCheck className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button type="button" disabled={isRunning} onClick={onResetFile} className="p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-white disabled:opacity-30" title="Restaurar exercício" aria-label="Restaurar exercício">
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {copyError && <p role="status" className="bg-amber-950 px-3 py-2 text-xs text-amber-200">Não foi possível copiar. Selecione o código e use Ctrl+C.</p>}
      {storageError && <p role="status" className="bg-amber-950 px-3 py-2 text-xs text-amber-200">Não foi possível salvar neste navegador. Copie seu código antes de sair.</p>}

      <div className="relative min-h-0 flex-1">
        {simpleEditor ? <textarea aria-label={`Código de ${activeFile}`} value={codeContent} onChange={(event) => onCodeChange(event.target.value)} readOnly={isRunning} spellCheck={false} autoCapitalize="off" autoCorrect="off" className="h-full w-full resize-none border-0 bg-[#111111] p-4 font-mono text-[13px] leading-6 text-neutral-200 outline-none" onKeyDown={(event) => {
          if (event.key !== 'Tab' || isRunning) return;
          event.preventDefault();
          const { selectionStart, selectionEnd } = event.currentTarget;
          onCodeChange(`${codeContent.slice(0, selectionStart)}  ${codeContent.slice(selectionEnd)}`);
          const input = event.currentTarget;
          requestAnimationFrame(() => { input.selectionStart = input.selectionEnd = selectionStart + 2; });
        }} /> : <Editor
          height="100%"
          path={`${stageId}/${activeFile}`}
          language={fileLanguage(activeFile)}
          theme="vs-dark"
          value={codeContent}
          onChange={(value) => onCodeChange(value || '')}
          onValidate={(markers) => onDiagnosticsChange?.(activeFile, markers)}
          onMount={handleEditorMount}
          loading={<div className="flex h-full flex-col items-center justify-center gap-3 bg-[#111111] px-5 text-center font-mono text-xs text-neutral-400"><Loader2 className="h-4 w-4 animate-spin" /><p>A preparar o editor…</p><button type="button" onClick={() => setSimpleEditor(true)} className="rounded border border-neutral-600 px-3 py-2 text-neutral-200">Continuar no editor simples</button></div>}
          options={{
            readOnly: isRunning,
            ariaLabel: `Código de ${activeFile}`,
            fontSize: 13,
            fontFamily: "'Cascadia Code', 'Fira Code', Consolas, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            lineNumbersMinChars: 3,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            bracketPairColorization: { enabled: true },
            smoothScrolling: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: { other: true, comments: false, strings: true },
            parameterHints: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            renderLineHighlight: 'line',
            padding: { top: 16, bottom: 16 },
          }}
        />}
      </div>

      <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-t border-neutral-800 bg-[#0b0b0b] px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[10px] text-neutral-500">
          <FileCode2 className="h-3.5 w-3.5" />
          <span className="truncate">{activeFile}</span>
          <span className="hidden sm:inline">· {codeContent.split('\n').length} linhas</span>
          <span className="hidden xl:inline">· {storageError ? 'não salvo' : 'salvo neste navegador'}</span>
        </div>
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className={`inline-flex h-9 shrink-0 items-center gap-2 px-4 text-xs font-bold transition ${allPassed ? 'bg-white text-neutral-950 hover:bg-neutral-200' : 'bg-white text-neutral-950 hover:bg-neutral-200'} disabled:cursor-wait disabled:opacity-60`}
          title="Executar e validar (Ctrl + Enter)"
        >
          {isRunning ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : allPassed ? <Check className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          <span>{isRunning ? 'A validar…' : allPassed ? 'Executar novamente' : 'Executar código'}</span>
          <kbd className="hidden border border-neutral-300 px-1 py-0.5 font-mono text-[8px] font-normal text-neutral-500 sm:inline">Ctrl↵</kbd>
        </button>
      </div>
    </div>
  );
}
