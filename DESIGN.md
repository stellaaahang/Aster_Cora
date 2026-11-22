# Light Orbital Aerospace

### Official Cora Product showcase — 11 November 2026

A light exhibition bay holds one real model viewer on the left and product information, screen modes, and the current component on the right. On narrow screens the introduction comes first, followed by the viewer and details. Cora’s source GLB materials and geometry define the product's appearance; neutral studio lighting and a soft floor shadow provide depth. Five surface-anchored hotspot categories share the main viewer, including the circular interfaces on both sides. The four module concepts use a separate lightweight image alignment demonstration. A quiet value section and centered call to action lead into Tech & Scenarios. The shared Aster navigation uses its existing light capsule on this route.

### Home refinement — 11 November 2026

The Home surface now follows Welcome Aboard → Explore Aster (four image cards) → Our Journey (four interactive route stops) → Meet Cora. Its existing station composition and restrained blue-white palette remain intact. Navigation and language controls are larger; the original Aster logo and hero product are smaller. Cora's first two clicks reveal a smiling/blinking screen and the two approved guide messages; later clicks keep the welcome. Robot and bubble share a tiny float, with offscreen/reduced-motion pauses. Galaxy uses the linked official Drift values with a pale blue/white palette. Voice remains explicit click-to-play, preferring available child voices with an honest matching-language fallback. Details and motion budgets are recorded in `docs/HOME-INTERACTIONS.md`.


Opening exception: the user explicitly requested the `db3345e` exploration pass unchanged. Its original component, stylesheet, behavior, artwork and logo are restored byte-for-byte. A scoped legacy stylesheet preserves the original Manrope font and tokens inside the dialog; the new site branding and colors apply after entry. Use `/?intro=preview` to review the full experience.

The latest user-provided color/background brief and monochrome Aster logo govern this refinement. Preserve the existing information architecture, page composition, bilingual content, product geometry and interactions.

Palette: Space Navy #163051, Cabin Blue #3F5474, Atmosphere Blue #8FA9C9, Glacier Blue #C8D8F0, Mist Blue #DDE8F7, Space White #E8F0FB. Text #173B62 / #355779; action #286AA5 with #397FBB hover influence; accent #A8D8F5; border #C1D5EA. Translucent white cards use .48 / .68 alpha. `src/styles.css` is the single token source; older semantic names alias these values.

Typography: self-hosted Inter for body and navigation, Manrope for headings; Noto Sans SC / PingFang SC / Microsoft YaHei for Chinese. Keep existing sizes and generous measures.

Home retains its station scene, Earth, white Cora and podium. Scene, readability wash and vertical fade are separate layers. The bottom resolves to the exact shared Space White canvas. The product stays above the fade, with a short light-blue guide above it. Clicking Cora toggles a local bilingual greeting; it does not navigate or play sound. Voice stays an explicit separate action. Previously approved opening greetings remain unchanged.

The Aster wordmark uses the exact user-supplied monochrome logo. It is white on the dark navigation, original dark blue on light navigation and footer. All four routes share a fixed capsule 16px from the top (72px desktop / 64px mobile), with a 250ms color transition when the hero leaves the header region. The third destination is labeled Tech & Scenarios / 技术与场景 while retaining `/applications` and its existing interactions.

Product uses a CSS-based exhibition bay on Space White; the official 3D model is its focal object. Tech & Scenarios uses a subdued work-cabin backdrop, clear blue selection states and readable scene captions. About uses a calm observation-window backdrop fading into the shared canvas; the real team photo and existing member cards stay on light surfaces. No future interactive features mentioned in the broad reference brief are represented as already implemented.

Layout: 1280px maximum, existing desktop gutters and section rhythm. Cards and buttons use the requested restrained translucent surfaces and rounded corners. Mobile stacks and original keyboard, touch and reduced-motion controls remain operational. The Product page uses the official GLB with a clearly labeled static alternative.

Implementation: `src/styles.css`, `src/styles/reference.css`, `src/styles/home-orbit.css`; reusable `BrandLogo` and `SceneBackdrop`; `useHeaderTone` observes only the hero boundary. See `docs/ORBITAL-THEME.md`.

---

## Earlier visual history

# Orbital Minimalism
The supplied reference images are the visual authority. The latest 10 November space-station screenshot supersedes the earlier pale-blue reference for Home and the shared navigation. Product, Applications and About retain their light content surfaces.

Palette: Orbital White #F7F9FC, Ice Blue #E8F1FA, White #FFFFFF, Earth Blue #3B82D6, Deep Technology Blue #173B68, Space Navy #101C30.
Typography: self-hosted Manrope variable for Latin; system PingFang SC / Microsoft YaHei / Noto Sans SC for Chinese. Restrained weight contrast. Headings are balanced, body copy at comfortable measures.
Layout: max 1280px, 64–80px desktop gutters, 110–140px section gaps. Main hero is an open two-column composition inside a space-station cabin overlooking Earth. Shared navigation uses a translucent blue capsule with white Inter text and a filled active pill. Features use open columns and rules rather than dense cards. Product discovery is central; applications focus on one scene; About is human and photographic.
Interaction: pill-shaped primary actions, quiet outline alternatives, 44px minimum targets. Soft functional transitions, one-time section reveals, reduced-motion support. No fake 3D rotation. Image hotspots and six orthographic views are labeled as image browsing. Future modules and applications carry explicit concept labels.

## Reference-aligned revision

### Latest Home override — 10 November 2026

Home follows the user's 21:47 reference: white left-hand headline, Earth through a panoramic station window, upright white Cora on a circular podium, a blue speech bubble above the product, and an Aster Space shooting-star wordmark. Home and shared navigation use self-hosted Inter. The product and cabin are separate reference-edited bitmap assets; text and controls are live HTML. The Galaxy effect occupies only the window, with subdued motion and a static reduced-motion fallback. Mobile stacks text, bubble and product. Voice is explicit click-to-play, never automatic. `src/styles/home-orbit.css` owns this override. See `docs/HOME-ORBITAL.md` for asset provenance and integration details. The original four destinations and bilingual navigation are retained.

The following documents the earlier baseline used by the remaining page bodies:

The user reconfirmed the supplied four-panel composition as the standard and requested matte white housing, replacing the silver-gray material in the supplied product render. The actual Aster logo remains the supplied brand lockup. White visual variants are documented in docs/WHITE-FINISH.md; original media and CAD remain the engineering source.

Each desktop opening screen now shares a continuous pale-blue canvas with a compact 80px header. Home uses modest left-aligned copy, the white product, an orbital line and four bottom values. Product puts its vertical section menu, product and one illustrated component detail in one viewport. Applications uses left-hand copy, a right-hand cabin concept scene and four task selectors. About uses left-hand story copy, an Earth-surface arc and three Mission/Vision/Team anchors; the real team photograph follows below. The reference's small spaced labels are retained as an explicit user-pinned visual choice.

`src/styles/reference.css` owns these opening compositions. Lower-page sections continue to use shared components and `src/styles.css`. Mobile stacks the composition and retains fully usable selectors, image annotations and bilingual copy.

## First-visit exploration pass

The user approved an Exploration Pass opening, entering Home after tearing, shown once on the first Home visit and preserving Skip / Direct entry. It uses Aster branding, orbital white paper, an ice-blue stub, deep-blue print and restrained paper grain. All sizes use a tilted landscape ticket with a right-hand stub. A space-station line illustration occupies its own area beside the Cora heading; actual product images appear only after entry. The pass omits the prototype label. The greeting follows the shared bilingual resources: “Welcome to Aster Space” in English and “欢迎来到Aster太空。” in Chinese. The focal sequence is hinge rotation, progressive paper-fiber release, stub detachment, main-ticket recentering and a short fade into Home. Each opening starts in English before paint, while manual language choices carry into subsequent page navigation. The invitation line and Exploration Pass title use larger print; the digital-pass subtitle and visible keyboard hint are omitted. Native modal focus and reduced-motion alternatives remain part of the design; normal page composition stays intact.
