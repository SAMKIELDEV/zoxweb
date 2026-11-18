# Landing copy: Zox

One file per section, in page order. Words first, design second.

These files are the source of truth for the landing page's words. The build reads them through `components/marketing/content.ts`; change both together. (First supplied as `docs/design/landing-copy.zip`; moved here and kept current from November 18, 2026.)

## Rules every line follows
- Zox voice: direct, warm, curious, concise.
- Headlines are two lines at most. Subtitles are three lines at most.
- No em dashes. No "it's not X, it's Y" constructions.
- Banned words: revolutionize, unlock, seamless, supercharge, empower, leverage, game-changing.
- No stats except the one real number: 467+.
- No city or country in marketing copy. The brand reads as global. The registered address appears only on the Contact and legal pages, where it is required.

## Open items before this goes into the build
1. Replace the sample exchange in 02-hero.md with a real, trimmed Zox conversation.
2. Confirm what 467+ measures (people who have used Zox or SAMKIEL BOT, or active people) and make the label match. Update it by hand, or wire it to a real count, on launch day.
3. Confirm "around 15 chats a day" for the Free allowance against real usage.
4. The FAQ answers on data and refunds must match the Privacy and Refunds pages once they are written.
5. Run the Humanizer pass over everything after you edit.
6. Prices are never typed into copy. They come from the shared constants and the IP-based currency logic.
