# White housing visual variant

The user explicitly requested the matte white housing shown in their website reference, replacing the gray metallic finish. The built-in ImageGen tool was used in precise-object-edit mode to recolor the supplied Cora render and its six-view sheet. Original assets remain preserved. Website views now use the `cora-white-*` siblings; this is a visualization of the requested finish, not a claim about a manufactured or tested coating.

The edit instruction constrained the existing silhouette, proportions, corner fans, screen, sensor strip, side interfaces, panels, screws and vents. Only exterior housing color/material and associated lighting were targeted. A generated color visualization can retain small rendering differences; final engineering geometry remains defined by the original CAD.

Prompts: Change only silver/gray brushed-metal exterior housing to bright matte orbital white matching the supplied reference. Preserve actual geometry, camera angle, panel boundaries, screws, ventilation, circular interface, black corners, fans, sensor strip and display. Do not add or remove hardware. Use soft cool studio lighting and a transparent background. Apply the same finish consistently to all six existing orthographic views.

Sources: supplied `模型/产品图.png` (previously extracted into `cora-hero.webp`), `模型/产品6面 展示图.png`, and `网站风格参考.png` (material reference only).

The original generation outputs are retained in the Codex generated_images directory; the selected project master is `public/images/cora-white-master.png`. WebP assets are local copies, retaining alpha. Component detail crops come from the edited master.
