import { useState } from 'react';
import { LandingHero } from './components/LandingHero';

export function App() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [autoDemo, setAutoDemo] = useState(false);

  const handleOpenWorkspace = (runDemo = false) => {
    setAutoDemo(runDemo);
    setView('studio');
  };

  if (view === 'landing') {
    return <LandingHero onOpenWorkspace={handleOpenWorkspace} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <header style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>EduStar Studio {autoDemo ? '· Demo' : ''}</span>
        <button className="btn btn--sm" onClick={() => setView('landing')}>
          Overview
        </button>
      </header>
      <main style={{ padding: '32px 24px' }}>
        <p style={{ color: 'var(--muted)' }}>NotebookLM 3-Pane Workspace loading next...</p>
      </main>
    </div>
  );
}

export default App;
