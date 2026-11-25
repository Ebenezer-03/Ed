import { beforeEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import App from '../App';
import { INITIAL_SOURCES } from '../data/initialSources';
import { runEvaluationBenchmark } from '../data/evalBenchmark';
import { evaluateQuestion } from '../engine/evidenceGate';

describe('EduStar Regression Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('T-LAND-01/02: renders dark-wave landing view and launches workspace', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /study only from/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /open tutor workspace/i }));
    expect(screen.getByLabelText('Course sources')).toBeInTheDocument();
    expect(screen.getByLabelText('Tutor Studio')).toBeInTheDocument();
    expect(screen.getByLabelText('Source proof, teacher gaps, and evaluation')).toBeInTheDocument();
  });

  it('T-GATE-01/02/03/04: verifies Factual, dynamic Numerical, and Unsupported refusal modes', () => {
    // Mode 1: Factual
    const factual = evaluateQuestion(
      'What are the four necessary conditions for deadlock?',
      INITIAL_SOURCES
    );
    expect(factual.mode).toBe('FACTUAL');
    expect(factual.citations?.[0].pageLabel).toBe('Page 43');
    expect(factual.telemetry?.stage2VerbatimMatch).toBe(true);

    // Mode 2: Dynamic Numerical (unseen numbers)
    const math = evaluateQuestion(
      'Calculate FCFS average waiting time for P1=4, P2=6, P3=2',
      INITIAL_SOURCES
    );
    expect(math.mode).toBe('NUMERICAL');
    expect(math.answer).toContain('4.67 ms');
    expect(math.steps?.length).toBeGreaterThanOrEqual(4);
    expect(math.citations?.[0].pageLabel).toBe('Page 37');

    // Mode 3: Unsupported (Unit 6 is PENDING)
    const blocked = evaluateQuestion(
      'Explain the TCP three-way handshake',
      INITIAL_SOURCES
    );
    expect(blocked.mode).toBe('UNSUPPORTED');
    expect(blocked.telemetry?.decision).toBe('BLOCKED');
    expect(blocked.missingTopic?.toLowerCase()).toContain('tcp three-way handshake');
  });

  it('T-SRC-01/02/03/04: supports Create, Approve/Revoke, Edit, and Delete in UI', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /open tutor workspace/i }));

    const sourcesPane = screen.getByLabelText('Course sources');

    // T-SRC-02: TCP handshake blocked while Unit 6 is PENDING, unlocked on Approve
    const input = screen.getByLabelText('Ask EduStar a question');
    fireEvent.change(input, { target: { value: 'Explain the TCP three-way handshake' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send question' }));
    expect(screen.getByText('Blocked by Evidence Gate')).toBeInTheDocument();

    // Approve Unit 6 in Sources
    const unit6Card = within(sourcesPane)
      .getByText('Unit 6 Networking & TCP Handshake.pdf')
      .closest('.source-card') as HTMLElement;
    fireEvent.click(within(unit6Card).getByRole('button', { name: 'Approve' }));

    fireEvent.change(input, { target: { value: 'Explain the TCP three-way handshake' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send question' }));
    expect(screen.getByText('Evidence Verified')).toBeInTheDocument();

    // T-SRC-01: Create a new note
    fireEvent.click(within(sourcesPane).getByRole('button', { name: /add/i }));
    fireEvent.change(screen.getByLabelText('Source title'), {
      target: { value: 'Unit 7 Disk Scheduling.pdf' },
    });
    fireEvent.change(screen.getByLabelText('Source content'), {
      target: { value: 'SCAN elevator algorithm moves the disk arm across cylinders.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Source' }));
    expect(within(sourcesPane).getByText('Unit 7 Disk Scheduling.pdf')).toBeInTheDocument();

    // T-SRC-03: Edit the created note
    fireEvent.click(
      within(sourcesPane).getByRole('button', { name: 'Edit Unit 7 Disk Scheduling.pdf' })
    );
    fireEvent.change(screen.getByLabelText('Source title'), {
      target: { value: 'Unit 7 Disk I/O.pdf' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
    expect(within(sourcesPane).getByText('Unit 7 Disk I/O.pdf')).toBeInTheDocument();

    // T-SRC-04: Delete the created note
    fireEvent.click(
      within(sourcesPane).getByRole('button', { name: 'Delete Unit 7 Disk I/O.pdf' })
    );
    expect(within(sourcesPane).queryByText('Unit 7 Disk I/O.pdf')).not.toBeInTheDocument();
  });

  it('T-STU-01/02/03: verifies 30-question evaluation benchmark scores 30/30 on initial sources', () => {
    const benchmark = runEvaluationBenchmark(INITIAL_SOURCES);
    expect(benchmark.summary.total).toBe(30);
    expect(benchmark.summary.passed).toBe(30);
    expect(benchmark.summary.factualAcc).toBe(100);
    expect(benchmark.summary.numericalAcc).toBe(100);
    expect(benchmark.summary.refusalAcc).toBe(100);
    expect(benchmark.summary.citationAcc).toBe(100);
  });

  it('T-STU-03 UI: runs 30Q Eval tab interactively inside StudioDrawer', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /run 3-mode demo/i }));

    // Gaps tab logged TCP refusal from 3-mode demo
    expect(screen.getByRole('tab', { name: /gaps \(1\)/i })).toBeInTheDocument();

    // Run 30Q Eval tab
    fireEvent.click(screen.getByRole('tab', { name: /30q eval/i }));
    fireEvent.click(screen.getByRole('button', { name: /run 30q eval/i }));
    expect(screen.getByText('30/30')).toBeInTheDocument();
  });
});
