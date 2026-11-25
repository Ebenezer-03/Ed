import { useState } from 'react';

export function App() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');

  return (
    <div data-view={view} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>EduStar</span>
        <button className="btn btn--primary btn--sm" onClick={() => setView(view === 'landing' ? 'studio' : 'landing')}>
          {view === 'landing' ? 'Open Workspace' : 'Back to Overview'}
        </button>
      </header>
      <main style={{ padding: '48px 24px', textAlign: 'center' }}>
        <h1>EduStar Prototype Shell</h1>
      </main>
    </div>
  );
}

export default App;
