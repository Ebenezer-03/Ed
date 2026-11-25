export type SourceStatus = 'APPROVED' | 'PENDING';

export interface CourseSource {
  id: string;
  title: string;
  unit: string;
  pageLabel: string;
  section: string;
  status: SourceStatus;
  format: 'PDF' | 'MD' | 'DOCX';
  content: string;
  updatedAt: string;
}

export type TutorMode = 'FACTUAL' | 'NUMERICAL' | 'UNSUPPORTED';

export interface CitationRef {
  sourceId: string;
  sourceTitle: string;
  pageLabel: string;
  section: string;
  excerpt: string;
  score: number;
}

export interface NumericalStep {
  label: string;
  detail: string;
}

export interface GateTelemetry {
  stage1Score: number;
  stage2VerbatimMatch: boolean;
  approvedDocsChecked: number;
  decision: 'PASS' | 'BLOCKED';
}

export interface TutorMessage {
  id: string;
  role: 'student' | 'tutor';
  query?: string;
  mode?: TutorMode;
  answer: string;
  citations?: CitationRef[];
  steps?: NumericalStep[];
  missingTopic?: string;
  availableTopics?: string[];
  telemetry?: GateTelemetry;
  timestamp: string;
}

export interface TeacherGap {
  id: string;
  query: string;
  missingTopic: string;
  askedCount: number;
  lastAskedAt: string;
}

export interface EvalCase {
  id: string;
  category: TutorMode;
  question: string;
  expectedSupported: boolean;
  expectedPageHint?: string;
  expectedAnswerFragment?: string;
}

export interface EvalResult {
  caseId: string;
  category: TutorMode;
  question: string;
  passed: boolean;
  actualMode: TutorMode;
  citedPage?: string;
  gateScore: number;
  note: string;
}
