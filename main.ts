// make.fun entry: One Line, One Laugh.
// Reads the single joke line from line.txt next to this file and emits it
// verbatim as entry.txt inside the output directory (MAKEFUN_OUTPUT_DIR,
// default /output). No trailing newline is added anywhere.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const targetDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");

function loadLine(): string {
  const raw = readFileSync(join(sourceDir, "line.txt"), "utf8");
  // line.txt is stored without a trailing newline; strip any trailing
  // whitespace defensively so the emitted file is exactly one line.
  const cleaned = raw.replace(/\s+$/, "");
  if (cleaned.length === 0) throw new Error("line.txt is empty");
  if (cleaned.length > 200) {
    throw new Error(`line is ${cleaned.length} chars, max 200`);
  }
  if (cleaned.includes("\n")) throw new Error("line must be a single line");
  const stops = (cleaned.match(/[.!?]/g) ?? []).length;
  if (stops !== 1) throw new Error("line must be exactly one sentence");
  return cleaned;
}

const joke = loadLine();
mkdirSync(targetDir, { recursive: true });
writeFileSync(join(targetDir, "entry.txt"), joke, "utf8");
console.log(joke);
