import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// The footer traces the wordmark from a copy of its path (lib/brandWordmark.ts).
// The brand file is the logo: the copy must match it exactly.
test("the footer wordmark matches the brand file", () => {
  const file = readFileSync(new URL("../public/brand/zox-logo.svg", import.meta.url), "utf8");
  const copy = readFileSync(new URL("../lib/brandWordmark.ts", import.meta.url), "utf8");
  const pick = (source, pattern) => source.match(pattern)?.[1];
  assert.equal(pick(copy, /d: "([^"]*)"/), pick(file, /<path d="([^"]*)"/));
  assert.equal(pick(copy, /viewBox: "([^"]*)"/), pick(file, /viewBox="([^"]*)"/));
  assert.equal(pick(copy, /transform: "([^"]*)"/), pick(file, /<g transform="([^"]*)"/));
});
