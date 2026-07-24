import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Search,
  Sparkles,
  Loader2,
  AlertCircle,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  Briefcase,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { runResearch, type ResearchResult } from "@/lib/research-assistant.functions";
import { recordActivity } from "@/lib/activity-store";
import { toast } from "sonner";

export const Route = createFileRoute("/research-assistant")({
  head: () => ({
    meta: [
      { title: "Research Assistant — AI Workplace Productivity Assistant" },
      { name: "description", content: "Research workplace topics with AI-powered insights." },
      { property: "og:title", content: "Research Assistant — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Research workplace topics with AI-powered insights." },
    ],
  }),
  component: ResearchAssistantPage,
});

const suggestedTopics = [
  "Remote work productivity trends",
  "AI ethics in the workplace",
  "Effective meeting facilitation",
  "Time management frameworks",
  "Async communication best practices",
  "Employee engagement strategies",
];

function ResearchAssistantPage() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const research = useServerFn(runResearch);

  const mutation = useMutation({
    mutationFn: research,
    onSuccess: (data, variables) => {
      setResult(data);
      const requested = (variables as { data: { topic: string } })?.data?.topic ?? topic;
      recordActivity("research", requested);
      toast.success("Research ready");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to run research");
    },
  });

  const runFor = (value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setTopic(value);
    mutation.mutate({ data: { topic: clean } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runFor(topic);
  };

  const handleClear = () => {
    setTopic("");
    setResult(null);
    mutation.reset();
  };

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
          <Search className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
            AI Research Assistant
          </h1>
          <p className="text-sm text-muted-foreground">
            Get reliable, structured briefings on any workplace topic.
          </p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">What would you like to research?</CardTitle>
          <CardDescription>
            Enter a topic and the AI will summarize insights, recommendations,
            and a practical workplace example.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="e.g. AI adoption in small businesses"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={mutation.isPending || !topic.trim()}
                className="shadow-sm transition-all hover:shadow-md"
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Research
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                disabled={!topic && !result}
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            </div>
          </form>
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Suggested topics — click to research instantly
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedTopics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => runFor(t)}
                  disabled={mutation.isPending}
                  className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary disabled:opacity-50"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {mutation.isPending && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">Researching your topic...</p>
            <p className="text-xs text-muted-foreground">Gathering insights and recommendations.</p>
          </CardContent>
        </Card>
      )}

      {mutation.isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {mutation.error instanceof Error
              ? mutation.error.message
              : "Unable to run research. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {result && !mutation.isPending && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Research on <span className="text-primary">{topic}</span>
          </h2>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Key Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.keyInsights.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">Recommendations</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.recommendations.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-600">
                  <Briefcase className="h-4 w-4" />
                </div>
                <CardTitle className="text-base">Practical Workplace Example</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">{result.workplaceExample}</p>
            </CardContent>
          </Card>

          <Badge variant="secondary" className="text-xs">
            Generated by AI — always review before acting on recommendations.
          </Badge>
        </div>
      )}
    </div>
  );
}
