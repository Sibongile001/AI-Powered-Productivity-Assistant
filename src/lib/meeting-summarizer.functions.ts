import { createServerFn } from "@tanstack/react-start";
import { generateText, NoObjectGeneratedError } from "ai";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const SummarizeMeetingInput = z.object({
  notes: z.string().min(1, "Meeting notes are required"),
});

const MeetingSummaryOutput = z.object({
  executiveSummary: z.string(),
  keyDiscussionPoints: z.array(z.string()),
  decisionsMade: z.array(z.string()),
  actionItems: z.array(z.string()),
  deadlines: z.array(z.string()),
  responsibilities: z.array(z.string()),
});

export type MeetingSummary = z.infer<typeof MeetingSummaryOutput>;

function parseSummaryJson(text: string): MeetingSummary {
  const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(cleaned);
  return MeetingSummaryOutput.parse(parsed);
}

export const summarizeMeeting = createServerFn({ method: "POST" })
  .validator((input: unknown) => SummarizeMeetingInput.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("Missing LOVABLE_API_KEY");
    }

    const gateway = createLovableAiGatewayProvider(apiKey);

    const system = `You are an expert executive assistant. Summarize the provided meeting notes into a clear, professional, and actionable format.

Return ONLY a JSON object with exactly these keys:
- "executiveSummary": a short paragraph (string)
- "keyDiscussionPoints": array of concise bullet strings
- "decisionsMade": array of concise bullet strings
- "actionItems": array of concise bullet strings
- "deadlines": array of concise bullet strings
- "responsibilities": array of concise bullet strings

Do not include markdown formatting or explanation. Return valid JSON only.`;

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system,
        prompt: data.notes,
      });
      return parseSummaryJson(text);
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        const fallbackText = error.text ?? "";
        if (fallbackText) {
          try {
            return parseSummaryJson(fallbackText);
          } catch {
            // fall through to generic error
          }
        }
      }
      throw error;
    }
  });
