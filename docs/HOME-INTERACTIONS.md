# Home interaction update — 11 November 2026

Surface: Home. Mode: Persuade. The approved station scene, white Cora and pale-blue content canvas remain the visual authority. The exploration pass retains the ticket and tear interaction from `db3345e`. The latest adjustment removes its two footer labels.

## Page sequence

1. **Welcome Aboard**: the supplied two-column station composition, updated bilingual heading/subheading/body and two CTAs. Begin the Journey scrolls to the route; Meet Cora opens Product.
2. **Explore Aster**: four reusable whole-card links. Product uses the existing white Cora render; Technology uses the supplied interface close-up; Applications uses the existing station interior; About uses the actual team photo. Four columns become two and then one.
3. **Our Journey**: Earth → Launch → Orbit → Station → Moon → Mars in [React Bits Orbit Images](https://reactbits.dev/animations/orbit-images?itemRadius=15), with square thumbnails from the six supplied photos. Select a photo by click, tap or keyboard to bring it forward and read its caption. Hover slows the orbit, the visible control pauses it, and reduced-motion visitors get a stationary orbit. The narrative is marked as a future mission concept.
4. **Meet Cora**: a two-column introduction with the neutral product image, feature tags and a Product CTA. The supplied `恒星.jpg` appears behind the content as a low-opacity background with a fade toward the text.

Technology's `/technology` link resolves to the Core Technologies section at `/applications#technology`. This adds a usable destination without inventing another technical page or changing the four primary navigation destinations.

## Cora states and motion

- Default: original neutral screen and a short click hint.
- First click / Enter / Space: smiling display and “Hi, I'm Cora, your guide today!”
- Second click: “Welcome aboard. Let's explore the future of space robotics together.”
- Further clicks keep the second message and smile. The state remains in place during language switching.
- The live face is SVG screen UI calibrated to the supplied 1495 × 1052 render. It covers only the inner display; the robot body and default image are not repainted.
- Robot and bubble share one 3.8-second, 8px float. Eyes blink quietly over 4.8 seconds. The bubble appears in 300ms and message changes fade in 200ms.
- Loops pause when the hero is offscreen or the browser tab is hidden. Reduced motion removes floating/blinking while preserving the greeting and controls.

Desktop navigation labels increase from 13px to 16px, language controls from 11px to 14px, and the logo decreases from 161px to 128px. Tablet/mobile retain larger readable controls and the existing collapsed menu. The Cora image is reduced inside the same product stage.

## Galaxy Drift

Implemented the user's linked [Drift configuration](https://reactbits.dev/backgrounds/galaxy?preset=drift&glowIntensity=0.35&starSpeed=0.3&rotationSpeed=0.03&direction=backward&clickWarp=false). Values were cross-checked with the [official preset source](https://github.com/DavidHDev/react-bits/blob/main/src/demo/Backgrounds/presets/Galaxy.js).

`src/config/home.ts` holds the settings: glow .35, star speed .3, rotation .03, backward direction, no click warp, density 1, star size 1, flare 1, twinkle .3, overall speed 1. Desktop uses four layers; mobile uses two and a lower DPR. The palette is the requested pale blue/white (`#EAF7FF`, `#CCEAFF`, `#FFFFFF`). The effect remains inside the window; intro warp is disabled to keep entry gentle.

The [Orbit Images reference](https://reactbits.dev/animations/orbit-images) inspired the journey's SVG route and emphasis of the active image. The site uses its own small state-based component rather than adding a dependency for continuous orbit animation.

## Voice

The 22 November update replaces device voice selection with ElevenLabs Jessica (`cgSgspJ2msm6clMCkdW9`), an account-listed young, playful, warm premade voice approved as an alternative by the user. Home guidance, companion replies and voice-task replies share one audio player. The bilingual scripts remain in the existing dictionaries. See `CORA-VOICE.md` for API key setup and audio generation.

The local generator writes MP3 files and an index to `public/audio/cora/`; these files ship with the static website. It reuses matching files and publishes the index after the complete generation run succeeds. The frontend never receives the API key and does not fall back to a different device voice.

The current reply is silently preloaded; speech only starts when the sound-wave button is clicked. Buffered audio is reused on replay. Stop, message changes, language changes and page exit cancel it. All 20 English/Chinese MP3 files have been generated. Failed audio leaves the text and retry button available. General browser tests mock playback; native MP3 playback is verified separately. See `CORA-VOICE.md`.

## Files and verification

- Components: `src/components/home/`.
- Content/imagery: `src/i18n/en.ts`, `zh.ts`, `src/config/home.ts`.
- Styles: `src/styles/home-orbit.css`, `home-sections.css`.
- Motion and voice: `src/hooks/useMotionVisibility.ts`, `useCoraVoice.ts`.
- Checks: `scripts/home-browser-check.mjs`, `tests/home.test.mjs`; see `VERIFICATION.md` for results.

Full preview with the preserved opening: `http://127.0.0.1:5173/?intro=preview`.
