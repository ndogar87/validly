# Saved runs and per-run cost

## Goal

1. Keep every analysis run so it can be reopened after a refresh or a new search.
2. Show what each run cost, split into Decodo and Claude.

## Storage

- One JSON file per run at `$DATA_DIR/runs/<id>.json` (`DATA_DIR` defaults to `./data`).
- In Docker, `/app/data` is a named volume, so runs survive restarts and rebuilds.
- Failed runs are saved too (status `error`), because they can still incur Decodo cost.

Run record:

```ts
{
  id, subreddit, createdAt, durationMs,
  status: "success" | "error", error?,
  source?, ideas: [],
  cost: {
    decodo: { requests, usd },
    claude: { model, inputTokens, outputTokens, usd } | null,
    totalUsd
  }
}
```

## Cost

- **Decodo**: count successful (HTTP 200) scrape requests per run and multiply by
  `DECODO_COST_PER_1K` (default `0.50`, the Free / $19 plan rate).
- **Claude**: `usage.input_tokens` / `usage.output_tokens` times the per-model price
  table in `lib/pricing.ts`, using `response.model` (the model that actually
  answered). Unknown models report tokens with `usd: null`.

## API

- `POST /api/analyze` runs the analysis, saves the run, returns it (with `id`, `cost`).
- `GET /api/runs` lists run summaries, newest first.
- `GET /api/runs/:id` returns a full run; `DELETE /api/runs/:id` removes it.

## UI

- "Previous runs" list: subreddit, date, idea count, total cost; click to open, delete button.
- Cost card on the open run: Decodo requests and $, Claude tokens and $, total.
- Open run id kept in the URL (`?run=<id>`) so a refresh restores it.

## Verification

No test suite exists; typecheck, lint, build, then run a real analysis on the
server and confirm the run persists across a page refresh and a container restart.
