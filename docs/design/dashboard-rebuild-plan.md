# Dashboard rebuild plan (November 2026)

Builds the dashboard to DESIGN.md, "Dashboard shell" (owner's direction, November 17 and 18, 2026). This settles audit question 2: DESIGN.md wins over the Figma export. Each step is one commit, pushed when it builds and its tests pass.

## Steps

| # | Repo | Work | Done when |
|---|---|---|---|
| 1 | `zox` | `GET /api/account/usage?days=7\|14\|30\|90&tz=<IANA zone>`: credits and requests per day (every day present, zeroes included), and the per-tool totals for the same period. Days are counted in the visitor's time zone. | Route tests pass; pushed to `main` (Render) |
| 2 | `zoxweb` | Proxy allows `GET /usage` and passes on only `days` and `tz`. Client type, fetcher and `useUsageSeries` hook. | Typecheck passes |
| 3 | `zoxweb` | Shell: floating sidebar panel (inset, `sidebar`, hairline, `shadow-soft`, radius `lg`), Z mark at top, active row `wash` with a terracotta edge marker, Settings, theme and Sign out at the foot. Icon rail with tooltips from 768 to 1023px. Phones: slim top bar with the Z mark and a menu button opening a sheet with the same items; the bottom nav goes. Page header inside the content (`PageHeader`: serif `h1`, optional subtitle, at most one primary action). Phosphor icons in the shell. | Every page renders its own `PageHeader`; one `h1` per page |
| 4 | `zoxweb` | Home: balance hero, "Top up" as the header's one primary action, a 14-day usage chart, recent activity rows, account rows alongside. Not linked: the link flow, as now. | All five states; chart draws in once |
| 5 | `zoxweb` | Billing: the balance, packages as rows, a sticky order summary on desktop (the side column), purchases as hairline rows with status words in status colors, a "How credits work" link to `/pricing`. | All five states |
| 6 | `zoxweb` | Usage: one large chart with a 7d / 30d / 90d toggle, then the breakdown by tool for that period, then activity. | All five states; no pie or donut |
| 7 | `zoxweb` | Settings: one column with dividers: Profile (SAMKIEL ID), WhatsApp (number, member since, link or unlink), Plan, Sign out. | All states; no fake controls |
| 8 | `zoxweb` | DESIGN.md section 5 brought in line with the new shell; audit marked done for these items. | |

## Status (November 18, 2026)

All eight steps are built. Steps 1 (`zox`, on `main`) and 2 to 8 (`zoxweb`, on `redesign/v2-landing`) are pushed. Checked in a browser with mocked account data: every page populated at 375 and 1280px (Home and Usage also at 768, Billing at 1024), Home loading and empty, Usage at 90 days, failed and not linked, Settings not linked, the phone menu sheet, and Home in the dark theme. Not yet checked against the live backend.

- `DailyChart` lives in `components/account/` because Home and Usage both use it.
- The user chip in the old top bar is gone; who is signed in shows on Settings.
- `CreditCosts` and `UsageTotals` were removed; their information is on the Pricing page.

## Decided while planning

- **Notifications** are left out of Settings: the product sends none and has no setting for them, and DESIGN.md bans fake toggles. Add the section when the feature exists.
- **Preferred name** is left out of Profile: the column exists in the backend, but nothing sets it yet.
- **Charts are drawn by hand** in HTML, with no chart library: bars in `accent`, direct labels, no gradients, a screen-reader table of the same numbers.
- **The Usage breakdown follows the toggle** (the same period as the chart), not all time.
- **"What a credit covers"** leaves Billing and Usage; Billing links to the Pricing page instead, as DESIGN.md asks.

## Conventions the pages keep (read from the current dashboard)

- Data from `useAccount()`; states in this order: closed (403) renders nothing, a failed load is `ErrorState` with a retry, loading is `LoadingRegion` with skeletons laid out like the page, not linked is `LinkWhatsApp` (Home, Settings) or `NotLinked` (elsewhere).
- Sections are `section` with `aria-labelledby` and an `h2` in `text-lg font-semibold text-ink`.
- Rows are a `dl` or `ul` with `divide-y divide-line border-y border-line`, rows `py-4`, labels `text-sm text-ink-2`, values `text-sm tabular-nums text-ink`.
- `Button` / `ButtonLink` / `TextLink` only; running work is `busy`, never `disabled`.
- Motion from `lib/motion.ts`, with `useReducedMotion`.
- Page layout from `components/shell/layout.ts`.
- Tokens only. Phosphor icons from `@phosphor-icons/react/dist/ssr`, regular weight.
