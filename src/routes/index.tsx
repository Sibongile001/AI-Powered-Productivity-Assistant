import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  ListTodo,
  Search,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    href: "/meeting-summarizer",
    cta: "Summarize meeting",
    accent: "from-blue-500 to-blue-600",
  },
  {
    title: "AI Task Planner",
    description:
      "Automatically organize your workload into prioritized tasks, deadlines, and a smart daily schedule.",
    icon: ListTodo,
    href: "/ai-task-planner",
    cta: "Plan tasks",
    accent: "from-indigo-500 to-blue-600",
  },
  {
    title: "AI Research Assistant",
    description:
      "Get structured briefings on workplace topics with insights, recommendations, and real examples.",
    icon: Search,
    href: "/research-assistant",
    cta: "Start research",
    accent: "from-sky-500 to-blue-600",
  },
];

const stats = [
  { label: "AI features", value: "3+" },
  { label: "Hours saved / week", value: "10+" },
  { label: "Powered by", value: "Lovable AI" },
];

function DashboardPage() {
  return (
    <div className="space-y-8 px-4 py-6 md:px-8 md:py-10 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-blue-500/5 p-6 shadow-sm md:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
        />
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

          <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-background/70 p-3 backdrop-blur">
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Features
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to work smarter, powered by AI.
            </p>
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
              <div
                aria-hidden
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${feature.accent}`}
              />
              <CardHeader>
                <div
                  className={`mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${feature.accent} text-white shadow-sm`}
                >
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base md:text-lg">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-between px-3 hover:bg-primary/5 hover:text-primary"
                >
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
    </div>
  );
}
