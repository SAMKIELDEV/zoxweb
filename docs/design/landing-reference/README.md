# Landing page design reference

Captured on 2026-11-12 from the published Figma Make design at
`https://import-social-86577787.figma.site` (the "Zox Dashboard Design" file,
republished that day). The Figma connector could not open the source file, so
the published site was opened in a browser and recorded instead.

| File | What it is |
|---|---|
| `landing-light-1280.png`, `-768.png`, `-375.png` | Full-page screenshots, light theme |
| `landing-dark-1280.png`, `-768.png`, `-375.png` | Full-page screenshots, dark theme |
| `*-fold.png` | The first screen only (900px tall) at each width |
| `landing-1280.html`, `-768.html`, `-375.html` | The rendered page markup at each width, with every inline style and icon path |
| `landing-1280-tree.txt` | The same markup as an indented outline, icon paths shortened |
| `landing-summary.json` | Text, headings, font sizes, colors, radii and effects read from the live page |

These are the comparison target for the built landing page. They are a
record of the design, not code to copy: the build uses the project's tokens
and components.

Decisions the owner made that differ from what these files show:

- The "Logo lab" link in the navigation and "Explore the logo lab" in the
  hero are left out. The Logo lab is an internal exploration page.
- The hexagon mark drawn here is a placeholder. The real logo is the "zox"
  wordmark in `docs/brand/`, supplied on 2026-11-12, and the build uses that.
- Package names and prices come from the shared pricing constants (Basic, Pro,
  Max), not the names written in the design (Starter, Standard, Power).
