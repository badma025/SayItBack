import { handleExtract } from "../../../lib/extract/handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Above the 15 s Featherless timeout, so the fallback reply always gets sent. */
export const maxDuration = 25;

export async function POST(request: Request) {
  return handleExtract(request, {
    apiKey: process.env.FEATHERLESS_API_KEY,
    model: process.env.FEATHERLESS_MODEL || undefined,
  });
}
