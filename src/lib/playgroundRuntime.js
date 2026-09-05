// This bridge runs inside the preview, before the learner's script.
function installRuntime(storageKey) {
  let nativeStorage;
  try { nativeStorage = window.localStorage; } catch { /* Storage may be blocked by browser preferences. */ }
  let values = {};
  try { values = JSON.parse(nativeStorage.getItem(storageKey) || '{}'); } catch { /* Start with an empty exercise store. */ }
  if (!values || typeof values !== 'object' || Array.isArray(values)) values = {};
  const persist = () => { try { nativeStorage.setItem(storageKey, JSON.stringify(values)); } catch { /* Preview remains usable without storage. */ } };
  // Exercise clear() must never erase course progress or another project's data.
  Object.defineProperty(window, 'localStorage', { value: {
    getItem: (key) => Object.hasOwn(values, String(key)) ? String(values[String(key)]) : null,
    setItem: (key, value) => { Object.defineProperty(values, String(key), { value: String(value), enumerable: true, writable: true, configurable: true }); persist(); },
    removeItem: (key) => { delete values[String(key)]; persist(); },
    clear: () => { values = {}; persist(); },
    key: (index) => Object.keys(values)[index] ?? null,
    get length() { return Object.keys(values).length; },
  } });

  window.__scriptErrors = [];
  window.__consoleLogs = [];
  window.__consoleCalls = [];
  window.__reportScriptError = (error) => {
    const detail = { message: error?.message || String(error), stack: String(error?.stack || ''), line: error?.line, column: error?.column };
    window.__scriptErrors.push(detail);
    window.parent.postMessage({ type: 'SCRIPT_ERROR', error: detail }, '*');
  };
  window.addEventListener('error', (event) => window.__reportScriptError({ message: event.message, stack: event.error?.stack, line: event.lineno, column: event.colno }));
  window.addEventListener('unhandledrejection', (event) => window.__reportScriptError(event.reason));
  const format = (value) => {
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    try { return typeof value === 'object' ? JSON.stringify(value) : String(value); } catch { return String(value); }
  };
  ['log', 'info', 'warn', 'error', 'debug', 'table'].forEach((level) => {
    console[level] = (...args) => {
      const message = args.map(format).join(' ');
      window.__consoleLogs.push(message);
      window.__consoleCalls.push({ level, args });
      if (window.__consoleLogs.length > 300) window.__consoleLogs.shift();
      if (window.__consoleCalls.length > 300) window.__consoleCalls.shift();
      // Strings remain cloneable even for functions, DOM nodes, or circular data.
      window.parent.postMessage({ type: 'CONSOLE_LOG', level, message }, '*');
    };
  });
}

export function buildPreview(files, stageId) {
  const doc = new DOMParser().parseFromString(files['index.html'] || '<main></main>', 'text/html');
  doc.documentElement.lang ||= 'pt-BR';
  doc.querySelectorAll('script[src="script.js"], script[src="./script.js"], link[href="style.css"], link[href="./style.css"]').forEach((node) => node.remove());
  const bridge = doc.createElement('script');
  bridge.textContent = `(${installRuntime.toString()})(${JSON.stringify(`devpath_exercise_${stageId}`)});`;
  doc.head.prepend(bridge);
  const style = doc.createElement('style');
  style.textContent = files['style.css'] || '';
  doc.head.append(style);
  const script = doc.createElement('script');
  const code = `${files['script.js'] || ''}\n;window.__getVar = function(name) { try { return eval(name); } catch { return undefined; } };\nwindow.__evaluate = function(expression) { return eval(expression); };\n//# sourceURL=devpath-user.js`;
  script.textContent = `try { eval(${JSON.stringify(code).replace(/</g, '\\u003c')}); } catch (error) { window.__reportScriptError(error); }`;
  doc.body.append(script);
  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
}

export function withTimeout(promise, milliseconds = 6000) {
  let timeout;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error('O teste excedeu o tempo de espera. Verifique se a operação termina e tente novamente.')), milliseconds); }),
  ]).finally(() => clearTimeout(timeout));
}

export function loadPreview(iframe, html) {
  let onLoad;
  const loaded = new Promise((resolve) => {
    onLoad = () => resolve();
    iframe.addEventListener('load', onLoad, { once: true });
    iframe.srcdoc = html;
  });
  return withTimeout(loaded).finally(() => iframe.removeEventListener('load', onLoad));
}
