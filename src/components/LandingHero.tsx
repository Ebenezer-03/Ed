import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  ChevronRight,
  FileCheck2,
  FlaskConical,
  ShieldAlert,
  Sparkles,
  Table2,
} from 'lucide-react';
import '../styles/landing.css';

interface LandingHeroProps {
  onOpenWorkspace: (runDemo?: boolean) => void;
}

export function LandingHero({ onOpenWorkspace }: LandingHeroProps) {
  return (
    <div className="landing">
      <header className="landing__nav">
        <a href="#top" className="brand">
          <span className="brand__mark" aria-hidden="true">
            <Sparkles size={15} />
          </span>
          EduStar
        </a>

        <nav className="landing__links" aria-label="Primary">
          <a href="#modes">Evidence Gate</a>
          <button type="button" onClick={() => onOpenWorkspace(false)}>
            Notebook Studio
          </button>
          <button type="button" onClick={() => onOpenWorkspace(true)}>
            3-Mode Demo
          </button>
        </nav>

        <button
          type="button"
          className="btn btn--sm"
          onClick={() => onOpenWorkspace(false)}
        >
          Open Workspace
        </button>
      </header>

      <main id="top" className="landing__hero">
        <button
          type="button"
          className="hero-pill"
          onClick={() => onOpenWorkspace(true)}
        >
          <span className="hero-pill__tag">New</span>
          <span>Evidence-Gated Study Tutor · 30Q Eval Ready</span>
          <ChevronRight size={14} />
        </button>

        <h1 className="landing__title">
          Study Only From <em>Approved</em> Course Material
        </h1>

        <p className="landing__sub">
          EduStar retrieves teacher-approved PDFs before answering, cites exact
          pages, computes numerical steps, and blocks out-of-syllabus guesses.
        </p>

        <div className="landing__cta">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => onOpenWorkspace(false)}
          >
            Open Tutor Workspace
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => onOpenWorkspace(true)}
          >
            Run 3-Mode Demo
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="wave-stage" aria-hidden="true">
          <svg viewBox="0 0 1440 260" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveFill1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(163, 230, 53, 0.18)" />
                <stop offset="45%" stopColor="rgba(22, 46, 36, 0.45)" />
                <stop offset="100%" stopColor="rgba(6, 10, 13, 0.98)" />
              </linearGradient>
              <linearGradient id="waveFill2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(110, 200, 140, 0.12)" />
                <stop offset="100%" stopColor="rgba(6, 10, 13, 1)" />
              </linearGradient>
              <linearGradient id="waveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(163, 230, 53, 0.05)" />
                <stop offset="35%" stopColor="rgba(163, 230, 53, 0.65)" />
                <stop offset="68%" stopColor="rgba(159, 199, 184, 0.35)" />
                <stop offset="100%" stopColor="rgba(163, 230, 53, 0.05)" />
              </linearGradient>
            </defs>
            <path
              d="M0,185 C210,120 380,68 620,132 C840,192 1040,56 1270,96 C1355,111 1405,134 1440,148 L1440,260 L0,260 Z"
              fill="url(#waveFill2)"
            />
            <path
              d="M0,162 C230,42 430,210 700,140 C955,75 1170,198 1440,108 L1440,260 L0,260 Z"
              fill="url(#waveFill1)"
            />
            <path
              d="M0,162 C230,42 430,210 700,140 C955,75 1170,198 1440,108"
              fill="none"
              stroke="url(#waveStroke)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </main>

      <section className="landing__strip" aria-label="Core capabilities">
        <p className="landing__strip-label">
          Built for verifiable exam preparation across technical university courses
        </p>
        <div className="landing__specs">
          <span className="landing__spec-item">
            <FileCheck2 size={16} /> Teacher Approval Gate
          </span>
          <span className="landing__spec-item">
            <BookOpenCheck size={16} /> Exact Page Citations
          </span>
          <span className="landing__spec-item">
            <Table2 size={16} /> Table-Aware Ingestion
          </span>
          <span className="landing__spec-item">
            <Calculator size={16} /> Deterministic Math Steps
          </span>
          <span className="landing__spec-item">
            <ShieldAlert size={16} /> Unsupported Query Refusal
          </span>
          <span className="landing__spec-item">
            <FlaskConical size={16} /> 30-Question Eval Harness
          </span>
        </div>
      </section>

      <section id="modes" className="landing__modes" aria-label="Three tutor modes">
        <article className="mode-card">
          <div className="mode-card__top">
            <span>MODE 01</span>
            <span>FACTUAL</span>
          </div>
          <h3>Cited passage answers</h3>
          <p>
            Retrieves approved PDF chunks first and attaches clickable page
            citations that highlight the verbatim proof.
          </p>
        </article>
        <article className="mode-card">
          <div className="mode-card__top">
            <span>MODE 02</span>
            <span>NUMERICAL</span>
          </div>
          <h3>Step-by-step calculations</h3>
          <p>
            Extracts given values and textbook formulas to compute and display
            each intermediate step deterministically.
          </p>
        </article>
        <article className="mode-card">
          <div className="mode-card__top">
            <span>MODE 03</span>
            <span>UNSUPPORTED</span>
          </div>
          <h3>Strict refusal and gap log</h3>
          <p>
            Blocks questions outside teacher-approved units, names the missing
            topic, and surfaces gaps to instructors.
          </p>
        </article>
      </section>
    </div>
  );
}
