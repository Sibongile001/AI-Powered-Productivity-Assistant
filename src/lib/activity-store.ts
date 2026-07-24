// Lightweight localStorage-based activity tracker for dashboard stats.
// Later stages will replace/augment this with a proper history feature.

export type ActivityType = "meeting" | "task" | "research";

export type ActivityEntry = {
  id: string;
  type: ActivityType;
  title: string;
  createdAt: string; // ISO
};

const COUNTS_KEY = "awpa:counts";
const ACTIVITY_KEY = "awpa:activity";
const MAX_ENTRIES = 20;

export type Counts = { meeting: number; task: number; research: number };

const emptyCounts: Counts = { meeting: 0, task: 0, research: 0 };

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function getCounts(): Counts {
  if (typeof window === "undefined") return emptyCounts;
  return safeParse<Counts>(localStorage.getItem(COUNTS_KEY), emptyCounts);
}

export function getRecentActivity(): ActivityEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse<ActivityEntry[]>(localStorage.getItem(ACTIVITY_KEY), []);
}

export function recordActivity(type: ActivityType, title: string) {
  if (typeof window === "undefined") return;
  const counts = getCounts();
  counts[type] = (counts[type] ?? 0) + 1;
  localStorage.setItem(COUNTS_KEY, JSON.stringify(counts));

  const entries = getRecentActivity();
  const entry: ActivityEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: title.trim().slice(0, 120) || "Untitled",
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...entries].slice(0, MAX_ENTRIES);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));

  window.dispatchEvent(new CustomEvent("awpa:activity-updated"));
}
