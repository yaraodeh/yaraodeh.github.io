# Graph Report - .  (2026-06-23)

## Corpus Check
- 62 files · ~289,143 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 420 nodes · 509 edges · 56 communities (41 shown, 15 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 41 edges (avg confidence: 0.84)
- Token cost: 10,800 input · 3,820 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Minified Bundle Core|Minified Bundle Core]]
- [[_COMMUNITY_TypeScript App Config|TypeScript App Config]]
- [[_COMMUNITY_Dev Dependencies & Hooks|Dev Dependencies & Hooks]]
- [[_COMMUNITY_GitHub API & File Utils|GitHub API & File Utils]]
- [[_COMMUNITY_React Dependencies|React Dependencies]]
- [[_COMMUNITY_TypeScript Node Config|TypeScript Node Config]]
- [[_COMMUNITY_Portfolio Categories|Portfolio Categories]]
- [[_COMMUNITY_CICD Deploy Workflow|CI/CD Deploy Workflow]]
- [[_COMMUNITY_Minified Bundle Functions|Minified Bundle Functions]]
- [[_COMMUNITY_Site Content Config|Site Content Config]]
- [[_COMMUNITY_Git Hooks (Husky)|Git Hooks (Husky)]]
- [[_COMMUNITY_Admin & Home Pages|Admin & Home Pages]]
- [[_COMMUNITY_Minified Bundle Utils|Minified Bundle Utils]]
- [[_COMMUNITY_Minified Bundle Classes|Minified Bundle Classes]]
- [[_COMMUNITY_About & Contact Components|About & Contact Components]]
- [[_COMMUNITY_Historic Architecture Photos|Historic Architecture Photos]]
- [[_COMMUNITY_Landscape Photography|Landscape Photography]]
- [[_COMMUNITY_Minified Bundle Misc|Minified Bundle Misc]]
- [[_COMMUNITY_Coverflow Carousel|Coverflow Carousel]]
- [[_COMMUNITY_Modern Architecture Photos|Modern Architecture Photos]]
- [[_COMMUNITY_Urban Beach Photography|Urban Beach Photography]]
- [[_COMMUNITY_Fine Art Dance Photography|Fine Art Dance Photography]]
- [[_COMMUNITY_Error Boundary (Minified)|Error Boundary (Minified)]]
- [[_COMMUNITY_Romantic Couples Photography|Romantic Couples Photography]]
- [[_COMMUNITY_Minified Bundle Hooks|Minified Bundle Hooks]]
- [[_COMMUNITY_Conference Photography|Conference Photography]]
- [[_COMMUNITY_Photographer Identity (Cover)|Photographer Identity (Cover)]]
- [[_COMMUNITY_Dance & Theater Events|Dance & Theater Events]]
- [[_COMMUNITY_Minified Bundle Plugins|Minified Bundle Plugins]]
- [[_COMMUNITY_Claude Code Settings|Claude Code Settings]]
- [[_COMMUNITY_About Section Portrait|About Section Portrait]]
- [[_COMMUNITY_Minified Bundle Core II|Minified Bundle Core II]]
- [[_COMMUNITY_Claude Local Settings|Claude Local Settings]]
- [[_COMMUNITY_Admin Auth|Admin Auth]]
- [[_COMMUNITY_Urban Portrait Photography|Urban Portrait Photography]]
- [[_COMMUNITY_Vite Env Types|Vite Env Types]]
- [[_COMMUNITY_TypeScript Project References|TypeScript Project References]]
- [[_COMMUNITY_Claude Permissions|Claude Permissions]]
- [[_COMMUNITY_ESLint & Package Root|ESLint & Package Root]]
- [[_COMMUNITY_Site Config Export|Site Config Export]]
- [[_COMMUNITY_Jewellery Earring|Jewellery Earring]]
- [[_COMMUNITY_Jewellery Lighting|Jewellery Lighting]]
- [[_COMMUNITY_Jewellery Necklace|Jewellery Necklace]]
- [[_COMMUNITY_Jewellery Product Photo|Jewellery Product Photo]]
- [[_COMMUNITY_Jewellery Ring|Jewellery Ring]]
- [[_COMMUNITY_Editorial Jewellery Style|Editorial Jewellery Style]]
- [[_COMMUNITY_TypeScript Root Config|TypeScript Root Config]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 20 edges
2. `compilerOptions` - 17 edges
3. `jd()` - 15 edges
4. `Le()` - 12 edges
5. `sp()` - 12 edges
6. `scripts` - 11 edges
7. `xd()` - 9 edges
8. `dp()` - 9 edges
9. `Gothic Cathedral - Historic Architecture Photography` - 9 edges
10. `Landscape Photograph - Mediterranean Town View` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Coverflow()` --references--> `App Routing (HashRouter)`  [INFERRED]
  src/components/Coverflow/Coverflow.tsx → /Users/mariomonir/Marios/yaraodeh.github.io/src/App.tsx
- `Nav Items (home, portfolio, about, services, contact)` --conceptually_related_to--> `AboutSection()`  [INFERRED]
  /Users/mariomonir/Marios/yaraodeh.github.io/src/components/Header/Header.tsx → src/components/AboutSection/AboutSection.tsx
- `Nav Items (home, portfolio, about, services, contact)` --conceptually_related_to--> `ContactSection()`  [INFERRED]
  /Users/mariomonir/Marios/yaraodeh.github.io/src/components/Header/Header.tsx → src/components/ContactSection/ContactSection.tsx
- `Coverflow()` --implements--> `3D Coverflow Carousel UI Pattern`  [EXTRACTED]
  src/components/Coverflow/Coverflow.tsx → /Users/mariomonir/Marios/yaraodeh.github.io/src/components/Coverflow/Coverflow.tsx
- `Coverflow()` --implements--> `Coverflow Autoplay (2s interval)`  [EXTRACTED]
  src/components/Coverflow/Coverflow.tsx → /Users/mariomonir/Marios/yaraodeh.github.io/src/components/Coverflow/Coverflow.tsx

## Import Cycles
- 1-file cycle: `src/config/site.ts -> src/config/site.ts`

## Communities (56 total, 15 thin omitted)

### Community 0 - "Minified Bundle Core"
Cohesion: 0.06
Nodes (17): Aa, Ao(), dn, eh, fp(), gc, Ha, hp (+9 more)

### Community 1 - "TypeScript App Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+14 more)

### Community 2 - "Dev Dependencies & Hooks"
Cohesion: 0.10
Nodes (20): devDependencies, eslint, eslint-plugin-react, eslint-plugin-react-hooks, husky, jsdom, prettier, @testing-library/jest-dom (+12 more)

### Community 3 - "GitHub API & File Utils"
Cohesion: 0.17
Nodes (17): fileExt(), readBase64(), createBlob(), deleteImage(), fetchImages(), GH_BRANCH, GH_OWNER, GH_REPO (+9 more)

### Community 4 - "React Dependencies"
Cohesion: 0.10
Nodes (19): dependencies, react, react-dom, react-router-dom, name, private, scripts, build (+11 more)

### Community 5 - "TypeScript Node Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+10 more)

### Community 6 - "Portfolio Categories"
Cohesion: 0.12
Nodes (14): Art project category, Conferences project category, Couples project category, Events project category, Historic Architecture project category, Jewellery project category, Landscape project category, Modern Architecture project category (+6 more)

### Community 7 - "CI/CD Deploy Workflow"
Cohesion: 0.12
Nodes (17): build-and-deploy Job, Commit built files to main, Deploy to GitHub Pages Workflow, GitHub Pages, npm run build, npm ci, npm test, VITE_ADMIN_PASSWORD secret (+9 more)

### Community 8 - "Minified Bundle Functions"
Cohesion: 0.22
Nodes (16): $a(), cn(), dp(), ep(), Er(), fh(), kp(), Le() (+8 more)

### Community 9 - "Site Content Config"
Cohesion: 0.15
Nodes (12): about, body, stats, title, hero, name, socials, tagline (+4 more)

### Community 10 - "Git Hooks (Husky)"
Cohesion: 0.12
Nodes (16): Husky applypatch-msg hook, Husky commit-msg hook, Husky h entrypoint, Husky Shell Bootstrap (deprecated), Husky post-applypatch hook, Husky post-checkout hook, Husky post-commit hook, Husky post-merge hook (+8 more)

### Community 11 - "Admin & Home Pages"
Cohesion: 0.14
Nodes (16): Admin - Image Management Page, Admin Login Form, Admin GitHub Image Operations, Home - Portfolio Landing Page, Home IntersectionObserver Reveal Animation, Home Scroll-to-section Behavior, Project Back Navigation to Portfolio, Project Carousel Navigation Logic (+8 more)

### Community 12 - "Minified Bundle Utils"
Cohesion: 0.19
Nodes (13): ap(), Cr(), fn(), Fo(), Ho(), Id(), Kd(), lc() (+5 more)

### Community 13 - "Minified Bundle Classes"
Cohesion: 0.24
Nodes (11): c(), d(), fc(), jd(), Ld(), Md(), Nd(), Pd (+3 more)

### Community 14 - "About & Contact Components"
Cohesion: 0.20
Nodes (7): AboutSection(), site config about data, Contact Info (email, phone, instagram, location), ContactSection(), Header(), Nav Items (home, portfolio, about, services, contact), Header Scroll-to-Section Navigation

### Community 15 - "Historic Architecture Photos"
Cohesion: 0.27
Nodes (10): Exterior Architectural Photography, Flying Buttresses, Girona Cathedral (likely) - Spain, Gothic Cathedral - Historic Architecture Photography, Gothic Architectural Style, Medieval Era Architecture, Gothic Pinnacles and Finials, Pointed Gothic Arches (+2 more)

### Community 16 - "Landscape Photography"
Cohesion: 0.27
Nodes (10): Colorful Low-Rise Buildings (White, Yellow, Orange), Foreground-to-Background Layered Composition, Tall Cypress Trees as Vertical Elements, Urban Landscape with Natural Foreground, Golden Hour / Warm Afternoon Light, Mediterranean / Southern European Town, Serene, Warm, Idyllic, Landscape Photograph - Mediterranean Town View (+2 more)

### Community 17 - "Minified Bundle Misc"
Cohesion: 0.22
Nodes (9): Ba(), Dd(), mc(), pc(), qd(), Td(), Ud(), Yd() (+1 more)

### Community 18 - "Coverflow Carousel"
Cohesion: 0.22
Nodes (7): 3D Coverflow Carousel UI Pattern, Coverflow Autoplay (2s interval), Coverflow(), PortfolioProject type, Props, App(), App Routing (HashRouter)

### Community 19 - "Modern Architecture Photos"
Cohesion: 0.25
Nodes (8): Contemporary Brutalist-Influenced Building, Exposed Exterior Stairwells, Angular Diagonal Window Cutouts, Cantilevered Upper Mass, Gray Stone Panel Cladding, Architectural Detail Photography – Oblique Upward Angle, Modern Architecture Photograph 1, Deconstructivist / Neo-Brutalist Architectural Style

### Community 20 - "Urban Beach Photography"
Cohesion: 0.38
Nodes (7): Sandy Beach, Urban Skyline with High-rise Buildings, Industrial Chimneys in Background, Ocean Waves, People and Dog Walking on Beach, Urban Beach at Sunset, Pastel Sunset Sky

### Community 21 - "Fine Art Dance Photography"
Cohesion: 0.47
Nodes (6): Dramatic Elliptical Spotlight with Tree Branch Shadow Projection, Tension Vulnerability and Organic Connection, Contemporary Dance Duet Photography, Black and White Fine Art Dance Photography, Two Dancers in Contact Improvisation, Studio Photography with Theatrical Lighting and Shadow Play

### Community 23 - "Romantic Couples Photography"
Cohesion: 0.60
Nodes (6): Dried Roses Bouquet, Female Subject, Male Subject, Dramatic Melancholic Mood, Couples Portrait with Dried Roses, Studio Portrait Photography Style

### Community 24 - "Minified Bundle Hooks"
Cohesion: 0.40
Nodes (5): cp(), dh(), lh(), qo(), Sc()

### Community 25 - "Conference Photography"
Cohesion: 0.70
Nodes (5): Audience of Hundreds to Thousands of Attendees, Large-Scale Conference or Public Event, Teal and Green Stage Lighting, Large Conference Audience in Auditorium, Large Indoor Auditorium or Arena

### Community 26 - "Photographer Identity (Cover)"
Cohesion: 0.50
Nodes (5): Cover Hero Image: Photographer at Seaside, Photographer (person with Sony camera), Portfolio Hero / Personal Brand Identity, Seaside / Waterfront Setting, Sony Camera

### Community 27 - "Dance & Theater Events"
Cohesion: 0.40
Nodes (5): Matching Costumes - White Tops Dark Skirts, Green Scarves/Props Waved by Dancers, Group of Performers Dancing on Stage, Stage Performance - Dance/Theater Show, Theater Stage with Green Projection Backdrop

### Community 28 - "Minified Bundle Plugins"
Cohesion: 0.50
Nodes (4): bp(), op(), pp(), wp()

### Community 29 - "Claude Code Settings"
Cohesion: 0.50
Nodes (3): permissions, additionalDirectories, allow

### Community 31 - "About Section Portrait"
Cohesion: 1.00
Nodes (3): Young woman with staff badge at modern building, Professional lifestyle portrait photo - woman wearing staff badge outdoors at event venue, Modern dark-facade public building (venue/conference center), urban street setting

### Community 32 - "Minified Bundle Core II"
Cohesion: 0.67
Nodes (3): Cd(), Ed(), $o()

### Community 35 - "Urban Portrait Photography"
Cohesion: 1.00
Nodes (3): Portrait Photography - Outdoor Natural Light, Urban Cactus Garden with Stairs, Young Woman with Flowers on Escalator

## Knowledge Gaps
- **176 isolated node(s):** `allow`, `additionalDirectories`, `allow`, `husky.sh script`, `gc` (+171 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Dependencies & Hooks` to `React Dependencies`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **Why does `mp` connect `Error Boundary (Minified)` to `Minified Bundle Core`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 8 inferred relationships involving `jd()` (e.g. with `Ao()` and `Fo()`) actually correct?**
  _`jd()` has 8 INFERRED edges - model-reasoned connections that need verification._
- **Are the 13 inferred relationships involving `Husky h entrypoint` (e.g. with `Husky applypatch-msg hook` and `Husky commit-msg hook`) actually correct?**
  _`Husky h entrypoint` has 13 INFERRED edges - model-reasoned connections that need verification._
- **What connects `allow`, `additionalDirectories`, `allow` to the rest of the system?**
  _176 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Minified Bundle Core` be split into smaller, more focused modules?**
  _Cohesion score 0.06050420168067227 - nodes in this community are weakly interconnected._
- **Should `TypeScript App Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._