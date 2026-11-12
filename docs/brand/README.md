# Zox Brand Asset Pack

**Brand:** Zox, an AI companion for students on WhatsApp, by SAMKIEL Studio.  
**Website:** https://zox.samkiel.tech

## Colours

| Name | Hex | Use |
|---|---|---|
| Terracotta (primary) | `#C4703F` | Wordmark and profile images |
| Cream | `#FAF6F0` | Light backgrounds and inverted wordmark |
| Near-black | `#141009` | Dark background and black wordmark |

**Typography:** Fraunces for headlines; DM Sans for body text. These are UI type choices, not a recreation of the logo.  
**Text in `og-samkielbot.png`:** Liberation Sans Regular, used because DM Sans was not available in the rendering environment.

## Source and fidelity

The wordmark and isolated `z` were **contour-traced from the approved terracotta open-`o` image**. No font replacement or letter redesign was used. The single traced vector path is reused unchanged for every colour and size. The hole inside `o` is a true vector cutout (`fill-rule=even-odd`). SVG is the master. Raster PNG edges are anti-aliased; the underlying vector fills and backgrounds are solid flat hex colours without gradients, textures, grain, or shadows.

## Files and their use

### `logo/`

| File | Purpose |
|---|---|
| `zox logo nobg.svg` | Primary terracotta transparent SVG wordmark; source master |
| `zox logo nobg.png` | Terracotta transparent wordmark, 2000 px wide |
| `zox-logo-cream.svg` and `.png` | Cream transparent wordmark, PNG 2000 px wide |
| `zox-logo-black.svg` and `.png` | Near-black transparent wordmark, PNG 2000 px wide |
| `zox-logo-email.png` | Terracotta transparent wordmark, 640 px wide for signatures |
| `zox-icon.svg` | Isolated terracotta `z` vector in a transparent square |

### `web/`

| File | Purpose |
|---|---|
| `favicon.ico` | Transparent terracotta `z`, 16/32/48 px sizes |
| `icon.svg` | Scalable transparent terracotta `z` for the site |
| `apple-icon.png` | 180 × 180 Apple touch icon; cream `z` on terracotta |
| `icon-192.png` | 192 × 192 PWA icon |
| `icon-512.png` | 512 × 512 PWA icon |
| `icon-maskable-512.png` | 512 × 512 maskable PWA icon, `z` in central 60% |
| `manifest.json` | PWA name, colours, start URL and icon declarations |
| `opengraph-image.png` | 1200 × 630 Open Graph preview |
| `twitter-image.png` | 1200 × 600 Twitter/X preview |

### `social/profile/`

All profile images have terracotta wordmarks on near-black, with the full wordmark restricted to 68% of the square width for circular cropping.

| File | Platform and size |
|---|---|
| `whatsapp-profile.png` | WhatsApp, 640 × 640 |
| `instagram-threads-tiktok-profile.png` | Instagram / Threads / TikTok, 1080 × 1080 |
| `x-profile.png` | X, 400 × 400 |
| `linkedin-logo.png` | LinkedIn, 400 × 400 |
| `facebook-profile.png` | Facebook, 720 × 720 |
| `youtube-profile.png` | YouTube, 800 × 800 |
| `bluesky-profile.png` | Bluesky, 1000 × 1000 |
| `google-business-profile.png` | Google Business Profile, 720 × 720 |
| `discord-icon.png` | Discord, 512 × 512 |

### `social/banner/`

All banners have a terracotta wordmark centered on a cream background, ordinarily 35% of banner height.

| File | Platform and size |
|---|---|
| `x-header.png` | X header, 1500 × 500, outside top/bottom 60 px |
| `linkedin-cover.png` | Personal LinkedIn cover, 1584 × 396 |
| `linkedin-company-cover.png` | LinkedIn company cover, 1128 × 191 |
| `facebook-cover.png` | Facebook cover, 1702 × 630 |
| `youtube-banner.png` | YouTube banner, 2560 × 1440; wordmark at 60% of the **1546 × 423 center safe-area height** |
| `bluesky-banner.png` | Bluesky banner, 3000 × 1000 |

### `social/link-preview/`

| File | Purpose |
|---|---|
| `og-image.png` | 1200 × 630, byte-identical to `web/opengraph-image.png` |
| `github-social-preview.png` | GitHub social preview, 1280 × 640 |
| `og-samkielbot.png` | 1200 × 630, only asset containing added text: “SAMKIEL BOT is now” above the logo |

Every link-preview image in `web/` and `social/link-preview/` is under 300 KB.

## Next.js App Router placement

Put **all files from `web/` in your `app/` folder**, with three exceptions:

- `web/icon-192.png` → `public/icon-192.png`
- `web/icon-512.png` → `public/icon-512.png`
- `web/icon-maskable-512.png` → `public/icon-maskable-512.png`

To serve the manifest reliably as an App Router static asset, place `web/manifest.json` at `app/manifest.json` **only if your build setup supports that convention**; otherwise use `public/manifest.json` and reference it from metadata. In Next.js, `app/manifest.webmanifest` (renamed from this file) is another supported metadata convention. In either case the manifest icon paths assume the icons are in `public/`.

For automatically discovered Open Graph metadata, keep `opengraph-image.png` in `app/`. `twitter-image.png`, `icon.svg`, `apple-icon.png`, and `favicon.ico` can also live in `app/`.

For the site icon assets, if using manual metadata, reference your `manifest.json` explicitly in the root layout.
