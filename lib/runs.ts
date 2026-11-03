import { randomBytes } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import type { RunSummary, SavedRun } from "@/lib/types";

const RUN_ID_PATTERN = /^[a-z0-9]+-[a-f0-9]{6}$/;

function runsDir(): string {
  return path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "runs");
}

function runPath(id: string): string | null {
  // The id comes from the URL, so only accept the format we generate.
  return RUN_ID_PATTERN.test(id) ? path.join(runsDir(), `${id}.json`) : null;
}

export function createRunId(): string {
  return `${Date.now().toString(36)}-${randomBytes(3).toString("hex")}`;
}

export async function saveRun(run: SavedRun): Promise<void> {
  const file = runPath(run.id);
  if (!file) {
    throw new Error(`Invalid run id: ${run.id}`);
  }

  await mkdir(runsDir(), { recursive: true });
  await writeFile(file, JSON.stringify(run), "utf8");
}

export async function getRun(id: string): Promise<SavedRun | null> {
  const file = runPath(id);
  if (!file) {
    return null;
  }

  try {
    return JSON.parse(await readFile(file, "utf8")) as SavedRun;
  } catch {
    return null;
  }
}

export async function deleteRun(id: string): Promise<boolean> {
  const file = runPath(id);
  if (!file) {
    return false;
  }

  try {
    await rm(file);
    return true;
  } catch {
    return false;
  }
}

export async function listRuns(): Promise<RunSummary[]> {
  let files: string[];
  try {
    files = (await readdir(runsDir())).filter((name) => name.endsWith(".json"));
  } catch {
    return [];
  }

  const runs = await Promise.all(files.map((name) => getRun(name.slice(0, -".json".length))));

  return runs
    .filter((run): run is SavedRun => run !== null)
    .map((run) => ({
      id: run.id,
      subreddit: run.subreddit,
      createdAt: run.createdAt,
      status: run.status,
      ideaCount: run.ideas.length,
      totalUsd: run.cost.totalUsd,
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
