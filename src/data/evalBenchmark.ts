import { evaluateQuestion } from '../engine/evidenceGate';
import { CourseSource, EvalCase, EvalResult } from '../types/edustar';

export const EVAL_CASES: EvalCase[] = [
  // 10 Unseen Factual Questions (Units 1-5)
  {
    id: 'F-01',
    category: 'FACTUAL',
    question: 'What operations access a semaphore variable?',
    expectedSupported: true,
    expectedPageHint: 'Page 23',
  },
  {
    id: 'F-02',
    category: 'FACTUAL',
    question: 'How do binary semaphores enforce mutual exclusion?',
    expectedSupported: true,
    expectedPageHint: 'Page 23',
  },
  {
    id: 'F-03',
    category: 'FACTUAL',
    question: 'What do counting semaphores track?',
    expectedSupported: true,
    expectedPageHint: 'Page 23',
  },
  {
    id: 'F-04',
    category: 'FACTUAL',
    question: 'What are the four necessary conditions for deadlock?',
    expectedSupported: true,
    expectedPageHint: 'Page 43',
  },
  {
    id: 'F-05',
    category: 'FACTUAL',
    question: 'Explain circular wait in deadlock conditions.',
    expectedSupported: true,
    expectedPageHint: 'Page 43',
  },
  {
    id: 'F-06',
    category: 'FACTUAL',
    question: 'What does no preemption mean for allocated resources?',
    expectedSupported: true,
    expectedPageHint: 'Page 43',
  },
  {
    id: 'F-07',
    category: 'FACTUAL',
    question: 'How does paging eliminate external fragmentation?',
    expectedSupported: true,
    expectedPageHint: 'Page 58',
  },
  {
    id: 'F-08',
    category: 'FACTUAL',
    question: 'When does a page fault occur during execution?',
    expectedSupported: true,
    expectedPageHint: 'Page 58',
  },
  {
    id: 'F-09',
    category: 'FACTUAL',
    question: 'How is the Need matrix defined in the Banker algorithm?',
    expectedSupported: true,
    expectedPageHint: 'Page 46',
  },
  {
    id: 'F-10',
    category: 'FACTUAL',
    question: 'When is a system in a safe state under Banker algorithm?',
    expectedSupported: true,
    expectedPageHint: 'Page 46',
  },

  // 10 Unseen Numerical Questions (Unit 2 FCFS & Unit 4 EAT)
  {
    id: 'N-01',
    category: 'NUMERICAL',
    question: 'Calculate FCFS average waiting time for P1=5, P2=3, P3=8',
    expectedSupported: true,
    expectedPageHint: 'Page 37',
    expectedAnswerFragment: '4.33 ms',
  },
  {
    id: 'N-02',
    category: 'NUMERICAL',
    question: 'Calculate FCFS average waiting time for P1=4, P2=6, P3=2',
    expectedSupported: true,
    expectedPageHint: 'Page 37',
    expectedAnswerFragment: '4.67 ms',
  },
  {
    id: 'N-03',
    category: 'NUMERICAL',
    question: 'Calculate FCFS average waiting time for P1=10, P2=2, P3=3',
    expectedSupported: true,
    expectedPageHint: 'Page 37',
    expectedAnswerFragment: '7.33 ms',
  },
  {
    id: 'N-04',
    category: 'NUMERICAL',
    question: 'Calculate FCFS average waiting time for P1=6, P2=6, P3=6',
    expectedSupported: true,
    expectedPageHint: 'Page 37',
    expectedAnswerFragment: '6 ms',
  },
  {
    id: 'N-05',
    category: 'NUMERICAL',
    question: 'Calculate FCFS average turnaround time for P1=5, P2=3, P3=8',
    expectedSupported: true,
    expectedPageHint: 'Page 37',
    expectedAnswerFragment: '9.67 ms',
  },
  {
    id: 'N-06',
    category: 'NUMERICAL',
    question: 'Calculate FCFS average turnaround time for P1=4, P2=6, P3=2',
    expectedSupported: true,
    expectedPageHint: 'Page 37',
    expectedAnswerFragment: '8.67 ms',
  },
  {
    id: 'N-07',
    category: 'NUMERICAL',
    question: 'Calculate FCFS average waiting time for P1=2, P2=8, P3=4, P4=6',
    expectedSupported: true,
    expectedPageHint: 'Page 37',
    expectedAnswerFragment: '6.5 ms',
  },
  {
    id: 'N-08',
    category: 'NUMERICAL',
    question: 'Calculate effective access time for p=0.001, ma=100, pf=8000',
    expectedSupported: true,
    expectedPageHint: 'Page 58',
    expectedAnswerFragment: '107.9 ns',
  },
  {
    id: 'N-09',
    category: 'NUMERICAL',
    question: 'Calculate effective access time for p=0.01, ma=200, pf=5000',
    expectedSupported: true,
    expectedPageHint: 'Page 58',
    expectedAnswerFragment: '248 ns',
  },
  {
    id: 'N-10',
    category: 'NUMERICAL',
    question: 'Calculate effective access time for p=0.002, ma=50, pf=10000',
    expectedSupported: true,
    expectedPageHint: 'Page 58',
    expectedAnswerFragment: '69.9 ns',
  },

  // 10 Unseen Unsupported Questions (Outside Units 1-5)
  {
    id: 'U-01',
    category: 'UNSUPPORTED',
    question: 'Explain the TCP three-way handshake',
    expectedSupported: false,
  },
  {
    id: 'U-02',
    category: 'UNSUPPORTED',
    question: 'What is the Linux command to detect deadlocks?',
    expectedSupported: false,
  },
  {
    id: 'U-03',
    category: 'UNSUPPORTED',
    question: 'Compare HTTP/2 multiplexing with HTTP/3 QUIC',
    expectedSupported: false,
  },
  {
    id: 'U-04',
    category: 'UNSUPPORTED',
    question: 'Explain B+ tree node splitting in SQL indexes',
    expectedSupported: false,
  },
  {
    id: 'U-05',
    category: 'UNSUPPORTED',
    question: 'How does RSA public key encryption generate primes?',
    expectedSupported: false,
  },
  {
    id: 'U-06',
    category: 'UNSUPPORTED',
    question: 'Explain backpropagation gradient clipping in neural networks',
    expectedSupported: false,
  },
  {
    id: 'U-07',
    category: 'UNSUPPORTED',
    question: 'What are Kubernetes pod liveness probes?',
    expectedSupported: false,
  },
  {
    id: 'U-08',
    category: 'UNSUPPORTED',
    question: 'Describe DNS recursive resolver caching behavior',
    expectedSupported: false,
  },
  {
    id: 'U-09',
    category: 'UNSUPPORTED',
    question: 'How does MapReduce shuffle sort intermediate keys?',
    expectedSupported: false,
  },
  {
    id: 'U-10',
    category: 'UNSUPPORTED',
    question: 'Explain Raft consensus leader election timeouts',
    expectedSupported: false,
  },
];

export interface BenchmarkSummary {
  total: number;
  passed: number;
  factualAcc: number;
  numericalAcc: number;
  refusalAcc: number;
  citationAcc: number;
}

export function runEvaluationBenchmark(sources: CourseSource[]): {
  results: EvalResult[];
  summary: BenchmarkSummary;
} {
  const results: EvalResult[] = EVAL_CASES.map((testCase) => {
    const reply = evaluateQuestion(testCase.question, sources);
    const actualMode = reply.mode ?? 'UNSUPPORTED';
    const citedPage = reply.citations?.[0]?.pageLabel;
    const gateScore = reply.telemetry?.stage1Score ?? 0;

    let passed = false;
    let note = '';

    if (testCase.category === 'UNSUPPORTED') {
      passed = actualMode === 'UNSUPPORTED';
      note = passed ? 'Blocked cleanly' : `Unexpectedly answered (${actualMode})`;
    } else if (testCase.category === 'NUMERICAL') {
      const hasAnswer =
        !testCase.expectedAnswerFragment ||
        reply.answer.includes(testCase.expectedAnswerFragment);
      const hasPage =
        !testCase.expectedPageHint || citedPage === testCase.expectedPageHint;
      passed = actualMode === 'NUMERICAL' && hasAnswer && hasPage;
      note = passed
        ? `${testCase.expectedAnswerFragment} verified`
        : `Got "${reply.answer}" (${citedPage ?? 'no citation'})`;
    } else {
      const hasPage =
        !testCase.expectedPageHint || citedPage === testCase.expectedPageHint;
      passed = actualMode === 'FACTUAL' && hasPage;
      note = passed
        ? `Cited ${citedPage}`
        : `Expected ${testCase.expectedPageHint}, got ${citedPage ?? actualMode}`;
    }

    return {
      caseId: testCase.id,
      category: testCase.category,
      question: testCase.question,
      passed,
      actualMode,
      citedPage,
      gateScore,
      note,
    };
  });

  const factual = results.filter((r) => r.category === 'FACTUAL');
  const numerical = results.filter((r) => r.category === 'NUMERICAL');
  const unsupported = results.filter((r) => r.category === 'UNSUPPORTED');
  const supportedCases = [...factual, ...numerical];

  const pct = (items: EvalResult[]) =>
    items.length === 0
      ? 0
      : Math.round((items.filter((i) => i.passed).length / items.length) * 100);

  return {
    results,
    summary: {
      total: results.length,
      passed: results.filter((r) => r.passed).length,
      factualAcc: pct(factual),
      numericalAcc: pct(numerical),
      refusalAcc: pct(unsupported),
      citationAcc: pct(supportedCases),
    },
  };
}
