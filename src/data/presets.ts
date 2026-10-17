import {
  AestheticPreset,
  BRollClipAsset,
  BrandTone,
  ContentNiche,
  CoreNiche,
  CreatorFormat,
  CreatorWorkflow,
  NicheWorkspaceTemplate,
  OnboardingConfig,
  PacingDensity,
  ScriptBeat,
  TargetPlatform,
} from '../types';

export const GENERATED_IMAGES = {
  watchmaker: '/src/assets/images/broll_cinematic_watchmaker_1792096174273.jpg',
  architecture: '/src/assets/images/broll_architectural_monolith_1792096175650.jpg',
  datacenter: '/src/assets/images/broll_quantum_datacenter_1792096176482.jpg',
  speaker: '/src/assets/images/broll_editorial_studio_speaker_1792096178294.jpg',
  cyberneticSubway: '/src/assets/images/broll_cybernetic_subway_hud_1792172077884.jpg',
};

export const BROLL_LIBRARY: BRollClipAsset[] = [
  {
    id: 'clip-cybernetic-subway',
    title: 'Subway AR HUD & Neural Interface Iris Scan',
    sourceCollection: 'Cybernetic Narrative Lab',
    resolution: '8K Anamorphic',
    fps: 24,
    durationSec: 9.0,
    colorProfile: 'Rec.709 / Cyberpunk Teal-Magenta',
    imageUrl: GENERATED_IMAGES.cyberneticSubway,
    focalKeywords: ['AR Projection', 'Subway Commuters', 'Iris Scan', 'Neural Flow'],
  },
  {
    id: 'clip-watchmaker',
    title: 'Calibre 89 Chronograph Assembly Macro',
    sourceCollection: 'Geneva Horology Archive',
    resolution: '6K RED RAW',
    fps: 60,
    durationSec: 6.4,
    colorProfile: 'Rec.709 / Kodak 2383 Warm',
    imageUrl: GENERATED_IMAGES.watchmaker,
    focalKeywords: ['Precision', 'Craftsmanship', 'Macro Mechanism', 'Time'],
  },
  {
    id: 'clip-datacenter',
    title: 'Obsidian Optical Compute Corridor',
    sourceCollection: 'Zurich Neural Infrastructure',
    resolution: '4K ProRes 422 HQ',
    fps: 24,
    durationSec: 5.8,
    colorProfile: 'ACEScct / Tungsten Rim',
    imageUrl: GENERATED_IMAGES.datacenter,
    focalKeywords: ['AI Compute', 'Fiber Optics', 'Throughput', 'Encryption'],
  },
  {
    id: 'clip-architecture',
    title: 'Alpine Brutalist Concrete Pavilion',
    sourceCollection: 'Monolith Architectural Cinema',
    resolution: '8K Anamorphic 2.39:1',
    fps: 24,
    durationSec: 7.2,
    colorProfile: 'Arri LogC4 / Twilight Slate',
    imageUrl: GENERATED_IMAGES.architecture,
    focalKeywords: ['Scale', 'Solitude', 'Structure', 'Wealth'],
  },
  {
    id: 'clip-speaker',
    title: 'Studio A-Roll Narrative Keyframe',
    sourceCollection: 'Stage 04 Documentary Unit',
    resolution: '4K Cinema DNG',
    fps: 24,
    durationSec: 8.0,
    colorProfile: 'Leica Monochrom Warm',
    imageUrl: GENERATED_IMAGES.speaker,
    focalKeywords: ['Narrator', 'Dialogue', 'Studio Keylight', 'Interview'],
  },
];

export const WORKFLOW_OPTIONS: {
  id: CreatorWorkflow;
  subtitle: string;
  description: string;
  trackLayout: string;
}[] = [
  {
    id: 'Talking-Head / Face-Cam Creator',
    subtitle: 'A-Roll Dialogue + Semantic B-Roll Cutaways',
    description:
      'Preserves primary camera posture on Track V1 while automatically inserting context-matched B-roll cutaways on Track V2 during visual nouns and pacing transitions.',
    trackLayout: 'V1 Primary Camera · V2 Semantic Cutaways · C1 Kinetic Subtitles · A1 Dialogue',
  },
  {
    id: '100% Faceless Automation',
    subtitle: 'Full Visual Storytelling + Neural Voiceover Sync',
    description:
      'Constructs continuous frame-accurate B-roll sequences across Tracks V1 and V2 locked to voiceover transients, acoustic stems, and retention hooks.',
    trackLayout: 'V1 Continuous B-Roll · V2 Optical Overlays · C1 Dynamic Captions · A1 Voice Stem',
  },
];

export const NICHE_OPTIONS: {
  id: ContentNiche;
  kicker: string;
  description: string;
  avgRetentionLift: string;
  sampleSources: string;
}[] = [
  {
    id: 'Tech & AI',
    kicker: 'Silicon, Compute & Frontier Systems',
    description: 'Anamorphic hardware macros, clean server telemetry, and architectural cleanrooms.',
    avgRetentionLift: '+38% 60s Hold',
    sampleSources: '4,200+ 4K Hardware & Lab Stems',
  },
  {
    id: 'Finance & Crypto',
    kicker: 'Institutional Markets & Sovereign Capital',
    description: 'Swiss banking architecture, central reserve vaults, high-frequency ledger visuals.',
    avgRetentionLift: '+41% Avg View Duration',
    sampleSources: '3,850+ Global Market & Macro Clips',
  },
  {
    id: 'True Crime & Mystery',
    kicker: 'Archival Evidence & Atmospheric Noir',
    description: '35mm rain-slicked corridors, microfiche dossier scans, and moody tungsten interiors.',
    avgRetentionLift: '+52% Episode Completion',
    sampleSources: '5,100+ Forensic & Cinema Noir Stems',
  },
  {
    id: 'Motivation & Philosophy',
    kicker: 'Classical Stoicism & High-Craft Mastery',
    description: 'Horology macros, alpine monoliths, sculptural shadows, and contemplative pacing.',
    avgRetentionLift: '+44% Share Velocity',
    sampleSources: '3,400+ Editorial & Fine Art Reels',
  },
  {
    id: 'E-commerce & SaaS',
    kicker: 'Product Tactility & Conversion Velocity',
    description: 'Studio tabletop product sweeps, tactile packaging close-ups, and UI motion cues.',
    avgRetentionLift: '+34% Click-Through Lift',
    sampleSources: '2,950+ Commercial Studio Assets',
  },
];

export const PLATFORM_OPTIONS: {
  id: TargetPlatform;
  ratio: '9:16' | '16:9' | '1:1';
  resolution: string;
  cutCadence: string;
  description: string;
}[] = [
  {
    id: 'TikTok / Reels / Shorts (9:16)',
    ratio: '9:16',
    resolution: '2160 × 3840 Vertical UHD',
    cutCadence: '1.8s – 2.6s Visual Cut Interval',
    description: 'Optimized for vertical mobile retention with center-weighted optical reframing and eye-level caption safe zones.',
  },
  {
    id: 'YouTube Longform (16:9)',
    ratio: '16:9',
    resolution: '3840 × 2160 Widescreen Cinema',
    cutCadence: '4.2s – 7.5s Documentary Rhythm',
    description: 'Widescreen editorial pacing with breathing room for multi-layered sound design, chapter cards, and lower-third typography.',
  },
  {
    id: 'Square Feeds (1:1)',
    ratio: '1:1',
    resolution: '2160 × 2160 Editorial Square',
    cutCadence: '2.8s – 4.0s Feed Cadence',
    description: 'Balanced 1:1 composition engineered for high-contrast desktop and mobile feed carousels with persistent header bars.',
  },
];

export const PRESET_OPTIONS: {
  id: AestheticPreset;
  colorGrade: string;
  captionTypography: string;
  transitionProfile: string;
  accentHex: string;
}[] = [
  {
    id: 'Cinematic Noir',
    colorGrade: 'Kodak 2383 Print Lut · Deep Obsidian Blacks',
    captionTypography: 'Cormorant Garamond Italic · Tracked Lowercase',
    transitionProfile: '24fps L-Cuts & Subtle Film Dissolves',
    accentHex: '#C9A063',
  },
  {
    id: 'Viral Punch',
    colorGrade: 'High-Contrast Crisp · Micro-Sharpened Highlights',
    captionTypography: 'Plus Jakarta Bold · Word-by-Word Kinetic Pop',
    transitionProfile: 'Transient Whip-Pans & J-Cut Snap',
    accentHex: '#EAB308',
  },
  {
    id: 'Minimalist Clean',
    colorGrade: 'Alabaster Neutral · Zero Halation',
    captionTypography: 'Geist Medium · Swiss Grid Lower Thirds',
    transitionProfile: 'Precision Hard Cuts on Beat Transients',
    accentHex: '#38BDF8',
  },
  {
    id: 'Retro Archive',
    colorGrade: '16mm Ektachrome Warmth · Gate Weave',
    captionTypography: 'IBM Plex Mono · Timecode Stamped Captions',
    transitionProfile: 'Flash-Frame & Analog Splices',
    accentHex: '#F97316',
  },
];

export const NICHE_WORKSPACE_TEMPLATES: Record<ContentNiche, NicheWorkspaceTemplate> = {
  'Tech & AI': {
    niche: 'Tech & AI',
    projectTitle: 'EP_042_DETERMINISTIC_COMPUTE_HORIZON',
    tags: ['Sub-Millisecond Inference', 'Optical Interconnects', 'Sovereign Silicon', 'Anamorphic Macro'],
    bpm: 118,
    lutName: 'Zurich_Obsidian_LogC4.cube',
    scriptBeats: [
      {
        id: 'beat-1',
        timecodeStart: '00:00:00:00',
        timecodeEnd: '00:00:04:12',
        startSec: 0,
        durationSec: 4.5,
        speakerLine: 'Every frontier model bottleneck traces back to a single physical constraint: moving photons across copper interconnects.',
        semanticIntent: 'Hardware bottleneck & optical fiber density',
        matchedClipId: 'clip-datacenter',
        confidenceScore: 98.4,
        captionStyle: 'Kinetic Monospace Highlight',
      },
      {
        id: 'beat-2',
        timecodeStart: '00:00:04:12',
        timecodeEnd: '00:00:09:06',
        startSec: 4.5,
        durationSec: 4.75,
        speakerLine: 'Like a master horologist calibrating a tourbillon cage, next-generation wafer scale engines synchronize trillions of clock cycles.',
        semanticIntent: 'Mechanical precision analogy & micro-calibration',
        matchedClipId: 'clip-watchmaker',
        confidenceScore: 96.9,
        captionStyle: 'Editorial Serif Pull-Quote',
      },
      {
        id: 'beat-3',
        timecodeStart: '00:00:09:06',
        timecodeEnd: '00:00:14:18',
        startSec: 9.25,
        durationSec: 5.5,
        speakerLine: 'Inside isolated alpine compute sanctuaries, hydro-cooled clusters operate in complete acoustic silence.',
        semanticIntent: 'Isolated brutalist facility & scale',
        matchedClipId: 'clip-architecture',
        confidenceScore: 95.2,
        captionStyle: 'Location Stamp + Lower Third',
      },
      {
        id: 'beat-4',
        timecodeStart: '00:00:14:18',
        timecodeEnd: '00:00:20:00',
        startSec: 14.75,
        durationSec: 5.25,
        speakerLine: 'Here is how deterministic compilation cuts inference latency by seventy-eight percent without sacrificing precision.',
        semanticIntent: 'Direct narrator thesis & studio breakdown',
        matchedClipId: 'clip-speaker',
        confidenceScore: 99.1,
        captionStyle: 'A-Roll Keyframe Lock',
      },
    ],
  },
  'Finance & Crypto': {
    niche: 'Finance & Crypto',
    projectTitle: 'EP_109_SOVEREIGN_LIQUIDITY_ARCHITECTURE',
    tags: ['Basel IV Reserves', 'Zero-Knowledge Settlement', 'Swiss Custody', 'Institutional Flow'],
    bpm: 112,
    lutName: 'Geneva_Bullion_2383.cube',
    scriptBeats: [
      {
        id: 'beat-1',
        timecodeStart: '00:00:00:00',
        timecodeEnd: '00:00:04:18',
        startSec: 0,
        durationSec: 4.75,
        speakerLine: 'When sovereign wealth desks rebalance forty billion in overnight liquidity, they do not use retail order books.',
        semanticIntent: 'Monolithic institutional fortress & capital scale',
        matchedClipId: 'clip-architecture',
        confidenceScore: 97.8,
        captionStyle: 'Editorial Serif Pull-Quote',
      },
      {
        id: 'beat-2',
        timecodeStart: '00:00:04:18',
        timecodeEnd: '00:00:09:12',
        startSec: 4.75,
        durationSec: 4.75,
        speakerLine: 'Settlement engines verify cryptographic proofs across private dark-fiber corridors in under fourhundred microseconds.',
        semanticIntent: 'Encrypted fiber corridors & institutional ledger',
        matchedClipId: 'clip-datacenter',
        confidenceScore: 98.6,
        captionStyle: 'Kinetic Monospace Highlight',
      },
      {
        id: 'beat-3',
        timecodeStart: '00:00:09:12',
        timecodeEnd: '00:00:14:18',
        startSec: 9.5,
        durationSec: 5.25,
        speakerLine: 'Every basis point of yield is engineered with the mechanical tolerance of a Geneva perpetual calendar.',
        semanticIntent: 'Swiss watchmaking precision & compounding',
        matchedClipId: 'clip-watchmaker',
        confidenceScore: 96.4,
        captionStyle: 'Macro Callout Overlay',
      },
      {
        id: 'beat-4',
        timecodeStart: '00:00:14:18',
        timecodeEnd: '00:00:20:00',
        startSec: 14.75,
        durationSec: 5.25,
        speakerLine: 'Let us examine the three balance-sheet signals that precede every major liquidity expansion.',
        semanticIntent: 'Narrator commentary & chart transition',
        matchedClipId: 'clip-speaker',
        confidenceScore: 98.9,
        captionStyle: 'A-Roll Keyframe Lock',
      },
    ],
  },
  'True Crime & Mystery': {
    niche: 'True Crime & Mystery',
    projectTitle: 'CASE_FILE_019_THE_ZURICH_VAULT_DISAPPEARANCE',
    tags: ['Archival Dossier', 'Forensic Timeline', 'Cold Case Reconstruction', '35mm Noir'],
    bpm: 94,
    lutName: 'Noir_Tungsten_35mm.cube',
    scriptBeats: [
      {
        id: 'beat-1',
        timecodeStart: '00:00:00:00',
        timecodeEnd: '00:00:05:00',
        startSec: 0,
        durationSec: 5.0,
        speakerLine: 'At 03:14 CET on November 12th, the bespoke chronograph left on the director’s desk stopped at the exact second the vault sealed.',
        semanticIntent: 'Forensic macro of mechanical watch movement',
        matchedClipId: 'clip-watchmaker',
        confidenceScore: 99.2,
        captionStyle: 'Timecode Evidence Stamp',
      },
      {
        id: 'beat-2',
        timecodeStart: '00:00:05:00',
        timecodeEnd: '00:00:10:06',
        startSec: 5.0,
        durationSec: 5.25,
        speakerLine: 'High in the Graubünden pass, the concrete archive building showed zero forced entry on any exterior perimeter sensor.',
        semanticIntent: 'Isolated alpine concrete structure at twilight',
        matchedClipId: 'clip-architecture',
        confidenceScore: 97.5,
        captionStyle: 'Location Stamp + Lower Third',
      },
      {
        id: 'beat-3',
        timecodeStart: '00:00:10:06',
        timecodeEnd: '00:00:15:00',
        startSec: 10.25,
        durationSec: 4.75,
        speakerLine: 'Yet inside the air-gapped server annex, a single optical patch cable had been manually rerouted for ninety seconds.',
        semanticIntent: 'Dark server corridor & optical cable inspection',
        matchedClipId: 'clip-datacenter',
        confidenceScore: 98.1,
        captionStyle: 'Kinetic Monospace Highlight',
      },
      {
        id: 'beat-4',
        timecodeStart: '00:00:15:00',
        timecodeEnd: '00:00:20:00',
        startSec: 15.0,
        durationSec: 5.0,
        speakerLine: 'For twelve years, investigators overlooked the one acoustic anomaly recorded on the studio transcription tape.',
        semanticIntent: 'Investigative narrator in darkened studio',
        matchedClipId: 'clip-speaker',
        confidenceScore: 98.7,
        captionStyle: 'A-Roll Keyframe Lock',
      },
    ],
  },
  'Motivation & Philosophy': {
    niche: 'Motivation & Philosophy',
    projectTitle: 'ESSAY_008_THE_ARCHITECTURE_OF_STILLNESS',
    tags: ['Deep Work Mastery', 'Stoic Discipline', 'Craftsmanship', 'Editorial Essay'],
    bpm: 88,
    lutName: 'Alabaster_Film_Print.cube',
    scriptBeats: [
      {
        id: 'beat-1',
        timecodeStart: '00:00:00:00',
        timecodeEnd: '00:00:05:06',
        startSec: 0,
        durationSec: 5.25,
        speakerLine: 'Mastery is never loud. It happens in the quiet resistance of three hundred microscopic components aligned by hand.',
        semanticIntent: 'Artisan watchmaker assembling delicate gears',
        matchedClipId: 'clip-watchmaker',
        confidenceScore: 99.4,
        captionStyle: 'Editorial Serif Pull-Quote',
      },
      {
        id: 'beat-2',
        timecodeStart: '00:00:05:06',
        timecodeEnd: '00:00:10:12',
        startSec: 5.25,
        durationSec: 5.25,
        speakerLine: 'When you strip away every ornamental distraction, what remains has the permanence of raw stone against an alpine sky.',
        semanticIntent: 'Minimalist concrete pavilion & still reflection pool',
        matchedClipId: 'clip-architecture',
        confidenceScore: 98.8,
        captionStyle: 'Location Stamp + Lower Third',
      },
      {
        id: 'beat-3',
        timecodeStart: '00:00:10:12',
        timecodeEnd: '00:00:15:06',
        startSec: 10.5,
        durationSec: 4.75,
        speakerLine: 'Even in an era of infinite digital velocity, signal requires deliberate constraint and structured channels.',
        semanticIntent: 'Ordered optical pathways in dark corridor',
        matchedClipId: 'clip-datacenter',
        confidenceScore: 94.9,
        captionStyle: 'Kinetic Monospace Highlight',
      },
      {
        id: 'beat-4',
        timecodeStart: '00:00:15:06',
        timecodeEnd: '00:00:20:00',
        startSec: 15.25,
        durationSec: 4.75,
        speakerLine: 'Protect the first ninety minutes of your morning as if your entire body of work depends upon it.',
        semanticIntent: 'Direct philosophical reflection in studio',
        matchedClipId: 'clip-speaker',
        confidenceScore: 99.0,
        captionStyle: 'A-Roll Keyframe Lock',
      },
    ],
  },
  'E-commerce & SaaS': {
    niche: 'E-commerce & SaaS',
    projectTitle: 'LAUNCH_FILM_PRECISION_WORKFLOW_V4',
    tags: ['Product Launch', 'High-Ticket Conversion', 'Founder Narrative', 'Brand Positioning'],
    bpm: 122,
    lutName: 'Commercial_Studio_Rec709.cube',
    scriptBeats: [
      {
        id: 'beat-1',
        timecodeStart: '00:00:00:00',
        timecodeEnd: '00:00:04:12',
        startSec: 0,
        durationSec: 4.5,
        speakerLine: 'Luxury buyers decide within three seconds whether your product belongs in an heirloom category or a commodity feed.',
        semanticIntent: 'Tactile luxury watchmaking macro',
        matchedClipId: 'clip-watchmaker',
        confidenceScore: 98.5,
        captionStyle: 'Editorial Serif Pull-Quote',
      },
      {
        id: 'beat-2',
        timecodeStart: '00:00:04:12',
        timecodeEnd: '00:00:09:12',
        startSec: 4.5,
        durationSec: 5.0,
        speakerLine: 'Behind every seamless customer checkout sits an enterprise pipeline processing thousands of real-time inventory events.',
        semanticIntent: 'Enterprise server infrastructure & speed',
        matchedClipId: 'clip-datacenter',
        confidenceScore: 97.2,
        captionStyle: 'Kinetic Monospace Highlight',
      },
      {
        id: 'beat-3',
        timecodeStart: '00:00:09:12',
        timecodeEnd: '00:00:14:18',
        startSec: 9.5,
        durationSec: 5.25,
        speakerLine: 'Category leaders design their digital flagship with the architectural clarity of a private gallery.',
        semanticIntent: 'Gallery architecture & illuminated showcase',
        matchedClipId: 'clip-architecture',
        confidenceScore: 96.8,
        captionStyle: 'Location Stamp + Lower Third',
      },
      {
        id: 'beat-4',
        timecodeStart: '00:00:14:18',
        timecodeEnd: '00:00:20:00',
        startSec: 14.75,
        durationSec: 5.25,
        speakerLine: 'Walk through our live creative pipeline to see how teams ship twelve campaign variations every single week.',
        semanticIntent: 'Founder studio walkthrough & CTA',
        matchedClipId: 'clip-speaker',
        confidenceScore: 99.3,
        captionStyle: 'A-Roll Keyframe Lock',
      },
    ],
  },
};

export const SFX_LIBRARY = [
  {
    id: 'sfx-whoosh-01',
    name: 'Anamorphic Cinema Whoosh',
    category: 'whoosh' as const,
    durationSec: 0.8,
    tags: ['#Whoosh', '#4K', '#Fast-Transition'],
  },
  {
    id: 'sfx-whoosh-02',
    name: 'Sub-Bass Atmospheric Air Pass',
    category: 'whoosh' as const,
    durationSec: 1.2,
    tags: ['#Whoosh', '#Minimal', '#Drone'],
  },
  {
    id: 'sfx-impact-01',
    name: 'Cinematic Sub-Bass Braam Impact',
    category: 'impact' as const,
    durationSec: 1.5,
    tags: ['#Impact', '#4K', '#Heavy-Drop'],
  },
  {
    id: 'sfx-impact-02',
    name: 'Precision Titanium Latch Thud',
    category: 'impact' as const,
    durationSec: 0.9,
    tags: ['#Impact', '#Minimal', '#Mechanical'],
  },
  {
    id: 'sfx-glitch-01',
    name: 'Neural Hologram Pulse Glitch',
    category: 'glitch' as const,
    durationSec: 0.6,
    tags: ['#Glitch-SFX', '#Cyberpunk', '#Fast'],
  },
  {
    id: 'sfx-glitch-02',
    name: 'Anamorphic Tape Head Static',
    category: 'glitch' as const,
    durationSec: 0.45,
    tags: ['#Glitch-SFX', '#Minimal', '#Analog'],
  },
  {
    id: 'sfx-riser-01',
    name: 'Tension String & Sub Riser',
    category: 'riser' as const,
    durationSec: 2.2,
    tags: ['#Drone', '#4K', '#Build-Up'],
  },
  {
    id: 'sfx-minimal-01',
    name: 'Swiss Studio Timecode Beep',
    category: 'minimal' as const,
    durationSec: 0.35,
    tags: ['#Minimal', '#Clean', '#UI-Click'],
  },
];

export const STOCK_VIDEO_LIBRARY = [
  {
    id: 'stock-subway-hud',
    title: 'Cybernetic Subway AR HUD & Commuter Motion Blur',
    sourceProvider: 'Pexels Cinema 8K Stream',
    resolution: '4K UHD',
    durationSec: 9.0,
    tags: ['#4K', '#Minimal', '#Glitch-SFX', '#Cyberpunk'],
    imageUrl: GENERATED_IMAGES.cyberneticSubway,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    aspect: '16:9',
  },
  {
    id: 'stock-watchmaker-macro',
    title: 'Master Horologist Micro Chronograph Assembly',
    sourceProvider: 'Geneva Studio 6K RAW',
    resolution: '4K UHD',
    durationSec: 6.4,
    tags: ['#4K', '#Minimal', '#Macro', '#Precision'],
    imageUrl: GENERATED_IMAGES.watchmaker,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    aspect: '16:9',
  },
  {
    id: 'stock-alpine-monolith',
    title: 'Swiss Brutalist Alpine Pavilion & Twilight Mist',
    sourceProvider: 'High-Altitude Aerial Unit',
    resolution: '4K UHD',
    durationSec: 7.2,
    tags: ['#Drone', '#4K', '#Minimal', '#Architecture'],
    imageUrl: GENERATED_IMAGES.architecture,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    aspect: '16:9',
  },
  {
    id: 'stock-quantum-datacenter',
    title: 'Obsidian Fiber Array & Quantum Server Corridor',
    sourceProvider: 'Zurich Tech Archive',
    resolution: '1080p',
    durationSec: 5.8,
    tags: ['#Minimal', '#4K', '#Glitch-SFX', '#Hardware'],
    imageUrl: GENERATED_IMAGES.datacenter,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    aspect: '16:9',
  },
  {
    id: 'stock-narrator-speaker',
    title: 'Studio A-Roll Dialogue Stage & Keylight Reflection',
    sourceProvider: 'Stage 04 Documentary Unit',
    resolution: '1080p',
    durationSec: 8.0,
    tags: ['#Minimal', '#Documentary', '#Interview'],
    imageUrl: GENERATED_IMAGES.speaker,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    aspect: '16:9',
  },
];

export function analyzeScriptWithAI(scriptText: string, niche: ContentNiche) {
  const lines = scriptText
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const fallbackLines = lines.length > 0 ? lines : [
    'Every frontier model bottleneck traces back to a single physical constraint: moving photons across copper interconnects.',
    'Like a master horologist calibrating a tourbillon cage, next-generation wafer scale engines synchronize trillions of clock cycles.',
    'Inside isolated alpine compute sanctuaries, hydro-cooled clusters operate in complete acoustic silence.',
    'Here is how deterministic compilation cuts inference latency by seventy-eight percent without sacrificing precision.'
  ];

  let currentTime = 0;
  const cards = fallbackLines.map((line, idx) => {
    const duration = Math.max(3.5, Math.min(7.5, Number((line.split(' ').length * 0.38).toFixed(1))));
    const start = currentTime;
    const end = Number((currentTime + duration).toFixed(1));
    currentTime = end;

    const startSecFormatted = `${Math.floor(start / 60).toString().padStart(2, '0')}:${Math.floor(start % 60).toString().padStart(2, '0')}`;
    const endSecFormatted = `${Math.floor(end / 60).toString().padStart(2, '0')}:${Math.floor(end % 60).toString().padStart(2, '0')}`;

    // Contextual tag extraction
    const lower = line.toLowerCase();
    const tags: string[] = [];
    if (lower.includes('photon') || lower.includes('silicon') || lower.includes('compute') || lower.includes('model') || lower.includes('ai')) {
      tags.push('#tech-hardware', '#optical-fiber');
    }
    if (lower.includes('horolog') || lower.includes('tourbillon') || lower.includes('clock') || lower.includes('precision') || lower.includes('watch')) {
      tags.push('#cinematic-close-up', '#macro-mechanism');
    }
    if (lower.includes('alpine') || lower.includes('stone') || lower.includes('sanctuary') || lower.includes('architecture') || lower.includes('quiet')) {
      tags.push('#brutalist-drone', '#alpine-mist');
    }
    if (lower.includes('latency') || lower.includes('percent') || lower.includes('compil') || lower.includes('speed') || lower.includes('market')) {
      tags.push('#finance-market', '#dynamic-split');
    }
    if (tags.length === 0) {
      tags.push('#cinematic-close-up', '#editorial-b-roll');
    }

    const sfxTriggers = ['#whoosh', '#impact', '#glitch', '#sub-bass', '#minimal-ping'];
    const sfxTrigger = sfxTriggers[idx % sfxTriggers.length];

    const voiceProfiles = [
      'Deep Resonant Baritone (BBC Documentary)',
      'Crisp Analytical Studio (Silicon Valley Lead)',
      'Intense & Forensic Whisper (True Crime Noir)',
      'Calm Stoic Philosopher (Geneva Atelier)'
    ];

    const words = line.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, '').split(/\s+/);
    const stopWords = new Set(['the', 'and', 'a', 'to', 'of', 'in', 'is', 'it', 'you', 'that', 'this', 'for', 'on', 'with', 'as', 'are', 'was', 'by', 'at', 'from']);
    const candidateWords = words.filter((w) => w.length > 4 && !stopWords.has(w.toLowerCase()));
    const emphasisWords = candidateWords.slice(0, 3).map((w) => w.toUpperCase());

    return {
      id: `beat-analyzed-${idx + 1}`,
      timecode: `${startSecFormatted} - ${endSecFormatted}`,
      text: line,
      startSec: start,
      durationSec: duration,
      visualTags: tags,
      sfxTrigger,
      toneProfile: idx === 0 ? 'Urgent & Visionary' : idx === 1 ? 'Technical Precision' : idx === 2 ? 'Contemplative Solitude' : 'Decisive Strategic Call',
      voiceStyle: voiceProfiles[idx % voiceProfiles.length],
      emphasisWords: emphasisWords.length > 0 ? emphasisWords : ['KEYWORD', 'TRANSITION'],
    };
  });

  return {
    overallTone: niche === 'Tech & AI' ? 'Visionary & Technical' : niche === 'Finance & Crypto' ? 'Institutional & Analytical' : niche === 'True Crime & Mystery' ? 'Forensic & Atmospheric' : niche === 'Motivation & Philosophy' ? 'Stoic & Contemplative' : 'High-Velocity Conversion',
    voiceProfile: 'Swiss Precision Studio (48kHz 24-bit Flac)',
    pacingBpm: niche === 'Tech & AI' ? 118 : niche === 'Finance & Crypto' ? 112 : 94,
    dominantVisualKeywords: ['#cinematic-close-up', '#4K-macro', '#drone-sweep', '#glitch-overlay'],
    detectedSfxTriggers: ['#whoosh', '#impact', '#sub-bass', '#riser'],
    timestampCards: cards,
  };
}

// =============================================================================
// DEEP-PERSONALIZATION 5-STEP ONBOARDING ENGINE CONSTANTS
// =============================================================================

export interface CreatorFormatOption {
  id: CreatorFormat;
  title: string;
  badge: string;
  detail: string;
  trackScheme: string;
}

export const CREATOR_FORMAT_5STEP: CreatorFormatOption[] = [
  {
    id: 'Talking Head / Face-Cam Creator',
    title: 'Talking Head / Face-Cam Creator',
    badge: 'A-Roll + Auto Cutaways',
    detail: 'Main camera preserved on Track V1 while AI detects narrative punchlines and drops semantic 4K B-roll on Track V2.',
    trackScheme: 'Track 1: Camera · Track 2: B-Roll Cutaways · Track 3: Captions · Track 4: SFX',
  },
  {
    id: '100% Faceless Automation Channel',
    title: '100% Faceless Automation Channel',
    badge: 'Voiceover + Full Visual Canvas',
    detail: 'Frame-accurate visual storytelling across V1 and V2 with dense B-roll transitions synced to voiceover transients.',
    trackScheme: 'Track 1: Voiceover · Track 2: Continuous 4K B-Roll · Track 3: Kinetic Captions · Track 4: Stems',
  },
  {
    id: 'Agency / Multi-Client Team',
    title: 'Agency / Multi-Client Team',
    badge: 'Multi-Brand & Team Seats',
    detail: 'Multiplayer editing seats with client-specific brand locks, custom LUT catalogs, and batch aspect ratio export pipelines.',
    trackScheme: 'Multiplayer Cursors · Brand Stems · Multi-Ratio Sync · Team Workspaces',
  },
];

export interface CoreNicheCard {
  id: CoreNiche;
  title: string;
  kicker: string;
  defaultTags: string[];
  description: string;
}

export const CORE_NICHE_5STEP: CoreNicheCard[] = [
  {
    id: 'Tech & AI News',
    title: 'Tech & AI News',
    kicker: 'Compute, Silicon & Neural Models',
    defaultTags: ['#ai', '#silicon', '#gpu-cluster', '#hardware', '#compute'],
    description: 'Anamorphic datacenter corridors, cleanroom macro photography, and optical fiber arrays.',
  },
  {
    id: 'Personal Finance & Trading',
    title: 'Personal Finance & Trading',
    kicker: 'Institutional Liquidity & Macro Trends',
    defaultTags: ['#macro', '#liquidity', '#treasuries', '#crypto', '#central-bank'],
    description: 'Swiss vault architecture, high-frequency terminal flows, and sovereign wealth visuals.',
  },
  {
    id: 'Documentary & History',
    title: 'Documentary & History',
    kicker: 'Archival Investigation & Cultural Milestones',
    defaultTags: ['#timeline', '#dossier', '#investigation', '#cinema-noir', '#35mm'],
    description: 'Moody 35mm grain, brutalist alpine monoliths, and tactile investigative dossiers.',
  },
  {
    id: 'Self-Improvement & Philosophy',
    title: 'Self-Improvement & Philosophy',
    kicker: 'Stoic High-Craft & Mental Models',
    defaultTags: ['#stoicism', '#discipline', '#craftsmanship', '#focus', '#habits'],
    description: 'Handcrafted horology movements, quiet alpine sanctuaries, and contemplative framing.',
  },
  {
    id: 'E-commerce & SaaS Demos',
    title: 'E-commerce & SaaS Demos',
    kicker: 'Conversion Velocity & Product Tactility',
    defaultTags: ['#saas', '#onboarding', '#conversion', '#product-tour', '#metrics'],
    description: 'Modern studio tabletop sweeps, tactile hardware, and clean software interactions.',
  },
];

export interface TargetPlatform5Step {
  id: TargetPlatform;
  title: string;
  ratio: '9:16' | '16:9' | '1:1';
  spec: string;
  description: string;
}

export const TARGET_PLATFORM_5STEP: TargetPlatform5Step[] = [
  {
    id: 'TikTok / Reels / Shorts (9:16 Vertical)',
    title: 'TikTok / Reels / Shorts (9:16 Vertical)',
    ratio: '9:16',
    spec: '2160 × 3840 UHD · Eye-Level Safe Zones',
    description: 'Vertical viewport framing with center-weighted typography and mobile thumbnail contrast.',
  },
  {
    id: 'YouTube Longform (16:9 Widescreen)',
    title: 'YouTube Longform (16:9 Widescreen)',
    ratio: '16:9',
    spec: '3840 × 2160 Cinema · 2.39:1 Letterbox Ready',
    description: 'Cinematic widescreen canvas with ample breathing room for complex multi-layered sound design.',
  },
  {
    id: 'Square Feeds (1:1)',
    title: 'Square Feeds (1:1)',
    ratio: '1:1',
    spec: '2160 × 2160 Square · Persistent Header Area',
    description: 'Universal 1:1 square canvas engineered for desktop and mobile LinkedIn & Instagram carousel cards.',
  },
];

export interface PacingDensityOption {
  id: PacingDensity;
  title: string;
  cutInterval: string;
  badge: string;
  description: string;
  bpm: number;
}

export const PACING_DENSITY_5STEP: PacingDensityOption[] = [
  {
    id: 'Viral Fast-Paced',
    title: 'Viral Fast-Paced',
    cutInterval: '1.5s – 2.0s Visual Cuts',
    badge: 'Maximum Retention Velocity',
    description: 'B-roll cuts every 1.5 seconds, punchy impact braams, whoosh transitions, and bold jumping captions.',
    bpm: 138,
  },
  {
    id: 'Cinematic Documentary',
    title: 'Cinematic Documentary',
    cutInterval: '3.5s – 5.0s Editorial Cadence',
    badge: 'Artful Narrative Prestige',
    description: 'Slower 3–5s cuts, subtle paper rustles & tension risers, with elegant Cormorant Garamond subtitles.',
    bpm: 92,
  },
  {
    id: 'Minimalist Explainer',
    title: 'Minimalist Explainer',
    cutInterval: '2.5s – 3.5s Balanced Cuts',
    badge: 'Educational Clarity',
    description: 'Smooth subtle transitions, minimal mechanical clicks, and high-contrast Swiss sans-serif typography.',
    bpm: 112,
  },
];

export interface BrandToneOption {
  id: BrandTone;
  title: string;
  vibe: string;
  badgeColor: string;
  sampleVoice: string;
}

export const BRAND_TONE_5STEP: BrandToneOption[] = [
  {
    id: 'Authoritative & Crisp',
    title: 'Authoritative & Crisp',
    vibe: 'Analytical, institutional authority with zero filler words.',
    badgeColor: '#38BDF8',
    sampleVoice: 'Silicon Valley Principal Scientist (Studio Condenser)',
  },
  {
    id: 'Energetic & Hype',
    title: 'Energetic & Hype',
    vibe: 'High-velocity, contagious conviction with punchy emphasis.',
    badgeColor: '#FACC15',
    sampleVoice: 'Viral Growth Engineer (Broadcast Shure SM7B)',
  },
  {
    id: 'Calm Narrative',
    title: 'Calm Narrative',
    vibe: 'Contemplative, stoic pacing with warm acoustic intimacy.',
    badgeColor: '#C9A063',
    sampleVoice: 'Master Horologist / BBC Documentary Baritone',
  },
  {
    id: 'Humorous & Punchy',
    title: 'Humorous & Punchy',
    vibe: 'Self-aware, witty, and razor-sharp delivery with comedic timing.',
    badgeColor: '#EC4899',
    sampleVoice: 'Digital Culture Essayist (Dynamic Podcaster)',
  },
];

/**
 * Generates tailored workspace template adapting beats, cut durations, and SFX density
 */
export function generatePersonalizedTemplate(config: OnboardingConfig): NicheWorkspaceTemplate {
  const isViral = config.pacingDensity === 'Viral Fast-Paced';
  const isDoc = config.pacingDensity === 'Cinematic Documentary';
  const isExplainer = config.pacingDensity === 'Minimalist Explainer';

  const nicheTitle = config.coreNiche || (config.niche as string);
  const tone = config.brandTone || 'Authoritative & Crisp';
  const tags = config.microTags && config.microTags.length > 0
    ? config.microTags
    : ['#ai', '#compute', '#mastery', '#cinema'];

  // Tailor beats duration based on pacing density
  const beatDuration = isViral ? 2.5 : isDoc ? 5.5 : 3.8;
  const bpm = isViral ? 138 : isDoc ? 92 : 112;

  let scriptLines: string[] = [];
  if (nicheTitle.includes('Tech')) {
    scriptLines = isViral
      ? [
          'Stop scrolling. AI inference speed just hit a brand-new quantum threshold.',
          'Moving photons across silicon at 1.5 nanoseconds changes everything you build.',
          'Inside this dark corridor, thousands of optical fibers run full throughput.',
          'Here is the exact hardware benchmark nobody is talking about yet.',
        ]
      : isDoc
      ? [
          'Every historic technological revolution has hinged on moving energy through space with greater precision.',
          'Inside the silent, hydro-cooled sanctuaries of modern Europe, optical compute corridors operate without friction.',
          'When you calibrate a system to nanosecond tolerances, computational latency dissolves into pure signal.',
          'The question is no longer what models can compute, but how fast sovereign networks can distribute insight.',
        ]
      : [
          'Today we are breaking down why optical compute architecture is replacing traditional copper interconnects.',
          'By routing light directly through microscopic silicon pathways, power consumption drops sixty percent.',
          'Notice how structured data flows seamlessly through these dark fiber channels.',
          'In the next section, we examine the deployment timeline for production models.',
        ];
  } else if (nicheTitle.includes('Finance') || nicheTitle.includes('Trading')) {
    scriptLines = isViral
      ? [
          'Central banks just shifted thirty billion in overnight liquidity.',
          'When treasury yields invert, high-frequency desks execute in sub-milliseconds.',
          'Look at this private vault: physical collateral still anchors the digital ledger.',
          'Here is the macro indicator that predicted every rebalance this decade.',
        ]
      : [
          'Institutional wealth rarely moves in panic; it reallocates across quiet, pre-determined corridors.',
          'Behind the brushed steel doors of Zurich reserve vaults, physical permanence meets cryptographic liquidity.',
          'Precision in asset management is like the escapement wheel of a high-complication chronograph.',
          'Those who understand structural market depth see opportunity where retail traders see noise.',
        ];
  } else if (nicheTitle.includes('Documentary') || nicheTitle.includes('Crime')) {
    scriptLines = [
      'In the winter of nineteen eighty-nine, an uncatalogued document surfaced in an alpine archives.',
      'Constructed from reinforced concrete and mountain slate, this pavilion hid a quiet sovereign operation.',
      'Every wiretap and encrypted transmission was recorded on reel-to-reel magnetic tape.',
      'Thirty-five years later, the declassified timeline reveals an entirely different sequence of events.',
    ];
  } else if (nicheTitle.includes('Philosophy') || nicheTitle.includes('Self')) {
    scriptLines = isViral
      ? [
          'Ninety percent of mental fatigue comes from context switching, not hard work.',
          'Mastery is built through ruthless elimination of everything non-essential.',
          'Look at how this watchmaker works: three hours of unbroken, focused silence.',
          'Start protecting your morning hours before the world takes them from you.',
        ]
      : [
          'True discipline is never loud or performative; it lives in the deliberate alignment of repetitive craft.',
          'When you strip away superficial ornamentation, what remains possesses the timeless weight of alpine stone.',
          'The master watchmaker does not rush the balance spring; he respects the physics of friction and time.',
          'Design your daily routine with architectural intention, and let velocity take care of itself.',
        ];
  } else {
    // E-commerce & SaaS
    scriptLines = [
      'High-tier customers decide within two seconds whether your brand is an heirloom or a commodity.',
      'Behind every seamless checkout experience is an autonomous pipeline processing inventory events.',
      'We designed this interface with the spatial restraint and clarity of a contemporary art pavilion.',
      'Here is how deterministic onboarding increases day-thirty retention by forty-four percent.',
    ];
  }

  let currentTime = 0;
  const scriptBeats: ScriptBeat[] = scriptLines.map((line, idx) => {
    const dur = beatDuration;
    const start = currentTime;
    const end = Number((currentTime + dur).toFixed(1));
    currentTime = end;

    const startMin = Math.floor(start / 60).toString().padStart(2, '0');
    const startSec = Math.floor(start % 60).toString().padStart(2, '0');
    const endMin = Math.floor(end / 60).toString().padStart(2, '0');
    const endSec = Math.floor(end % 60).toString().padStart(2, '0');

    const clip = BROLL_LIBRARY[idx % BROLL_LIBRARY.length];

    return {
      id: `p-beat-${idx + 1}`,
      timecodeStart: `00:${startMin}:${startSec}`,
      timecodeEnd: `00:${endMin}:${endSec}`,
      startSec: start,
      durationSec: dur,
      speakerLine: line,
      semanticIntent: `${tags[idx % tags.length]} contextual visual`,
      matchedClipId: clip.id,
      confidenceScore: 97.5 + (idx % 3),
      captionStyle: isViral
        ? 'Viral Punch · Highlight Pop'
        : isDoc
        ? 'Cormorant Garamond Serif'
        : 'Swiss Sans Clean',
    };
  });

  return {
    niche: (nicheTitle.includes('Tech')
      ? 'Tech & AI'
      : nicheTitle.includes('Finance')
      ? 'Finance & Crypto'
      : nicheTitle.includes('Documentary')
      ? 'True Crime & Mystery'
      : nicheTitle.includes('Philosophy')
      ? 'Motivation & Philosophy'
      : 'E-commerce & SaaS') as ContentNiche,
    projectTitle: `${nicheTitle.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_${isViral ? 'VIRAL' : isDoc ? 'CINEMA' : 'EXPLAINER'}_V1`,
    tags,
    bpm,
    lutName: isViral ? 'Rec709_CrispPunch.cube' : isDoc ? 'Kodak2383_ObsidianNoir.cube' : 'SwissClean_Neutral.cube',
    scriptBeats,
  };
}


