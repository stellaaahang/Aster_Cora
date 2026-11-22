# Verification

## Official Cora Product page — 11 November 2026

- `npm run check`, `npm test` (10 tests), `npm run build` and `git diff --check` passed. The uploaded GLB, the public copy, and the built copy were compared byte for byte. The source SHA-256 is recorded in [3D-INTEGRATION.md](3D-INTEGRATION.md).
- Ten focused Product browser groups passed against the production preview. Camera screenshots verified the screen and sensing area on Front, the circular interface on both sides, rear controls on Back, ventilation on Top and the wheel assemblies on Bottom. Angle checks confirmed all six directions. The initial three-quarter view stayed still.
- Tested mouse orbit, wheel and button zoom, the zoom-in limit, reset, keyboard controls, touch rotation, two-finger zoom, page scrolling, native fullscreen and its focus-trapped fallback. Five hotspot categories track visible geometry; both side interfaces work, and hidden front points do not show through the model.
- Pixel comparisons confirmed that Working and Companion change only the display region. Standby restores the original render; mode selection leaves the camera unchanged. Verified module order, selection, bilingual state, and the Technology link. Only one GLB was fetched across the scene's interactions and static-view round trip.
- Simulated a failed GLB request and unavailable WebGL. The official static render and the rest of the page remained available, and retry recovered from a temporary fetch failure.
- Five shared browser groups and six focused Home groups passed on the production preview. The four pages fit English and Chinese at 1440 / 768 / 390 / 320px. Reviewed desktop and mobile Product renders, the six camera screenshots and the Chinese module preview. Product screenshots and a machine-readable report are written to `test-results/product/` by the browser script.
- The four attachments are concept images. The demonstration verifies presentation and interaction; it does not verify mechanical fit or flight readiness. Three.js is loaded only by the Product viewer; its lazy chunk is larger than Vite's default advisory threshold.

## Home guide, four cards, journey and Galaxy Drift — 11 November 2026

- Production build and all 10 unit/content tests passed. The voice tests check language-safe child-preset preference and bounded bright fallback settings.
- Six new Home browser groups passed on development and production previews: neutral default display; first-click smile and exact first message; second message and stable later clicks; no automatic voice; stop/cancellation; English Junior and Mandarin Flo selection in the mocked voice list; keyboard product interaction; four working card links and the Technology alias; journey hover preview/click lock/pointer leave/arrow keys; touch selection and mobile navigation.
- English and Chinese Home layouts were checked at 1440 / 1024 / 768 / 390 / 320px. Navigation, language controls, guide width/clearance and document width fit; reduced motion stopped the float/blink loops. Desktop and mobile hero, cards, journey and product bridge screenshots were reviewed.
- Existing six page-browser groups passed across all four original routes, both languages and the four original viewport widths. All eight exploration-pass groups passed; original opening source and artwork remain unchanged.
- Real Chrome WebGL2 checks confirmed four desktop layers, three blue/white palette colors, the requested .35 glow input (internally scaled by the official renderer), reverse drift and .03 rotation progression. No GL error was reported. The hero uses the requested 3.8-second float and pauses when it leaves the viewport.
- Production smoke verification confirmed the preserved opening enters the new Welcome Aboard Home. No normal browser runtime errors occurred in the grouped checks.
- Voice requests were inspected using a mock synthesis API; installed Chrome voices were separately enumerated. On this Mac Junior is available for English; Mandarin uses a bright matching-language fallback. Audible voice quality and availability are device-dependent.
- Mechanical detection returned the existing generic Inter-font warning, retained because the brief requests Inter. No new dependency or new photographic asset was added. Whitespace checks passed.


## db3345e opening restoration — 10 November 2026

- Restored OpeningPass.tsx and opening-pass.css byte-for-byte from `db3345e`. Gate, TearTicket, geometry, configuration, original logo, space-station art and paper texture also match the commit byte-for-byte. Opening translation blocks are unchanged from that version.
- Kept the current site logo separately in `assets.brandLogo`; the original opening continues to use `assets.logo`. Added a narrowly scoped legacy font/token stylesheet so the new site theme does not alter the old invitation.
- Compared a temporary checkout of `db3345e` against the integrated site in English and Chinese at 1440 / 768 / 390 / 320px. All sampled layout bounds, font families, sizes and colors matched. Four screenshots were pixel-identical; the other four differed only inside the rotated small logo's raster sampling bounds (0.09–0.16% of the frame). Both versions use the identical PNG bytes.
- Production build and all 8 unit/content tests passed. All 8 intro browser groups passed, covering drag/touch tearing, Skip, Direct entry, keyboard alternatives, English-first behavior, Chinese switching, once-per-first-visit persistence, intentional replay and unavailable storage.
- The opening was already mounted; its apparent absence resulted from the direct Home hash link and saved completion state. The original storage key and frequency are preserved. The complete review entry is `http://127.0.0.1:5173/?intro=preview`.
- Mechanical detector reported no findings for the restored opening and its scoped theme. `git diff --check` passed.

## Light Orbital Aerospace, original logo and local greeting — 10 November 2026

- Updated the single global palette, existing page backgrounds and component surfaces; retained all four routes, content collections and existing interactions. No additional runtime dependency was added in this refinement.
- Restored the user-supplied monochrome Aster logo. Dark navigation renders the same image in white; light navigation and footer use its original dark finish. The exploration pass uses the same lockup at its original layout sizes.
- Build, TypeScript checks, all 8 unit/content tests, and `git diff --check` passed. All 6 full-page browser groups and all 8 exploration-pass groups passed across both languages and four viewport widths.
- Updated Home checks passed: Cora responds locally to click / Enter / Space without navigation or speech; voice remains an explicit bilingual action and stops when the greeting changes or the page is left; Galaxy renders without a GL error; the original logo and fixed navigation switch correctly at each page's hero boundary; guidance fits 1440 / 768 / 390 / 320px.
- Reviewed desktop Home, all three inner-page openings, mobile Home, local greeting, light navigation and team cards. The scene background resolves to the shared content canvas without a hard image edge.
- Checked palette contrast: primary text on Space White 9.95:1; secondary text 6.55:1; white primary-button labels 5.68:1; selected navigation 7.51:1. This is targeted verification, not a complete accessibility certification.
- Mechanical detector returned only its generic Inter-font warnings; Inter is explicitly requested in the supplied visual brief and was retained.
- Live preview returned HTTP 200 at `http://127.0.0.1:5173/`.

## Space-station Home and shared navigation — 10 November 2026

- `npm run build`, all 8 unit/content tests, and `git diff --check` passed.
- All 6 grouped page browser checks passed across four routes, English/Chinese and 1440 / 768 / 390 / 320px. All 8 exploration-pass browser groups passed after the new Home heading was incorporated.
- Dedicated `scripts/home-browser-check.mjs` passed: a real WebGL2 context produced a compiled Galaxy program and no GL error under Chrome SwiftShader; no automatic speech; explicit English/Chinese voice requests; stop and cancellation on language change and navigation; keyboard navigation from the product; direct preview starts at scroll position zero; bubble width and separation from the product across all four responsive widths.
- Voice tests stubbed the browser speech API to inspect requests and cancellation; audible OS voices were not certified.
- Desktop Home, mobile Home and the Product navigation were visually reviewed. No document overflow or normal browser runtime errors were found. Browser rendering without WebGL still retained the scene and usable controls.
- Mechanical design detector returned only the generic Inter-font warning. Inter is intentionally retained to match the user's pinned reference. No additional detector finding was reported.
- Live development preview was restarted and verified with HTTP 200 at `http://127.0.0.1:5173/`. Direct Home preview is `/#home-heading`; exploration-pass replay is `/?intro=preview`.

Earlier verification history follows.

Verified on 8 November 2026 with the local project environment.

- `npm run check`: passed.
- `npm run build`: passed, including TypeScript checks.
- `npm test`: 4 passed. Translation shape/nonempty content, asset existence, truthful model fallback, and interactive-content completeness.
- `scripts/browser-check.mjs`: 6 grouped browser checks passed against both production preview and the Vite development server, using headless Google Chrome.
- Browser locale was explicitly set to zh-CN; a fresh site still opened in English.
- Four routes × two languages × widths 1440, 768, 390 and 320: images loaded and no document-level horizontal overflow.
- Tested navigation, single-card hotspots and close/Escape, six orthographic views, image zoom/reset, all functionality tabs, system nodes, module concepts, mission scenarios, workflow steps, keyboard tab navigation, language persistence across refresh/navigation, preserved scroll and selected tabs, mobile menu navigation and Escape.
- Browser runtime errors: none observed.
- `npm audit`: zero reported vulnerabilities with the locked dependency tree.
- Mechanical design detector: no findings.
- Visual review: desktop and mobile screenshots in both languages were inspected; representative viewport screenshots also verified first-screen layout.

Browser checks used a reduced-motion context. Automatic scroll reveals are implemented with IntersectionObserver and are disabled under reduced motion. This is a prototype website verification, not flight, hardware, WCAG certification, cross-engine certification or performance benchmarking.

At the 8 November baseline, no browser model had been provided; the image explorer was the fallback. The official GLB integration is documented above.

## Reference and white-finish revision

The four opening screens were restructured against the supplied reference, and the product perspective plus all six orthographic views were replaced with the user-requested matte-white visual variant. Component detail crops were updated from the white master. After this change, build and all four content tests passed; six grouped browser checks passed across both languages and the four widths. The mechanical design detector reported no findings. Desktop and Chinese mobile screenshots were reviewed, including the integrated product sidebar/viewer/detail panel. Source artifacts and edit prompts are retained in WHITE-FINISH.md and IMAGE-EDIT-PROMPTS.md.

## Exploration Pass opening — 9 November 2026

- Production build and TypeScript checks passed; 8 unit/content tests passed.
- 8 dedicated intro browser checks passed: first-visit persistence, focus containment and Skip; short-pull return and full pointer tear; direct Product links and first Home entry; Enter / Space / Escape; non-spatial reduced-motion drag; Chinese mobile touch tearing; intentional replay with preserved query parameters and bilingual layouts at 1440 / 768 / 390 / 320px; storage-unavailable fallback during navigation.
- The existing six grouped page checks also passed, including all four routes in both languages and four responsive widths.
- Production smoke checks passed for lazy JS/CSS/art loading, keyboard entry, 320px Chinese layout and Skip. Deliberately blocking the optional intro module still left Home and navigation usable.
- Desktop and Chinese mobile screenshots, plus a stretched-fiber interaction frame, were visually reviewed. No runtime errors occurred in normal browser checks.
- Mechanical design detector: no findings. No new runtime dependency was added.

## Landscape pass and space line art — 9 November 2026

- Desktop and mobile now use horizontal tickets and rightward tearing. The smaller space-station illustration replaces the product image in the opening; the prototype label is removed from the pass only.
- The requested English welcome message remains English in both locales and is explicitly marked `lang="en"`.
- `npm run build` and all 8 unit/content tests passed. All 8 intro browser groups passed, including a real horizontal touch drag, persistence, keyboard alternatives and reduced motion.
- Both languages were checked at 1440 / 768 / 390 / 320px: no horizontal overflow, no heading/illustration overlap, and the welcome text/barcode fit inside the stub. Desktop and mobile screenshots were visually reviewed.
- Production smoke checks passed at 320 × 844 and 900 × 430 for illustration loading, Chinese controls with the English greeting, horizontal orientation, keyboard tear / Skip, entry into Home and absence of browser runtime errors.
- Mechanical design detector and `git diff --check`: no findings. The generated transparent illustration is packaged locally as a 700px WebP (149 KB), with its master and prompt retained in SPACE-LINE-ART.md.

### Greeting localization follow-up

The greeting now reads “Welcome to Aster Space” in English and “欢迎来到Aster太空。” in Chinese; “Enjoy your trip.” has been removed. The greeting's language attribute follows the selected locale. Build and all 8 unit/content tests passed. Targeted browser checks verified both languages at 1440px and 320px, including text, language switching, stub fit, direct entry and no runtime errors. Desktop English and mobile Chinese screenshots were visually reviewed. The mechanical design detector reported no findings.

### Pass typography and English opening follow-up

Removed the digital-pass subtitle and visible keyboard hint from both locales; keyboard interaction remains supported. The English stub title is now “Exploration Pass”. Increased the invitation line from 8px to 12px on desktop and from 11px to 16px in the mobile artwork; increased the stub title from 10px to 14px / 12px to 18px respectively. The space-station artwork is now 255px wide on desktop and 185px in the mobile composition, with separate space for Cora.

Every opening starts in English before paint, including a browser with a saved Chinese preference, explicit preview replays and first Home navigation from a Chinese subpage. Manual Chinese choices remain selected through entry and later navigation; ordinary pages retain their saved language behavior. Build and 8 unit/content tests passed, as did all 8 intro browser groups across both languages and 1440 / 768 / 390 / 320px. Desktop English and mobile English/Chinese screenshots were reviewed. Production mobile smoke checks confirmed the English opening, removed labels, keyboard entry and preservation of a subsequent Chinese choice through Home, mobile-menu navigation and ordinary reload. No browser runtime errors, mechanical design findings or whitespace errors were observed.
