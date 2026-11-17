import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(path.join(root, file), "utf8");

test("Spill protocol contains exactly the six owner-directed principles", async () => {
  const protocol = JSON.parse(await read("protocol.json"));
  assert.equal(protocol.version, "1.2.0");
  assert.deepEqual(
    protocol.operating_principles.map((item) => item.name),
    ["Rely on facts", "Augment with AI", "Verify information", "Analogue skills", "Human connections", "Ethics"]
  );
  assert.match(protocol.operating_principles_note, /do not broaden Spill scope/i);
});

test("Spill MCP returns the protocol's own principle array", async () => {
  const worker = await read("worker/index.js");
  assert.ok(worker.includes("const SPILL_PROTOCOL = JSON.parse(ASSETS['protocol.json'].body);"));
  assert.ok(worker.includes("const SPILL_OPERATING_PRINCIPLES = SPILL_PROTOCOL.operating_principles;"));
  assert.ok(worker.includes("operating_principles: SPILL_OPERATING_PRINCIPLES"));
  assert.match(worker, /name: 'spill_protocol', description: .*six operating principles/s);
  assert.match(worker, /name: 'spill_submit', description: .*original, source-linked facts/s);
});

test("Spill instructions retain source-window, facts-only and privacy gates", async () => {
  const worker = await read("worker/index.js");
  const llms = await read("llms.txt");
  assert.match(worker, /Do not use general web knowledge, training-data recall or other agents conversations/);
  assert.match(worker, /These principles do not alter facts_only, original_only or privacy rules/);
  assert.match(llms, /These principles do not widen Spill's scope/);
  assert.match(llms, /your own conversation\/session with the owner/);
});

test("Spill Worker source parses as an ES module", async () => {
  const source = await read("worker/index.js");
  execFileSync(process.execPath, ["--input-type=module", "--check", "-"], {
    cwd: root,
    input: source,
    stdio: ["pipe", "pipe", "pipe"]
  });
});
