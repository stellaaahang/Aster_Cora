# Space-station Home — 10 November 2026

The user's latest 21:47 screenshot is the visual reference for Home and the shared navigation. Home uses separate scene, product and live UI layers; the reference is not displayed as a flat page screenshot. The four original destinations remain Home, Product, Applications and About. The language switch remains available on every route.

## Assets and provenance

These are native image-generation **edits of user-provided references**, not engineering renders or evidence of a built capability. The user explicitly requested the upright white product appearance in the latest screenshot. The supplied engineering views remain in the Product image explorer.

| Asset | Purpose | Master |
| --- | --- | --- |
| `public/images/home-reference-cabin.webp` | Desktop cabin and empty podium | `home-reference-cabin-master.png` |
| `public/images/cora-reference.webp` | Transparent upright white Cora, front/right view | `cora-reference-master.png` |
| `public/images/home-orbital-cabin.webp` | Mobile cabin without a baked-in podium | `home-orbital-cabin-master.png` |

The desktop assets reference the user attachment `截屏2026-11-10 21.47.59.png`. The mobile scene references the earlier 21:27 screenshot. PNG masters are retained alongside compressed WebP delivery images. The cabin remains usable when WebGL is unavailable.

### Desktop scene edit prompt

Edit the supplied website screenshot into a clean background plate. Preserve the camera, composition, color, entire space-station cabin architecture, Earth and blue atmosphere outside the panoramic window, floor reflections, and the large silver circular display pedestal at lower right EXACTLY as shown. Remove all UI: the navigation bar including its logo and words, all headings/body text, both buttons, speech bubble and sound-wave icon. Remove the white Cora robot, leaving its pedestal empty and restoring the window and Earth behind it. Do not redesign the station, do not change the framing or move the pedestal. Keep the same landscape aspect ratio and layout as the supplied reference, about 1.42:1. No new objects, no text, no people, no robots, no logos. This is only the clean scene layer for reconstructing the screenshot as a functional website. High quality faithful architectural image.

### Product edit prompt

Extract ONLY the white Cora robot from this supplied screenshot as a high-quality transparent-background product cutout. Match the screenshot's product EXACTLY: upright white square body, near-front view with the right side visible, black corner fan structures, narrow black sensor bar above the front display, ventilation perforations flanking that sensor, black glossy front screen showing the small white shooting-star emblem over a subtle blue Earth arc, circular recessed module interface on the right side. Preserve the reference proportions, viewing angle, white material, panel lines, screws and all structural details. It stands upright, NOT tilted backward, and its underside is not visible. Remove the station, pedestal, speech bubble, navigation, all external text and all background. Do not add or redesign any parts. Center the entire complete robot with only a small transparent margin; no cropped corners. The output must be a truly transparent cutout with no backdrop or floor, suitable for laying back onto the same reference background.

## Galaxy

Official [React Bits Galaxy](https://reactbits.dev/backgrounds/galaxy), imported using the requested `npx shadcn@latest add @react-bits/Galaxy-JS-CSS` in an isolated import folder, then copied into `src/components/effects/galaxy`. This avoids adding Tailwind to the existing plain-CSS project. The current component uses WebGL2 without an additional renderer dependency and is loaded lazily.

Local compatibility changes: restored shader newline escapes altered by the importer, and removed forced context loss during cleanup so React StrictMode can mount the renderer again. Buffers, programs, listeners and animation frames are still cleaned up. A TypeScript declaration describes the JSX API. The effect is masked into the station window, reduced on mobile, paused outside the viewport, and static under reduced-motion preferences. A failed optional renderer leaves the static scene and controls available.

Upstream copyright and license: [David Haz / React Bits — MIT + Commons Clause](https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md). A copy is included beside the component.

## Latest refinement

The supplied monochrome Aster lockup replaces the temporary shooting-star / Aster Space header branding. It is retained as `public/images/aster-logo-mono.png`; `BrandLogo` frames its existing transparent bounds and CSS renders it white on the dark navigation. The light navigation and footer use its original dark version. The previously approved “Welcome to Aster Space” opening greeting remains a greeting, rather than the company wordmark.

The later color brief is implemented in the existing stylesheet layers; see `ORBITAL-THEME.md` for the canonical variables, scene masks and scroll-aware navigation.

## Guidance and voice

`CoraGuide` contains localized short guidance and an explicit voice button. The 22 November voice update uses ElevenLabs Jessica, pre-generated locally as bilingual MP3 files and silently preloaded for the current reply. It supports stop and cancels on language change or navigation. The product image is a keyboard-accessible button. The two successive guide messages and live smiling/blinking screen remain; later clicks retain the welcome. The route and scroll position are preserved and speech never starts automatically. The separate “Meet Cora” link leads to `/product#overview`. See `HOME-INTERACTIONS.md` and `CORA-VOICE.md` for motion, voice generation and Drift settings.

## Maintenance

- Text: `src/i18n/en.ts` and `zh.ts`, `home.hero`.
- Image paths: `src/config/product.ts`.
- Home components: `src/components/home`.
- Shared navigation mark: `src/components/BrandLogo.tsx` (the supplied logo, without a replacement drawing).
- Home/navigation styles: `src/styles/home-orbit.css`, imported last.
- [Preview with the original Exploration Pass](http://127.0.0.1:5173/?intro=preview).
- Focused browser verification: `scripts/home-browser-check.mjs`.
