# Zox web

The website for Zox, the WhatsApp-native AI agent by SAMKIEL Studio: the public landing page and the signed-in dashboard (Home, Billing, Usage and Settings).

It is a Next.js app. Every figure in the dashboard comes from the Zox backend, which is a separate service. There are no demo balances in the application.

## Run locally

```powershell
pnpm install
pnpm run dev
```

Open http://localhost:3002. To change a setting, copy `.env.example` to `.env.local`.

| Variable | What it is | Default |
|---|---|---|
| `ZOX_BACKEND_URL` | Where the Zox backend answers | `http://localhost:3000` |
| `SAMKIEL_ID_URL` | The SAMKIEL ID service | `https://id.samkiel.tech` |
| `APP_ORIGIN` | This site's public origin. Set it in production. | The request's own host |
| `NEXT_PUBLIC_ZOX_WHATSAPP_NUMBER` | Zox's WhatsApp number, for the landing page's chat buttons | Unset: those buttons go to sign-in |
| `NEXT_PUBLIC_ZOX_X_URL`, `NEXT_PUBLIC_ZOX_INSTAGRAM_URL` | Profile links in the footer | Unset: the icon is hidden |
| `NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL` | The accounts site, when running one locally | `https://accounts.samkiel.tech` |

`NEXT_PUBLIC_` values are read when the site is built, so changing one needs a rebuild. None of them is secret, and this app holds no secret at all.

`pnpm run dev` and `pnpm run start` go through a small launcher that refuses to start a second copy on the same port.

## Deploy

The app runs anywhere Next.js runs.

- **Vercel:** import the repository and set the variables above. `vercel.json` gives the build command.
- **A web service elsewhere:** build with `pnpm install --frozen-lockfile --prod=false && pnpm run build`, start with `pnpm exec next start -p $PORT`.

It cannot be a static site: sign-in and the `/api` routes need the server.

It must be served from a host under `samkiel.tech`. Sign-in depends on cookies that SAMKIEL ID sets for that domain. On any other address, a preview URL for example, nobody can sign in.

## Sign-in

- Sign-in is SAMKIEL ID's. **Continue with SAMKIEL ID** on `/login` goes to the accounts site (`accounts.samkiel.tech/login?redirect=...`), which signs the person in and sends them back. There is no password form here. Registration and password recovery are on the accounts site too.
- SAMKIEL ID sets two HTTP-only cookies for all of `samkiel.tech`: `sk_access_token` (15 minutes) and `sk_refresh_token` (30 days). This app keeps no session of its own. Its `/api` routes read the access cookie and pass it to the backend as a bearer token. When it runs out, the browser calls `POST /api/session/refresh`, which swaps the refresh cookie for a new pair, and repeats the request.
- SAMKIEL ID ends a session when a refresh token reaches it twice. Renewals therefore go one at a time: one per tab, one across tabs (a browser lock), and one per server instance for requests that were already on their way.
- Signing out ends the SAMKIEL ID session and clears both cookies, so it signs the person out of every `samkiel.tech` site in that browser.
- The cookies are `SameSite=None`, so browsers send them on requests from other sites. Every request that changes something is rejected unless its Origin is this site. When `APP_ORIGIN` is unset, the request's own Host decides what "this site" is.
- Local sign-in needs SAMKIEL ID and the accounts site running locally as well, with `NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL` pointing at the local accounts site.

## What the server side does

- `proxy.ts` sends signed-out visitors from `/dashboard/*` to `/login` and remembers where they were going, so a payment page survives sign-in.
- `/api/account/*` passes a fixed list of account requests on to the backend with the person's access token. Anything not on the list is refused.
- `DELETE /api/session` signs out. `POST /api/session/refresh` renews a session.

The backend checks every token with SAMKIEL ID and answers only for that identity. Credits are granted by the backend alone, from a signed payment-provider webhook. The payment page here only reads a purchase's status: a redirect never grants anything.

## Design

`DESIGN.md` is the source of truth for tokens, type, layout, components, states, voice and motion. The brand pack is in `docs/brand/`, and the landing page's design reference is in `docs/design/landing-reference/`.

## Checks

- `pnpm run typecheck`
- `pnpm run build`: the production build.
- `pnpm run test:pricing`: compares the pack names, credits and prices in `lib/pricing.ts` with the backend's. It needs a backend checkout beside this repository, or `ZOX_BACKEND_DIR`. Without one it says so and passes.
