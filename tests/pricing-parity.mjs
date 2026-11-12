// Fails if lib/pricing.ts and the Zox backend disagree on the credit
// packages or the free daily grant. The landing page shows these figures
// without asking the backend, so they are kept in step by hand.
//
// The backend lives in its own repository. This check reads the backend's
// source from a checkout beside this one (../zox), or from the folder named
// by ZOX_BACKEND_DIR. With no backend source to read it says so and passes,
// so run it wherever both are checked out before the figures change.
//
// Run with: pnpm run test:pricing   (plain Node, no build needed)
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(process.env.ZOX_BACKEND_DIR || path.join(here, "..", "..", "zox"));
const BACKEND_PRICING = "src/payments/pricing.ts";
const BACKEND_CREDITS = "src/billing/credits.ts";

if (!existsSync(path.join(backendDir, BACKEND_PRICING)) || !existsSync(path.join(backendDir, BACKEND_CREDITS))) {
  console.log("pricing parity: SKIPPED. No backend source at " + backendDir + ". Set ZOX_BACKEND_DIR to check against it.");
  process.exit(0);
}

/** Every { id, name, credits, amountUsd } object literal in a source file. */
function packagesIn(source) {
  const pattern = /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*credits:\s*([\d_]+),\s*amountUsd:\s*"([^"]+)"\s*\}/g;
  return [...source.matchAll(pattern)].map(([, id, name, credits, amountUsd]) => ({
    id,
    name,
    credits: Number(credits.replaceAll("_", "")),
    amountUsd,
  }));
}

/** The number assigned by "export const NAME = <number>;" in a source file. */
function constantIn(source, name) {
  const match = new RegExp("export const " + name + "\\s*=\\s*([\\d_]+)\\s*;").exec(source);
  assert.ok(match, name + " not found: has the file changed shape?");
  return Number(match[1].replaceAll("_", ""));
}

const backendPricing = readFileSync(path.join(backendDir, BACKEND_PRICING), "utf8");
const backendCredits = readFileSync(path.join(backendDir, BACKEND_CREDITS), "utf8");
const webPricing = readFileSync(path.join(here, "..", "lib", "pricing.ts"), "utf8");

const backendPackages = packagesIn(backendPricing);
const webPackages = packagesIn(webPricing);
assert.ok(backendPackages.length > 0, "no packages found in the backend's " + BACKEND_PRICING + ": has the file changed shape?");
assert.deepEqual(webPackages, backendPackages, "lib/pricing.ts packages differ from the backend's " + BACKEND_PRICING);

const backendGrant = Math.floor(
  constantIn(backendCredits, "FREE_DAILY_TOKEN_GRANT") / constantIn(backendCredits, "TOKENS_PER_CREDIT"),
);
assert.equal(
  constantIn(webPricing, "FREE_DAILY_CREDITS"),
  backendGrant,
  "FREE_DAILY_CREDITS differs from the backend's daily grant",
);

console.log(
  "pricing parity: " + webPackages.length + " packages and a daily grant of " + backendGrant + " credits match the backend",
);
