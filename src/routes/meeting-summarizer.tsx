import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  FileText,
  Wand2,
  Copy,
  RotateCcw,
  Loader2,
  ClipboardList,
  MessageSquareQuote,
  CheckCircle2,
  ListTodo,
  CalendarClock,
  Users,
  AlertCircle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { summarizeMeeting, type MeetingSummary } from "@/lib/meeting-summarizer.functions";

export const Route = createFileRoute("/meeting-summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer — AI Workplace Productivity Assistant" },
      { name: "description", content: "Summarize meeting notes and transcripts with AI." },
      { property: "og:title", content: "Meeting Summarizer — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Summarize meeting notes and transcripts with AI." },
    ],
  }),
  component: MeetingSummarizerPage,
});

const sections: {
  key: keyof MeetingSummary;
  title: string;
  icon: React.ElementType;
}[] = [
  { key: "executiveSummary", title: "Executive Summary", icon: ClipboardList },
  { key: "keyDiscussionPoints", title: "Key Discussion Points", icon: MessageSquareQuote },
  { key: "decisionsMade", title: "Decisions Made", icon: CheckCircle2 },
  { key: "actionItems", title: "Action Items", icon: ListTodo },
  { key: "deadlines", title: "Deadlines", icon: CalendarClock },
  { key: "responsibilities", title: "Responsibilities", icon: Users },
];

function MeetingSummarizerPage() {
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const summarize = useServerFn(summarizeMeeting);

  const mutation = useMutation({
    mutationFn: summarize,
    onSuccess: (data) => {
      setSummary(data);
    },
  });

  const handleGenerate = () => {
    if (!notes.trim()) return;
    mutation.mutate({ data: { notes } });
  };

  const handleClear = () => {
    setNotes("");
    setSummary(null);
    mutation.reset();
  };

  const handleCopy = async () => {
    if (!summary) return;
    const text = sections
      .map((section) => {
        const value = summary[section.key];
        const body = Array.isArray(value)
          ? value.map((item) => `• ${item}`).join("\n") || "No items listed."
          : value || "No summary available.";
        return `${section.title}\n${body}`;
      })
      .join("\n\n");
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
            Meeting Notes Summarizer
          </h1>
          <p className="text-sm text-muted-foreground">
            Paste a transcript and get a concise, actionable summary.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meeting Notes</CardTitle>
          <CardDescription>
            Paste your meeting transcript or notes below, then click Generate Summary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste meeting transcript or notes here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[260px] resize-y"
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleGenerate} disabled={mutation.isPending || !notes.trim()}>
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Generate Summary
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={!notes && !summary}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {mutation.isPending && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">AI is summarizing your meeting...</p>
            <p className="text-xs text-muted-foreground">This may take a few moments.</p>
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
              : "Unable to generate the summary. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {summary && !mutation.isPending && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">AI Summary</h2>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Summary
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sections.map((section) => {
              const value = summary[section.key];
              const isText = typeof value === "string";
              const items = isText ? [] : value;

              return (
                <Card key={section.key} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <section.icon className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-base">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    {isText ? (
                      <p className="text-sm leading-relaxed text-foreground">{value || "—"}</p>
                    ) : (
                      <ul className="space-y-2">
                          {items.length > 0 ? (
                          items.map((item, index) => (
                            <li key={index} className="flex gap-2 text-sm text-foreground">
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              <span className="leading-relaxed">{item}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-sm text-muted-foreground">No items listed.</li>
                        )}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
