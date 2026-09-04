import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCheck,
  Clock3,
  Code2,
  Copy,
  ExternalLink,
  GripVertical,
  Library,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelRight,
  Target,
  Terminal,
} from 'lucide-react';
import CodecademyEditor from '../components/CodecademyEditor';
import InteractiveConsole from '../components/InteractiveConsole';
import ValidationChecklist from '../components/ValidationChecklist';
import { useProgress } from '../context/ProgressContext';
import { jsRoadmapCourse } from '../data/roadmapData';

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

function LessonContent({ lessonText, objective, onContinue }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const chunks = (lessonText || '').split(/```/g);

  const copySnippet = async (code, index) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="border-l-2 border-neutral-950 pl-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500">Objetivo da aula</p>
        <p className="mt-2 text-sm font-semibold leading-6 text-neutral-950">{objective}</p>
      </div>

      {chunks.map((chunk, chunkIndex) => {
        if (!chunk.trim()) return null;
        if (chunkIndex % 2 === 1) {
          const lines = chunk.trim().split('\n');
          const language = lines[0].trim();
          const code = ['javascript', 'js', 'html', 'css'].includes(language) ? lines.slice(1).join('\n') : lines.join('\n');
          return (
            <div key={chunkIndex} className="overflow-hidden bg-neutral-950 text-neutral-200">
              <div className="flex h-9 items-center justify-between border-b border-neutral-800 px-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-500">{language || 'código'}</span>
                <button type="button" onClick={() => copySnippet(code, chunkIndex)} className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-500 transition hover:text-white">
                  {copiedIndex === chunkIndex ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedIndex === chunkIndex ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-5"><code>{code}</code></pre>
            </div>
          );
        }

        const sections = chunk.split(/(?=###\s)/g).filter((section) => section.trim());
        return sections.map((section, sectionIndex) => {
          const lines = section.trim().split('\n');
          const hasHeading = lines[0].startsWith('###');
          const heading = hasHeading ? lines[0].replace(/^###\s*/, '').replace(/^[^\p{L}\p{N}]+/u, '') : null;
          const body = (hasHeading ? lines.slice(1) : lines).filter((line) => line.trim());
          return (
            <section key={`${chunkIndex}-${sectionIndex}`}>
              {heading && <h3 className="mb-3 text-sm font-black tracking-[-0.02em] text-neutral-950">{heading}</h3>}
              <div className="space-y-2.5 text-xs leading-5 text-neutral-600">
                {body.map((line, lineIndex) => {
                  const list = line.trim().match(/^(\d+)\.\s+(.*)/);
                  if (list) return <div key={lineIndex} className="flex gap-3 border-t border-neutral-200 py-2.5 first:border-t-0"><span className="font-mono text-[9px] font-bold text-neutral-400">{String(list[1]).padStart(2, '0')}</span><p><InlineText text={list[2]} /></p></div>;
                  return <p key={lineIndex}><InlineText text={line.trim()} /></p>;
                })}
              </div>
            </section>
          );
        });
      })}

      <button type="button" onClick={onContinue} className="flex h-11 w-full items-center justify-center gap-2 bg-neutral-950 px-4 text-xs font-bold text-white transition hover:bg-neutral-700">
        Ir para o desafio <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function StageWorkspace({ stage }) {
  const navigate = useNavigate();
  const { isStageCompleted, completeStage, getStageFiles, saveStageFiles, resetStageFiles } = useProgress();

  const [searchParams] = useSearchParams();
  const [files, setFiles] = useState(() => stage ? getStageFiles(stage.id) : {});
  const [activeFile, setActiveFile] = useState(() => stage?.playground.activeFile || 'script.js');
  const [mobileTab, setMobileTab] = useState('lesson');
  const [instructionTab, setInstructionTab] = useState(() => searchParams.get('tab') || 'lesson');
  const [studyPanelMode, setStudyPanelMode] = useState('normal');
  const [studyPanelSide, setStudyPanelSide] = useState('left');
  const [studyPanelWidth, setStudyPanelWidth] = useState(420);
  const [taskResults, setTaskResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  // Uma etapa salva como concluída não deve aparecer validada antes de o aluno
  // executar o código desta sessão.
  const [allPassed, setAllPassed] = useState(false);
  const [logs, setLogs] = useState(() => [{ time: new Date().toLocaleTimeString(), level: 'info', msg: 'Ambiente pronto. Leia a aula e execute o desafio quando estiver preparado.' }]);
  const [showSuccess, setShowSuccess] = useState(false);
  const iframeRef = useRef(null);
  const capturedLogsRef = useRef([]);
  const workspaceRef = useRef(null);

  const tasks = useMemo(() => {
    if (!stage) return [];
    if (stage.playground?.tasks?.length) return stage.playground.tasks;
    return (stage.playground?.tests || []).map((test, index) => ({
      id: test.id || `task-${index + 1}`,
      description: test.description || `Requisito ${index + 1}`,
      hint: stage.instruction?.progressiveHints?.[index] || stage.instruction?.progressiveHints?.[0],
      check: test.check,
    }));
  }, [stage]);

  const generatePreview = useCallback(() => {
    const html = files['index.html'] || '';
    const css = files['style.css'] || '';
    const js = files['script.js'] || '';
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    const bodyContent = (bodyMatch?.[1] || html).replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, '');
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style><script>
      window.__scriptErrors = [];
      window.addEventListener('error', function(event) {
        window.__scriptErrors.push(event.message || 'Erro no script');
        window.parent.postMessage({ type: 'CONSOLE_LOG', level: 'error', message: event.message || 'Erro no script' }, '*');
      });
      ['log', 'warn', 'error'].forEach(function(level) {
        const original = console[level];
        console[level] = function(...args) {
          original.apply(console, args);
          window.parent.postMessage({ type: 'CONSOLE_LOG', level, raw: args.length === 1 ? args[0] : args, message: args.map(function(value) { try { return typeof value === 'object' ? JSON.stringify(value) : String(value); } catch { return String(value); } }).join(' ') }, '*');
        };
      });
    </script></head><body>${bodyContent}<script>try {
      ${js}
      window.__getVar = function(name) { try { return eval(name); } catch { return undefined; } };
    } catch (error) { window.__scriptErrors.push(error.message); console.error(error.message); }</script></body></html>`;
  }, [files]);

  useEffect(() => {
    if (iframeRef.current) iframeRef.current.srcdoc = generatePreview();
  }, [generatePreview]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type !== 'CONSOLE_LOG') return;
      const nextLog = { time: new Date().toLocaleTimeString(), level: event.data.level || 'log', msg: event.data.message, raw: event.data.raw };
      setLogs((current) => [...current.slice(-35), nextLog]);
      capturedLogsRef.current.push(event.data.message);
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCodeChange = (code) => {
    const updated = { ...files, [activeFile]: code };
    setFiles(updated);
    saveStageFiles(stage.id, updated);
  };

  const handleReset = () => {
    if (!window.confirm('Restaurar o código inicial? As alterações desta aula serão perdidas.')) return;
    resetStageFiles(stage.id);
    setFiles(stage.playground.files);
    setActiveFile(stage.playground.activeFile || 'script.js');
    setTaskResults({});
    setAllPassed(false);
    setLogs((current) => [...current, { time: new Date().toLocaleTimeString(), level: 'warn', msg: 'Código restaurado para a versão inicial.' }]);
  };

  const startStudyPanelResize = (event) => {
    if (studyPanelMode !== 'normal') return;
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = studyPanelWidth;
    const direction = studyPanelSide === 'left' ? 1 : -1;

    const handlePointerMove = (moveEvent) => {
      const workspaceWidth = workspaceRef.current?.getBoundingClientRect().width || window.innerWidth;
      const nextWidth = startWidth + ((moveEvent.clientX - startX) * direction);
      setStudyPanelWidth(Math.min(Math.max(nextWidth, 300), workspaceWidth * 0.7));
    };
    const stopResize = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', stopResize);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', stopResize);
  };

  const handleEvaluate = (expression) => {
    try {
      const result = iframeRef.current?.contentWindow?.eval(expression);
      setLogs((current) => [...current, { time: new Date().toLocaleTimeString(), level: 'input', msg: expression }, { time: new Date().toLocaleTimeString(), level: 'output', raw: result, msg: String(result) }]);
    } catch (error) {
      setLogs((current) => [...current, { time: new Date().toLocaleTimeString(), level: 'error', msg: error.message }]);
    }
  };

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setTaskResults({});
    capturedLogsRef.current = [];
    const iframe = iframeRef.current;
    if (!iframe) { setIsRunning(false); return; }
    iframe.srcdoc = generatePreview();

    setTimeout(() => {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow || {};
      const helpers = {
        source: files['script.js'] || '',
        files,
        getVar: (name) => {
          try {
            const value = win.__getVar?.(name);
            if (value !== undefined) return value;
            if (win[name] !== undefined) return win[name];
            return win.eval?.(`typeof ${name} !== 'undefined' ? ${name} : undefined`);
          } catch { return undefined; }
        },
        logs: capturedLogsRef.current,
        errors: win.__scriptErrors || [],
      };

      if (helpers.errors.length) {
        const firstTask = tasks[0];
        setTaskResults({ [firstTask?.id || 'syntax-error']: { pass: false, tip: `Erro no script: ${helpers.errors[0]}. Verifique a sintaxe no editor.` } });
        setAllPassed(false);
        setIsRunning(false);
        return;
      }

      const results = {};
      let passed = tasks.length > 0;
      tasks.forEach((task) => {
        try {
          const result = task.check(doc, win, helpers);
          results[task.id] = result?.pass ? { pass: true } : { pass: false, tip: result?.tip || 'Revise este requisito e tente novamente.' };
          if (!result?.pass) passed = false;
        } catch (error) {
          results[task.id] = { pass: false, tip: `Erro ao validar: ${error.message}` };
          passed = false;
        }
      });
      setTaskResults(results);
      setAllPassed(passed);
      setIsRunning(false);
      setInstructionTab('challenge');
      if (passed) {
        completeStage(stage.id);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2800);
      }
    }, 500);
  }, [completeStage, files, generatePreview, stage.id, tasks]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleRun();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [handleRun]);

  const currentIndex = jsRoadmapCourse.stages.findIndex((item) => item.id === stage.id);
  const previousStage = jsRoadmapCourse.stages[currentIndex - 1];
  const nextStage = jsRoadmapCourse.stages[currentIndex + 1];
  const module = jsRoadmapCourse.modules.find((item) => item.id === stage.moduleId);
  const completedCount = jsRoadmapCourse.stages.filter((item) => isStageCompleted(item.id)).length;
  const courseProgress = Math.round((completedCount / jsRoadmapCourse.stages.length) * 100);

  return (
    <div className="relative flex h-[calc(100vh-64px)] flex-col overflow-hidden bg-white text-neutral-950">
      {showSuccess && (
        <div className="pointer-events-none absolute inset-0 z-[60] grid place-items-center bg-black/35 p-4 backdrop-blur-[2px]">
          <div className="flex items-center gap-4 border border-neutral-950 bg-white p-5 shadow-2xl">
            <span className="grid h-10 w-10 place-items-center bg-neutral-950 text-white"><Check className="h-5 w-5" /></span>
            <div><h2 className="text-sm font-black">Aula concluída</h2><p className="mt-1 text-xs text-neutral-500">Todos os testes passaram. Bom trabalho.</p></div>
          </div>
        </div>
      )}

      <header className="flex min-h-14 shrink-0 items-center gap-4 border-b border-neutral-200 bg-[#f7f7f5] px-4">
        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="truncate text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">Módulo {module?.name.split('.')[0]} · {stage.category}</p>
          <h1 className="mt-0.5 truncate text-xs font-bold">{stage.title.replace(/^[^\p{L}\p{N}]+/u, '')}</h1>
        </div>
        <div className="flex flex-1 items-center gap-3 lg:max-w-xs">
          <span className="font-mono text-[9px] text-neutral-500">{String(stage.stepNumber).padStart(2, '0')}</span>
          <div className="h-1 flex-1 bg-neutral-200"><div className="h-full bg-neutral-950" style={{ width: `${courseProgress}%` }} /></div>
          <span className="font-mono text-[9px] text-neutral-500">{courseProgress}%</span>
        </div>
        <div className="flex items-center border border-neutral-300 bg-white">
          {previousStage ? <Link to={`/playground/${previousStage.id}`} className="grid h-8 w-8 place-items-center border-r border-neutral-300 text-neutral-500 transition hover:bg-neutral-950 hover:text-white" title="Aula anterior"><ArrowLeft className="h-3.5 w-3.5" /></Link> : <span className="h-8 w-8 border-r border-neutral-300" />}
          {nextStage ? <Link to={`/playground/${nextStage.id}`} className="grid h-8 w-8 place-items-center text-neutral-500 transition hover:bg-neutral-950 hover:text-white" title="Próxima aula"><ArrowRight className="h-3.5 w-3.5" /></Link> : <span className="h-8 w-8" />}
        </div>
      </header>

      <div className="grid h-12 shrink-0 grid-cols-3 border-b border-neutral-200 bg-white lg:hidden">
        {[
          { id: 'lesson', label: 'Aula', icon: BookOpen },
          { id: 'code', label: 'Editor', icon: Code2 },
          { id: 'output', label: 'Resultado', icon: Terminal },
        ].map((tab) => <button key={tab.id} type="button" onClick={() => setMobileTab(tab.id)} className={`flex items-center justify-center gap-1.5 border-b-2 text-[10px] font-bold uppercase tracking-wider ${mobileTab === tab.id ? 'border-neutral-950 text-neutral-950' : 'border-transparent text-neutral-400'}`}><tab.icon className="h-3.5 w-3.5" />{tab.label}</button>)}
      </div>

      <div ref={workspaceRef} className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        <aside
          className={`${mobileTab === 'lesson' ? 'flex' : 'hidden'} ${studyPanelSide === 'right' ? 'lg:order-3 lg:border-l' : 'lg:order-1 lg:border-r'} relative min-h-0 max-lg:!w-full flex-col border-neutral-200 bg-white lg:flex ${studyPanelMode === 'maximized' ? 'lg:absolute lg:inset-0 lg:z-40 lg:w-full' : ''}`}
          style={studyPanelMode === 'normal' ? { width: `${studyPanelWidth}px`, flex: '0 0 auto' } : studyPanelMode === 'minimized' ? { width: '52px', flex: '0 0 auto' } : undefined}
        >
          <div className="hidden h-10 shrink-0 items-center justify-between border-b border-neutral-200 bg-white pl-3 lg:flex">
            <div className={`${studyPanelMode === 'minimized' ? 'hidden' : 'flex'} min-w-0 items-center gap-2`}>
              <GripVertical className="h-3.5 w-3.5 text-neutral-400" />
              <span className="truncate text-[9px] font-bold uppercase tracking-[0.14em] text-neutral-500">Zona de aula e desafios</span>
            </div>
            <div className="ml-auto flex h-full items-center">
              {studyPanelMode !== 'minimized' && <button type="button" onClick={() => setStudyPanelSide((side) => side === 'left' ? 'right' : 'left')} className="grid h-full w-9 place-items-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950" title={`Encostar à ${studyPanelSide === 'left' ? 'direita' : 'esquerda'}`} aria-label={`Encostar painel à ${studyPanelSide === 'left' ? 'direita' : 'esquerda'}`}><PanelRight className={`h-3.5 w-3.5 ${studyPanelSide === 'right' ? 'rotate-180' : ''}`} /></button>}
              <button type="button" onClick={() => setStudyPanelMode((mode) => mode === 'minimized' ? 'normal' : 'minimized')} className="grid h-full w-9 place-items-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950" title={studyPanelMode === 'minimized' ? 'Abrir zona de aula' : 'Reduzir zona de aula'} aria-label={studyPanelMode === 'minimized' ? 'Abrir zona de aula' : 'Reduzir zona de aula'}>{studyPanelMode === 'minimized' ? <BookOpen className="h-4 w-4" /> : <PanelLeftClose className="h-3.5 w-3.5" />}</button>
              {studyPanelMode !== 'minimized' && <button type="button" onClick={() => setStudyPanelMode((mode) => mode === 'maximized' ? 'normal' : 'maximized')} className="grid h-full w-9 place-items-center text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950" title={studyPanelMode === 'maximized' ? 'Restaurar tamanho' : 'Maximizar zona de aula'} aria-label={studyPanelMode === 'maximized' ? 'Restaurar tamanho' : 'Maximizar zona de aula'}>{studyPanelMode === 'maximized' ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}</button>}
            </div>
          </div>
          <div className={studyPanelMode === 'minimized' ? 'hidden' : 'contents'}>
          <div className="grid h-11 shrink-0 grid-cols-3 border-b border-neutral-200 bg-[#f7f7f5] p-1">
            {[
              { id: 'lesson', label: '1. Aula' },
              { id: 'challenge', label: '2. Desafio' },
              { id: 'resources', label: '3. Fontes' },
            ].map((tab) => <button key={tab.id} type="button" onClick={() => setInstructionTab(tab.id)} className={`text-[9px] font-bold uppercase tracking-wider transition ${instructionTab === tab.id ? 'bg-neutral-950 text-white' : 'text-neutral-500 hover:text-neutral-950'}`}>{tab.label}</button>)}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5 select-text">
            {instructionTab === 'lesson' && <LessonContent lessonText={stage.instruction.deepLesson} objective={stage.instruction.learningObjective} onContinue={() => setInstructionTab('challenge')} />}
            {instructionTab === 'challenge' && (
              <div>
                <div className="mb-5">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500"><Target className="h-3.5 w-3.5" /> Sua tarefa</div>
                  <p className="mt-3 text-sm font-semibold leading-6 text-neutral-950"><InlineText text={stage.instruction.taskDescription} /></p>
                  <div className="mt-4 flex items-center gap-2 border-y border-neutral-200 py-3 text-[10px] text-neutral-500"><Clock3 className="h-3.5 w-3.5" /> Tempo estimado: {stage.estimatedMinutes} minutos</div>
                </div>
                <div className="mb-4 border border-neutral-200 bg-[#f7f7f5] p-3 text-xs leading-5 text-neutral-600">
                  <strong className="block text-[10px] uppercase tracking-wider text-neutral-950">Como avançar</strong>
                  Leia cada requisito, implemente no editor e use <strong>Executar código</strong>. Se algo falhar, verá uma indicação específica e poderá abrir uma dica em cada passo.
                </div>
                <ValidationChecklist tasks={tasks} taskResults={taskResults} allPassed={allPassed} onNextStage={() => nextStage && navigate(`/playground/${nextStage.id}`)} hasNextStage={Boolean(nextStage)} />
              </div>
            )}
            {instructionTab === 'resources' && (
              <div>
                <div className="mb-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500"><Library className="h-3.5 w-3.5" /> Para aprofundar</div>
                <div className="space-y-3">
                  {stage.instruction.curatedLinks?.map((resource) => (
                    <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="group block border border-neutral-200 p-4 transition hover:border-neutral-950">
                      <div className="flex items-start justify-between gap-3"><span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">{resource.source}</span><ExternalLink className="h-3.5 w-3.5 text-neutral-400 transition group-hover:text-neutral-950" /></div>
                      <h3 className="mt-2 text-sm font-bold">{resource.title}</h3><p className="mt-2 text-xs leading-5 text-neutral-500">{resource.summary}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
          {studyPanelMode === 'normal' && <button type="button" onPointerDown={startStudyPanelResize} className={`absolute top-0 z-20 hidden h-full w-3 cursor-col-resize touch-none items-center justify-center lg:flex ${studyPanelSide === 'left' ? '-right-1.5' : '-left-1.5'}`} title="Arrastar para redimensionar" aria-label="Redimensionar zona de aula"><span className="h-12 w-1 bg-neutral-300 transition hover:bg-neutral-950" /></button>}
        </aside>

        <section className={`${mobileTab === 'code' ? 'flex' : 'hidden'} min-h-0 min-w-0 flex-1 lg:order-2 lg:flex`}>
          <CodecademyEditor files={files} activeFile={activeFile} onFileChange={setActiveFile} onCodeChange={handleCodeChange} onResetFile={handleReset} onRun={handleRun} isRunning={isRunning} allPassed={allPassed} />
        </section>

        <section className={`${mobileTab === 'output' ? 'flex' : 'hidden'} min-h-0 min-w-0 lg:order-2 lg:flex lg:w-[28%] lg:flex-none`}>
          <InteractiveConsole logs={logs} onClearLogs={() => setLogs([])} onEvaluate={handleEvaluate} iframeRef={iframeRef} />
        </section>
      </div>
    </div>
  );
}

export default function StagePlaygroundPage() {
  const { stageId } = useParams();
  const stage = jsRoadmapCourse.stages.find((item) => item.id === stageId);
  if (!stage) return <div className="grid min-h-[calc(100vh-64px)] place-items-center bg-[#f7f7f5]"><div className="text-center"><h1 className="text-xl font-bold">Aula não encontrada</h1><Link to="/" className="mt-3 inline-block text-sm underline">Voltar à trilha</Link></div></div>;
  return <StageWorkspace key={stageId} stage={stage} />;
}
