import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const ResearchInput = z.object({
  topic: z.string().min(1, "Please enter a topic to research"),
});

const ResearchOutput = z.object({
  summary: z.string(),
  keyInsights: z.array(z.string()),
  recommendations: z.array(z.string()),
  workplaceExample: z.string(),
});

export type ResearchResult = z.infer<typeof ResearchOutput>;

function parseResearch(text: string): ResearchResult {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  return ResearchOutput.parse(JSON.parse(cleaned));
}

export const runResearch = createServerFn({ method: "POST" })
  .validator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(apiKey);
    const system = `You are an expert workplace research analyst. Research the topic and produce a concise briefing for a busy professional.

Return ONLY a JSON object with exactly these keys:
- "summary": a clear paragraph summarizing the topic
- "keyInsights": array of short, insightful bullet strings
- "recommendations": array of short, actionable recommendation strings
- "workplaceExample": one concrete practical example of applying this at work (string)

No markdown, no explanation. Valid JSON only.`;

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system,
        prompt: data.topic,
      });
      return parseResearch(text);
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error) && error.text) {
        try {
          return parseResearch(error.text);
        } catch {
          // fall through
        }
      }
      throw error;
    }
  });
