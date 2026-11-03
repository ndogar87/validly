import { NextResponse } from "next/server";
import { z } from "zod";

import { analyzeWithAI } from "@/lib/ai";
import { structureRedditData } from "@/lib/reddit";
import { createRunId, saveRun } from "@/lib/runs";
import type { SaasIdea, SavedRun, StructuredRedditData } from "@/lib/types";
import { calculateRunCost, trackRunUsage } from "@/lib/usage";

export const runtime = "nodejs";
export const maxDuration = 300;

const requestSchema = z.object({
  subreddit: z
    .string()
    .trim()
    .min(1, "Subreddit is required")
    .max(50, "Subreddit is too long")
    .regex(/^[A-Za-z0-9_]+$/, "Use a subreddit name without /r/ or spaces"),
});

function getErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Invalid request payload.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected server error.";
}

export async function POST(request: Request) {
  let body: z.infer<typeof requestSchema>;

  try {
    body = requestSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }

  console.log(`[API] Starting analysis for r/${body.subreddit}`);
  const startedAt = Date.now();
  let source: StructuredRedditData | null = null;

  const { usage, result } = trackRunUsage(async (): Promise<SaasIdea[]> => {
    source = await structureRedditData(body.subreddit);
    console.log(`[API] Scraped ${source.posts.length} posts`);

    return analyzeWithAI(source);
  });

  let ideas: SaasIdea[] = [];
  let errorMessage: string | undefined;

  try {
    ideas = await result;
    console.log(`[API] Generated ${ideas.length} ideas`);
  } catch (error) {
    console.error("[API] Error occurred:", error);
    errorMessage = getErrorMessage(error);
  }

  const run: SavedRun = {
    id: createRunId(),
    subreddit: body.subreddit,
    createdAt: new Date(startedAt).toISOString(),
    durationMs: Date.now() - startedAt,
    status: errorMessage ? "error" : "success",
    error: errorMessage,
    source,
    ideas,
    cost: calculateRunCost(usage),
  };
  console.log(`[API] Run ${run.id} cost: $${run.cost.totalUsd.toFixed(4)}`);

  try {
    await saveRun(run);
  } catch (error) {
    // Losing the history entry shouldn't hide a finished analysis from the user.
    console.error("[API] Failed to save run:", error);
  }

  if (errorMessage) {
    return NextResponse.json({ error: errorMessage, run }, { status: 500 });
  }

  return NextResponse.json(run);
}
