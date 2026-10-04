import { createHash } from "node:crypto";
import { SYSTEM_PROMPT } from "../prompt";

/** Identifies the prompt a recording was made with. Recordings go stale when it changes. */
export function promptHash(): string {
  return createHash("sha256").update(SYSTEM_PROMPT).digest("hex").slice(0, 16);
}
