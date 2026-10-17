export type ThemeMode = 'dark' | 'light';

export type CreatorWorkflow =
  | 'Talking-Head / Face-Cam Creator'
  | '100% Faceless Automation';

export type CreatorFormat =
  | 'Talking Head / Face-Cam Creator'
  | '100% Faceless Automation Channel'
  | 'Agency / Multi-Client Team';

export type ContentNiche =
  | 'Tech & AI'
  | 'Finance & Crypto'
  | 'True Crime & Mystery'
  | 'Motivation & Philosophy'
  | 'E-commerce & SaaS';

export type CoreNiche =
  | 'Tech & AI News'
  | 'Personal Finance & Trading'
  | 'Documentary & History'
  | 'Self-Improvement & Philosophy'
  | 'E-commerce & SaaS Demos';

export type TargetPlatform =
  | 'TikTok / Reels / Shorts (9:16)'
  | 'YouTube Longform (16:9)'
  | 'Square Feeds (1:1)'
  | 'TikTok / Reels / Shorts (9:16 Vertical)'
  | 'YouTube Longform (16:9 Widescreen)';

export type PacingDensity =
  | 'Viral Fast-Paced'
  | 'Cinematic Documentary'
  | 'Minimalist Explainer';

export type BrandTone =
  | 'Authoritative & Crisp'
  | 'Energetic & Hype'
  | 'Calm Narrative'
  | 'Humorous & Punchy';

export type AestheticPreset =
  | 'Cinematic Noir'
  | 'Viral Punch'
  | 'Minimalist Clean'
  | 'Retro Archive';

export type PricingTierName = 'Creator' | 'Pro Agency' | 'Enterprise BYOK';

export interface UserProfile {
  name: string;
  email: string;
  authProvider: 'email' | 'apple' | 'google' | 'firebase';
  selectedTier: PricingTierName;
  uid?: string;
}

export interface OnboardingConfig {
  workflow: CreatorWorkflow | CreatorFormat;
  creatorFormat?: CreatorFormat;
  niche: ContentNiche | CoreNiche;
  coreNiche?: CoreNiche;
  microTags?: string[];
  platform: TargetPlatform;
  pacingDensity?: PacingDensity;
  brandTone?: BrandTone;
  preset: AestheticPreset;
  completed: boolean;
}

export interface ScriptBeat {
  id: string;
  timecodeStart: string;
  timecodeEnd: string;
  startSec: number;
  durationSec: number;
  speakerLine: string;
  semanticIntent: string;
  matchedClipId: string;
  confidenceScore: number;
  captionStyle: string;
}

export interface BRollClipAsset {
  id: string;
  title: string;
  sourceCollection: string;
  resolution: string;
  fps: number;
  durationSec: number;
  colorProfile: string;
  imageUrl: string;
  focalKeywords: string[];
}

export interface NicheWorkspaceTemplate {
  niche: ContentNiche;
  projectTitle: string;
  tags: string[];
  bpm: number;
  lutName: string;
  scriptBeats: ScriptBeat[];
}

export interface SfxAsset {
  id: string;
  name: string;
  category: 'whoosh' | 'impact' | 'riser' | 'glitch' | 'minimal';
  durationSec: number;
  tags: string[];
  frequencyHz?: number;
}

export interface TimelineSfxCue {
  id: string;
  sfxId: string;
  name: string;
  startSec: number;
  durationSec: number;
  category: 'whoosh' | 'impact' | 'riser' | 'glitch' | 'minimal';
  intensity?: number;
}

export interface TimelineBRollItem {
  id: string;
  clipId: string;
  title: string;
  imageUrl: string;
  startSec: number;
  durationSec: number;
  resolution: string;
  isLocked: boolean;
}

export interface TimelineCaptionItem {
  id: string;
  text: string;
  startSec: number;
  durationSec: number;
  style: string;
}

export interface SentimentBeatCard {
  id: string;
  timecode: string;
  text: string;
  startSec: number;
  durationSec: number;
  visualTags: string[];
  sfxTrigger: string;
  toneProfile: string;
  voiceStyle: string;
  emphasisWords?: string[];
}

export interface SentimentAnalysisResult {
  overallTone: string;
  voiceProfile: string;
  pacingBpm: number;
  dominantVisualKeywords: string[];
  detectedSfxTriggers: string[];
  timestampCards: SentimentBeatCard[];
}

export type CreatorStylePreset =
  | 'Hormozi Punch'
  | 'Ali Abdaal Minimal'
  | 'Noir Serif'
  | 'Neon Cyberpunk';

export type SubtitleAnimationMode =
  | 'Word-by-Word'
  | 'Bounce In'
  | 'Fade Slide'
  | 'Typewriter';

export interface SubtitleStyleConfig {
  preset: CreatorStylePreset | 'Custom';
  fontFamily: 'Geist' | 'Inter' | 'Cormorant Garamond' | 'IBM Plex Mono';
  fontSize: number;
  strokeWidth: number;
  shadowOffset: number;
  isUppercase: boolean;
  highlightColor: string;
  baseTextColor: string;
  boxColor: string;
  boxOpacity: number;
  animationMode: SubtitleAnimationMode;
  customPrompt?: string;
}

export type ExportFormat = 'fcpxml' | 'edl' | 'remotion-json' | 'ffmpeg-wasm';
export type ExportResolution = '1080p @ 60fps' | '4K @ 30fps' | '4K @ 60fps';

export interface ExportPipelinePayload {
  projectName: string;
  resolution: ExportResolution;
  fps: number;
  totalDurationSec: number;
  lutName: string;
  tracks: {
    videoClips: TimelineBRollItem[];
    captions: TimelineCaptionItem[];
    sfx: TimelineSfxCue[];
  };
  subtitleStyle: SubtitleStyleConfig;
  exportedAt: string;
}

export interface SavedProject {
  id: string;
  userId: string;
  name: string;
  niche?: ContentNiche | string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  scriptText: string;
  brollItems: TimelineBRollItem[];
  captionItems: TimelineCaptionItem[];
  sfxItems: TimelineSfxCue[];
  subtitleStyle: SubtitleStyleConfig;
  updatedAt: string;
  thumbnailUrl?: string;
}


