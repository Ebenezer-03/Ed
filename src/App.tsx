import { useEffect, useState } from 'react';
import { BookOpenCheck, Sparkles } from 'lucide-react';
import { LandingHero } from './components/LandingHero';
import { SourcesPanel } from './components/SourcesPanel';
import { TutorPanel } from './components/TutorPanel';
import { loadSources, saveSources } from './data/initialSources';
import { evaluateQuestion } from './engine/evidenceGate';
import {
  CitationRef,
  CourseSource,
  TeacherGap,
  TutorMessage,
} from './types/edustar';
import './styles/studio.css';

const DEMO_QUERIES = [
  'What are the four necessary conditions for deadlock?',
  'Calculate FCFS average waiting time for P1=5, P2=3, P3=8',
  'Explain the TCP three-way handshake',
];

export function App() {
  const [view, setView] = useState<'landing' | 'studio'>('landing');
  const [sources, setSources] = useState<CourseSource[]>(() => loadSources());
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    () => loadSources()[0]?.id ?? null
  );
  const [activeExcerpt, setActiveExcerpt] = useState<string | null>(null);
  const [messages, setMessages] = useState<TutorMessage[]>([]);
  const [teacherGaps, setTeacherGaps] = useState<TeacherGap[]>([]);
  const [mobilePane, setMobilePane] = useState<'sources' | 'tutor' | 'studio'>('tutor');

  useEffect(() => {
    saveSources(sources);
  }, [sources]);

  const askQuestion = (question: string, currentSources = sources) => {
    const trimmed = question.trim();
    if (!trimmed) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const studentMsg: TutorMessage = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'student',
      answer: trimmed,
      timestamp: now,
    };

    const tutorMsg = evaluateQuestion(trimmed, currentSources);
    setMessages((prev) => [...prev, studentMsg, tutorMsg]);

    if (tutorMsg.citations && tutorMsg.citations.length > 0) {
      setSelectedSourceId(tutorMsg.citations[0].sourceId);
      setActiveExcerpt(tutorMsg.citations[0].excerpt);
    }

    if (tutorMsg.mode === 'UNSUPPORTED' && tutorMsg.missingTopic) {
      const missing = tutorMsg.missingTopic;
      setTeacherGaps((prev) => {
        const idx = prev.findIndex(
          (g) => g.missingTopic.toLowerCase() === missing.toLowerCase()
        );
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = {
            ...copy[idx],
            askedCount: copy[idx].askedCount + 1,
            lastAskedAt: now,
          };
          return copy;
        }
        return [
          {
            id: `gap-${Date.now()}`,
            query: trimmed,
            missingTopic: missing,
            askedCount: 1,
            lastAskedAt: now,
          },
          ...prev,
        ];
      });
    }
  };

  const runDemoSet = (targetSources = sources) => {
    const nextMessages: TutorMessage[] = [];
    const nextGaps: TeacherGap[] = [];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    for (const q of DEMO_QUERIES) {
      nextMessages.push({
        id: `demo-q-${Math.random().toString(36).slice(2, 7)}`,
        role: 'student',
        answer: q,
        timestamp: now,
      });
      const reply = evaluateQuestion(q, targetSources);
      nextMessages.push(reply);
      if (reply.mode === 'UNSUPPORTED' && reply.missingTopic) {
        nextGaps.push({
          id: `gap-${Math.random().toString(36).slice(2, 7)}`,
          query: q,
          missingTopic: reply.missingTopic,
          askedCount: 1,
          lastAskedAt: now,
        });
      }
    }

    setMessages(nextMessages);
    if (nextGaps.length > 0) {
      setTeacherGaps((prev) => {
        const merged = [...prev];
        for (const g of nextGaps) {
          if (!merged.some((m) => m.missingTopic.toLowerCase() === g.missingTopic.toLowerCase())) {
            merged.unshift(g);
          }
        }
        return merged;
      });
    }
    const firstCitation = nextMessages.find((m) => m.citations?.length)?.citations?.[0];
    if (firstCitation) {
      setSelectedSourceId(firstCitation.sourceId);
      setActiveExcerpt(firstCitation.excerpt);
    }
  };

  const handleOpenWorkspace = (runDemo = false) => {
    setView('studio');
    if (runDemo) {
      runDemoSet();
    }
  };

  const handleCreateSource = (draft: Omit<CourseSource, 'id' | 'updatedAt'>) => {
    const newSource: CourseSource = {
      ...draft,
      id: `src-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setSources((prev) => [newSource, ...prev]);
    setSelectedSourceId(newSource.id);
    setActiveExcerpt(null);
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
        setActiveExcerpt(null);
      }
      return next;
    });
  };

  const handleSelectCitation = (citation: CitationRef) => {
    setSelectedSourceId(citation.sourceId);
    setActiveExcerpt(citation.excerpt);
    setMobilePane('studio');
  };

  if (view === 'landing') {
    return <LandingHero onOpenWorkspace={handleOpenWorkspace} />;
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
            setActiveExcerpt(null);
            setMobilePane('studio');
          }}
          onCreateSource={handleCreateSource}
          onUpdateSource={handleUpdateSource}
          onToggleStatus={handleToggleStatus}
          onDeleteSource={handleDeleteSource}
          isHiddenOnMobile={mobilePane !== 'sources'}
        />

        <TutorPanel
          messages={messages}
          approvedCount={approvedCount}
          onAskQuestion={(q) => askQuestion(q)}
          onSelectCitation={handleSelectCitation}
          onRunDemoSet={() => runDemoSet()}
          isHiddenOnMobile={mobilePane !== 'tutor'}
        />

        <aside
          className={`pane ${mobilePane !== 'studio' ? 'is-mobile-hidden' : ''}`}
          aria-label="Source proof and evaluation"
        >
          <div className="pane__head">
            <h2 className="pane__title">Source Proof ({teacherGaps.length} gaps)</h2>
          </div>
          <div className="pane__body">
            {selectedSource ? (
              <div>
                <p className="mono" style={{ fontSize: 12, color: 'var(--accent)', margin: '0 0 6px' }}>
                  {selectedSource.unit} · {selectedSource.pageLabel}
                </p>
                <h3 style={{ margin: '0 0 10px', fontSize: 15 }}>{selectedSource.title}</h3>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-2)' }}>
                  {activeExcerpt ? (
                    <mark className="proof-mark">{activeExcerpt}</mark>
                  ) : (
                    selectedSource.content
                  )}
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
