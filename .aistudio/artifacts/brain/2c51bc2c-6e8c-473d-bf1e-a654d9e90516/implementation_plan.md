# B-Roll Flow Studio Workspace Layout Architecture

A clean, high-density Studio Workspace layout for "B-Roll Flow" with strict spatial separation across three non-overlapping grid zones: a fixed 56px Top Navigation Bar, a 35% Left Panel with tabbed AI Content Strategy & Script Analysis, and a 65% Right Panel vertically divided into a 45% Video Preview Canvas and a 55% 4-Track Timeline Editor with adjustable track density and real-time sync.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following layout and workflow specifications were confirmed during the interactive interview:
> - **Workspace Panel Partitioning**: Responsive 35% / 65% split with smooth collapsible left panel and interactive drag-to-resize divider to accommodate various screen resolutions without layout shifts.
> - **Multi-Track Timeline Density**: Tri-mode density control (Pro High-Density, Spacious with large thumbnails, and Auto-expanding on selection/hover) switchable via timeline header buttons.
> - **AI Script Analysis Synchronization**: Real-time automatic synchronization of detected B-roll clips, SFX cues, and kinetic captions directly into the 4 timeline tracks and video preview canvas.
> - **Project Vault Persistence**: Slide-out drawer with glassmorphism backdrop, preview cards, and Firestore cloud synchronization (`users/{userId}/projects/{projectId}`).

---

## 1. Overview & Core Concept

- **What It Does**: Provides a professional, non-overlapping multi-zone digital audio/video workstation (DAW/NLE) environment designed specifically for viral short-form and high-retention video production.
- **Target Audience / Persona**: Video creators, social media editors, and content strategists who require rapid pacing, audio-visual alignment, and automated B-roll/SFX placement without UI clutter.
- **Key Value**: Guarantees zero UI scrambling or clipping through strict flexbox and grid spatial geometry, uniting AI ideation, script parsing, real-time kinetic caption previews, and multi-track sequence editing in a single coherent viewport.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Content Strategy & Ideation (Tab A)**: The user opens the left panel's AI Strategy tab, triggers quick-action prompts (e.g., *"Brainstorm 3 viral tech hooks"* or *"Draft a finance script with high retention"*), reviews suggestions, and clicks **"Send Script to Studio"**.
2. **Script Ingestion & Analysis (Tab B)**: Script automatically populates Tab B. Clicking **"Run AI Script Analysis"** extracts timestamp segments (`00:00 - 00:03`), editable B-roll visual tags (`#finance-chart`, `#dark-tech`), sound cues (`#whoosh`, `#impact-pop`), and subtitle emphasis keywords.
3. **Real-Time Preview Canvas (Right Top - 45%)**: Centered video player renders aspect ratio presets (`9:16`, `16:9`, `1:1`) with real-time kinetic typography and subtitle overlays, driven by transport controls (Play/Pause, -1s/+1s frame step, timecode `00:00.00 / 00:30.00`, volume, fullscreen).
4. **Multi-Track Timeline Scrubbing (Right Bottom - 55%)**: Users scrub the playhead across Track 1 (Audio Baseline with waveform), Track 2 (B-Roll video thumbnails with drag handles), Track 3 (Kinetic Subtitles), and Track 4 (SFX triggers), switching between Pro High-Density, Spacious, and Auto-Expanding view modes.
5. **Project Persistence & Export**: Persist sequences to the Project Vault drawer and export production-ready timelines to FCPXML, EDL, JSON, or MP4 packages.

### Visual Identity & Theme
- **Aesthetic Direction**: High-density pro workstation dark theme with champagne gold / amber accents (`#C9A063` / `#F59E0B`), deep graphite zinc backgrounds (`#09090B` / `#050505`), and clean hairline dividers (`border-zinc-800`).
- **Color Palette**:
  - Canvas Neutral (60%): Deep obsidian and graphite (`#050505`, `#0C0C0C`, `#121214`).
  - Structural Surfaces (30%): Elevated panels and track headers (`#18181B`, `border-zinc-800/80`).
  - Functional Accent (10%): Champagne amber (`#C9A063`), active cyan indicator (`#38BDF8`), and emerald status green (`#10B981`).
- **Typography & Hierarchy**:
  - Interface Labels: `Plus Jakarta Sans` / `Outfit` (600 semi-bold for headers, 500 medium for controls).
  - Timecodes & Metrics: Monospace tabular numerals (`JetBrains Mono`, `tabular-nums`) to ensure zero-jitter vertical alignment during playback.
- **Component Styling & Layout**:
  - Single-line controls with `whitespace-nowrap shrink-0` across all toolbars.
  - Strict 56px fixed header height (`h-14`) and `h-[calc(100vh-56px)]` main viewport container with zero outer window scrolling.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Strict CSS Grid & Flex Spatial Separation**
  - *Chosen Approach*: Enforce explicit height math (`h-14`, `h-[45%]`, `h-[55%]`) and responsive width split (`w-[35%]`, `w-[65%]`) with overflow-hidden root containers and isolated internal scroll areas.
  - *Why*: Eliminates content clipping, overlapping transport bars, and erratic timeline collapsing on various display densities.
  - *Alternatives Considered*: Floating draggable modals — rejected to prevent UI occlusion and mobile/tablet scrambling.
- **Decision 2: Tri-Mode Timeline Density System**
  - *Chosen Approach*: Dedicated state toggle supporting Pro High-Density (compact 32px tracks), Spacious Studio (56px tracks with large thumbnail cards), and Auto-Expanding (compact default, expanding focused track).
  - *Why*: Satisfies diverse user workflows ranging from fast overview editing to detailed clip inspection.
- **Decision 3: Server-Side Gemini API with Smart Client Fallback**
  - *Chosen Approach*: Stream AI chat strategy responses through `/api/chat` using Gemini Flash, with instantaneous client fallback logic when running in disconnected environments.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Top Navigation Bar (Fixed 56px Height - h-14)                                    │
│ [Breadcrumb: Project / Ratio]  [API Vault: Pexels+Freesound]  [Vault] [Theme] [Export]│
└─────────────────────────────────────────────────────────────────────────────────┘
┌──────────────────────────────────────┬──────────────────────────────────────────┐
│ Left Panel (35% Width)               │ Right Panel (65% Width)                  │
│                                      │                                          │
│ ┌──────────────────────────────────┐ │ ┌──────────────────────────────────────┐ │
│ │ Tab Switcher: [Strategy] [Script]│ │ │ Top Section: Video Preview (45% H)   │ │
│ ├──────────────────────────────────┤ │ │ - Centered Aspect Ratio Box (9:16)   │ │
│ │ Tab A: AI Content Strategy Chat  │ │ │ - HTML5 Video + Kinetic Typography   │ │
│ │  - Quick action prompt pills     │ │ │ - Transport Controls & Timecode Bar  │ │
│ │  - "Send Script to Studio"       │ │ └──────────────────────────────────────┘ │
│ │                                  │ ├──────────────────────────────────────┤ │
│ │ Tab B: Script Ingestion Engine   │ │ Bottom Section: 4-Track Timeline (55% H)│ │
│ │  - Raw text ingestion input      │ │ - Density Mode: [Pro] [Spacious] [Auto]│ │
│ │  - "Run AI Script Analysis"      │ │ - Track 1: Audio Baseline Waveform     │ │
│ │  - Timestamp Segment Cards       │ │ - Track 2: B-Roll Video Thumbnails     │ │
│ │  - Editable B-Roll tags          │ │ - Track 3: Kinetic Subtitle Markers    │ │
│ │  - SFX badges & Emphasis words   │ │ - Track 4: SFX Trigger Badges          │ │
│ └──────────────────────────────────┘ │ - Interactive Scrubbing Playhead       │ │
│                                      │ - Zoom Slider (1x, 2x, 5x)             │ │
│                                      │ └──────────────────────────────────────┘ │
└──────────────────────────────────────┴──────────────────────────────────────────┘
```

### State Store & Interactions
- `activeTab`: `'strategy' | 'script'` toggles left panel views with zero layout shifts.
- `chatMessages`: Conversation history with prompt suggestion chips and one-click transfer to `scriptInput`.
- `timelineDensity`: `'pro' | 'spacious' | 'auto'` dynamically updates track row styles (`h-8`, `h-14`, or dynamic hover/select expansion).
- `playheadSec`: Synchronous transport state driving preview canvas rendering, scrubber line position, and active beat highlights across both left and right panels.
- `analysisResult`: Structured beat markers with editable tags that immediately propagate to timeline tracks.
