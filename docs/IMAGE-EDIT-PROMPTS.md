# White housing edit prompts

Mode: built-in image_gen, precise-object-edit. Transparent background requested for both edits.

## Product perspective

Use case: precise-object-edit. Asset type: transparent product cutout for the existing Aster / Cora website. Input 1 is the EDIT TARGET, the existing actual Cora product render. Input 2 is a STYLE REFERENCE ONLY: the four-panel website reference. Change ONLY the silver/gray brushed-metal exterior housing panels of the robot in input 1 to the clean matte orbital-white housing finish shown in the robot of input 2. The body must read clearly WHITE with gentle cool-blue shading, never brushed silver, chrome, gunmetal, or gray metal. Preserve the exact product silhouette, camera angle, proportions, panel boundaries, screw positions, ventilation openings, circular side interface, black corner structures and ducted fans, black sensor strip and front display and its existing cyan interface. Do not borrow or redesign the robot geometry from input 2. Do not add or remove parts, arms, wheels, text, logos, orbit rings or any decoration. Use soft bright studio lighting on the new white panels; retain natural shading on the unchanged black structures. Output one robot in the same orientation as input 1, fully contained in frame, on a truly transparent background. This is strictly a material/color edit of the actual supplied design, not a new product design.

Selected output: `public/images/cora-white-master.png` and its optimized `public/images/cora-white-hero.webp`.

## Six orthographic views

Use case: precise-object-edit. EDIT TARGET: Image 1 is the real Cora six-view product sheet. STYLE REFERENCE: Image 2 is the already approved white-material version of the same robot. Change only the exterior housing material/color in ALL SIX views to clean bright matte orbital white, matching image 2. Preserve the exact original orthographic front, left, rear, right, top and bottom geometries, proportions, all fan housings and fan blades, black front display, black sensor strip, circular side ports, back red switches, panel seams, every screw and vent slot. Do not add or remove details, do not alter the view angles. Keep the six products in the same positions, scale, layout and aspect ratio as image 1: four across the upper row, two centered in the lower row. Remove the dark studio background, floor shadows and the written FRONT/LEFT/REAR/RIGHT/TOP/BOTTOM labels; output the six views against a genuinely transparent background for cropping into website view assets. No new text, logos, orbit lines or decorative objects. White non-metallic housing, subtle cool-blue shadows, neutral soft bright studio lighting, black structures unchanged. The intent is a consistent color variant of the exact supplied Cora, never a redesign.

Selected output: `public/images/cora-white-six-views.webp`, cropped into the six `cora-white-{front,left,rear,right,top,bottom}.webp` assets.
