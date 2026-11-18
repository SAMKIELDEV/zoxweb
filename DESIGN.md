# Zox Dashboard: Design System

Source of truth for every visual decision in the Zox web dashboard (Next.js, App Router, Tailwind v4, Framer Motion). If this file and your instincts disagree, this file wins. If this file is silent, stop and ask instead of guessing.

## 0. Status of the values below

The direction (warm, soft, editorial) is locked. The values in section 2 are **confirmed**: they were reconciled against the Figma Make export in Part 2. Figma supplied colors, fonts, radii, spacing, and the shell layout. This file's pattern rules (sections 6 and 10) won wherever the Figma broke them: no gradient balance card, no pure white surfaces, no identical card grids.

The implemented tokens live in `app/globals.css`. If that file and this section disagree, fix whichever is wrong in the same change.

The logo is supplied: the brand pack lives in `docs/brand/` (see its README for every file and its use).

## 1. Principles

- **Soft organic warmth, not a cute app.** Calm, editorial, human. Think a well-made printed journal, not a SaaS template.
- **Credits are the product.** Balance, usage, and top-up are what people come for. Numbers get typographic priority, not decoration.
- **Quiet by default.** One focal point per screen. Whitespace does the work that borders and cards usually do.
- **Zox has a voice.** The UI speaks like Zox: direct, warm, curious, concise. See section 8.

## 2. Tokens (Tailwind v4 `@theme`)

Components use semantic names, never raw values. Each name has a light and a dark value; the dark theme overrides the same CSS variables under `[data-theme="dark"]`, so no component branches on the theme.

| Token (Tailwind name) | Light | Dark | Use |
|---|---|---|---|
| `paper` | `#FAF6F0` | `#141009` | Page background |
| `surface` | `#F5EDE5` | `#1E1710` | Raised surface |
| `sidebar` | `#F2EBE0` | `#110E07` | Sidebar background |
| `wash` | `#EEE7DD` | `#2E2519` | Hover and selected fills, skeletons, bar tracks |
| `line` | `#E4D9CE` | `#2E2519` | Borders |
| `line-soft` | `#EDE3D8` | `#261E13` | Hairlines inside a surface |
| `track` | `#C8BFB5` | `#3A3028` | Control outlines: radio marks, input hover |
| `ink` | `#2A2420` | `#F0E8DC` | Body and headings |
| `ink-2` | `#5E544B` | `#B3A797` | Secondary text (passes AA) |
| `ink-3` | `#8A7F73` | `#7A6F63` | Hints only, never essential text |
| `accent` | `#C4703F` | `#D4845A` | Terracotta: marks, focus ring, large numbers |
| `accent-strong` | `#A85C30` | `#A85C30` | Primary button fill |
| `accent-deep` | `#934E27` | `#934E27` | Primary hover and pressed |
| `accent-ink` | `#A85C30` | `#D4845A` | Terracotta as small text or links |
| `on-accent` | `#FAF6F0` | `#FAF6F0` | Text on `accent-strong` |
| `forest`, `positive` | `#2C3B2E` | `#6A9B70` | Success, positive |
| `danger` | `#A33A2B` | `#E0806F` | Errors, destructive |
| `warning` | `#A8741A` | `#D6A04A` | Warnings (mark only in light; text stays `ink`) |

| Other tokens | Value |
|---|---|
| `font-display` | Fraunces, Georgia, serif |
| `font-sans` | DM Sans, system-ui, sans-serif |
| Radius `sm` / `md` / `lg` | 8px / 12px / 16px |
| `shadow-soft` | `0 2px 16px rgb(42 36 32 / 0.06)` |
| `shadow-lift` | `0 2px 4px rgb(42 36 32 / 0.08), 0 16px 40px rgb(42 36 32 / 0.10)` |
| `ease-zox` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--dur-fast` / `--dur-base` / `--dur-slow` | 140ms / 240ms / 420ms |

Theme: light and dark, switched by the toggle at the foot of the sidebar (in the menu sheet on phones; in the header on the public pages). The choice is stored in the browser; with no stored choice the system preference decides. Every page is checked in both themes.

Rules:
- Use tokens only. No raw hex, no arbitrary Tailwind color values. Tailwind's default palette, type sizes, radii and shadows are removed in `globals.css`, so off-system classes (`gray-*`, `text-4xl`, `rounded-3xl`) produce nothing.
- Spacing uses a 4px base. Prefer generous section spacing (48 to 80px between major blocks on desktop).
- Contrast: body text must meet WCAG AA against its surface. `ink-3` is decorative or hint text only. Terracotta text uses `accent-ink`; `accent` itself fails AA at small sizes in light theme.

## 3. Typography

- **Display (serif)**: page titles, the credit balance hero number, section headings. Large, confident, tight tracking.
- **Sans**: everything else. Body 16px, line-height 1.55.
- **Numbers**: use tabular figures (`font-variant-numeric: tabular-nums`) anywhere numbers align or change (balance, usage, transactions).
- Scale: 12 / 14 / 16 / 20 / 28 / 40 / 64 (`text-xs` through `text-3xl`). Do not invent sizes between. The public pages have a few sizes of their own, listed in section 14; the dashboard does not use them.
- Max two weights per family on a screen.
- Never use Inter, Roboto, Arial, or system-ui as a visible design font.

## 4. Texture and surface

- Subtle grain overlay on the page background only (SVG noise, 3% opacity in light and 5% in dark, `pointer-events: none`, fixed, behind all content). Never on cards or text.
- Cards are `surface` on `paper`, hairline `line` border or `shadow-soft`, not both heavy.
- A screen should not be a grid of identical cards. Vary scale and weight: one hero element, supporting rows, quiet lists.

## 5. Layout and shell

- Desktop: the floating sidebar panel described under "Dashboard shell" below: Home, Billing and Usage, with Settings, the theme toggle and Sign out at its foot. 220px wide with labels from 1024px, a 64px icon rail with tooltips from 768px. Content max width 1120px, left-aligned, clearing the panel (`components/shell/AppShell.tsx`).
- Two-column pages (a main column and an 18rem side column) start their side column at 1280px. From 1024 to 1279px the sidebar has just opened to 220px, so the page stays one column, capped at 720px. The shared class lists are in `components/shell/layout.ts`.
- Mobile: no sidebar. A 56px top bar with the Z mark and a menu button that opens a modal sheet (a native `dialog`) with the same items, the theme toggle and Sign out. Tap targets 44px minimum.
- The logo is the terracotta "zox" wordmark from the brand pack, with the standalone "z" in the dashboard's sidebar and phone bar and as the favicon. It sits at the top of the nav. Never redraw, recolor or rebuild it in code: render the supplied file through `components/ui/Logo.tsx`. Terracotta is used on both themes. The cream and near-black variants in `public/brand/` are for terracotta or photographic backgrounds, which the product does not have yet.
- Favicon, app icons, web manifest and the Open Graph and Twitter images are the files from the pack's `web/` folder, placed in `app/` and `public/` as its README describes.
- Page header pattern: every page opens with `PageHeader` (`components/shell/PageHeader.tsx`) inside the content area: the serif title (the page's only `h1`), an optional one-line sans subtitle in `ink-2`, and at most one primary action to the right. It renders in every state of the page.

### Dashboard shell (owner's direction, November 17, 2026)

Built November 18, 2026; the steps and the decisions made on the way are in `docs/design/dashboard-rebuild-plan.md`.

- **Desktop:** a floating sidebar panel, inset from the screen edges (it does not touch the top, bottom or left edge), on `sidebar` with a hairline border and `shadow-soft`, radius `lg`. The Z mark at the top. Nav items are rows with a tinted active background (`wash`) and a small terracotta edge marker on the active row. Settings and Sign out sit at the bottom of the panel.
- **Narrow desktop** (768 to 1023px): the panel collapses to an icon rail, each icon with a tooltip giving its name.
- **Phones:** no sidebar. A slim top bar with the Z mark and a menu button that opens a sheet with the same items.
- **Page header:** inside the content area, not in a full-width bar: the serif page title, an optional one-line subtitle, and at most one primary action to the right.
- **Home:** the balance is the hero (large serif number, a quiet line for what it covers), one large usage chart for the last 14 days (flat warm palette, direct labels, no gradients), recent activity as hairline rows, one primary action ("Top up"), and a small inline notice only when WhatsApp is not linked. No row of metric cards.
- **Dashboard motion:** page enter, list stagger, the chart drawing in once on first load, the balance changing (the digit flip), button press feedback. Nothing else.
- **Billing:** the balance, then the packages as rows (not cards) with prices in the visitor's currency, a sticky order summary on desktop, and the transaction history as hairline rows. The success page shows "Confirming your purchase" and polls until the webhook has credited the wallet; it never trusts the redirect alone. Status colors (`positive`, `warning`, `danger`) appear on this page only, always beside words. A "How credits work" link goes to the Pricing page.
- **Usage:** one large chart with a 7d, 30d, 90d toggle, then a breakdown by tool for the same period as horizontal bars with direct labels, then recent activity. No pie or donut charts. Days are the visitor's own (the backend counts them in the browser's time zone).
- **Settings:** one column with dividers: Profile (SAMKIEL ID, preferred name), WhatsApp link (status, and the code flow with polling), Notifications, Plan. Nothing the product cannot do (no fake toggles): Notifications and the preferred name are left out until the product has them.
- **Sign-in (owner's change, November 18, 2026):** the public pages' header and footer, no phone. On desktop (1024px and up) a quiet warm panel sits to the right of the form: `surface` with a hairline border, a soft terracotta wash from its lower right edge (the third and last gradient place on the public pages, after the hero and the CTA), the Z mark, "Zox gets to the point.", and three hairline rows on what the dashboard holds. Phones show the form only. The headline, one line on what SAMKIEL ID is for, one primary button "Continue with SAMKIEL ID", and under it a quiet line "Don't have a SAMKIEL ID? Create one." with "Create one." as the link. Zox has no password form of its own: both go to SAMKIEL ID at the accounts site. It covers the signed-out notice ("You were signed out. Sign in again to carry on.").

## 6. Components

- **Buttons**: primary = `accent-strong` fill with `on-accent` text (the lighter `accent` fails contrast with light text). Secondary = transparent with `line` border. Destructive is rare and uses `danger`. One primary button per view. A button whose work is still running is marked `busy`, never `disabled`: a disabled button drops keyboard focus, and the person has to find it again when the work ends.
- **Inputs**: `paper` fill, `line` border, terracotta focus ring (2px, offset 2px). Labels above, always visible.
- **Icons**: one icon set, one stroke weight, used sparingly: **Phosphor, regular weight** (`@phosphor-icons/react`), whose rounded joins match the buttons' rounded corners. It replaces Lucide (owner's choice, November 17, 2026); pages move over as they are rebuilt, and the hero phone keeps its WhatsApp-style glyphs, since it is a picture of another app. Never emoji as icons. No icon in a colored circle as a card header.
- **Credit balance**: the hero. Large serif number, small sans "credits" label, plus a quiet line for what it covers. Not wrapped in a gradient card.
- **Charts (Home and Usage)**: flat, warm palette (terracotta, forest, ink tints), no gradients, no glow, direct labels preferred over legends, no chart junk. Drawn by hand, with no chart library (`components/account/DailyChart.tsx`): bars in `accent`, the busiest day and today labelled, a hover readout per day, and a summary and table for screen readers.
- **Tables / lists** (transactions, activity): rows separated by whitespace and hairlines, not boxed zebra stripes.

## 7. States (mandatory on every data view)

Every page and data block ships with all four: loading, empty, error, and populated.
- **Loading**: skeletons that match final layout, in `wash`. No generic spinners for page content. A skeleton row is laid out like the real row, so it is the same height at every width.
- **Not linked**: a fifth state on every page that needs a WhatsApp number. The page shows why it is empty and one way forward (the link flow itself on Home and Settings, a link to it elsewhere).
- **Empty**: a short Zox-voiced line and one clear next action. No illustration clipart.
- **Error**: say what failed in plain words, offer retry, never show raw error codes or stack traces.
- **Billing success page**: shows "confirming your purchase" and polls wallet/transaction status. Do not trust the redirect alone. The webhook is the source of truth for crediting.

## 8. Voice (UI copy)

Zox is Direct, Warm, Curious. In the UI that means:
- Short. Say it once. No filler, no corporate phrasing ("seamless", "unlock", "empower", "leverage").
- No exclamation marks unless something genuinely good happened.
- No emoji in UI chrome.
- No "Welcome back" greeting patterns with a wave. If greeting at all, use the person's preferred name, plainly.
- Errors and empties sound like a person, not a system.

Examples:
- Empty usage: "Nothing here yet. Send Zox a message on WhatsApp and it shows up."
- Failed load: "Couldn't load that. Try again."
- Pending payment: "Confirming your purchase. This usually takes a few seconds."

## 9. Motion

- Framer Motion (the `motion` package) for page enter, list stagger and the balance flip. Hover and press feedback are plain CSS transitions. Both use the tokens in section 2 for duration and easing.
- Purposeful motion: page enter (fade + 8px rise), list stagger (40 to 60ms), digit flip on balance change (only the digits that changed, right to left, upward when credits arrive and downward when they are spent; owner's choice, November 13, 2026), press feedback on buttons. That is the whole vocabulary.
- No parallax, no bouncing, no looping decorative animation, no hover-scale on everything.
- Respect `prefers-reduced-motion`: disable transforms and the flip, keep opacity fades under 100ms.
- **Page-load bar (owner's request, November 18, 2026), on every page, public and dashboard:** a 2px `accent` line fixed along the top of the window while a page loads. On first load it grows from the first paint and fills and fades once the page has loaded; between pages, a click on an in-app link (or back and forward to another path) starts it, and it fills and fades when the new page renders. `transform` and `opacity` only, no dependency (`components/ui/RouteProgress.tsx`). Without script it never shows. With reduced motion it does not grow: it appears part-way and fades in under 100ms.
- Home keeps the balance live: it refetches the account every 5 seconds while the tab is visible, so credits spent on WhatsApp flip down without a reload.

## 10. Banned list (reject on sight)

This list is for the dashboard. The public marketing pages are built as designed, and their design uses a few of these. Section 14 names which ones; everything else here applies to them too.

- Default shadcn/ui look left unstyled, or any unmodified component library styling.
- Purple, blue, or teal gradients. Any gradient on cards or buttons.
- Glassmorphism, backdrop blur cards, neon glows, dark "cyber" panels.
- Identical rounded-card grids as the main layout.
- Emoji as icons or decoration. Icon-in-colored-circle headers.
- Gray or blue-tinted shadows. Pure black (`#000`) or pure white (`#fff`) anywhere.
- Default Tailwind color palette classes.
- Lorem ipsum, fake testimonials, placeholder stats, invented metrics.
- Stock hero phrases and filler copy (see section 8).
- Centered-everything layouts and symmetric three-column feature rows.

## 11. Performance

- Route-level code splitting is automatic in the App Router. Do not hand-roll it.
- Use `next/dynamic` only for heavy components that render below the fold or on interaction (for example the Usage chart).
- Never lazy load above-the-fold content: the balance hero, page title, nav, and primary action load eagerly.
- Fonts via `next/font`, with `display: swap` and a real fallback stack. Images via `next/image`.

## 12. Accessibility minimum

- Visible focus on every interactive element. Keyboard reachable. Semantic HTML first.
- Color is never the only signal (pair with text or icon).
- Forms: labels, error text tied to inputs, no placeholder-only labels.
- Test at 375px, 768px, and 1280px widths.

## 13. Definition of done (per page)

A page is not done until all of these are true:
1. Matches the Figma frame at desktop and mobile, or the deviation is listed and approved.
2. Uses only tokens. Zero raw colors, zero banned patterns.
3. All four states exist (loading, empty, error, populated).
4. Copy passes the voice rules in section 8.
5. Reduced-motion and keyboard checks pass.
6. Screenshots at 375, 768, and 1280 attached to the report.

Stop and report after each page. Do not continue to the next part without approval.

## 14. Marketing pages

The public pages live in `app/(marketing)/` with their components in `components/marketing/`. So far that is the landing page. Its design was published from Figma Make and is recorded in `docs/design/landing-reference/`.

The owner's decision for these pages (November 12, 2026): **build them as designed.** Where the design uses a pattern that section 10 bans, the design wins on the marketing pages. The dashboard is not affected: every rule above still holds there.

### What a marketing page may do that the dashboard may not

| In the design | Where | Rule it sets aside |
|---|---|---|
| White cards in a grid | Feature cards, pricing packs | No pure white; no identical card grids |
| An icon on a tinted square | Feature cards | No icon-in-colored-shape headers |
| Gradient fills | Zox's two chat bubbles | No gradients |
| Blurred color shapes | Behind the hero chat | No decorative blur |
| Colored shadows | The hero button, Zox's chat bubbles | Shadows are warm and neutral |
| Small all-caps labels above titles | "What Zox does", "Why Zox", "Pricing", pack names | Not part of the dashboard's type |
| One word of the headline in italic terracotta | Hero | Not part of the dashboard's type |
| A numbered row of three | Why Zox | No symmetric three-column rows |
| A centered section | Pricing | No centered-everything layouts |
| Emoji | Inside the chat illustration, as part of the messages | No emoji in UI chrome |
| A drawn phone with a WhatsApp-style chat on it | Hero (owner's request, November 16, 2026) | Tokens only for brand colors; the picture uses its own `wa-*` and `device` tokens |
| More than one filled button | Navigation, hero, pricing. All three start the same chat. | One primary button per view |
| Three weights of DM Sans, and sizes off the scale | Throughout | Two weights per family; the seven-step scale |

### What still holds

- Tokens only. The marketing values below are tokens in `globals.css`; no component writes a color.
- Text meets WCAG AA. Where the design's colors do not, the build uses the nearest token that does (see "Contrast" below).
- Visible focus, keyboard reach, 44px tap targets on phones, reduced motion respected. The landing page moves only as "Marketing motion" below allows.
- One icon set: Phosphor, regular weight (see section 6). The WhatsApp, X and Instagram marks are drawn from the design, as brand marks.
- The real logo, through `components/ui/Logo.tsx`. The design's hexagon was a placeholder.
- No invented numbers. Pack names, credits and prices come from `lib/pricing.ts`, which `pnpm run test:pricing` checks against the backend.
- No address written in code. The chat link is built from `NEXT_PUBLIC_ZOX_WHATSAPP_NUMBER`.
- The copy is the design's, word for word. A line that breaks section 8 stays as designed and is listed in that page's report.
- Marketing pages are static: they read no session and fetch nothing.

### Marketing tokens

Used by `components/marketing` only, with one exception noted below. They sit in their own block in `globals.css`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `card` | `#FFFFFF` | `#1E1710` | Feature and pricing cards, the person's chat bubbles |
| `band` | `#F5EDE5` | `#251D13` | The tinted "Why Zox" section |
| `accent-tint` | `#FDF0E7` | `#2E1E10` | Icon squares, terracotta |
| `forest-tint` | `#E8F0E9` | `#1C2A1E` | Icon squares, green |
| `signal` | `#5A8A60` | same | The "available" dot |
| `eyebrow` | `#934E27` | `#D4845A` | The small all-caps section labels |
| `bubble-accent`, `bubble-accent-end` | `#C4703F` to `#A85C30` | same | Chat illustration, Zox's first reply |
| `bubble-forest`, `bubble-forest-end` | `#2C3B2E` to `#1E2A20` | same | Chat illustration, Zox's second reply |
| `on-bubble` | `#FFFFFF` | same | Text on the two colored bubbles |
| `night` | `#2A2420` | `#241C14` | The footer card |
| `on-night`, `on-night-2` | `#F0E8DC`, `#B3A797` | same | Footer headings; footer body and links (6.5:1 light, 7.1:1 dark) |
| `night-line` | `#3D342C` | `#3A2F24` | Footer hairlines, social chips, the dark theme's card border |
| `--footer-mark-line`, `--footer-mark-fill` | `0.7`, `0.16` | `0.65`, `0.14` | The footer wordmark's outline (about 2.7:1 against `night`) and its fill |

| Type token | Size / line height | Use |
|---|---|---|
| `text-hero` | 38 to 61px, fluid / 1.08; smaller on phones (to 26px) so the headline keeps two lines | The page headline |
| `text-title` | 29 to 42px, fluid / 1.15 | Section titles |
| `text-figure` | 32px / 1 | Credit counts in the pricing packs |
| `text-point` | 22px / 1.5 | "Why Zox" headings |
| `text-lead` | 18px / 1.65 | The hero paragraph; feature card titles |
| `text-copy` | 15px / 1.65 | "Why Zox" paragraphs. Also the large (`lg`) button, which only the landing page uses. |
| `text-note` | 13px / 1.45 | Chat bubble text, the footer line |
| `text-micro` | 11px / 1.4 | Chat times, pack labels |

| Other token | Value | Use |
|---|---|---|
| Radius `xs` | 4px | The tail corner of a chat bubble |
| `shadow-card` | `0 2px 20px rgb(42 36 32 / 0.08)` | Cards |
| `shadow-bubble` | `0 6px 24px rgb(42 36 32 / 0.12)` | The person's chat bubbles |
| `shadow-bubble-accent`, `shadow-bubble-forest` | `0 6px 24px` in terracotta at 22%, forest at 18% | Zox's chat bubbles |
| `shadow-cta` | `0 4px 20px rgb(196 112 63 / 0.3)` | The hero button |

`shadow-card` and `shadow-bubble` have darker values in the dark theme, set in `globals.css`.

### The hero phone

The hero shows a generic phone in the proportions of a current tall Android flagship (a 19.5:9 screen, thin even bezels, buttons on the right, a punch-hole camera; owner's request, November 16, 2026), drawn in CSS with no logos or copied details, with a WhatsApp-style chat with Zox on it: Zox's header with "online" or "typing…", the back arrow, call icons and the three-dot menu, a patterned wallpaper, bubbles with tails, times and read ticks, and the composer with its round green button (a microphone when empty, send when not). It follows the page theme the way WhatsApp's light and dark themes do. Limits: no real device is copied, the wallpaper pattern is our own (not WhatsApp's doodles), the header carries Zox's own logo and name, and the visitor's own message shows a "sending" clock, never ticks or a reply, because nothing has been sent yet. Bubble times and the status bar clock are the visitor's own time. The script lives in `content/chat-script.ts`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `device`, `device-edge` | `#1D1A18`, `#36312D` | same | The handset |
| `wa-bg`, `wa-doodle` | `#EFEAE2`, `#E7E0D5` | `#0B141A`, `#131D24` | Chat wallpaper and its pattern |
| `wa-bar` | `#FFFFFF` | `#1F2C34` | Status bar, chat header |
| `wa-in`, `wa-out` | `#FFFFFF`, `#D9FDD3` | `#202C33`, `#144D37` | Zox's bubbles (and the composer, chips), the person's bubbles |
| `wa-ink`, `wa-meta`, `wa-icon` | `#111B21`, `#667781`, `#54656F` | `#E9EDEF`, `#8696A0`, `#AEBAC1` | Text, times and "online", icons |
| `wa-tick`, `wa-green`, `wa-on-green`, `wa-date` | `#53BDEB`, `#1DAA61`, `#FFFFFF`, `#FFFFFF` | `#53BDEB`, `#21C063`, `#0B141A`, `#182229` | Read ticks, the send button and its icon, the "Today" chip |
| `shadow-wa`, `shadow-device` | small bubble shadow; the handset's lift | darker in dark | |

### Type on the marketing pages

- Fraunces is drawn at its optical sizes: finer and narrower as it gets larger. The design relies on this for the headline. The marketing layout turns it on; the rest of the app holds the font at one cut (`font-variation-settings` in `globals.css`), so the dashboard's type is unchanged.
- Headings have normal letter-spacing here. The dashboard tightens its headings by 0.01em.
- Content column: 1152px at most, 24px side padding (`container` in `components/marketing/Section.tsx`).

### Contrast

The design's values, and what the build uses where they fall short of AA:

| Text | Design | Ratio | Build | Ratio |
|---|---|---|---|---|
| Muted body copy and notes | `#8A7F73` | 3.3 to 3.9:1 | `ink-2` | 6.2 to 7.4:1 |
| Section labels (12px) | `#C4703F` | 3.2 to 3.4:1 | `eyebrow` | 5.4 to 5.8:1 |
| Prices (20px) on a white card | `#C4703F` | 3.7:1 | `accent-ink` | 5.0:1 |
| Filled buttons | white on `#C4703F` | 3.7:1 | `on-accent` on `accent-strong` | 4.6:1 |
| Green icons, dark theme | `#2C3B2E` on its tint | 1.3:1 | `forest` | 4.7:1 |

`eyebrow` is its own token because `accent-ink` reaches only 4.3:1 on the tinted band.

The chat illustration is a picture of the product. Screen readers get one description of it, and WCAG does not hold text inside a picture to a contrast ratio. Its colored bubbles are drawn as designed: white on the terracotta gradient runs from 3.7:1 to 5.0:1, and the faint times under each message are fainter still. The times on the white bubbles use `ink-2`.

### Marketing motion

The landing page has a fixed motion budget. Section 9's vocabulary still holds for the dashboard; this section is the whole list for the public pages. Anything not named here does not move.

**The budget**

| # | Effect | What moves | Timing | Built with |
|---|---|---|---|---|
| 1 | Navbar morph | Flat bar to floating pill and back. The wordmark's O and X fade and slide into the Z. The fold follows the scroll over the first 140px (owner's choice, November 17, 2026): slow scrolling folds it slowly, stopping holds it part-way, scrolling up unfolds it. | Tied to scroll; a `--dur-fast` ease-out smooths wheel steps | One CSS variable set per frame |
| 2 | Hero phone demo | The chat opens with two exchanges already there. Then it plays the other scenarios in `content/chat-script.ts` (a YouTube link, voice notes both ways, a photo of a problem, a generated poster, a web search, an Instagram download once a link is set) in a shuffled order, repeating none until every one has played, for as long as the phone is on screen (owner's request, November 16, 2026, over "plays once"). Zox shows "typing…" or "recording audio…" in the header and, as WhatsApp now does, a typing bubble in the chat (three dots that rise in turn, or a pulsing mic while recording; the only looping motion on the page, and only while Zox is "typing"); a new bubble fades in and the chat scrolls up under it. The status bar is live: the visitor's real time, Wi-Fi and signal that drift every few seconds, a battery that drains a percent at a time. | `--dur-base` fade, `--dur-slow` scroll | CSS and a small script; no animation library |

The page-load bar in section 9 also runs on the public pages.

**Section reveals (owner's change, November 17, 2026; budget restated November 18, 2026).** The fixed list above left the lower sections feeling dead. Each major landing section now gets **exactly one** content-driven animation, played once when the section first scrolls into view:

- It explains the content, not decorates it: a rule drawing in, a highlight sweeping a line of a document, a timeline filling, source pills arriving in order, a pile collapsing into one chat bubble.
- Under 1.2 seconds in total. Only `transform`, `opacity` or SVG stroke drawing (`stroke-dashoffset`).
- It plays once and never replays on scroll back.
- Something at the very end of the page (the footer wordmark) can never rise above the bottom 20% of the screen, so its trigger counts the whole screen (`atPageEnd`).
- Still banned: parallax, marquees, looping decorative motion, cursor effects, hover shadows, count-up numbers.
- Reduced motion shows the final state.

**Scroll triggers (November 18, 2026).** An animation must not start, and must not show its final state, before its section is genuinely in view.

- The trigger is `useInViewOnce` in `components/marketing/Reveal.tsx`, an `IntersectionObserver` with a bottom root margin of 20% (the lowest fifth of the screen does not count). It fires once, when about **50%** of the watched element is visible on desktop (768px and up) or about **35%** on phones. For an element taller than the screen, the same share of the screen is enough.
- Watch the element that animates, not a taller wrapper: on a phone a stacked section's text can be on screen while its illustration is still below it.
- Elements stay in their start pose until the trigger fires. The start pose is in the server markup (`data-reveal="pending"`), and CSS shows it only when script is running and motion is allowed (`data-motion="ok"`, set on `<html>` by an inline script before first paint). So there is no flash of the finished state, a visitor without script sees the final state, and reduced motion sees the final state. Write start poses with the `pre-reveal:` variant (`app/globals.css`).

| Section | Its one animation |
|---|---|
| 03 Trust | The hairline rule draws in from the left. |
| 04 Problem | The pile of tabs and papers collapses into the one chat bubble. Watches the illustration, not the heading. |
| 05 Five jobs | Sticky stacking cards (below). Each card's illustration plays once when its card first becomes the active one: the two bubbles arrive, the PDF highlight sweeps and the summary chip appears, the source pills arrive in order, the video timeline fills, the annotation bracket draws. |
| 06 Pricing teaser | The price rows reveal with a 50ms stagger. |
| 07 FAQ | The answer's height and opacity as it opens and closes (no reveal on scroll). |
| 08 CTA | The composer rises 8px as it fades in. |
| 09 Footer | The wordmark's outline traces the letters, then its fill follows. |

**05 Five jobs: sticky stacking cards (November 18, 2026).** The section's cards pin under the navbar and each one slides up over the one before as the visitor scrolls. Native scrolling only: nothing hijacks or snaps the scroll.

- Each card is `position: sticky`, its `top` the navbar height (`--nav-h`) plus 14px per card, so the top edge of every earlier card stays visible.
- It reads as a real stack of paper (owner's request, November 18, 2026): the cards beneath shrink from their top edge by 4% per card on top of them (to 3 deep), so their peeking edges narrow, and take a `shade` layer (7% per card, at most 20%). Each card casts `shadow-stack` up onto the card beneath. Both follow the scroll as the next card slides over: one CSS variable per card (`--depth`), set per frame while the stack is near the screen, never React state. This is the second scroll-linked effect, after the navbar fold.
- A card's illustration plays once, when its card is 65% of the way into place.
- Heights use `svh`, never `vh`. Cards are tall (about two thirds of the screen) and each card's scroll runway is about 75% of the screen height, so five cards stay a short scroll on a phone with little empty space between them.
- No ancestor of the cards may have `overflow: hidden` (it breaks sticky, worst on iOS Safari). Use `overflow: clip` on the card itself if it must clip.
- Reduced motion and no script: a plain vertical list, no sticky, no transforms.

**FAQ (November 18, 2026).** A single-open accordion: opening one answer closes the others. Each question is a `button` with `aria-expanded` and `aria-controls`; the answer is a region labelled by it, and is `inert` while closed. Plain dividers, no card per question, the first answer open, 44px tap targets on phones. Without script every answer shows.

**Gradients on the public pages (November 18, 2026).** Allowed only as a soft wash: one or two brand tokens, the terracotta tint at low opacity, radial from an edge. Used in the hero, the closing CTA, and one more place: the sign-in page's side panel. Never behind body text, never on cards or buttons. (The chat bubbles in the hero phone are part of the picture and keep their gradient.)

**Composers (November 18, 2026).** Every text box that sends a message to WhatsApp (the hero phone, the closing CTA, any other) uses the same words, from `COMPOSER` in `components/marketing/content.ts`:

| Part | Copy |
|---|---|
| Placeholder | Type your message here |
| Button (visible text, or the accessible name of an icon button) | Send |
| Under the composer before sending (owner's change, November 18, 2026) | One short line that says typing here and tapping Send gets the message to Zox on WhatsApp, worded differently per composer. Hero phone: "Type your message, tap Send, and it goes to Zox on WhatsApp." Closing CTA: "Write it here. Send takes it straight to Zox on WhatsApp." |
| After the visitor taps Send | Opening WhatsApp with your message ready |
| Fallback button, if the browser blocks the hand-off | Open WhatsApp |

Behaviour does not change: a prefilled WhatsApp link, the message trimmed and capped at 300 characters, no fake delivered ticks, no fake reply.

**Footer (November 18, 2026).** The footer card is a dark surface in both themes, from its own tokens (`night`, `on-night`, `on-night-2`, `night-line`). In the dark theme it also takes a `night-line` border so it separates from the page. Body and link text pass AA on it. The large wordmark (owner's change, same day) is the brand file's own outline (`lib/brandWordmark.ts`, checked against the file by `tests/brand-wordmark.test.mjs`): a terracotta line at `--footer-mark-line` (about 2.7:1 against `night`) with a soft fill at `--footer-mark-fill`, fading out toward the card's lower edge through a mask. Its one animation: the outline traces the letters, then the fill follows (1.1 seconds, stroke drawing and opacity).

**Micro-interactions** (on top of the reveals): button press feedback; the icon in a button nudges 2px toward its action on hover; a feature card's illustration reacts slightly on hover (the card itself never moves, scales or gains a shadow).

Still banned on the public pages: parallax, cursor effects, marquees, count-up numbers, hover shadows, hover scale on cards or links, looping decoration (the phone's typing dots are the one exception), scroll-linked values (the navbar fold is the one exception), hide-on-scroll headers.

**Rules**

- Durations and easing come from the tokens (`--dur-fast` 140ms, `--dur-base` 240ms, `--dur-slow` 420ms, `ease-zox`), or from `lib/motion.ts` in script. No other curves.
- Animate `transform` and `opacity`. The navbar pill also animates `clip-path` on one childless layer. Nothing animates `width`, `height`, `top` or `left` on an element with children, except the FAQ answer, whose height change is confined to that one block.
- Scroll is read with a passive listener batched to one `requestAnimationFrame`, or with `IntersectionObserver`. The navbar fold and the five-jobs stack are the only scroll-linked effects, and each sets CSS variables per frame, never React state.
- `will-change` only where a trace shows it helps. None is set by default.
- Effects that CSS can do stay in CSS. The landing page ships no animation library: the hero's scroll is one transform set from script. If one is ever needed, it is Motion's `m` components inside `LazyMotion` with `domAnimation`.
- Nothing above the fold waits for motion. The headline and the phone shell render at once; the demo starts after hydration, in idle time.
- Every effect has a final state that is correct with no animation at all.

**Reduced motion**

With `prefers-reduced-motion: reduce`: the navbar snaps between flat and pill at the halfway point, with nothing in between; the phone shows its opening conversation, still, and plays nothing; every section reveal shows its final state at once (the rule drawn, the pile already collapsed, the rows in place); the five jobs are a plain list, not a sticky stack; the icon slide and illustration shift do not run; the FAQ opens and closes at once. Opacity fades, where any remain, stay under 100ms.
