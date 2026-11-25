import { useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  FlaskConical,
  Play,
  ShieldAlert,
} from 'lucide-react';
import {
  BenchmarkSummary,
  runEvaluationBenchmark,
} from '../data/evalBenchmark';
import { CourseSource, EvalResult, TeacherGap } from '../types/edustar';

interface StudioDrawerProps {
  sources: CourseSource[];
  selectedSource: CourseSource | null;
  activeExcerpt: string | null;
  teacherGaps: TeacherGap[];
  onApproveSource: (id: string) => void;
  onClearGaps: () => void;
  isHiddenOnMobile?: boolean;
}

type DrawerTab = 'proof' | 'gaps' | 'eval';

function renderHighlightedContent(content: string, excerpt: string | null) {
  if (!excerpt) return content;
  const idx = content.indexOf(excerpt);
  if (idx < 0) return content;
  const before = content.slice(0, idx);
  const after = content.slice(idx + excerpt.length);
  return (
    <>
      {before}
      <mark className="proof-mark">{excerpt}</mark>
      {after}
    </>
  );
}

export function StudioDrawer({
  sources,
  selectedSource,
  activeExcerpt,
  teacherGaps,
  onApproveSource,
  onClearGaps,
  isHiddenOnMobile = false,
}: StudioDrawerProps) {
  const [tab, setTab] = useState<DrawerTab>('proof');
  const [evalRun, setEvalRun] = useState<{
    results: EvalResult[];
    summary: BenchmarkSummary;
  } | null>(null);

  const handleRunEval = () => {
    setEvalRun(runEvaluationBenchmark(sources));
  };

  return (
    <aside
      className={`pane ${isHiddenOnMobile ? 'is-mobile-hidden' : ''}`}
      aria-label="Source proof, teacher gaps, and evaluation"
    >
      <div className="pane__head" style={{ padding: '10px 12px' }}>
        <div className="drawer-tabs" role="tablist" aria-label="Studio tools">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'proof'}
            className={`chip-tab ${tab === 'proof' ? 'is-active' : ''}`}
            onClick={() => setTab('proof')}
          >
            <BookOpen size={12} /> Proof
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'gaps'}
            className={`chip-tab ${tab === 'gaps' ? 'is-active' : ''}`}
            onClick={() => setTab('gaps')}
          >
            <AlertTriangle size={12} /> Gaps ({teacherGaps.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'eval'}
            className={`chip-tab ${tab === 'eval' ? 'is-active' : ''}`}
            onClick={() => setTab('eval')}
          >
            <FlaskConical size={12} /> 30Q Eval
          </button>
        </div>
      </div>

      <div className="pane__body">
        {tab === 'proof' && (
          <div className="proof-view">
            {selectedSource ? (
              <>
                <div className="proof-meta">
                  <span className="mono proof-meta__loc">
                    {selectedSource.unit} · {selectedSource.pageLabel}
                  </span>
                  <span
                    className={`badge ${
                      selectedSource.status === 'APPROVED'
                        ? 'badge--approved'
                        : 'badge--pending'
                    }`}
                  >
                    {selectedSource.status === 'APPROVED' ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <h3 className="proof-title">{selectedSource.title}</h3>
                <p className="proof-section">{selectedSource.section}</p>
                <div className="proof-page">
                  <div className="mono proof-page__header">
                    <span>EXCERPT VERIFICATION</span>
                    <span>{activeExcerpt ? 'EXACT SPAN MATCH' : 'FULL CHUNK'}</span>
                  </div>
                  <p className="proof-page__body">
                    {renderHighlightedContent(selectedSource.content, activeExcerpt)}
                  </p>
                </div>
              </>
            ) : (
              <p className="muted-copy">
                Select any source or click a citation pill in Tutor Studio to inspect
                the page text.
              </p>
            )}
          </div>
        )}

        {tab === 'gaps' && (
          <div className="gaps-view">
            <div className="gaps-head">
              <p className="muted-copy" style={{ margin: 0 }}>
                Questions blocked by the Evidence Gate appear here for teacher review.
              </p>
              {teacherGaps.length > 0 && (
                <button
                  type="button"
                  className="icon-btn"
                  onClick={onClearGaps}
                >
                  Clear
                </button>
              )}
            </div>

            {teacherGaps.length === 0 ? (
              <div className="empty-box">
                <ShieldAlert size={22} style={{ color: 'var(--muted)' }} />
                <p>No blocked queries logged yet. Try asking an unsupported question.</p>
              </div>
            ) : (
              <div className="gap-list">
                {teacherGaps.map((gap) => {
                  const pendingMatch = sources.find(
                    (s) =>
                      s.status === 'PENDING' &&
                      (`${s.title} ${s.section} ${s.content}`
                        .toLowerCase()
                        .includes(gap.missingTopic.toLowerCase().split(' ')[0]))
                  );
                  return (
                    <div key={gap.id} className="gap-card">
                      <div className="gap-card__top">
                        <strong>{gap.missingTopic}</strong>
                        <span className="badge badge--pending">
                          {gap.askedCount}x blocked
                        </span>
                      </div>
                      <p className="gap-card__q">“{gap.query}”</p>
                      {pendingMatch && (
                        <button
                          type="button"
                          className="btn btn--sm btn--primary"
                          onClick={() => onApproveSource(pendingMatch.id)}
                        >
                          <CheckCircle2 size={13} /> Approve {pendingMatch.unit}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'eval' && (
          <div className="eval-view">
            <div className="eval-header">
              <div>
                <h3 style={{ margin: 0, fontSize: 15 }}>30-Question Syllabus Suite</h3>
                <p className="muted-copy" style={{ margin: '4px 0 0' }}>
                  10 Factual · 10 Numerical · 10 Unsupported against active approved notes.
                </p>
              </div>
              <button
                type="button"
                className="btn btn--sm btn--primary"
                onClick={handleRunEval}
              >
                <Play size={13} /> Run 30Q Eval
              </button>
            </div>

            {evalRun && (
              <>
                <div className="eval-metrics">
                  <div className="metric-box">
                    <span className="mono metric-box__val">
                      {evalRun.summary.passed}/{evalRun.summary.total}
                    </span>
                    <span className="metric-box__lbl">Overall Pass</span>
                  </div>
                  <div className="metric-box">
                    <span className="mono metric-box__val">
                      {evalRun.summary.factualAcc}%
                    </span>
                    <span className="metric-box__lbl">Factual</span>
                  </div>
                  <div className="metric-box">
                    <span className="mono metric-box__val">
                      {evalRun.summary.numericalAcc}%
                    </span>
                    <span className="metric-box__lbl">Numerical</span>
                  </div>
                  <div className="metric-box">
                    <span className="mono metric-box__val">
                      {evalRun.summary.refusalAcc}%
                    </span>
                    <span className="metric-box__lbl">Refusal</span>
                  </div>
                </div>

                <ul className="eval-list">
                  {evalRun.results.map((item) => (
                    <li
                      key={item.caseId}
                      className={`eval-row ${item.passed ? 'is-pass' : 'is-fail'}`}
                    >
                      <div className="eval-row__top">
                        <span className="mono">{item.caseId}</span>
                        <span className="eval-row__cat">{item.category}</span>
                        <span
                          className={`badge ${
                            item.passed ? 'badge--approved' : 'badge--pending'
                          }`}
                        >
                          {item.passed ? 'PASS' : 'FAIL'}
                        </span>
                      </div>
                      <div className="eval-row__q">{item.question}</div>
                      <div className="mono eval-row__note">{item.note}</div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
