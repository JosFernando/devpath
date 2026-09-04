import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Navbar from './components/common/Navbar';
import RoadmapPage from './pages/RoadmapPage';

const StagePlaygroundPage = lazy(() => import('./pages/StagePlaygroundPage'));

function PageFallback() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f7f7f5] text-sm text-neutral-500">
      A carregar…
    </div>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col bg-[#f7f7f5] font-sans text-neutral-950 selection:bg-neutral-950 selection:text-white">
          <Navbar />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<RoadmapPage />} />
              <Route path="/playground/:stageId" element={<StagePlaygroundPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ProgressProvider>
  );
}
