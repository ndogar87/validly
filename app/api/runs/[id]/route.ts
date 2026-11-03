import { NextResponse } from "next/server";

import { deleteRun, getRun } from "@/lib/runs";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: RouteContext<"/api/runs/[id]">) {
  const { id } = await params;
  const run = await getRun(id);

  if (!run) {
    return NextResponse.json({ error: "Run not found." }, { status: 404 });
  }

  return NextResponse.json(run);
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/runs/[id]">) {
  const { id } = await params;

  if (!(await deleteRun(id))) {
    return NextResponse.json({ error: "Run not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
