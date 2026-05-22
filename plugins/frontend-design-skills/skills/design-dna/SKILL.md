---
name: design-dna
description: >-
  This skill should be used when the user asks to "extract design DNA", "analyze
  a design system", "generate design from JSON", "design with effects", or
  "turn a reference into design tokens" across design system, design style, and
  visual effects dimensions.
---

# Design DNA

A 3-phase workflow for extracting, structuring, and applying design identity across three dimensions:

1. **Design System** — measurable tokens (color, typography, spacing, layout, shape, elevation, motion, components)
2. **Design Style** — qualitative perception (mood, visual language, composition, imagery, interaction feel, brand voice)
3. **Visual Effects** — special rendering (Canvas, WebGL, 3D, particles, shaders, scroll effects, cursor effects, SVG animations, glassmorphism, etc.)

## Phases

### Phase 1: Structure — Output the Schema

When the user asks for the structural dimensions or schema:

1. Present the full schema with field descriptions
3. Explain the three dimensions and their roles:
   - **design_system**: What you can measure — exact hex values, pixel sizes, rem scales
   - **design_style**: What you can feel — mood, personality, composition strategy
   - **visual_effects**: What you can see but can't express in CSS alone — WebGL scenes, particle systems, shader distortions, scroll-driven animations
4. Ask if the user wants to customize or extend any dimensions

### Phase 2: Analyze — Extract DNA from References

When the user provides images, screenshots, or links representing a target design style:

1. For each reference provided:
   - If image/screenshot: analyze visual properties directly
   - If URL: fetch and analyze the page's visual design
3. For every field in the schema, extract or infer a value from the references
4. When multiple references conflict, note the dominant pattern and mention variants
5. Output a complete Design DNA JSON — every field populated, no empty strings
6. After output, ask: "Want to adjust any values before using this for generation?"

**Analysis approach per dimension:**

#### Dimension 1: design_system

- **color**: Extract dominant palette via visual sampling. Primary by area dominance, secondary by supporting role, accent by CTA usage. Map neutral scale from lightest background to darkest text.
- **typography**: Identify font families by visual characteristics (geometric, humanist, serif class). Estimate scale ratios from heading/body size relationships.
- **spacing**: Assess density by element proximity. Measure rhythm by section gap consistency.
- **layout**: Identify grid by content alignment patterns. Note max-width, column count, asymmetry.
- **shape**: Measure border-radius by comparing to element height. Note border and divider presence.
- **elevation**: Classify shadow softness, spread, and layering approach.
- **motion**: If observable (video/interactive), note easing curves and duration feel.

#### Dimension 2: design_style

- Synthesize holistic impressions — mood, personality, composition strategy
- Compare against genre archetypes (SaaS, editorial, brutalist, etc.)
- Note ornamentation level and whitespace philosophy

#### Dimension 3: visual_effects

- **From code**: Scan for `<canvas>`, WebGL contexts, Three.js/Pixi.js imports, GSAP/Lottie usage, custom shaders, IntersectionObserver scroll triggers, SVG `<animate>` elements
- **From screenshots**: Describe visible effects that go beyond standard CSS — glowing particles, 3D object renders, noise textures, gradient animations, parallax depth, cursor trails, text distortions, glassmorphic surfaces. Note these in `composite_notes` when exact implementation can't be determined.
- **From video/interaction demos**: Note scroll behaviors, hover distortions, transition choreography, loading sequences
- Set `enabled: false` for any effect category not present in the reference
- Rate `overview.effect_intensity` and `overview.performance_tier` based on what's observed

### Phase 3: Generate — Apply DNA to Content

When the user provides DNA JSON + content to design:

1. Parse the DNA JSON and extract all tokens across three dimensions
3. Build CSS custom properties from `design_system` values
4. Apply `design_style` qualitative fields to guide subjective design decisions
5. When the design needs assets or source materials, fetch them from the original source whenever possible. If the user provided a URL, retrieve the real asset from that URL instead of recreating, approximating, or substituting it.
6. Implement `visual_effects` using appropriate technologies:
   - Lightweight effects → CSS animations, SVG, vanilla JS
   - Medium effects → Canvas 2D, GSAP, Lottie
   - Heavy effects → Three.js, custom GLSL shaders, Pixi.js
7. Generate the design output (default: self-contained HTML with inline CSS/JS)
8. Run quality checks from the generation guide

**If the user provides only content without DNA JSON**, ask whether to:

- Analyze a reference first (go to Phase 2)
- Use a described style (extract DNA from description, then generate)

## Phase Combinations

Users may invoke any combination:

- **Phase 1 only**: "Show me the design structure/schema"
- **Phase 2 only**: "Analyze this design" (with images/links)
- **Phase 2 → 3**: "Analyze this design and build me a landing page in the same style"
- **Phase 1 → 2 → 3**: Full pipeline
- **Phase 3 only**: User already has DNA JSON

Detect which phase(s) are needed from context and execute accordingly.
