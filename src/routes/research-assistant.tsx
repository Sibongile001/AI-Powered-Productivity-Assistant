import { createFileRoute } from "@tanstack/react-router";
import { Search, BookOpen, Sparkles, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

const topics = [
  "Remote work productivity trends",
  "AI ethics in the workplace",
  "Effective meeting facilitation",
  "Time management frameworks",
];

const results = [
  {
    title: "The future of AI in workplace productivity",
    source: "Industry Insights",
    summary:
      "Organizations adopting AI assistants report significant time savings on administrative tasks, allowing teams to focus on strategic work.",
    tags: ["AI", "Productivity"],
  },
  {
    title: "Best practices for asynchronous meetings",
    source: "Workplace Guide",
    summary:
      "Asynchronous meetings improve focus and reduce fatigue. Key practices include clear agendas, recorded updates, and documented decisions.",
    tags: ["Meetings", "Collaboration"],
  },
  {
    title: "Prioritization frameworks for professionals",
    source: "Productivity Weekly",
    summary:
      "Frameworks like Eisenhower Matrix and ICE scoring help professionals focus on high-impact tasks and avoid busywork.",
    tags: ["Planning", "Focus"],
  },
];

function ResearchAssistantPage() {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Search className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
            AI Research Assistant
          </h1>
          <p className="text-sm text-muted-foreground">
            Explore workplace topics and gather reliable insights quickly.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">What would you like to research?</CardTitle>
          <CardDescription>
            Enter a topic and the assistant will summarize key findings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="e.g. AI adoption in small businesses"
              className="flex-1"
            />
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              Research
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => (
              <Badge key={topic} variant="outline" className="cursor-pointer hover:bg-muted">
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
              <CardTitle className="text-base">{result.title}</CardTitle>
              <CardDescription>{result.source}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto space-y-3">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {result.summary}
              </p>
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
