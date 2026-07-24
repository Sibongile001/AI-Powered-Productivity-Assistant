import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  FileText,
  ListTodo,
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  CalendarDays,
  Quote,
  Activity as ActivityIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCounts,
  getRecentActivity,
  type ActivityEntry,
  type Counts,
} from "@/lib/activity-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Overview of the AI-Powered Workplace Productivity Assistant dashboard.",
      },
      {
        property: "og:title",
        content: "Dashboard — AI Workplace Productivity Assistant",
      },
      {
        property: "og:description",
        content:
          "Overview of the AI-Powered Workplace Productivity Assistant dashboard.",
      },
    ],
  }),
  component: DashboardPage,
});

const features = [
  {
    title: "Meeting Notes Summarizer",
    description:
      "Turn lengthy meeting transcripts into concise summaries with clear decisions, action items, and owners.",
    icon: FileText,
    href: "/meeting-summarizer" as const,
    cta: "Summarize meeting",
    accent: "from-blue-500 to-blue-600",
  },
  {
    title: "AI Task Planner",
    description:
      "Automatically organize your workload into prioritized tasks, deadlines, and a smart daily schedule.",
    icon: ListTodo,
    href: "/ai-task-planner" as const,
    cta: "Plan tasks",
    accent: "from-indigo-500 to-blue-600",
  },
  {
    title: "AI Research Assistant",
    description:
      "Get structured briefings on workplace topics with insights, recommendations, and real examples.",
    icon: Search,
    href: "/research-assistant" as const,
    cta: "Start research",
    accent: "from-sky-500 to-blue-600",
  },
];

const quotes = [
  "Productivity is never an accident. It's the result of commitment to excellence.",
  "Focus on being productive instead of busy.",
  "The way to get started is to quit talking and begin doing.",
  "Small daily improvements compound into remarkable results.",
  "Do the hard jobs first. The easy jobs will take care of themselves.",
];

const activityMeta: Record<ActivityEntry["type"], { label: string; icon: typeof FileText; color: string }> = {
  meeting: { label: "Meeting summary", icon: FileText, color: "text-blue-600 bg-blue-500/10" },
  task: { label: "Task plan", icon: ListTodo, color: "text-indigo-600 bg-indigo-500/10" },
  research: { label: "Research", icon: Search, color: "text-sky-600 bg-sky-500/10" },
};

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function useDashboardData() {
  const [counts, setCounts] = useState<Counts>({ meeting: 0, task: 0, research: 0 });
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  useEffect(() => {
    const refresh = () => {
      setCounts(getCounts());
      setActivity(getRecentActivity());
    };
    refresh();
    window.addEventListener("awpa:activity-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("awpa:activity-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return { counts, activity };
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function DashboardPage() {
  const now = useNow();
  const { counts, activity } = useDashboardData();
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const stats = [
    { label: "Meeting summaries", value: counts.meeting, icon: FileText, accent: "text-blue-600 bg-blue-500/10" },
    { label: "Task plans", value: counts.task, icon: ListTodo, accent: "text-indigo-600 bg-indigo-500/10" },
    { label: "Research requests", value: counts.research, icon: Search, accent: "text-sky-600 bg-sky-500/10" },
  ];

  return (
    <div className="space-y-8 px-4 py-6 md:px-8 md:py-10 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-blue-500/5 p-6 shadow-sm md:p-12">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Productivity</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Welcome to the AI-Powered{" "}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Workplace Productivity
            </span>{" "}
            Assistant.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            This application helps professionals save time by using AI to
            summarize meetings, organize tasks, and research workplace topics.
          </p>
          {now && (
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" />
              {now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
              {" · "}
              {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-sm transition-all hover:shadow-md">
              <Link to="/meeting-summarizer">
                Try Meeting Summarizer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/responsible-ai">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Responsible AI
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${s.accent}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="truncate text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">Features</h2>
            <p className="text-sm text-muted-foreground">Everything you need to work smarter, powered by AI.</p>
          </div>
          <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Instant results
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative flex flex-col overflow-hidden border-border/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.accent}`} />
              <CardHeader>
                <div className={`mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${feature.accent} text-white shadow-sm`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base md:text-lg">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Button asChild variant="ghost" className="w-full justify-between px-3 hover:bg-primary/5 hover:text-primary">
                  <Link to={feature.href}>
                    {feature.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <ActivityIcon className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base">Recent activity</CardTitle>
                <CardDescription className="text-xs">Your most recent AI-generated outputs.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {activity.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No activity yet. Try summarizing a meeting or planning tasks to get started.
              </p>
            ) : (
              <ul className="space-y-2">
                {activity.slice(0, 6).map((entry) => {
                  const meta = activityMeta[entry.type];
                  return (
                    <li
                      key={entry.id}
                      className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/50 p-3 transition-colors hover:bg-muted/40"
                    >
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${meta.color}`}>
                        <meta.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{entry.title}</p>
                        <p className="text-xs text-muted-foreground">{meta.label}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatRelative(entry.createdAt)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-primary/5 via-background to-blue-500/5 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Quote className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Daily inspiration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="text-sm leading-relaxed text-foreground">
              &ldquo;{quote}&rdquo;
            </blockquote>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
