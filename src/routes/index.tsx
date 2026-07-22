import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ListTodo, Search, ArrowRight, Sparkles } from "lucide-react";

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
      "Turn lengthy meeting transcripts into concise, actionable summaries with key decisions and next steps.",
    icon: FileText,
    href: "/meeting-summarizer",
    cta: "Summarize meeting",
  },
  {
    title: "AI Task Planner",
    description:
      "Automatically organize your workload into prioritized tasks, deadlines, and smart daily plans.",
    icon: ListTodo,
    href: "/ai-task-planner",
    cta: "Plan tasks",
  },
  {
    title: "AI Research Assistant",
    description:
      "Quickly research workplace topics and gather reliable insights to support your decisions.",
    icon: Search,
    href: "/research-assistant",
    cta: "Start research",
  },
];

function DashboardPage() {
  return (
    <div className="space-y-8 px-4 py-6 md:px-8 md:py-8">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-background p-6 md:p-10">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered Productivity</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            Welcome to the AI-Powered Workplace Productivity Assistant.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            This application helps professionals save time by using AI to
            summarize meetings, organize tasks, and research workplace topics.
          </p>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
          Features
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group flex flex-col transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
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
                <Button asChild className="w-full group-hover:bg-primary/90">
                  <Link to={feature.href}>
                    {feature.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
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
