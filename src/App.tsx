import { useEffect, useState } from 'react';
import { BookOpenCheck, Sparkles } from 'lucide-react';
import { LandingHero } from './components/LandingHero';
import { SourcesPanel } from './components/SourcesPanel';
import { loadSources, saveSources } from './data/initialSources';
import { CourseSource } from './types/edustar';
import './styles/studio.css';

export function App() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [sources, setSources] = useState<CourseSource[]>(() => loadSources());
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    () => loadSources()[0]?.id ?? null
  );
  const [mobilePane, setMobilePane] = useState<'sources' | 'tutor' | 'studio'>('tutor');

  useEffect(() => {
    saveSources(sources);
  }, [sources]);

  const handleCreateSource = (draft: Omit<CourseSource, 'id' | 'updatedAt'>) => {
    const newSource: CourseSource = {
      ...draft,
      id: `src-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setSources((prev) => [newSource, ...prev]);
    setSelectedSourceId(newSource.id);
  };

  const handleUpdateSource = (id: string, patch: Partial<CourseSource>) => {
    setSources((prev) =>
      prev.map((src) =>
        src.id === id
          ? { ...src, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
          : src
      )
    );
  };

  const handleToggleStatus = (id: string) => {
    setSources((prev) =>
      prev.map((src) =>
        src.id === id
          ? {
              ...src,
              status: src.status === 'APPROVED' ? 'PENDING' : 'APPROVED',
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : src
      )
    );
  };

  const handleDeleteSource = (id: string) => {
    setSources((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (selectedSourceId === id) {
        setSelectedSourceId(next[0]?.id ?? null);
      }
      return next;
    });
  };

  if (view === 'landing') {
    return <LandingHero onOpenWorkspace={() => setView('studio')} />;
  }

  const approvedCount = sources.filter((s) => s.status === 'APPROVED').length;
  const pendingCount = sources.length - approvedCount;
  const selectedSource =
    sources.find((s) => s.id === selectedSourceId) ?? sources[0] ?? null;

  return (
    <div className="studio-shell">
      <header className="studio-topbar">
        <div className="studio-topbar__left">
          <button
            type="button"
            className="brand"
            style={{ background: 'none', border: 0, cursor: 'pointer', padding: 0 }}
            onClick={() => setView('landing')}
          >
            <span className="brand__mark" aria-hidden="true">
              <Sparkles size={14} />
            </span>
            EduStar
          </button>
          <span className="course-pill">
            <BookOpenCheck size={14} style={{ color: 'var(--accent)' }} />
            CS-301 · Operating Systems
          </span>
        </div>

        <div className="studio-topbar__right">
          <span className="badge badge--approved">{approvedCount} Approved</span>
          {pendingCount > 0 && (
            <span className="badge badge--pending">{pendingCount} Pending</span>
          )}
          <button
            type="button"
            className="btn btn--sm"
            onClick={() => setView('landing')}
          >
            Overview
          </button>
        </div>
      </header>

      <div className="studio-mobile-tabs" role="tablist" aria-label="Workspace panes">
        {(['sources', 'tutor', 'studio'] as const).map((pane) => (
          <button
            key={pane}
            type="button"
            className={`chip-tab ${mobilePane === pane ? 'is-active' : ''}`}
            onClick={() => setMobilePane(pane)}
          >
            {pane === 'sources' ? 'Sources' : pane === 'tutor' ? 'Tutor' : 'Proof & Eval'}
          </button>
        ))}
      </div>

      <main className="studio-grid">
        <SourcesPanel
          sources={sources}
          selectedSourceId={selectedSourceId}
          onSelectSource={(src) => {
            setSelectedSourceId(src.id);
            setMobilePane('studio');
          }}
          onCreateSource={handleCreateSource}
          onUpdateSource={handleUpdateSource}
          onToggleStatus={handleToggleStatus}
          onDeleteSource={handleDeleteSource}
          isHiddenOnMobile={mobilePane !== 'sources'}
        />

        <section
          className={`pane ${mobilePane !== 'tutor' ? 'is-mobile-hidden' : ''}`}
          aria-label="Tutor conversation"
        >
          <div className="pane__head">
            <h2 className="pane__title">Tutor Studio</h2>
          </div>
          <div className="pane__body">
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>
              Evidence Gate & Numerical Solver arriving in next step.
            </p>
          </div>
        </section>

        <aside
          className={`pane ${mobilePane !== 'studio' ? 'is-mobile-hidden' : ''}`}
          aria-label="Source proof and evaluation"
        >
          <div className="pane__head">
            <h2 className="pane__title">Source Proof</h2>
          </div>
          <div className="pane__body">
            {selectedSource ? (
              <div>
                <p className="mono" style={{ fontSize: 12, color: 'var(--accent)', margin: '0 0 6px' }}>
                  {selectedSource.unit} · {selectedSource.pageLabel}
                </p>
                <h3 style={{ margin: '0 0 10px', fontSize: 15 }}>{selectedSource.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-2)' }}>
                  {selectedSource.content}
                </p>
              </div>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: 13.5 }}>Select a source to inspect.</p>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
