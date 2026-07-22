import { createFileRoute } from "@tanstack/react-router";
import { ListTodo, Plus, Calendar, Clock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/ai-task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace Productivity Assistant" },
      { name: "description", content: "Organize tasks and build smart daily plans with AI." },
      { property: "og:title", content: "AI Task Planner — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Organize tasks and build smart daily plans with AI." },
    ],
  }),
  component: AiTaskPlannerPage,
});

const sampleTasks = [
  { title: "Review Q3 project proposal", priority: "High", due: "Today" },
  { title: "Draft follow-up email to client", priority: "Medium", due: "Tomorrow" },
  { title: "Prepare slides for team sync", priority: "High", due: "Wed" },
  { title: "Research competitor updates", priority: "Low", due: "Fri" },
];

function AiTaskPlannerPage() {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <ListTodo className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
            AI Task Planner
          </h1>
          <p className="text-sm text-muted-foreground">
            Organize, prioritize, and plan your work with AI assistance.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create a smart plan</CardTitle>
          <CardDescription>
            Describe your goals or paste meeting action items to generate a prioritized task list.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="e.g. Prepare product launch, follow up with design team..."
              className="flex-1"
            />
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Generate plan
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Your prioritized tasks</CardTitle>
            <CardDescription>
              AI-suggested order based on urgency and impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {sampleTasks.map((task, index) => (
                <li
                  key={index}
                  className="flex items-start justify-between gap-4 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {task.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {task.due}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={task.priority === "High" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {task.priority}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Daily focus</CardTitle>
            <CardDescription>
              Estimated time and top priorities for today.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">4 hours planned</p>
                <p className="text-xs text-muted-foreground">Across 4 tasks</p>
              </div>
            </div>
            <div className="rounded-lg bg-primary/5 p-3">
              <p className="text-xs font-medium text-primary">Top priority</p>
              <p className="mt-1 text-sm text-foreground">
                Review Q3 project proposal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
