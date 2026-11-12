---
name: zox-design
description: Enforces the Zox design system when building or changing any UI in the Zox web dashboard (Next.js, Tailwind v4, Framer Motion). Use this skill whenever the task involves pages, components, layouts, styling, colors, typography, animations, copy, empty or error states, or the Home, Billing, Usage, or Settings pages, even if the user does not mention design. Also use it when reviewing or auditing existing UI for generic "AI slop" patterns. Always read DESIGN.md at the repo root first.
---

# Zox design

Zox is a WhatsApp-native AI agent with a personality. The dashboard must feel like it: soft organic warmth, editorial, calm. Not a SaaS template.

## Before you write any UI

1. Read `DESIGN.md` at the repo root. It is the source of truth for tokens, type, layout, components, states, voice, motion, the banned list, and the definition of done.
2. If a Figma frame exists for the page, read it. Figma wins over DESIGN.md for colors, type, and spacing. Record any difference.
3. If DESIGN.md is silent on a decision, stop and ask. Do not fall back to library defaults.

## Hard rules

- Tokens only. No raw hex, no default Tailwind palette classes, no arbitrary color values.
- Every data view ships four states: loading, empty, error, populated.
- Copy is in Zox's voice: short, direct, warm. No corporate filler, no emoji in UI chrome, no "Welcome back 👋".
- Motion uses Framer Motion with the DESIGN.md tokens and respects `prefers-reduced-motion`.
- Never lazy load above-the-fold content. `next/dynamic` only for heavy below-the-fold pieces like charts.
- One primary action per view. One focal point per screen. Do not build screens out of identical rounded cards.

## Slop check (run before reporting)

Reject and fix if any of these appear: default shadcn styling left as is, gradients on cards or buttons, glassmorphism, glows, icon-in-colored-circle headers, emoji as icons, gray or blue-tinted shadows, pure black or white, Inter/Roboto/Arial as the visible font, centered-everything layouts, symmetric three-column feature rows, placeholder or invented metrics.

## Workflow

- Build one page at a time. Foundation (tokens, primitives, shell) first, then Home, then stop for review.
- After each page, report: what was built, deviations from Figma or DESIGN.md, screenshots at 375, 768, and 1280 widths, and the slop check result.
- Do not start the next page until the user approves.
- Keep backend and API contracts unchanged unless the task says otherwise. Reuse the existing API client and data layer. Legacy UI lives in `_legacy` for reference only and must not be imported.