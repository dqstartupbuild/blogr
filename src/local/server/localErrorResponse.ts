import { NextResponse } from "next/server";

export const localErrorResponse = (error: unknown) => {
  const message = error instanceof Error ? error.message : "Could not complete this action.";
  const status = /changed|revision/i.test(message) ? 409 : /too large/i.test(message) ? 413 : /not found/i.test(message) ? 404 : 400;
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
};
