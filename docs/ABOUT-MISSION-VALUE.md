# About: Mission & Vision / Value

The About page has two separate snapped chapters after the crew section:
`#vision` (Our Mission & Vision) and `#values` (Our Value). The previous combined
Value teaser and its button are removed. `/about/value` remains a working deep link
and reuses the new Value gallery; its back link returns to `/about#values`.
The separate Our Journey timeline chapter was removed on 21 November.

## Source and integration differences

The user supplied the Direction Aware Hover component and demo. There was no
`components.json`, so the manual React/TypeScript path was used, with `motion`,
`clsx` and `tailwind-merge`. Tailwind v4 is connected through its Vite plugin.

Differences from that source:

- The project is Vite, so no Next.js client directive is needed. `@/lib/utils`
  becomes the existing project's relative import convention. The `cn` helper
  still uses `clsx` and `tailwind-merge` exactly as requested.
- The original default Tailwind utility strings, directional calculation,
  image/text variants and ordinary 0.2s / 0.5s ease-out timings are retained.
  `console.log` is removed from the pointer handler to avoid production logging.
- The demo is actually used by MissionVision, with Aster's bilingual content
  and images instead of the hotel example. Its documented className props make
  cards fill the two-column layout, give text usable insets, and frame the Earth
  photo with contain/black so the whole planet and original black background remain
  visible. Following the 21 November refinement, there are no captions or links
  below the images; Mission and Vision text appears through the image interaction.
- The optional `overlayClassName` lets the Aster demo add a bottom dark gradient.
  This keeps the white copy readable over bright clouds and station hardware,
  especially on touch screens. The original overlay class and its timing remain
  the component default; the extra gradient uses Tailwind utilities.
- Descriptive localized image alternatives and lazy decoding replace the generic
  image label. Focus reveals the same text for keyboard users. On touch devices
  text is visible without requiring hover. A shared `useSyncExternalStore` media-query
  subscription removes translations and shortens both transitions to zero, including
  when the system setting changes during a visit. The supplied source had no explicit
  reduced-motion branch, and the installed Motion hook snapshots its initial value.
- Only the required Tailwind theme/utilities are compiled. Preflight is omitted
  and the site container utility is excluded, preserving the existing global
  design. Utilities have priority over the site's existing unlayered text rules.
  The source's `dark:bg-black` behavior follows the system color preference;
  a new site-wide dark-mode control is not introduced.

The Value effect is adapted from the public Aceternity Layout Grid registry:
https://ui.aceternity.com/registry/layout-grid.json
and https://ui.aceternity.com/components/layout-grid.

It keeps shared-image/layout expansion and a dimmed outside-click area. Changes
for this site: four localized titles and short descriptions; genuine buttons;
two columns on mobile; a bounded expanded panel with an explicit Close button,
Escape handling and focus return; layout durations become zero for reduced motion.
There is no document scroll lock or wheel interception. The selected item survives
language switching. The four background photographs contain no Cora product image.

## Image provenance

- `public/images/about-mission-earth.jpg`: NASA/JPL, *Earth – Pacific Ocean*,
  Galileo, PIA00123. Downloaded unchanged from the NASA image library:
  https://images-assets.nasa.gov/image/PIA00123/PIA00123~orig.jpg
  Source and credit: https://science.nasa.gov/photojournal/earth-pacific-ocean/
- Vision: the user's existing `iss-orbit.webp`.
- Values: the user's existing station interior, astronaut-above-Earth photograph,
  Mars habitat concept and rocket-launch photograph. The launch asset is copied
  unchanged from the supplied `背景/火箭发射.jpg` to `about-value-launch.jpg`.

No raster image is generated and no product appearance is altered.
