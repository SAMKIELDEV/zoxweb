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

Theme: light and dark, switched by the toggle in the top bar. The choice is stored in the browser; with no stored choice the system preference decides. Every page is checked in both themes.

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

- Desktop: left sidebar nav (Home, Billing, Usage, Settings), 220px wide with labels from 1024px and a 64px icon rail from 768px. Content max width 1120px, left-aligned, generous left/right padding. A sticky 64px top bar holds the page title (the page's only `h1`), the theme toggle, and who is signed in.
- Two-column pages (a main column and an 18rem side column) start their side column at 1280px. From 1024 to 1279px the sidebar has just opened to 220px, so the page stays one column, capped at 720px. The shared class lists are in `components/shell/layout.ts`.
- Mobile: no sidebar. A 60px top bar with the logo and page title, and a four-item bottom nav. Tap targets 44px minimum.
- The logo is the terracotta "zox" wordmark from the brand pack, with the standalone "z" where the wordmark does not fit (the 64px sidebar rail, the favicon). It sits at the top of the nav. Never redraw, recolor or rebuild it in code: render the supplied file through `components/ui/Logo.tsx`. Terracotta is used on both themes. The cream and near-black variants in `public/brand/` are for terracotta or photographic backgrounds, which the product does not have yet.
- Favicon, app icons, web manifest and the Open Graph and Twitter images are the files from the pack's `web/` folder, placed in `app/` and `public/` as its README describes.
- Page header pattern: the serif title lives in the top bar. A page may open with a one-line sans subtitle in `ink-2`, with its primary action aligned right.

## 6. Components

- **Buttons**: primary = `accent-strong` fill with `on-accent` text (the lighter `accent` fails contrast with light text). Secondary = transparent with `line` border. Destructive is rare and uses `danger`. One primary button per view. A button whose work is still running is marked `busy`, never `disabled`: a disabled button drops keyboard focus, and the person has to find it again when the work ends.
- **Inputs**: `paper` fill, `line` border, terracotta focus ring (2px, offset 2px). Labels above, always visible.
- **Icons**: one icon set, one stroke weight, used sparingly. Never emoji as icons. No icon in a colored circle as a card header.
- **Credit balance**: the hero. Large serif number, small sans "credits" label, plus a quiet line for what it covers. Not wrapped in a gradient card.
- **Charts (Usage page)**: flat, warm palette (terracotta, forest, ink tints), no gradients, no glow, direct labels preferred over legends, no chart junk.
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

- Framer Motion (the `motion` package) for page enter, list stagger and number counting. Hover and press feedback are plain CSS transitions. Both use the tokens in section 2 for duration and easing.
- Purposeful motion: page enter (fade + 8px rise), list stagger (40 to 60ms), number count on balance change, press feedback on buttons. That is the whole vocabulary.
- No parallax, no bouncing, no looping decorative animation, no hover-scale on everything.
- Respect `prefers-reduced-motion`: disable transforms and counting, keep opacity fades under 100ms.

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
| More than one filled button | Navigation, hero, pricing. All three start the same chat. | One primary button per view |
| Three weights of DM Sans, and sizes off the scale | Throughout | Two weights per family; the seven-step scale |

### What still holds

- Tokens only. The marketing values below are tokens in `globals.css`; no component writes a color.
- Text meets WCAG AA. Where the design's colors do not, the build uses the nearest token that does (see "Contrast" below).
- Visible focus, keyboard reach, 44px tap targets on phones, reduced motion respected. The landing page moves only in answer to a hover or a press.
- One icon set (Lucide, at the navigation's stroke weight). The WhatsApp, X and Instagram marks are drawn from the design, because Lucide carries no brand marks.
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

| Type token | Size / line height | Use |
|---|---|---|
| `text-hero` | 38 to 61px, fluid / 1.08 | The page headline |
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
