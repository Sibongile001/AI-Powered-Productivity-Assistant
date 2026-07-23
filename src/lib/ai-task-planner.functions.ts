import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const GeneratePlanInput = z.object({
  goals: z.string().min(1, "Please describe your tasks or goals"),
});

const TaskPlanOutput = z.object({
  highPriority: z.array(z.string()),
  mediumPriority: z.array(z.string()),
  lowPriority: z.array(z.string()),
  dailySchedule: z.array(z.string()),
  productivityTips: z.array(z.string()),
});

export type TaskPlan = z.infer<typeof TaskPlanOutput>;

function parsePlan(text: string): TaskPlan {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  return TaskPlanOutput.parse(JSON.parse(cleaned));
}

export const generateTaskPlan = createServerFn({ method: "POST" })
  .validator((input: unknown) => GeneratePlanInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(apiKey);
    const system = `You are an expert productivity coach. Turn the user's goals and tasks into a prioritized daily plan.

Return ONLY a JSON object with exactly these keys:
- "highPriority": array of concise task strings (urgent + important)
- "mediumPriority": array of concise task strings
- "lowPriority": array of concise task strings
- "dailySchedule": array of time-blocked strings like "09:00 - 10:30 — Deep work on X"
- "productivityTips": array of short, practical tips tailored to the goals

No markdown, no explanation. Valid JSON only.`;

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system,
        prompt: data.goals,
      });
      return parsePlan(text);
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error) && error.text) {
        try {
          return parsePlan(error.text);
        } catch {
          // fall through
        }
      }
      throw error;
    }
  });
