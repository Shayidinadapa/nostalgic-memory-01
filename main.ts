// nostalgic-memory-01 — make.fun entry
// Writes one sentence, a childhood memory, to $MAKEFUN_OUTPUT_DIR/entry.txt
// and validates it against the gate: UTF-8 text, 1-280 characters, not only whitespace.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SENTENCE =
  "I can still feel my father's shoulder under my cheek on the walk home at dusk, the gravel crunching under his sandals while the kitchen light waited for us.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "./output";
const outPath = join(outDir, "entry.txt");

const chars = [...SENTENCE].length;
if (SENTENCE.trim().length === 0) {
  throw new Error("entry is blank");
}
if (chars < 1 || chars > 280) {
  throw new Error(`entry is ${chars} characters, must be 1-280`);
}
if (SENTENCE.includes("\n")) {
  throw new Error("entry must be a single line");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, SENTENCE, "utf8");

// Read back and verify: the file on disk must be exactly the sentence,
// with the same code-point length (not UTF-16 units, not bytes).
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== SENTENCE) {
  throw new Error("read-back mismatch: entry.txt does not match the sentence");
}
if ([...roundTrip].length !== chars) {
  throw new Error("read-back length mismatch");
}
console.log(`wrote ${outPath} (${chars} characters, read-back verified)`);
