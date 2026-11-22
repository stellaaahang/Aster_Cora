# Light Orbital Aerospace refinement

This implements the user's color/background brief as a refinement of the existing four-page website. Existing destinations, content collections, product browsing, bilingual state and exploration pass remain in place. No Try Cora demo, avatar flip cards, route map or other absent features were added from the reference text.

## Shared tokens

The canonical palette lives in `src/styles.css`. The original `--orbital`, `--ice`, `--blue`, `--deep`, `--navy`, `--muted` and `--line` names now alias the new roles, so existing components use the same palette.

| Variables | Values / role |
| --- | --- |
| `--space-navy`, `--cabin-blue` | `#163051`, `#3F5474`: distant space and cabin / navigation |
| `--atmosphere-blue`, `--glacier-blue` | `#8FA9C9`, `#C8D8F0`: transition and soft surfaces |
| `--mist-blue`, `--space-white` | `#DDE8F7`, `#E8F0FB`: shared content canvas |
| `--primary-text`, `--secondary-text` | `#173B62`, `#355779` |
| `--primary-action`, `--action-hover` | `#286AA5`, `#397FBB`; hover blends the two to preserve white-label contrast |
| `--light-accent`, `--border-color` | `#A8D8F5`, `#C1D5EA` |
| `--card-background`, `--card-hover-background` | white at .48 and .68 alpha |
| `--surface-interaction`, `--surface-selection` | `#F3F8FE`, `#E3F0FB` |

## Background layers

- Home: original separate cabin/product presentation assets; blue readability mask; vertical fade into the exact shared Space White background. The fade is behind Cora, preserving the product's white body and black structural details. Galaxy remains a subtle optional layer within the window.
- Product: a bright CSS exhibition bay, pale architectural surfaces, and a soft floor shadow beneath the official GLB. No Earth or star image competes with the model.
- Tech & Scenarios: an existing interior scene with muted temperature and blur, separate wash and fade, and the existing single focused mission scene. Blue selected controls are distinct from translucent unselected controls.
- About: the existing station-window asset with a calm pale wash and bottom fade. The real team photo and existing member cards remain on clean light backgrounds.

`SceneBackdrop` reuses this image/wash/fade structure on Tech & Scenarios and About. Image paths continue to come from `src/config/product.ts`. Layout grids, product proportions and content are preserved.

## Aster logo and navigation

`public/images/aster-logo-mono.png` is an unchanged copy of the user's latest supplied logo. `BrandLogo` uses an SVG viewport to frame its transparent margins; it does not redraw the mark or substitute a font. CSS makes the lockup white on the dark navigation. The original dark version appears on the light navigation and footer. The opening is separately restored to commit `db3345e`, including its original logo, typography and palette; the main-site theme does not recolor it.

The header is fixed at 16px with a frosted capsule. `useHeaderTone` observes the first section's boundary with IntersectionObserver; it only stores a boolean and does not rerender for every scroll pixel. Below the scene it changes to a translucent pale-blue surface with deep-blue labels; returning to the top restores the white logo and labels. The Product route uses the light capsule throughout. Reduced-motion preferences disable the 250ms transition.

Labels follow the supplied brief: Home / Product / Tech & Scenarios / About Us, with matching Chinese labels. `/applications` remains the third route. The previously approved “Welcome to Aster Space” / “欢迎来到Aster太空。” greeting remains unchanged; the company wordmark is Aster.

## Cora interaction on Home

The product is now a button controlling the adjacent short guidance text. Click, Enter or Space reveals the first guide message with a smiling screen, then a second welcome message; further clicks keep that message. It preserves the current URL and scroll position and does not start audio. `aria-pressed`, `aria-controls` and a polite live status expose the same response to keyboard and screen-reader users. The separate Meet Cora button and navigation still open Product.

Voice preview remains click-to-play on the sound-wave button. A product greeting change, language change or navigation cancels the current voice preview.

## Files

- Palette and existing component surfaces: `src/styles.css`.
- Inner-page background layers: `src/styles/reference.css`, `src/components/SceneBackdrop.tsx`.
- Home fade, guidance and shared fixed navigation: `src/styles/home-orbit.css`.
- Brand and layout: `src/components/BrandLogo.tsx`, `src/components/Layout.tsx`, `src/hooks/useHeaderTone.ts`.
- Local greeting and bilingual copy: `src/components/home/`, `src/i18n/en.ts`, `src/i18n/zh.ts`.

[Preview with the original Exploration Pass](http://127.0.0.1:5173/?intro=preview).
