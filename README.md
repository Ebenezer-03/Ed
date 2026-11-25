# EduStar

An evidence-gated AI study tutor built for college courses. EduStar retrieves passages from teacher-approved study material before answering, cites the exact document and page, computes numerical problems step by step, and blocks out-of-syllabus questions when uploaded notes lack support.

## Features

Generic AI chatbots answer from broad internet training data without showing whether an explanation matches a professor's syllabus. EduStar reverses the default workflow:

- **Teacher Approval Gate:** Uploaded notes start as `PENDING` and remain excluded from student retrieval until a teacher clicks **Approve**.
- **2-Stage Evidence Gate:** Every student query is scored against approved chunks (`src/engine/evidenceGate.ts`) and checked for a verbatim excerpt match before any answer renders.
- **Exact Page Proof:** Citation chips open the source viewer to the cited unit and page with the matched sentence highlighted.
- **Deterministic Numerical Solver:** Supported CPU scheduling (`FCFS` waiting and turnaround times) and virtual memory (`EAT`) questions extract values dynamically from the prompt and compute intermediate steps in code.
- **Unsupported Query Refusal & Gap Log:** Out-of-syllabus questions are blocked, the missing topic is named explicitly, and the gap is logged for teachers.
- **30-Question Evaluation Suite:** Built-in benchmark (`10 Factual`, `10 Numerical`, `10 Unsupported`) verifies answer, citation, numerical, and refusal accuracy directly in the workspace.

## Architecture Overview

```text
Student Question ─► Evidence Gate (approved sources only)
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
    Mode 1: Factual  Mode 2: Math   Mode 3: Blocked
    Cited sentences  Step solver    Refusal + missing topic
    + page proof     + formula ref  + Teacher Gaps log
```

### Project Structure

```text
src/
├── App.tsx                       # Landing / 3-pane Studio router and state
├── components/
│   ├── LandingHero.tsx           # Dark-wave overview and demo launcher
│   ├── SourcesPanel.tsx          # Left pane: source CRUD and Approve/Revoke
│   ├── TutorPanel.tsx            # Center pane: Q&A, step trace, citation chips
│   └── StudioDrawer.tsx          # Right pane: Proof, Teacher Gaps, 30Q Eval
├── data/
│   ├── initialSources.ts         # Preloaded Operating Systems Units 1–6
│   └── evalBenchmark.ts          # 30-question unseen evaluation suite
├── engine/
│   └── evidenceGate.ts           # Retrieval scoring, span check, math solver
├── styles/
│   ├── theme.css                 # Obsidian + lime-emerald design tokens
│   ├── landing.css               # Landing page layout and wave stage
│   └── studio.css                # 3-pane NotebookLM-inspired workspace
└── test/
    └── edustar.regression.test.tsx
```

## Installation

Requires **Node.js 20+** and **npm 10+**.

```bash
git clone https://github.com/Ebenezer-03/Ed.git
cd Ed
npm install
```

## Quickstart

Start the local development server:

```bash
npm run dev
```

Open the local URL printed by Vite (default `http://localhost:5173`), then click **Open Tutor Workspace** or **Run 3-Mode Demo**.

### Try the Three Core Modes

1. **Factual (Supported):**
   Ask `What are the four necessary conditions for deadlock?` — EduStar cites `Unit 3 Deadlocks.pdf · Page 43` and highlights the matching sentence in the **Proof** pane.
2. **Numerical (Deterministic Steps):**
   Ask `Calculate FCFS average waiting time for P1=4, P2=6, P3=2` — EduStar applies the formula from `Unit 2 CPU Scheduling.pdf · Page 37` and outputs Steps 1–4 ending in `4.67 ms`.
3. **Unsupported (Refusal + Live Unlock):**
   Ask `Explain the TCP three-way handshake` while `Unit 6 Networking & TCP Handshake.pdf` is `PENDING` — EduStar blocks the query and logs it under **Gaps (1)**. Click **Approve** on Unit 6 in the **Sources** pane (or inside **Gaps**), re-ask the question, and EduStar answers with a `Page 74` citation.

## Configuration

- **Local Source Persistence:** Source edits, additions, deletions, and approval states persist in browser `localStorage` under `edustar.sources.v1`. Clear site storage to restore the initial Operating Systems Units 1–6 dataset.
- **Deployment (Vercel / Static Hosting):**
  - Framework Preset: `Vite`
  - Build Command: `npm run build`
  - Output Directory: `dist`

## Development & Testing

Run the automated Vitest regression suite (`T-LAND`, `T-SRC`, `T-GATE`, `T-STU`, and the 30-question benchmark):

```bash
npm test
```

Type-check and build the production bundle:

```bash
npm run build
```

Preview the production bundle locally:

```bash
npm run preview
```

## Contributing

1. Create a feature branch from `main`:

   ```bash
   git checkout -b feat/my-change
   ```

2. Make focused changes and verify tests and build pass:

   ```bash
   npm test && npm run build
   ```

3. Use Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`) in imperative mood and open a pull request against `main`.

## License

Created for HackKumbh 2026 (Education — Problem Statement 4: AI Tutor Based on Approved Study Material). All rights reserved unless a separate license file is added by the repository owner.
