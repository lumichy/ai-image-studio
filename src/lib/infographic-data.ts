export interface LayoutDef {
  id: string;
  name: string;
  bestFor: string;
  guidelines: string;
}

export interface StyleDef {
  id: string;
  name: string;
  description: string;
  guidelines: string;
}

export const INFOGRAPHIC_BASE_PROMPT = `Create a professional infographic following these specifications:

## Image Specifications

- **Type**: Infographic
- **Layout**: {{LAYOUT}}
- **Style**: {{STYLE}}
- **Aspect Ratio**: {{ASPECT_RATIO}}
- **Language**: {{LANGUAGE}}

## Core Principles

- Follow the layout structure precisely for information architecture
- Apply style aesthetics consistently throughout
- If content involves sensitive or copyrighted figures, create stylistically similar alternatives
- Keep information concise, highlight keywords and core concepts
- Use ample whitespace for visual clarity
- Maintain clear visual hierarchy

## Text Requirements

- All text must match the specified style treatment
- Main titles should be prominent and readable
- Key concepts should be visually emphasized
- Labels should be clear and appropriately sized
- Use the specified language for all text content

## Layout Guidelines

{{LAYOUT_GUIDELINES}}

## Style Guidelines

{{STYLE_GUIDELINES}}

---

Generate the infographic based on the content below:

{{CONTENT}}

Text labels (in {{LANGUAGE}}):
{{TEXT_LABELS}}
`;

export const INFOGRAPHIC_LAYOUTS: LayoutDef[] = [
  {
    id: 'bento-grid',
    name: 'Bento Grid',
    bestFor: '多主题概览（默认）',
    guidelines: `# bento-grid

Modular grid layout with varied cell sizes, like a bento box.

## Structure

- Grid of rectangular cells
- Mixed cell sizes (1x1, 2x1, 1x2, 2x2)
- No strict symmetry required
- Hero cell for main point
- Supporting cells around it

## Best For

- Multiple topic overview
- Feature highlights
- Dashboard summaries
- Portfolio displays
- Mixed content types

## Visual Elements

- Clear cell boundaries
- Varied cell backgrounds
- Icons or illustrations per cell
- Consistent padding/margins
- Visual hierarchy through size

## Text Placement

- Main title at top
- Cell titles within each cell
- Brief content per cell
- Minimal text, maximum visual
- CTA or summary in prominent cell

## Recommended Pairings

- \`craft-handmade\`: Friendly overviews (default)
- \`corporate-memphis\`: Business summaries
- \`pixel-art\`: Retro feature grids
`
  },
  {
    id: 'binary-comparison',
    name: 'Binary Comparison',
    bestFor: 'A vs B、前后对比、优缺点',
    guidelines: `# binary-comparison

Side-by-side comparison of two items, states, or concepts.

## Structure

- Vertical divider splitting image in half
- Left side: Item A / Before / Pro
- Right side: Item B / After / Con
- Mirrored layout for easy comparison
- Clear visual distinction between sides

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Before-After** | Transformation over time | Temporal change, improvement |
| **A vs B** | Feature comparison | Direct contrast, differences |
| **Pro-Con** | Advantages/disadvantages | Balanced evaluation |

## Best For

- Before/after transformations
- Product or option comparisons
- Pros and cons analysis
- Old vs new comparisons
- Two perspectives on a topic

## Visual Elements

- Strong vertical dividing line or gradient
- Contrasting colors per side
- Matching element positions for comparison
- VS symbol or divider decoration
- Transformation arrow for before-after

## Text Placement

- Main title centered at top
- Side labels (A/B, Before/After)
- Corresponding points aligned horizontally
- Summary at bottom if needed

## Recommended Pairings

- \`corporate-memphis\`: Business comparisons
- \`bold-graphic\`: High-contrast dramatic comparisons
- \`craft-handmade\`: Friendly explainers
`
  },
  {
    id: 'bridge',
    name: 'Bridge',
    bestFor: '问题-解决方案',
    guidelines: `# bridge

Gap-crossing structure connecting problem to solution or current to future state.

## Structure

- Left side: current state/problem
- Right side: desired state/solution
- Bridge element spanning the gap
- Gap representing challenge/obstacle
- Bridge elements as steps/methods

## Best For

- Problem to solution journeys
- Current vs future state
- Gap analysis
- Transformation bridges
- Strategic initiatives

## Visual Elements

- Two distinct platforms/sides
- Visible gap or chasm
- Bridge structure with supports
- Icons representing each side
- Stepping stones or bridge planks

## Text Placement

- Title at top
- Left label (From/Problem/Current)
- Right label (To/Solution/Future)
- Bridge elements labeled
- Gap description below

## Recommended Pairings

- \`cartoon-hand-drawn\`: Friendly journeys
- \`corporate-memphis\`: Business transformations
- \`isometric-3d\`: Technical transitions
`
  },
  {
    id: 'circular-flow',
    name: 'Circular Flow',
    bestFor: '循环、周期流程',
    guidelines: `# circular-flow

Cyclic process showing continuous or recurring steps.

## Structure

- Circular arrangement
- Steps around the circle
- Arrows showing direction
- No clear start/end (continuous)
- Center can hold main concept

## Best For

- Recurring processes
- Feedback loops
- Lifecycle stages
- Continuous improvement
- Natural cycles

## Visual Elements

- Circle or ring shape
- Directional arrows
- Step nodes evenly spaced
- Icons per step
- Optional center element

## Text Placement

- Title at top
- Step labels at each node
- Brief descriptions near nodes
- Center concept if applicable
- Cycle name

## Recommended Pairings

- \`cartoon-hand-drawn\`: Friendly cycles
- \`corporate-memphis\`: Business processes
- \`subway-map\`: Transit-style cycles
`
  },
  {
    id: 'comic-strip',
    name: 'Comic Strip',
    bestFor: '叙事、序列',
    guidelines: `# comic-strip

Sequential narrative panels telling a story or explaining a concept.

## Structure

- Multiple panels in sequence
- Left-to-right, top-to-bottom reading
- Characters or subjects in scenes
- Speech/thought bubbles
- Panel borders clearly defined

## Best For

- Storytelling explanations
- User journey narratives
- Scenario illustrations
- Step sequences with context
- Before/during/after stories

## Visual Elements

- Panel frames
- Speech and thought bubbles
- Sound effects (optional)
- Characters with expressions
- Scene backgrounds

## Text Placement

- Title at top
- Dialogue in speech bubbles
- Narration in caption boxes
- Sound effects integrated
- Panel numbers if needed

## Recommended Pairings

- \`graphic-novel\`: Dramatic narratives
- \`kawaii\`: Cute character stories
- \`cartoon-hand-drawn\`: Friendly explanations
`
  },
  {
    id: 'comparison-matrix',
    name: 'Comparison Matrix',
    bestFor: '多因素对比',
    guidelines: `# comparison-matrix

Grid-based multi-factor comparison across multiple items.

## Structure

- Table/grid layout
- Rows: items being compared
- Columns: comparison criteria
- Cells: scores, checks, or values
- Header row and column clearly marked

## Best For

- Product feature comparisons
- Tool/software evaluations
- Multi-criteria decisions
- Specification sheets
- Rating comparisons

## Visual Elements

- Clear grid lines or cell boundaries
- Checkmarks, X marks, or scores in cells
- Color coding for quick scanning
- Icons for criteria categories
- Highlight for recommended option

## Text Placement

- Title at top
- Item names in first column
- Criteria in header row
- Brief values in cells
- Legend if using symbols

## Recommended Pairings

- \`corporate-memphis\`: Business tool comparisons
- \`ui-wireframe\`: Technical feature matrices
- \`blueprint\`: Specification comparisons
`
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    bestFor: '指标、KPI',
    guidelines: `# dashboard

Multi-metric display with charts, numbers, and KPI indicators.

## Structure

- Multiple data widgets
- Charts, graphs, numbers
- Grid or modular layout
- Key metrics prominent
- Status indicators

## Best For

- KPI summaries
- Performance metrics
- Analytics overviews
- Status reports
- Data snapshots

## Visual Elements

- Chart types (bar, line, pie, gauge)
- Big numbers for KPIs
- Trend arrows (up/down)
- Color-coded status (green/red)
- Clean data visualization

## Text Placement

- Title at top
- Widget titles above each section
- Metric labels and values
- Units clearly shown
- Time period indicated

## Recommended Pairings

- \`corporate-memphis\`: Business dashboards
- \`ui-wireframe\`: Technical dashboards
- \`cyberpunk-neon\`: Futuristic displays
`
  },
  {
    id: 'dense-modules',
    name: 'Dense Modules',
    bestFor: '高密度模块、数据丰富的指南',
    guidelines: `# dense-modules

High-density modular layout with 6-7 typed information modules packed with concrete data.

## Structure

- 6-7 distinct modules per image, each serving a specific information function
- Every module contains concrete data: brand names, numbers, percentages, parameters
- Minimal whitespace—compact spacing prioritized over breathing room
- Smaller text acceptable to maximize information density
- Each module identified by coordinate label or section marker (e.g., MOD-1, SEC-A)

## Module Archetypes

| Module | Purpose | Content Requirements |
|--------|---------|---------------------|
| **Brand/Selection Array** | Grid of options with recommendations | 4-8 items with icons, names, brief descriptions; highlight "best choice" |
| **Specification Scale** | Quality/measurement gauge | 3-5 levels with precise numerical increments, quality indicators (emoji faces, checkmarks) |
| **Deep Dive/Detail** | Technical breakdown of key item | Zoom-in callouts, internal components, cross-section or exploded view |
| **Scenario Comparison** | Side-by-side use cases | 3-6 scenarios with specific recommendations and data per scenario |
| **Identification Tips** | How-to checklist | 3-5 inspection methods: look/test/check/ask format |
| **Warning/Pitfall Zone** | Critical mistakes to avoid | 3-5 pitfalls with consequences, 1-2 correct approaches; high visual contrast |
| **Quick Reference** | Compact summary | Dense table, one-line summaries, decision flowchart, or key takeaways |

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Coordinate-labeled** | Precision and systematicity | Each module has alphanumeric coordinate (A-01, B-05, C-12), ruler/axis markers |
| **Grid-cell** | Order and structure | Modules in strict rectangular cells divided by thick lines, Swiss grid feel |
| **Free-flowing** | Organic density | Magazine-style layout with dotted frames, varying module sizes, connected by arrows |

## Best For

- Product selection guides and buying guides
- Multi-dimensional comparison content
- Data-rich educational materials
- "Avoid pitfalls" / "complete guide" formats
- Content targeting platforms like Xiaohongshu with high-density visual requirements

## Visual Elements

- Module boundary markers (thick lines, dotted frames, or coordinate grids)
- Quality indicators per module (emoji faces, checkmarks, crosses, crowns)
- Data callout boxes with highlighted numbers
- Comparison arrows and progression indicators
- Warning/alert visual markers for pitfall modules
- Metadata in corners (page numbers, timestamps, small barcodes)

## Text Placement

- Main title at top, prominent and impactful
- Subtitle with module count ("X大维度全面解析...")
- Module headers inside colored badges or labeled frames
- Body text compact, multiple columns within modules
- Numbers highlighted with accent colors, slightly larger than body text

## Information Density Rules

- Every corner should contain useful information or metadata
- No decorative-only empty space
- Text size may be reduced to fit more content—information over font size
- Each module must have specific data points, not generic descriptions
- Balance between density and readability: dense but organized

## Recommended Pairings

- \`pop-laboratory\`: Technical precision with coordinate markers and blueprint grid
- \`morandi-journal\`: Hand-drawn warmth with doodle illustrations and organic frames
- \`retro-pop-grid\`: 1970s pop art with strict grid cells and bold contrast
- \`retro-popup-pop\`: Vintage desktop popups with chunky pixel UI for retro-tech dense guides
- \`corporate-memphis\`: Clean business feel for product comparisons
- \`technical-schematic\`: Engineering precision for technical product guides
`
  },
  {
    id: 'funnel',
    name: 'Funnel',
    bestFor: '转化、过滤',
    guidelines: `# funnel

Narrowing stages showing conversion, filtering, or refinement process.

## Structure

- Wide top (input/start)
- Narrow bottom (output/result)
- Horizontal layers for stages
- Progressive narrowing
- 3-6 stages typically

## Best For

- Sales/marketing funnels
- Conversion processes
- Filtering/selection
- Recruitment pipelines
- Decision processes

## Visual Elements

- Funnel shape clearly defined
- Distinct colors per stage
- Width indicates volume/quantity
- Stage icons or symbols
- Numbers/percentages per stage

## Text Placement

- Title at top
- Stage names inside or beside
- Metrics/numbers per stage
- Input label at top
- Output label at bottom

## Recommended Pairings

- \`corporate-memphis\`: Marketing funnels
- \`isometric-3d\`: Technical pipelines
- \`cartoon-hand-drawn\`: Educational funnels
`
  },
  {
    id: 'hierarchical-layers',
    name: 'Hierarchical Layers',
    bestFor: '金字塔、优先级',
    guidelines: `# hierarchical-layers

Nested layers showing levels of importance, influence, or proximity.

## Structure

- Multiple layers from core to periphery
- Core/top: most important/central
- Outer/bottom: decreasing importance
- 3-7 levels typically
- Clear boundaries between levels

## Variants

| Variant | Shape | Visual Emphasis |
|---------|-------|-----------------|
| **Pyramid** | Triangle, vertical | Top-down hierarchy, quantity |
| **Concentric** | Rings, radial | Center-out influence, proximity |

## Best For

- Maslow's hierarchy style concepts
- Priority and importance levels
- Spheres of influence
- Organizational structures
- Stakeholder analysis

## Visual Elements

- Distinct color per level
- Icons or illustrations per tier
- Size indicates importance/quantity
- Labels inside or beside layers
- Decorative apex/center element

## Text Placement

- Title at top or side
- Level names inside each tier
- Brief descriptions outside
- Quantities or percentages if relevant
- Legend for color meanings

## Recommended Pairings

- \`craft-handmade\`: Playful layered concepts
- \`corporate-memphis\`: Business hierarchies
- \`technical-schematic\`: Technical 3D pyramids
`
  },
  {
    id: 'hub-spoke',
    name: 'Hub Spoke',
    bestFor: '中心概念+关联项',
    guidelines: `# hub-spoke

Central concept with radiating connections to related items.

## Structure

- Central hub (main concept)
- Spokes radiating outward
- Nodes at spoke ends (related concepts)
- Even or weighted distribution
- Optional secondary connections

## Best For

- Central theme with components
- Product features around core
- Team roles around project
- Ecosystem mapping
- Mind maps

## Visual Elements

- Prominent central hub
- Clear spoke lines
- Consistent node styling
- Icons representing each spoke item
- Optional grouping colors

## Text Placement

- Title at top
- Core concept in center hub
- Spoke item labels at nodes
- Brief descriptions near nodes
- Connection labels on spokes if needed

## Recommended Pairings

- \`cartoon-hand-drawn\`: Friendly concept maps
- \`corporate-memphis\`: Business ecosystems
- \`subway-map\`: Network-style connections
`
  },
  {
    id: 'iceberg',
    name: 'Iceberg',
    bestFor: '表面vs隐藏',
    guidelines: `# iceberg

Surface vs hidden depths, visible vs underlying factors.

## Structure

- Waterline dividing visible/hidden
- Tip above water (obvious/surface)
- Larger mass below (hidden/deep)
- Proportional to emphasize hidden depth
- Optional layers within underwater section

## Best For

- Surface vs root causes
- Visible vs invisible work
- Symptoms vs underlying issues
- Public vs private aspects
- Known vs unknown factors

## Visual Elements

- Clear water/surface line
- Above: smaller, brighter
- Below: larger, darker/deeper
- Wave or water texture
- Gradient showing depth

## Text Placement

- Title at top
- Surface items above waterline
- Hidden items below, larger
- Waterline label optional
- Depth indicators for layers

## Recommended Pairings

- \`cartoon-hand-drawn\`: Friendly metaphor
- \`storybook-watercolor\`: Artistic depth
- \`graphic-novel\`: Dramatic revelation
`
  },
  {
    id: 'isometric-map',
    name: 'Isometric Map',
    bestFor: '空间关系',
    guidelines: `# isometric-map

3D-style spatial layout showing locations, relationships, or journey through space.

## Structure

- Isometric 3D perspective
- Locations as buildings/landmarks
- Paths connecting locations
- Spatial relationships visible
- Bird's eye view angle

## Best For

- Office/campus layouts
- City/ecosystem maps
- User journey maps
- System architecture
- Process landscapes

## Visual Elements

- Consistent isometric angle (30°)
- 3D buildings or objects
- Pathways and roads
- Labels floating above
- Mini scenes at locations

## Text Placement

- Title at top corner
- Location labels above objects
- Path labels along routes
- Legend for symbols
- Scale indicator if relevant

## Recommended Pairings

- \`isometric-3d\`: Clean technical maps
- \`pixel-art\`: Retro game-style maps
- \`lego-brick\`: Playful location maps
`
  },
  {
    id: 'jigsaw',
    name: 'Jigsaw',
    bestFor: '相互关联的部分',
    guidelines: `# jigsaw

Interlocking puzzle pieces showing how parts fit together.

## Structure

- Puzzle pieces that interlock
- Each piece represents a component
- Connections show relationships
- Can be assembled or exploded view
- Missing piece highlights gaps

## Best For

- Component relationships
- Team/skill fit
- Strategy pieces
- Integration concepts
- Completeness assessments

## Visual Elements

- Classic puzzle piece shapes
- Distinct colors per piece
- Interlocking edges visible
- Icons or labels per piece
- Optional missing piece

## Text Placement

- Title at top
- Piece labels inside or beside
- Connection descriptions
- Missing piece explanation
- Assembly context

## Recommended Pairings

- \`cartoon-hand-drawn\`: Friendly integration concepts
- \`paper-cutout\`: Tactile puzzle feel
- \`corporate-memphis\`: Business strategy pieces
`
  },
  {
    id: 'linear-progression',
    name: 'Linear Progression',
    bestFor: '时间线、流程、教程',
    guidelines: `# linear-progression

Sequential progression showing steps, timeline, or chronological events.

## Structure

- Linear arrangement (horizontal or vertical)
- Nodes/markers at key points
- Connecting line or path between nodes
- Clear start and end points
- Directional flow indicators

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Timeline** | Chronological events, dates | Time markers, period labels |
| **Process** | Action steps, numbered sequence | Step numbers, action icons |

## Best For

- Step-by-step tutorials and how-tos
- Historical timelines and evolution
- Project milestones and roadmaps
- Workflow documentation
- Onboarding processes

## Visual Elements

- Numbered steps or date markers
- Arrows or connectors showing direction
- Icons representing each step/event
- Consistent node spacing
- Progress indicators optional

## Text Placement

- Title at top
- Step/event titles at each node
- Brief descriptions below nodes
- Dates or numbers clearly visible

## Recommended Pairings

- \`craft-handmade\`: Friendly tutorials and timelines
- \`ikea-manual\`: Clean assembly instructions
- \`corporate-memphis\`: Business process flows
- \`aged-academia\`: Historical discoveries
`
  },
  {
    id: 'periodic-table',
    name: 'Periodic Table',
    bestFor: '分类集合',
    guidelines: `# periodic-table

Grid of categorized elements with consistent cell formatting.

## Structure

- Rectangular grid
- Each cell is one element
- Color-coded categories
- Consistent cell format
- Optional grouping gaps

## Best For

- Categorized collections
- Tool/resource catalogs
- Skill matrices
- Element collections
- Reference guides

## Visual Elements

- Uniform cell sizes
- Category colors
- Symbol/abbreviation prominent
- Small icon per cell
- Category legend

## Text Placement

- Title at top
- Cell: symbol, name, brief info
- Category names in legend
- Optional row/column headers
- Footnotes for special cases

## Recommended Pairings

- \`pop-art\`: Vibrant element grids
- \`pixel-art\`: Retro collection displays
- \`corporate-memphis\`: Business tool catalogs
`
  },
  {
    id: 'story-mountain',
    name: 'Story Mountain',
    bestFor: '情节结构、张力弧',
    guidelines: `# story-mountain

Plot structure visualization showing rising action, climax, and resolution.

## Structure

- Mountain/arc shape
- Rising slope (build-up)
- Peak (climax)
- Falling slope (resolution)
- Start and end at base level

## Best For

- Narrative structures
- Project lifecycles
- Tension/release patterns
- Emotional journeys
- Campaign arcs

## Visual Elements

- Mountain or arc curve
- Points along the path
- Climax visually emphasized
- Slope steepness meaningful
- Base camps or milestones

## Text Placement

- Title at top
- Stage labels along path
- Climax prominently labeled
- Brief descriptions at points
- Start/end clearly marked

## Recommended Pairings

- \`storybook-watercolor\`: Narrative journeys
- \`cartoon-hand-drawn\`: Educational plot diagrams
- \`graphic-novel\`: Dramatic story arcs
`
  },
  {
    id: 'structural-breakdown',
    name: 'Structural Breakdown',
    bestFor: '拆解图、剖面',
    guidelines: `# structural-breakdown

Internal structure visualization with labeled parts or layers.

## Structure

- Central subject (object, system, body)
- Parts or layers clearly shown
- Labels with callout lines
- Exploded or cutaway view
- Optional zoomed detail sections

## Variants

| Variant | View Type | Visual Emphasis |
|---------|-----------|-----------------|
| **Exploded** | Parts separated outward | Component relationships |
| **Cross-section** | Sliced/cutaway view | Internal layers, composition |

## Best For

- Product part breakdowns
- Anatomy explanations
- System components
- Device teardowns
- Material composition

## Visual Elements

- Main subject clearly rendered
- Callout lines with dots/arrows
- Label boxes at endpoints
- Numbered parts optionally
- Layer boundaries or separation

## Text Placement

- Title at top
- Part/layer labels at callouts
- Brief descriptions in boxes
- Legend for numbered systems
- Depth/thickness if relevant

## Recommended Pairings

- \`technical-schematic\`: Technical schematics
- \`aged-academia\`: Classic anatomical style
- \`craft-handmade\`: Friendly breakdowns
`
  },
  {
    id: 'tree-branching',
    name: 'Tree Branching',
    bestFor: '分类、谱系',
    guidelines: `# tree-branching

Hierarchical structure branching from root to leaves, showing categories and subcategories.

## Structure

- Root/trunk at top or left
- Branches splitting into sub-branches
- Leaves as terminal nodes
- Clear parent-child relationships
- Balanced or organic branching

## Best For

- Taxonomies and classifications
- Decision trees
- Organizational charts
- File/folder structures
- Family trees

## Visual Elements

- Connecting lines showing relationships
- Nodes at branch points
- Icons or labels at each node
- Color coding by branch
- Visual weight decreasing toward leaves

## Text Placement

- Title at top
- Root concept prominently labeled
- Branch and leaf labels
- Optional descriptions at key nodes
- Legend for categories

## Recommended Pairings

- \`cartoon-hand-drawn\`: Friendly taxonomies
- \`da-vinci-notebook\`: Scientific classifications
- \`origami\`: Geometric tree structures
`
  },
  {
    id: 'venn-diagram',
    name: 'Venn Diagram',
    bestFor: '重叠概念',
    guidelines: `# venn-diagram

Overlapping circles showing relationships, commonalities, and differences.

## Structure

- 2-3 overlapping circles
- Each circle is a category/concept
- Overlaps show shared elements
- Center shows common to all
- Unique areas for exclusives

## Best For

- Concept relationships
- Skill overlaps
- Market segments
- Comparative analysis
- Finding common ground

## Visual Elements

- Translucent circle fills
- Clear overlap regions
- Distinct colors per circle
- Icons in regions
- Boundary labels

## Text Placement

- Title at top
- Circle labels outside or on edge
- Items in appropriate regions
- Overlap region labels
- Legend if needed

## Recommended Pairings

- \`cartoon-hand-drawn\`: Friendly concept overlaps
- \`corporate-memphis\`: Business segment analysis
- \`pop-art\`: High-contrast comparisons
`
  },
  {
    id: 'winding-roadmap',
    name: 'Winding Roadmap',
    bestFor: '旅程、里程碑',
    guidelines: `# winding-roadmap

Curved path showing journey with milestones and checkpoints.

## Structure

- S-curve or winding path
- Milestones along the path
- Start and destination points
- Side elements (obstacles, helpers)
- Progress indicators

## Best For

- Project roadmaps
- Career paths
- Customer journeys
- Learning paths
- Strategy timelines

## Visual Elements

- Curving road or river
- Milestone markers/flags
- Scene elements along path
- Vehicle/character on journey
- Destination landmark

## Text Placement

- Title at top
- Milestone labels at each point
- Path section names
- Destination description
- Optional timeline indicators

## Recommended Pairings

- \`storybook-watercolor\`: Whimsical journeys
- \`cartoon-hand-drawn\`: Friendly roadmaps
- \`isometric-3d\`: Technical project paths
`
  }
];

export const INFOGRAPHIC_STYLES: StyleDef[] = [
  {
    id: 'craft-handmade',
    name: 'Craft Handmade',
    description: '手绘纸艺风格（默认）',
    guidelines: `# craft-handmade (DEFAULT)

Hand-drawn and paper craft aesthetic with warm, organic feel.

## Color Palette

- Primary: Warm pastels, soft saturated colors, craft paper tones
- Background: Light cream (#FFF8F0), textured paper (#F5F0E6)
- Accents: Bold highlights, construction paper colors

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Hand-drawn** | Cartoon illustration | Simple icons, slightly imperfect lines |
| **Paper-cutout** | Layered paper craft | Drop shadows, torn edges, texture |

## Visual Elements

- Hand-drawn or cut-paper quality
- Organic, slightly imperfect shapes
- Layered depth with shadows (paper variant)
- Simple cartoon elements and icons
- Character illustrations (people, personalities in cartoon form)
- Ample whitespace, clean composition
- Keywords and core concepts highlighted
- **Strictly hand-drawn—no realistic or photographic elements**

## Style Enforcement

- All imagery must maintain cartoon/illustrated aesthetic
- Replace real photos or realistic figures with hand-drawn equivalents
- Maintain consistent line weight and illustration style throughout

## Typography

- Hand-drawn or casual font style
- Clear, readable labels
- Keywords emphasized with larger/bolder text
- Cut-out letter style for paper variant

## Best For

Educational content, general explanations, friendly infographics, children's content, playful hierarchies
`
  },
  {
    id: 'claymation',
    name: 'Claymation',
    description: '3D黏土、定格动画',
    guidelines: `# claymation

3D clay figure aesthetic with stop-motion charm

## Color Palette

- Primary: Saturated clay colors - bright but slightly muted
- Background: Neutral studio backdrop, soft gradients
- Accents: Complementary clay colors, shiny highlights

## Visual Elements

- Clay/plasticine texture on all objects
- Fingerprint marks and imperfections
- Rounded, sculpted forms
- Soft shadows
- Stop-motion staging
- Miniature set aesthetic

## Typography

- Extruded clay letters
- Dimensional, rounded text
- Playful and chunky
- Embedded in clay scenes

## Best For

Playful explanations, children's content, stop-motion narratives, friendly processes
`
  },
  {
    id: 'kawaii',
    name: 'Kawaii',
    description: '日系可爱、粉彩',
    guidelines: `# kawaii

Japanese cute style with big eyes and pastel colors

## Color Palette

- Primary: Soft pastels - pink (#FFB6C1), mint (#98D8C8), lavender (#E6E6FA)
- Background: Light pink or cream, sparkle overlays
- Accents: Bright pops, star and heart shapes

## Visual Elements

- Big sparkly eyes on characters
- Rounded, soft shapes
- Blushing cheeks
- Sparkles and stars scattered
- Cute animal characters
- Chibi proportions

## Typography

- Rounded, bubbly fonts
- Cute decorations on letters
- Hearts and stars in text
- Soft, friendly appearance

## Best For

Cute tutorials, children's education, lifestyle content, character-driven explanations
`
  },
  {
    id: 'storybook-watercolor',
    name: 'Storybook Watercolor',
    description: '柔和水彩、童话感',
    guidelines: `# storybook-watercolor

Soft hand-painted illustration with whimsical charm

## Color Palette

- Primary: Soft watercolor washes - muted blues, greens, warm earth
- Background: Watercolor paper texture, white or cream
- Accents: Deeper pigment pools, splatter effects

## Visual Elements

- Visible brushstrokes
- Soft color bleeds and gradients
- White space as design element
- Delicate line work over washes
- Natural, organic shapes
- Dreamy, atmospheric quality

## Typography

- Elegant hand-lettering
- Watercolor-style text
- Flowing, organic letterforms
- Integrated with illustrations

## Best For

Storytelling, emotional journeys, nature topics, children's education, artistic presentations
`
  },
  {
    id: 'chalkboard',
    name: 'Chalkboard',
    description: '黑板粉笔',
    guidelines: `# chalkboard

Black chalkboard background with colorful chalk drawing style

## Design Aesthetic

Classic classroom chalkboard aesthetic with hand-drawn chalk illustrations. Nostalgic educational feel with imperfect, sketchy lines that capture the warmth of traditional teaching. Colorful chalk creates visual hierarchy while maintaining the authentic chalkboard experience.

## Background

- Color: Chalkboard Black (#1A1A1A) or Dark Green-Black (#1C2B1C)
- Texture: Realistic chalkboard texture with subtle scratches, dust particles, and faint eraser marks

## Typography

Hand-drawn chalk lettering style with visible chalk texture. Imperfect baseline adds authenticity. White or bright colored chalk for emphasis.

## Color Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Chalkboard Black | #1A1A1A | Primary background |
| Alt Background | Green-Black | #1C2B1C | Traditional green board |
| Primary Text | Chalk White | #F5F5F5 | Main text, outlines |
| Accent 1 | Chalk Yellow | #FFE566 | Highlights, emphasis |
| Accent 2 | Chalk Pink | #FF9999 | Secondary highlights |
| Accent 3 | Chalk Blue | #66B3FF | Diagrams, links |
| Accent 4 | Chalk Green | #90EE90 | Success, nature |
| Accent 5 | Chalk Orange | #FFB366 | Warnings, energy |

## Visual Elements

- Hand-drawn chalk illustrations with sketchy, imperfect lines
- Chalk dust effects around text and key elements
- Doodles: stars, arrows, underlines, circles, checkmarks
- Mathematical formulas and simple diagrams
- Eraser smudges and chalk residue textures
- Wooden frame border optional
- Stick figures and simple icons
- Connection lines with hand-drawn feel

## Style Rules

### Do

- Maintain authentic chalk texture on all elements
- Use imperfect, hand-drawn quality throughout
- Add subtle chalk dust and smudge effects
- Create visual hierarchy with color variety
- Include playful doodles and annotations

### Don't

- Use perfect geometric shapes
- Create clean digital-looking lines
- Add photorealistic elements
- Use gradients or glossy effects

## Best For

Educational content, tutorials, classroom themes, teaching materials, workshops, informal learning sessions, knowledge sharing
`
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon',
    description: '霓虹发光、未来感',
    guidelines: `# cyberpunk-neon

Neon glow on dark backgrounds, futuristic aesthetic

## Color Palette

- Primary: Neon pink (#FF00FF), cyan (#00FFFF), electric blue
- Background: Deep black (#0A0A0A), dark purple gradients
- Accents: Neon glow effects, chrome reflections

## Visual Elements

- Glowing neon outlines
- Dark atmospheric backgrounds
- Digital glitch effects
- Circuit patterns
- Holographic elements
- Rain and reflections

## Typography

- Glowing neon text
- Digital/tech fonts
- Flickering effects
- Outlined glow letters

## Best For

Tech futures, gaming content, digital culture, futuristic concepts, night aesthetics
`
  },
  {
    id: 'bold-graphic',
    name: 'Bold Graphic',
    description: '漫画风格、半调网点',
    guidelines: `# bold-graphic

High-contrast comic style with bold outlines and dramatic visuals.

## Color Palette

- Primary: Bold primaries - red, yellow, blue, black
- Background: White, halftone patterns, dramatic shadows
- Accents: Spot colors, neon highlights

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Graphic-novel** | Dramatic narratives | Action lines, hatching, panels |
| **Pop-art** | High-energy impact | Halftone dots, Warhol repetition |

## Visual Elements

- Bold black outlines
- High contrast compositions
- Halftone dot patterns
- Comic panel borders optional
- Action lines and motion
- Speech bubbles and sound effects

## Typography

- Comic book lettering
- Impact fonts for emphasis
- POW/BANG effects for pop-art
- Caption boxes for narrative

## Best For

Attention-grabbing content, dramatic narratives, pop culture, marketing, high-energy presentations
`
  },
  {
    id: 'aged-academia',
    name: 'Aged Academia',
    description: '复古科学、复古色调',
    guidelines: `# aged-academia

Historical scientific illustration with aged paper aesthetic.

## Color Palette

- Primary: Sepia brown (#704214), aged ink, muted earth tones
- Background: Parchment (#F4E4BC), yellowed paper texture
- Accents: Faded red annotations, iron gall ink spots

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Notebook** | Personal sketches, inventions | Cursive notes, margin annotations |
| **Specimen** | Scientific classification | Numbered diagrams, Latin labels |

## Visual Elements

- Aged paper texture overlay
- Detailed cross-hatching and line work
- Scientific illustration precision
- Study notes and annotations
- Specimen plate or sketch aesthetic
- Numbered diagram elements

## Typography

- Handwritten cursive or serif fonts
- Scientific annotations
- Small caps for labels
- Italics for scientific names

## Best For

Scientific education, biology topics, historical explanations, inventions, nature documentation
`
  },
  {
    id: 'corporate-memphis',
    name: 'Corporate Memphis',
    description: '扁平矢量、鲜艳',
    guidelines: `# corporate-memphis

Flat vector people with vibrant geometric fills

## Color Palette

- Primary: Bright, saturated - purple, orange, teal, yellow
- Background: White or light pastels
- Accents: Gradient fills, geometric patterns

## Visual Elements

- Flat vector illustration
- Disproportionate human figures
- Abstract body shapes
- Floating geometric elements
- No outlines, solid fills
- Plant and object accents

## Typography

- Clean sans-serif
- Bold headings
- Professional but friendly
- Minimal decoration

## Best For

Business presentations, tech products, marketing materials, corporate training
`
  },
  {
    id: 'technical-schematic',
    name: 'Technical Schematic',
    description: '蓝图、工程制图',
    guidelines: `# technical-schematic

Technical diagrams with engineering precision and clean geometry.

## Color Palette

- Primary: Blues (#2563EB), teals, grays, white lines
- Background: Deep blue (#1E3A5F), white, or light gray with grid
- Accents: Amber highlights (#F59E0B), cyan callouts

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Blueprint** | Engineering schematics | White on blue, measurements, grid |
| **Isometric** | 3D spatial representation | 30° angle blocks, clean fills |

## Visual Elements

- Geometric precision throughout
- Grid pattern or isometric angle
- Dimension lines and measurements
- Technical symbols and annotations
- Clean vector shapes
- Consistent stroke weights

## Typography

- Technical stencil or clean sans-serif
- All-caps labels
- Measurement annotations
- Floating labels for isometric

## Best For

Technical architecture, system diagrams, engineering specs, product breakdowns, data visualization
`
  },
  {
    id: 'origami',
    name: 'Origami',
    description: '折纸、几何',
    guidelines: `# origami

Folded paper forms with geometric precision

## Color Palette

- Primary: Solid origami paper colors - red, blue, green, gold
- Background: White or soft gray, subtle shadows
- Accents: Paper fold highlights, crisp shadows

## Visual Elements

- Geometric folded shapes
- Visible fold lines
- Cast shadows showing depth
- Paper texture
- Angular, faceted forms
- Low-poly aesthetic

## Typography

- Clean geometric fonts
- Angular letterforms
- Folded paper text effect
- Minimal, precise labels

## Best For

Geometric concepts, transformation topics, Japanese themes, abstract representations
`
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    description: '复古8位像素',
    guidelines: `# pixel-art

Retro 8-bit gaming aesthetic

## Color Palette

- Primary: Limited palette - NES/SNES colors
- Background: Black or dark blue, scanlines optional
- Accents: Bright pixel highlights, CRT glow

## Visual Elements

- Visible pixel grid
- Limited color count per sprite
- 8-bit or 16-bit style
- Retro game UI elements
- Pixel-perfect edges
- Dithering for gradients

## Typography

- Pixel fonts
- Blocky letterforms
- Game UI style text
- Score/stat display style

## Best For

Gaming topics, nostalgia content, developer audiences, retro tech themes
`
  },
  {
    id: 'ui-wireframe',
    name: 'UI Wireframe',
    description: '灰度界面线框',
    guidelines: `# ui-wireframe

Grayscale interface mockup style

## Color Palette

- Primary: Grays - light (#E5E5E5), medium (#9CA3AF), dark (#374151)
- Background: White (#FFFFFF), light gray
- Accents: Blue for interactive (#3B82F6), red for emphasis

## Visual Elements

- Wireframe boxes and placeholders
- X marks for image placeholders
- Simple line icons
- Grid-based layout
- Annotation callouts
- Redline specifications

## Typography

- System fonts
- Placeholder "Lorem ipsum"
- UI label style
- Sans-serif throughout

## Best For

Product designs, UI explanations, app concepts, user flow diagrams
`
  },
  {
    id: 'ikea-manual',
    name: 'IKEA Manual',
    description: '极简线条画',
    guidelines: `# ikea-manual

Minimal line art assembly instruction style

## Color Palette

- Primary: Black lines, minimal fills
- Background: White or cream paper
- Accents: Red for warnings, blue for highlights

## Visual Elements

- Simple line drawings
- Numbered step sequences
- Arrow indicators
- Exploded assembly views
- Wordless communication
- Stick figures for scale

## Typography

- Minimal text
- Step numbers prominent
- Universal symbols
- Simple sans-serif when needed

## Best For

Step-by-step instructions, assembly guides, how-to content, universal communication
`
  },
  {
    id: 'knolling',
    name: 'Knolling',
    description: '整齐排列俯拍',
    guidelines: `# knolling

Organized flat-lay with top-down arrangement

## Color Palette

- Primary: Object's natural colors
- Background: Solid color - black, white, or colored surface
- Accents: Shadows, subtle highlights

## Visual Elements

- Top-down camera angle
- Objects arranged at 90° angles
- Equal spacing between items
- Clean organization
- Symmetry and order
- No overlapping items

## Typography

- Clean labels
- Positioned outside objects
- Connecting lines to items
- Minimal, catalog-style

## Best For

Product collections, tool inventories, gear layouts, organized overviews
`
  },
  {
    id: 'lego-brick',
    name: 'LEGO Brick',
    description: '乐高积木',
    guidelines: `# lego-brick

Toy brick construction with playful aesthetic

## Color Palette

- Primary: Classic LEGO colors - red, blue, yellow, green, white
- Background: Light gray baseplate or white
- Accents: Bright primary pops, shiny studs

## Visual Elements

- Visible brick studs
- Modular construction
- Minifigure characters
- Building instruction style
- Stackable elements
- Plastic sheen

## Typography

- Blocky, bold fonts
- LEGO instruction style
- Step numbers
- Playful appearance

## Best For

Building concepts, modular systems, playful education, children's content
`
  },
  {
    id: 'pop-laboratory',
    name: 'Pop Laboratory',
    description: '蓝图网格、实验室精准',
    guidelines: `# pop-laboratory

Lab manual precision meets pop art color impact—coordinate systems, technical diagrams, and fluorescent accents on blueprint grid.

## Color Palette

- Background: Professional grayish-white with faint blueprint grid texture (#F2F2F2)
- Primary: Muted teal/sage green (#B8D8BE) for major functional blocks and data zones
- High-alert accent: Vibrant fluorescent pink (#E91E63) strictly for warnings, critical data, or "winner" highlights
- Marker highlights: Vivid lemon yellow (#FFF200) as translucent highlighter effect for keywords
- Line art: Ultra-fine charcoal brown (#2D2926) for technical grids, coordinates, and hairlines

## Visual Elements

- Coordinate-style labels on every module (e.g., R-20, G-02, SEC-08)
- Technical diagrams: exploded views, cross-sections with anchor points, architectural skeletal lines
- Vertical/horizontal rulers with precise markers (0.5mm, 1.8mm, 45°)
- "Marker-over-print" effect: color blocks slightly offset from text, postmodern print feel
- Cross-hair targets, mathematical symbols (Σ, Δ, ∞), directional arrows (X/Y axis)
- Microscopic detail annotations alongside macroscopic bold headers
- Corner metadata: tiny barcodes, timestamps, technical parameters
- High contrast between massive bold headers and tiny 8pt-style annotations

## Typography

- Headers: Bold brutalist characters, high visual impact
- Body: Professional sans-serif or crisp technical print
- Numbers: Large, highlighted with yellow or blue to stand out
- Annotations: Ultra-crisp, small technical labels

## Style Enforcement

- Strictly systematic color usage: only teal, pink, yellow, charcoal—no rainbow palette
- Sufficient fine grid lines and coordinate annotations throughout
- Maintain tension between large impactful headers and small precise parameters
- Lab manual aesthetic: mix of microscopic details and macroscopic data

## Avoid

- Cute or cartoonish doodles
- Soft pastels or generic textures
- Empty white space
- Flat vector stock icons
- Organic or hand-drawn imperfections

## Best For

Technical product guides, specification comparisons, precision-focused data visualization, engineering-adjacent content
`
  },
  {
    id: 'morandi-journal',
    name: 'Morandi Journal',
    description: '手绘涂鸦、莫兰迪暖色',
    guidelines: `# morandi-journal

Hand-drawn doodle illustration with warm Morandi color tones and cozy bullet journal aesthetic.

## Color Palette

- Background: Warm cream/beige with subtle paper texture (#F5F0E6)
- Primary: Muted teal/sage green (#7BA3A8) for headers and frames
- Secondary: Warm terracotta/orange (#D4956A) for highlights and numbers
- Line art: Dark charcoal brown (#4A4540)
- Soft highlights: Pale yellow (#F5E6C8)

## Visual Elements

- Hand-drawn doodle illustrations with organic, slightly imperfect ink lines
- Washi tape strip decorations (diagonal stripes pattern, beige and brown)
- Rounded card containers for brand/option items
- Hand-drawn rulers, scales, and progress bars with emoji quality indicators
- Smiley/frowny faces as quality markers (😊✓ 😐 ☹️✗)
- Dotted line frames around sections
- Connecting arrows and dotted lines between modules
- Corner decorations: tiny houses, stars, sparkles, clouds
- Wavy line dividers between sections
- Callout bubbles for tips
- Magnifying glass icons for identification tips
- Thumbs up/down icons (hand-drawn style)

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Cozy journal** | Maximum warmth | More washi tape, stickers, decorative doodles |
| **Clean sketch** | Readability | Cleaner lines, less decoration, more structured |

## Typography

- Main title: Bold hand-lettered calligraphy style with decorative flourishes
- Module headers: Clean handwritten text in white on dark teal rounded badge (#6B9080)
- Body text: Neat handwritten print style, easy to read
- Numbers: Highlighted in terracotta (#D4956A), slightly larger than body

## Style Enforcement

- All imagery must maintain hand-drawn/doodle aesthetic—no digital precision
- Organic, slightly imperfect shapes throughout
- Sketch-like quality with visible line weight variations
- Warm and cozy journal feel, not clinical or corporate

## Avoid

- Flat vector icons or emoji
- Clean geometric shapes
- Stock illustration style
- Strict grid layout
- Pure white background
- Digital/corporate look

## Best For

Product selection guides, lifestyle content, educational overviews, consumer-facing comparison content, Xiaohongshu-style posts
`
  },
  {
    id: 'retro-pop-grid',
    name: 'Retro Pop Grid',
    description: '70年代复古波普',
    guidelines: `# retro-pop-grid

1970s retro pop art with strict Swiss international grid, thick black outlines, and flat color blocks.

## Color Palette

- Background: Warm vintage cream/beige (#F5F0E6)
- Flat accents: Salmon pink, sky blue, mustard yellow, mint green—all muted retro tones
- Contrast blocks: Solid pure black (#000000) and solid pure white (#FFFFFF) used strategically for extreme contrast
- Line art and outlines: Solid thick black

## Visual Elements

- Uniform thick black outlines on all illustrations, text boxes, and grid dividers
- Pure 2D flat vector aesthetic with subtle screen print texture
- Strict Swiss international grid: poster divided into square and rectangular cells by thick black lines
- Black-background cells with white text for warnings or key categories (inverted contrast)
- Geometric fill patterns in empty cells: checkerboards, diagonal lines, dots
- Flat abstract symbols, warning signs, keyholes, stars, arrows
- Vintage comic-style smiley/frowny faces for quality indicators
- Colored cells used for breathing room—some with minimal/no content

## Typography

- Headers: Bold brutalist or retro thick display fonts, high legibility
- Body: Clean sans-serif, structured typographic alignment
- Decorative English text acceptable for stylistic labels ("WARNING", "INFO", "BEST")
- All content text in specified language

## Style Enforcement

- Absolutely no gradients, shading, drop shadows, or 3D effects
- Everything anchored in grid cells—no floating or unorganized elements
- Maintain 1970s retro pop art and underground comic illustration feel
- Visual density balanced with rhythmic grid—some cells intentionally sparse for contrast

## Avoid

- 3D rendering, realistic details, gradients, soft shadows
- Soft, thin, or sketch-like pencil lines
- Free-flowing, unorganized, or floating layouts (everything must be grid-anchored)
- Pure white background canvas
- Organic or hand-drawn imperfections

## Best For

Trendy product guides, design-conscious content, visually striking comparisons, content targeting design-savvy audiences, bold social media posts
`
  },
  {
    id: 'hand-drawn-edu',
    name: 'Hand-Drawn Edu',
    description: '马卡龙粉彩、手绘摇摆',
    guidelines: `# hand-drawn-edu

Hand-drawn educational infographic with macaron pastel color blocks on warm cream paper texture.

## Color Palette

- Background: Warm cream (#F5F0E8) with subtle paper grain texture
- Primary text: Deep charcoal (#2D2D2D) for headlines, outlines
- Macaron Blue: #A8D8EA for cool-toned information zones
- Macaron Mint: #B5E5CF for growth/positive zones
- Macaron Lavender: #D5C6E0 for abstract/concept zones
- Macaron Peach: #FFD5C2 for warm-toned zones
- Accent: Coral Red (#E8655A) for key data, warnings, emphasis
- Muted annotations: Warm gray (#6B6B6B) for secondary labels

## Visual Elements

- Macaron pastel rounded cards as distinct information zones
- Hand-drawn wavy connection lines and arrows with small text labels
- Simple stick-figure characters and cartoon icons to humanize concepts
- Doodle decorations: small stars, underlines, spirals, sparkles
- Color fills don't completely fill outlines — preserve casual hand-drawn feel
- Dashed borders for secondary or contained zones
- Small icon doodles (clipboard, lock, checkmark, lightbulb) to reinforce concepts
- Bold centered quote or takeaway at the bottom
- Slight hand-drawn wobble on all lines and shapes

## Variants

| Variant | Focus | Visual Emphasis |
|---------|-------|-----------------|
| **Sketch-notes** | Concept mapping | More stick figures, thought bubbles, connecting arrows |
| **Pastel cards** | Structured info | Cleaner macaron blocks, less doodle, more white space |

## Typography

- Main title: Bold hand-drawn lettering with organic strokes, large confident letterforms with slight wobble
- Section headers: Hand-lettered text on or inside macaron color blocks
- Body text: Clear handwritten print style, legible but not mechanical
- Annotations: Warm gray (#6B6B6B), smaller, neat handwritten labels
- Keywords: Bold emphasis within body text

## Style Enforcement

- All lines must have slight hand-drawn wobble — no perfect geometry
- Each information zone uses a distinct macaron color block
- Maintain consistent wobble quality across all shapes and lines
- Include at least one simple cartoon character or stick figure
- Generous white space between zones — each zone should breathe
- Maximum 4 macaron colors per infographic

## Avoid

- Perfect geometric shapes or straight lines
- Photorealistic elements or stock illustration style
- Pure white backgrounds
- Flat vector icons or digital-precision graphics
- Overcrowded layouts — let zones breathe
- Corporate or clinical aesthetic

## Best For

Educational diagrams, process explainers, concept maps, knowledge summaries, tutorial walkthroughs, onboarding visuals
`
  },
  {
    id: 'retro-popup-pop',
    name: 'Retro Popup Pop',
    description: '复古弹出拼贴',
    guidelines: `# retro-popup-pop

Retro pixel popup × pop-art collage — content rendered as a stack of 80/90s desktop dialog windows with thick black outlines, flat color fills, and bright cyan or vintage cream backgrounds.

## Color Palette

- Background: Bright cyan (#12B8DE) primary canvas, vintage cream (#F5F0E6) alternate
- Window fills: Vintage cream (#F5F0E6) and pure white (#FFFFFF)
- Primary text and outlines: Pure black (#000000)
- Reverse text: Pure white on solid black title bars
- Accent fills (small areas only): Salmon pink, sky blue, mustard yellow, mint green — muted retro tones

## Visual Elements

- 80s/90s desktop popup windows with title bars, close buttons (×), and chunky borders
- Multiple windows tiled or lightly overlapping with offset solid-black drop shadows for depth
- ERROR / ALERT / WARNING dialogs to highlight misconceptions, common pitfalls, risks
- File-window vignettes labeled with retro filenames (PROBLEMS.EXE, METHOD.PNG, BURNOUT.PSD, FOCUS_SCAN, SYSTEM_ALERT, IDEAS_MISSING)
- Progress bars for completion, difficulty, conversion rate, or trend
- Pixel-style chunky icons: folders, magnifiers, gears, exclamation marks, floppy disks, hourglasses
- Action buttons with thick black borders and short pop-style copy: OK, CANCEL, FIX IT, SCAN, PLAY, RETRY, SAVE
- Comparison data rendered as windowed lists or small tabular dialogs
- Uniform thick black outlines on every window, button, icon, and divider
- Pure 2D flat color fills throughout — no gradients, no glow, no glass

## Typography

- Headers: Pixel / dot-matrix / chunky bitmap display fonts, large and high-contrast
- Body: Retro monospace or system-style sans-serif, high legibility
- Title bars: Reverse white on solid black, all-caps preferred
- Decorative all-caps English allowed for filenames, status strings, button labels (PROBLEMS.EXE, OK, CANCEL); body content text remains in the confirmed output language

## Style Enforcement

- Every information chunk must live inside a window, dialog, button, or progress bar — no floating elements
- Uniform thick black outlines everywhere; offset solid-black drop shadows for stacked-window depth
- Limit accent palette to ~4 colors per composition; let cyan or cream dominate the canvas
- Maintain low-fi pixel/popup feel; humorous popup copy welcome, polished modern UI prohibited

## Avoid

- Modern UI styles: glassmorphism, neumorphism, soft shadows, blurs, gradients
- 3D rendering, photorealism, ray-traced shadows
- Hand-drawn wobble, watercolor washes, or sketch textures
- Smooth anti-aliased curves on icons (prefer chunky pixel/stair-step edges)
- Pure black backgrounds — keep cyan or cream as the canvas

## Best For

High-density "干货" knowledge guides, common-pitfall and debunking posts, knowledge-pop content for design-savvy or developer audiences, Xiaohongshu-style retro-tech posts, dense-modules portrait infographics.
`
  },
  {
    id: 'subway-map',
    name: 'Subway Map',
    description: '地铁线路图风格',
    guidelines: `# subway-map

Transit diagram style with colored lines and stations

## Color Palette

- Primary: Transit line colors - red, blue, green, yellow, orange
- Background: White or light gray
- Accents: Station dots, interchange markers

## Visual Elements

- Colored route lines
- 45° and 90° angles only
- Station circle markers
- Interchange symbols
- Simplified geography
- Line thickness hierarchy

## Typography

- Clean sans-serif
- Station name labels
- Line number/name badges
- Horizontal or angled text

## Best For

Journey maps, process flows, network diagrams, route explanations
`
  }
];
