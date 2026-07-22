import { createFileRoute } from "@tanstack/react-router";
import { FileText, Upload, Wand2, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

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

function MeetingSummarizerPage() {
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input</CardTitle>
            <CardDescription>
              Paste your meeting transcript or notes below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste meeting transcript here..."
              className="min-h-[240px] resize-y"
            />
            <div className="flex flex-wrap gap-2">
              <Button>
                <Wand2 className="mr-2 h-4 w-4" />
                Summarize
              </Button>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload file
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI Summary</CardTitle>
            <CardDescription>
              Key decisions, action items, and next steps will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">
                Your summary will appear here after you summarize a meeting.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
