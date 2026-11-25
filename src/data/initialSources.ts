import { CourseSource } from '../types/edustar';

export const STORAGE_SOURCES_KEY = 'edustar.sources.v1';

export const INITIAL_SOURCES: CourseSource[] = [
  {
    id: 'src-os-1',
    title: 'Unit 1 Processes & Semaphores.pdf',
    unit: 'Unit 1',
    pageLabel: 'Page 23',
    section: 'Process Synchronization',
    status: 'APPROVED',
    format: 'PDF',
    updatedAt: '2026-11-25',
    content:
      'A semaphore is an integer synchronization variable S accessed only through two indivisible atomic operations: wait(S) and signal(S). Binary semaphores take values 0 or 1 to enforce mutual exclusion around a critical section. Counting semaphores track available instances of a shared resource pool. Busy waiting inside spinlocks wastes CPU cycles unless paired with a waiting queue.',
  },
  {
    id: 'src-os-2',
    title: 'Unit 2 CPU Scheduling.pdf',
    unit: 'Unit 2',
    pageLabel: 'Page 37',
    section: 'FCFS & Turnaround Formulas',
    status: 'APPROVED',
    format: 'PDF',
    updatedAt: '2026-11-25',
    content:
      'In First-Come, First-Served (FCFS) non-preemptive scheduling, processes execute in arrival order. Waiting time W_i for process i equals the sum of burst times of all preceding processes (assuming arrival time 0). Formula: Average Waiting Time = (W_1 + W_2 + ... + W_n) / n. Worked example: For burst times P1 = 5 ms, P2 = 3 ms, P3 = 8 ms, waiting times are 0, 5, and 8 ms, yielding (0 + 5 + 8) / 3 = 4.33 ms. Turnaround time T_i = Waiting time W_i + Burst time B_i.',
  },
  {
    id: 'src-os-3',
    title: 'Unit 3 Deadlocks.pdf',
    unit: 'Unit 3',
    pageLabel: 'Page 43',
    section: 'Necessary Conditions for Deadlock',
    status: 'APPROVED',
    format: 'PDF',
    updatedAt: '2026-11-25',
    content:
      'A deadlock situation can arise if and only if four necessary conditions hold simultaneously in a system. First, Mutual exclusion requires that at least one resource be held in a non-sharable mode. Second, Hold and wait means a process holding one resource waits for additional resources held by others. Third, No preemption prevents resources from being forcibly taken until voluntarily released. Fourth, Circular wait forms a closed chain of waiting processes.',
  },
  {
    id: 'src-os-4',
    title: 'Unit 4 Memory & Paging.pdf',
    unit: 'Unit 4',
    pageLabel: 'Page 58',
    section: 'Virtual Memory & Page Faults',
    status: 'APPROVED',
    format: 'PDF',
    updatedAt: '2026-11-25',
    content:
      'Paging divides physical memory into fixed-size frames and logical memory into equal-size pages to eliminate external fragmentation. A page fault occurs when a running process references a page marked invalid in the page table, triggering a trap to the operating system. Effective Access Time EAT = (1 - p) * ma + p * page_fault_time, where p is the page fault probability and ma is memory access time.',
  },
  {
    id: 'src-os-5',
    title: 'Unit 5 Banker Algorithm Notes.md',
    unit: 'Unit 5',
    pageLabel: 'Page 46',
    section: 'Deadlock Avoidance',
    status: 'APPROVED',
    format: 'MD',
    updatedAt: '2026-11-25',
    content:
      'The Banker algorithm tests safety before granting a resource request by verifying Need[i] <= Work for each unfinished process. Need matrix is defined as Need = Max - Allocation. A system is in a safe state only if there exists a safe sequence of all processes that can finish without deadlock.',
  },
  {
    id: 'src-net-6',
    title: 'Unit 6 Networking & TCP Handshake.pdf',
    unit: 'Unit 6',
    pageLabel: 'Page 74',
    section: 'Transport Layer Connections',
    status: 'PENDING',
    format: 'PDF',
    updatedAt: '2026-11-25',
    content:
      'The TCP three-way handshake establishes a reliable full-duplex connection in three steps: (1) Client sends a SYN segment with initial sequence number x; (2) Server replies with SYN-ACK containing sequence number y and acknowledgment x + 1; (3) Client sends ACK with acknowledgment y + 1 to confirm.',
  },
];

export function loadSources(): CourseSource[] {
  try {
    const raw = localStorage.getItem(STORAGE_SOURCES_KEY);
    if (!raw) return INITIAL_SOURCES;
    const parsed = JSON.parse(raw) as CourseSource[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SOURCES;
  } catch {
    return INITIAL_SOURCES;
  }
}

export function saveSources(sources: CourseSource[]): void {
  try {
    localStorage.setItem(STORAGE_SOURCES_KEY, JSON.stringify(sources));
  } catch {
    // ignore quota errors in test environments
  }
}
