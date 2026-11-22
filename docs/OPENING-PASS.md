# Aster / Cora Exploration Pass

A first-visit opening interaction based on the user-approved paper ticket reference. The pass uses Aster branding, the website's blue-white palette and a small space-station line illustration. The actual Cora product is revealed after entry into Home.

## Entry rules

- A visitor's first plain `/` Home visit opens the pass. Every opening starts in English, including deliberate preview replays and after an earlier Chinese choice. Visitors can switch to Chinese while the pass is open, and that choice carries into Home and subsequent navigation. Ordinary pages retain the normal saved-language behavior.
- A completed tear, Skip intro, Enter directly or Escape enters Home and stores `aster.exploration-pass.v1=entered` in this browser's localStorage.
- Normal refreshes and subsequent navigation do not show the pass again. Other browsers/devices have their own first visit; clearing this key resets the first-visit experience.
- Direct Product, Applications and About links remain direct. A Home section hash also remains direct.
- `/?intro=preview` explicitly replays the opening for review, including after a previous completion. Finishing removes only the `intro` query parameter, preserving other query parameters.
- If storage is unavailable, entry still works and the mounted application remembers completion for the current visit. Persistence across a reload requires browser storage.

## Interaction

All screen sizes use a landscape ticket with a right-hand stub. Desktop artwork is 720 × 340; the compact mobile composition is 560 × 300 and scales to the available space. The Cora heading and illustration occupy separate areas. Touch users pull outward to the right, as on desktop.

Pointer motion provides a small perspective tilt and art parallax. Dragging selects a hinge at the perforation endpoint; increasing outward tension rotates the stub and progressively breaks the connecting paper fibers. A short or cancelled pull returns to the intact ticket. A detached stub follows the pointer until release, then falls and fades; the retained main ticket centers before the opening fades into Home. A quick decisive drag also works without waiting for a spring frame.

The printable artwork is a space-station and orbital line illustration, not a product rendering. The pass omits the prototype status label; development status remains available on the Product page. This interaction does not depend on a Cora GLB/GLTF or simulate a rotatable 3D product viewer.

The greeting follows the selected website language: “Welcome to Aster Space” in English and “欢迎来到Aster太空。” in Chinese, with a matching `lang` attribute. The right-hand title is “Exploration Pass” / “探索通行证”. This title and the invitation line have larger type, and the space-station illustration is enlarged while remaining separate from the Cora heading. The small digital-pass subtitle and visible keyboard hint have been removed in both locales. Keyboard operation remains available. All opening controls and instructions follow the selected language.

## Keyboard, touch and reduced motion

The opening is a native modal dialog with managed Tab / Shift+Tab focus. Enter or Space on the stub completes a tear; Escape, Skip intro and Enter directly provide alternatives. Touch capture is limited to the stub and respects pointer cancellation. On completion, body scrolling and focus return to Home.

Reduced-motion mode removes tilt, parallax and the falling trajectory. A short drag or keyboard operation provides clear fade/state feedback. Sound is off; the feature has no audio dependency.

The optional opening loads on demand. If the opening module fails, the normal Home content remains available.

## Files

- `src/components/intro/IntroGate.tsx`: first-visit policy, local persistence, explicit preview and fail-open boundary.
- `src/components/intro/OpeningPass.tsx`: branded artwork, localized copy, entry transition, native dialog and focus management.
- `src/components/intro/TearTicket.tsx`: reusable pointer/keyboard interaction and lightweight animation loop.
- `src/components/intro/ticketGeometry.ts`: paper cutouts, hinge geometry and tension calculations.
- `src/config/intro.ts`: dimensions, resistance, printed identifier and persistence key.
- `src/styles/opening-pass.css`: paper material, responsive compositions and motion treatment.
- `src/i18n/en.ts` / `zh.ts`: every opening label, instruction, status and accessible description.

No new runtime dependency is required. Animation frames run only during direct interaction, return or detachment. The illustration uses `aster-space-line-art.webp`; the small `pass-paper.svg` texture supplies restrained paper details. The source and generation prompt are documented in `docs/SPACE-LINE-ART.md`.

## Checks

`npm test` includes first-visit policy, persistence fallback and paper/tear geometry checks. `scripts/intro-browser-check.mjs` exercises the opening in Google Chrome with Playwright, including real pointer/touch input, focus, keyboard alternatives, replay, bilingual layouts and reduced motion. The existing page browser check sets the intro completion key to test ordinary page navigation independently.


## Exact restoration from db3345e — 10 November 2026

The opening component, stylesheet, gate, ticket interaction, geometry, configuration and supplied artwork are restored from commit `db3345e` without changes. Its original logo remains `/images/aster-logo.png`; the newer site's monochrome logo is configured separately as `assets.brandLogo`.

`src/styles/opening-pass-legacy.css` isolates the original font family and color tokens inside `.opening-pass`, preventing the newer site theme from changing the invitation. This preserves the original English-first bilingual text, horizontal ticket, space-station line art, proportions, tear motion, Skip and Direct entry.

The gate was already connected. A `#home-heading` direct link intentionally bypasses the opening, and the browser stores prior completion under the original key. No storage version or once-per-first-visit rule was changed. Use `http://127.0.0.1:5173/?intro=preview` to replay the original opening even after it has been viewed; entry leads into the current website.
