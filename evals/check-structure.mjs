#!/usr/bin/env node
// Reference static eval: checks the FORM of a harness's agents, with no LLM and no dependencies.
// Demonstrates the principle "an eval only enforces rules that are already written." Adapt the rules to your structure.
// Usage:  node evals/check-structure.mjs [agents-dir]   (default: examples/agents)   exit 1 if any violation.

import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

const AGENTS_DIR = process.argv[2] ?? "examples/agents";
const ALLOWED_FRONTMATTER = new Set(["name", "description", "tools", "model"]);
const REQUIRED_SECTIONS = ["Role", "Use when", "Do not use when", "Required context", "Output format"];
const WRITE_TOOLS = ["Edit", "Write"];

const violations = [];
const flag = (file, msg) => violations.push(`${file}: ${msg}`);

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  return Object.fromEntries(
    m[1].split("\n").filter((l) => /^\w[\w-]*:/.test(l)).map((l) => {
      const i = l.indexOf(":");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
  );
}

let checked = 0;
for (const f of readdirSync(AGENTS_DIR).filter((x) => x.endsWith(".md"))) {
  checked++;
  const text = readFileSync(join(AGENTS_DIR, f), "utf8").replace(/\r\n/g, "\n");
  const name = basename(f, ".md");
  const fm = frontmatter(text);

  if (!fm) { flag(f, "no frontmatter"); continue; }
  if (fm.name !== name) flag(f, `name "${fm.name}" differs from file "${name}"`);
  if (!fm.description) flag(f, "empty description — the agent will not load without it");
  if (!fm.tools) flag(f, "tools missing — the allowlist must be explicit");
  for (const key of Object.keys(fm)) {
    if (!ALLOWED_FRONTMATTER.has(key)) flag(f, `field "${key}" is not standard`);
  }

  for (const sec of REQUIRED_SECTIONS) {
    if (!new RegExp(`^## ${sec}`, "m").test(text)) flag(f, `missing section "## ${sec}"`);
  }

  // An agent the text declares read-only must not have a write tool.
  const declaresReadOnly = /read-only/i.test(text);
  const tools = (fm.tools ?? "").split(",").map((t) => t.trim());
  const write = tools.filter((t) => WRITE_TOOLS.includes(t));
  if (declaresReadOnly && write.length) flag(f, `declared read-only, but has ${write.join(", ")}`);

  // The output format must open with the contract block.
  if (!/confidence|contract block/i.test(text.split("## Output format")[1] ?? "")) {
    flag(f, '"## Output format" does not mention the contract block');
  }
}

if (!violations.length) {
  console.log(`ok — ${checked} agent(s) checked`);
  process.exit(0);
}
for (const v of violations) console.log(v);
console.log(`\n${violations.length} violation(s).`);
process.exit(1);
