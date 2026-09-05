import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/common/Navbar';
import RoadmapPage from './pages/RoadmapPage';
import { roadmapCourse } from './data/roadmapData';

const StagePlaygroundPage = lazy(() => import('./pages/StagePlaygroundPage'));

class PageErrorBoundary extends React.Component {
  state = { failed: false, resetKey: this.props.resetKey };
  static getDerivedStateFromProps(props, state) {
    return props.resetKey !== state.resetKey ? { failed: false, resetKey: props.resetKey } : null;
  }
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <main id="main-content" className="mx-auto max-w-lg px-6 py-24 text-center"><h1 className="text-2xl font-bold">Não foi possível abrir esta página</h1><p className="mt-3 text-sm leading-6 text-neutral-600">Tente carregar novamente. O progresso salvo neste navegador será mantido.</p><button onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Tentar novamente</button><a href="/" className="ml-4 text-sm underline">Voltar à trilha</a></main>;
    return this.props.children;
  }
}

function PageFallback() {
  return (
    <main id="main-content" tabIndex={-1} role="status" aria-live="polite" className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f7f7f5] text-sm text-neutral-500">
      A carregar…
    </main>
  );
}

function PageRoutes() {
  const location = useLocation();
  const previousPath = useRef(null);

  useEffect(() => {
    const stageId = location.pathname.startsWith('/playground/') ? location.pathname.split('/').at(-1) : null;
    const stage = roadmapCourse.stages.find((item) => item.id === stageId);
    document.title = stage ? `Aula ${stage.stepNumber}: ${stage.title.replace(/^[^\p{L}\p{N}]+/u, '')} | DevPath` : 'DevPath — Formação JavaScript do zero ao Master';

    const hasChanged = previousPath.current !== location.pathname;
    const shouldFocus = previousPath.current !== null && hasChanged;
    previousPath.current = location.pathname;
    if (!hasChanged) return;

    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      if (shouldFocus) document.getElementById('main-content')?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname, location.hash]);

  return (
    <PageErrorBoundary resetKey={location.pathname}>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<RoadmapPage />} />
          <Route path="/playground/:stageId" element={<StagePlaygroundPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </PageErrorBoundary>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-[#f7f7f5] font-sans text-neutral-950 selection:bg-neutral-950 selection:text-white">
          <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
          <Navbar />
          <PageRoutes />
        </div>
      </BrowserRouter>
    </ProgressProvider>
  );
}
