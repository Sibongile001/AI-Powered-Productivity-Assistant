import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Scale, Eye, Lock, Users } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    meta: [
      { title: "Responsible AI — AI Workplace Productivity Assistant" },
      { name: "description", content: "Learn about responsible AI practices in the workplace." },
      { property: "og:title", content: "Responsible AI — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Learn about responsible AI practices in the workplace." },
    ],
  }),
  component: ResponsibleAiPage,
});

const principles = [
  {
    title: "Fairness",
    description:
      "AI tools should treat all users equitably and avoid reinforcing bias in decisions or recommendations.",
    icon: Scale,
  },
  {
    title: "Transparency",
    description:
      "Users should understand when AI is being used and how outputs are generated, so they can judge reliability.",
    icon: Eye,
  },
  {
    title: "Privacy",
    description:
      "Sensitive workplace data must be protected and only used in ways consistent with organizational policies.",
    icon: Lock,
  },
  {
    title: "Human oversight",
    description:
      "AI should assist people, not replace their judgment. Important decisions remain under human review.",
    icon: Users,
  },
];

function ResponsibleAiPage() {
  return (
    <div className="space-y-6 px-4 py-6 md:px-8 md:py-8">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
            Responsible AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Using AI ethically, transparently, and safely at work.
          </p>
        </div>
      </div>

      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <p className="text-sm leading-relaxed text-foreground md:text-base">
            Our AI Workplace Productivity Assistant is designed to support your
            work while respecting your privacy and autonomy. We follow core
            responsible AI principles to ensure the technology remains
            trustworthy, fair, and beneficial for everyone.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((principle) => (
          <Card key={principle.title} className="flex flex-col">
            <CardHeader>
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <principle.icon className="h-5 w-5" />
              </div>
              <CardTitle className="text-base">{principle.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {principle.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Best practices</CardTitle>
          <CardDescription>
            Simple guidelines for using AI responsibly in your daily work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 text-sm text-foreground sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Always review AI-generated outputs before sharing them.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Do not input confidential or personal information unnecessarily.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Disclose when content has been generated or assisted by AI.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Report unexpected or biased results to your team.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Keep humans in the loop for high-stakes decisions.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              Follow your organization’s AI and data policies.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
