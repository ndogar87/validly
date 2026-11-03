import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value.replace(/\/+$/, "") : undefined))
  .refine((value) => !value || /^https?:\/\//.test(value), {
    message: "Expected a valid URL",
  });

const serverEnvSchema = z.object({
  DECODO_API_KEY: z.string().trim().min(1, "DECODO_API_KEY is required"),
  ANTHROPIC_API_KEY: z.string().trim().min(1, "ANTHROPIC_API_KEY is required"),
  ANTHROPIC_MODEL: z.string().trim().optional(),
  ANTHROPIC_WORKSPACE_ID: z.string().trim().optional(),
  INSFORGE_API_KEY: z.string().trim().optional(),
  INSFORGE_URL: optionalUrl,
  INSFORGE_RESULTS_TABLE: z.string().trim().optional(),
  DECODO_PROXY_POOL: z.string().trim().optional(),
  DECODO_HEADLESS_MODE: z.string().trim().optional(),
  DECODO_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
  INSFORGE_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
});

export type ServerEnv = {
  decodoApiKey: string;
  decodoProxyPool: string;
  decodoHeadlessMode: string;
  decodoTimeoutMs: number;
  anthropicApiKey: string;
  anthropicModel: string;
  anthropicWorkspaceId?: string;
  insforgeApiKey?: string;
  insforgeUrl: string;
  insforgeTimeoutMs: number;
  insforgeResultsTable?: string;
};

let cachedEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsedEnv = serverEnvSchema.parse({
    DECODO_API_KEY: process.env.DECODO_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
    ANTHROPIC_WORKSPACE_ID: process.env.ANTHROPIC_WORKSPACE_ID,
    INSFORGE_API_KEY: process.env.INSFORGE_API_KEY,
    INSFORGE_URL: process.env.INSFORGE_URL,
    INSFORGE_RESULTS_TABLE: process.env.INSFORGE_RESULTS_TABLE,
    DECODO_PROXY_POOL: process.env.DECODO_PROXY_POOL,
    DECODO_HEADLESS_MODE: process.env.DECODO_HEADLESS_MODE,
    DECODO_TIMEOUT_MS: process.env.DECODO_TIMEOUT_MS,
    INSFORGE_TIMEOUT_MS: process.env.INSFORGE_TIMEOUT_MS,
  });

  cachedEnv = {
    decodoApiKey: parsedEnv.DECODO_API_KEY,
    decodoProxyPool: parsedEnv.DECODO_PROXY_POOL || "premium",
    decodoHeadlessMode: parsedEnv.DECODO_HEADLESS_MODE || "html",
    // Headless Reddit renders regularly take 20-40s.
    decodoTimeoutMs: parsedEnv.DECODO_TIMEOUT_MS ?? 60000,
    anthropicApiKey: parsedEnv.ANTHROPIC_API_KEY,
    anthropicModel: parsedEnv.ANTHROPIC_MODEL || "claude-opus-5-5",
    anthropicWorkspaceId: parsedEnv.ANTHROPIC_WORKSPACE_ID || undefined,
    insforgeApiKey: parsedEnv.INSFORGE_API_KEY || undefined,
    insforgeUrl: parsedEnv.INSFORGE_URL ?? "https://api.insforge.dev",
    insforgeTimeoutMs: parsedEnv.INSFORGE_TIMEOUT_MS ?? 90000,
    insforgeResultsTable: parsedEnv.INSFORGE_RESULTS_TABLE || undefined,
  };

  return cachedEnv;
}