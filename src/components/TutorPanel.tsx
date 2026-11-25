import { useState } from 'react';
import {
  BookOpenCheck,
  Calculator,
  FileSearch,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { CitationRef, TutorMessage } from '../types/edustar';

interface TutorPanelProps {
  messages: TutorMessage[];
  approvedCount: number;
  onAskQuestion: (question: string) => void;
  onSelectCitation: (citation: CitationRef) => void;
  onRunDemoSet: () => void;
  isHiddenOnMobile?: boolean;
}

const QUICK_PROMPTS = [
  {
    label: 'Factual · Deadlocks',
    query: 'What are the four necessary conditions for deadlock?',
  },
  {
    label: 'Numerical · FCFS Math',
    query: 'Calculate FCFS average waiting time for P1=5, P2=3, P3=8',
  },
  {
    label: 'Unsupported · TCP',
    query: 'Explain the TCP three-way handshake',
  },
];

export function TutorPanel({
  messages,
  approvedCount,
  onAskQuestion,
  onSelectCitation,
  onRunDemoSet,
  isHiddenOnMobile = false,
}: TutorPanelProps) {
  const [draft, setDraft] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAskQuestion(trimmed);
    setDraft('');
  };

  return (
    <section
      className={`pane ${isHiddenOnMobile ? 'is-mobile-hidden' : ''}`}
      aria-label="Tutor Studio"
    >
      <div className="pane__head">
        <h2 className="pane__title">
          <Sparkles size={16} style={{ color: 'var(--accent)' }} />
          Tutor Studio
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>
            Gate active · {approvedCount} approved
          </span>
          <button type="button" className="btn btn--sm" onClick={onRunDemoSet}>
            Run 3-Mode Demo
          </button>
        </div>
      </div>

      <div className="tutor-prompts" aria-label="Quick test questions">
        {QUICK_PROMPTS.map((item) => (
          <button
            key={item.label}
            type="button"
            className="prompt-chip"
            onClick={() => onAskQuestion(item.query)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="pane__body tutor-stream">
        {messages.length === 0 ? (
          <div className="tutor-empty">
            <BookOpenCheck size={28} style={{ color: 'var(--accent)' }} />
            <h3>Ask anything in your approved syllabus</h3>
            <p>
              EduStar checks only approved course sources, cites the exact page,
              computes numerical steps, and blocks unsupported questions.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.role === 'student') {
              return (
                <div key={msg.id} className="msg-student">
                  <span>{msg.answer}</span>
                  <time>{msg.timestamp}</time>
                </div>
              );
            }

            const isBlocked = msg.mode === 'UNSUPPORTED';
            const isNumerical = msg.mode === 'NUMERICAL';

            return (
              <article
                key={msg.id}
                className={`msg-tutor ${isBlocked ? 'is-blocked' : ''}`}
              >
                <div className="msg-tutor__head">
                  <span
                    className={`badge ${
                      isBlocked ? 'badge--blocked' : 'badge--approved'
                    }`}
                  >
                    {isBlocked ? (
                      <ShieldAlert size={12} />
                    ) : isNumerical ? (
                      <Calculator size={12} />
                    ) : (
                      <ShieldCheck size={12} />
                    )}
                    {isBlocked
                      ? 'Blocked by Evidence Gate'
                      : isNumerical
                      ? 'Step-Verified · Numerical'
                      : 'Evidence Verified'}
                  </span>

                  {msg.telemetry && (
                    <span className="mono msg-tutor__telemetry">
                      Rerank {msg.telemetry.stage1Score.toFixed(2)} ·{' '}
                      {msg.telemetry.stage2VerbatimMatch
                        ? 'Span Matched'
                        : `${msg.telemetry.approvedDocsChecked} docs checked`}
                    </span>
                  )}
                </div>

                <p className="msg-tutor__answer">{msg.answer}</p>

                {msg.steps && msg.steps.length > 0 && (
                  <ol className="step-list" aria-label="Worked numerical steps">
                    {msg.steps.map((step) => (
                      <li key={step.label} className="step-item">
                        <span className="mono step-item__label">{step.label}</span>
                        <span className="step-item__detail">{step.detail}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {isBlocked && (
                  <div className="refusal-box">
                    <div>
                      <strong>Missing topic:</strong> {msg.missingTopic}
                    </div>
                    {msg.availableTopics && msg.availableTopics.length > 0 && (
                      <div className="refusal-box__avail">
                        <strong>Approved units available:</strong>{' '}
                        {msg.availableTopics.join(' · ')}
                      </div>
                    )}
                    <div className="mono refusal-box__logged">
                      Logged to Teacher Gaps · Approve Unit 6 in Sources to unlock
                    </div>
                  </div>
                )}

                {msg.citations && msg.citations.length > 0 && (
                  <div className="citation-row">
                    {msg.citations.map((cit) => (
                      <button
                        key={`${msg.id}-${cit.sourceId}`}
                        type="button"
                        className="citation-chip"
                        onClick={() => onSelectCitation(cit)}
                      >
                        <FileSearch size={13} />
                        <span>
                          {cit.sourceTitle} · {cit.pageLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      <form className="tutor-composer" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          placeholder="Ask a factual, numerical, or out-of-syllabus question..."
          aria-label="Ask EduStar a question"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn--primary"
          disabled={!draft.trim()}
          aria-label="Send question"
        >
          <Send size={15} /> Ask
        </button>
      </form>
    </section>
  );
}
