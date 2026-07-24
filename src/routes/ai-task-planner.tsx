import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  ListTodo,
  Sparkles,
  Loader2,
  AlertCircle,
  Flame,
  Target,
  Leaf,
  CalendarClock,
  Lightbulb,
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { generateTaskPlan, type TaskPlan } from "@/lib/ai-task-planner.functions";
import { recordActivity } from "@/lib/activity-store";
import { toast } from "sonner";

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

const sections: {
  key: keyof TaskPlan;
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
}[] = [
  { key: "highPriority", title: "High Priority", description: "Urgent and important", icon: Flame, accent: "text-red-600 bg-red-500/10" },
  { key: "mediumPriority", title: "Medium Priority", description: "Important, not urgent", icon: Target, accent: "text-amber-600 bg-amber-500/10" },
  { key: "lowPriority", title: "Low Priority", description: "Nice to have", icon: Leaf, accent: "text-emerald-600 bg-emerald-500/10" },
  { key: "dailySchedule", title: "Suggested Daily Schedule", description: "Time-blocked plan", icon: CalendarClock, accent: "text-blue-600 bg-blue-500/10" },
  { key: "productivityTips", title: "Productivity Tips", description: "Tailored to your goals", icon: Lightbulb, accent: "text-violet-600 bg-violet-500/10" },
];

function AiTaskPlannerPage() {
  const [goals, setGoals] = useState("");
  const [plan, setPlan] = useState<TaskPlan | null>(null);
  const generate = useServerFn(generateTaskPlan);

  const mutation = useMutation({
    mutationFn: generate,
    onSuccess: (data) => {
      setPlan(data);
      recordActivity("task", goals);
      toast.success("Task plan generated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to generate plan");
    },
  });

  const handleGenerate = () => {
    if (!goals.trim()) return;
    mutation.mutate({ data: { goals } });
  };

  const handleClear = () => {
    setGoals("");
    setPlan(null);
    mutation.reset();
  };

  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
          <ListTodo className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
            AI Task Planner
          </h1>
          <p className="text-sm text-muted-foreground">
            Turn goals and to-dos into a prioritized, actionable plan.
          </p>
        </div>
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Describe your tasks & goals</CardTitle>
          <CardDescription>
            List your tasks, goals, or paste meeting action items. The AI will
            prioritize them and build a daily schedule.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. Prepare Q3 launch deck, follow up with design team, review 5 pull requests, book venue for offsite, prep 1:1 agenda..."
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="min-h-[180px] resize-y"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleGenerate}
              disabled={mutation.isPending || !goals.trim()}
              className="shadow-sm transition-all hover:shadow-md"
            >
              {mutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Generate Plan
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={!goals && !plan}>
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
            <p className="text-sm font-medium text-foreground">AI is building your plan...</p>
            <p className="text-xs text-muted-foreground">Prioritizing tasks and scheduling your day.</p>
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
              : "Unable to generate your plan. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {plan && !mutation.isPending && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Your AI-generated plan
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => {
              const items = plan[section.key];
              return (
                <Card
                  key={section.key}
                  className="flex flex-col border-border/60 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${section.accent}`}>
                        <section.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{section.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
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
