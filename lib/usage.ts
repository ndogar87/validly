import { AsyncLocalStorage } from "node:async_hooks";

import { getServerEnv } from "@/lib/env";
import type { RunCost } from "@/lib/types";

// USD per million tokens (input, output) for prompts under the long-context threshold.
const CLAUDE_PRICING: Record<string, { input: number; output: number }> = {
  "claude-fable-5-1": { input: 10, output: 50 },
  "claude-fable-5": { input: 10, output: 50 },
  "claude-opus-5-5": { input: 4, output: 20 },
  "claude-opus-5": { input: 5, output: 25 },
  "claude-opus-4-8": { input: 5, output: 25 },
  "claude-opus-4-7": { input: 5, output: 25 },
  "claude-sonnet-5-5": { input: 2, output: 10 },
  "claude-sonnet-5": { input: 2, output: 10 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
};

type RunUsage = {
  decodoRequests: number;
  claude: { model: string; inputTokens: number; outputTokens: number } | null;
};

// Scoped per request so concurrent analyses don't mix their counts.
const runUsage = new AsyncLocalStorage<RunUsage>();

export function trackRunUsage<T>(fn: () => Promise<T>): { usage: RunUsage; result: Promise<T> } {
  const usage: RunUsage = { decodoRequests: 0, claude: null };
  return { usage, result: runUsage.run(usage, fn) };
}

export function recordDecodoRequest(): void {
  const usage = runUsage.getStore();
  if (usage) {
    usage.decodoRequests += 1;
  }
}

export function recordClaudeUsage(model: string, inputTokens: number, outputTokens: number): void {
  const usage = runUsage.getStore();
  if (usage) {
    usage.claude = { model, inputTokens, outputTokens };
  }
}

function priceForModel(model: string) {
  return (
    CLAUDE_PRICING[model] ??
    // Tolerate dated or suffixed IDs such as "claude-opus-5-5-20260401".
    Object.entries(CLAUDE_PRICING).find(([id]) => model.startsWith(id))?.[1]
  );
}

export function calculateRunCost(usage: RunUsage): RunCost {
  const { decodoCostPer1k } = getServerEnv();
  const decodoUsd = (usage.decodoRequests / 1000) * decodoCostPer1k;

  let claude: RunCost["claude"] = null;
  if (usage.claude) {
    const price = priceForModel(usage.claude.model);
    claude = {
      ...usage.claude,
      usd: price
        ? (usage.claude.inputTokens * price.input + usage.claude.outputTokens * price.output) / 1_000_000
        : null,
    };
  }

  return {
    decodo: { requests: usage.decodoRequests, usd: decodoUsd },
    claude,
    totalUsd: decodoUsd + (claude?.usd ?? 0),
  };
}
