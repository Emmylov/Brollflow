import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Film,
  FolderOpen,
  Key,
  Layers,
  Maximize2,
  Mic,
  Music,
  Play,
  RotateCcw,
  Scissors,
  Sliders,
  Sparkles,
  Type,
  Volume2,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { ThemeMode } from '../types';

interface PlatformTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  onOpenStudio?: () => void;
}

interface TutorialStep {
  title: string;
  tagline: string;
  description: string;
  badge: string;
  icon: React.ReactNode;
  tips: string[];
  visualType: 'strategy' | 'analyzer' | 'timeline' | 'preview' | 'vault' | 'export';
}

export const PlatformTutorialModal: React.FC<PlatformTutorialModalProps> = ({
  isOpen,
  onClose,
  theme,
  onOpenStudio,
}) => {
  const isDark = theme === 'dark';
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const STEPS: TutorialStep[] = [
    {
      title: '1. AI Content Strategy & Script Planning',
      tagline: 'Conversational ideation & high-retention scripting',
      badge: 'Left Panel · Tab A',
      icon: <Bot className="w-5 h-5 text-[#C9A063]" />,
      description:
        'Brainstorm viral hooks, outline 30-second shorts, and draft structured video scripts with one click. Use the quick action prompt pills or chat naturally. When satisfied, click "Send Script to Studio" to seamlessly pass it into the analysis engine.',
      tips: [
        'Click prompt pills like "Brainstorm 3 viral tech hooks" for instant outlines',
        'Directly inject generated scripts into Tab B with one click',
        'Tailored to your creator niche and pacing density',
      ],
      visualType: 'strategy',
    },
    {
      title: '2. Script Ingestion & AI Beat Extraction',
      tagline: 'Automated B-roll semantic tagging & SFX detection',
      badge: 'Left Panel · Tab B',
      icon: <Sparkles className="w-5 h-5 text-[#C9A063]" />,
      description:
        'Paste your script or voiceover transcript into the clean text engine and click "Run AI Script Analysis". B-Roll Flow extracts timestamp segments (00:00 - 00:03), tags visual queries (#dark-tech, #finance-chart), assigns SFX cues (#whoosh, #impact-pop), and flags subtitle emphasis words.',
      tips: [
        'Edit or add tags directly inside each segment card',
        'Click any SFX trigger badge to preview its synthesized sound',
        'Analysis immediately syncs with the live timeline and canvas',
      ],
      visualType: 'analyzer',
    },
    {
      title: '3. Multi-Track Timeline & Zoom Controls',
      tagline: 'Strict 4-track spatial layout with 1x, 2x, 5x scale',
      badge: 'Right Panel · Bottom Section',
      icon: <Layers className="w-5 h-5 text-[#C9A063]" />,
      description:
        'A high-density 4-track timeline editor designed for professional video workflows: Track 1 (Audio baseline), Track 2 (B-Roll video clips with hover & drag handles), Track 3 (Kinetic captions), and Track 4 (SFX markers). Use the timeline zoom slider in the top right to scale smoothly from 1x to 5x.',
      tips: [
        'Dynamic zoom slider (1x, 2x, 5x) scales all 4 tracks in real time',
        'Interactive playhead scrubbing across 0 to 30 seconds',
        'Switch between Pro Density, Spacious, and Auto-Expanding track heights',
      ],
      visualType: 'timeline',
    },
    {
      title: '4. Real-Time Video Preview Canvas',
      tagline: 'Layered video playback & kinetic caption styling',
      badge: 'Right Panel · Top Section',
      icon: <Film className="w-5 h-5 text-[#C9A063]" />,
      description:
        'Watch your assembled sequence in real time at 24.00 FPS with custom .CUBE LUT color profiles. Preview kinetic captions in 9:16 Vertical, 16:9 Widescreen, or 1:1 Square framing with multiplayer cursor synchronization.',
      tips: [
        'Toggle aspect ratios instantly with the top canvas selector',
        'Open Subtitle Studio to switch styles (Noir Serif, Cyberpunk, etc.)',
        'Real-time HTML5 video and 2D canvas typography overlay',
      ],
      visualType: 'preview',
    },
    {
      title: '5. API Integration & Token Vault',
      tagline: 'Bring-Your-Own-Key stock, audio, and AI engines',
      badge: 'Top Navigation · API Vault',
      icon: <Key className="w-5 h-5 text-[#C9A063]" />,
      description:
        'Connect directly to Pexels Video, Freesound Audio, Google Gemini / OpenAI, and ElevenLabs. Masked keys, connection latency checks, and automatic fallbacks ensure uninterrupted video generation.',
      tips: [
        'Pre-configured working studio keys included out of the box',
        'Test connection pings with live latency readout (e.g. 14ms)',
        'Zero markup: BYOK direct cloud inference',
      ],
      visualType: 'vault',
    },
    {
      title: '6. 1-Click Multi-NLE Export Pipeline',
      tagline: 'FCPXML, EDL, Premiere Pro, and MP4 generation',
      badge: 'Top Navigation · Export',
      icon: <Zap className="w-5 h-5 text-[#C9A063]" />,
      description:
        'When your edit is ready, click "Export Sequence" to generate industry-standard Final Cut Pro XML (.fcpxml), CMX 3600 EDL, or JSON project files. Directly import your timeline into Premiere Pro, DaVinci Resolve, or Final Cut without re-editing.',
      tips: [
        'Preserves exact cuts, audio cues, and B-roll timecodes',
        'Supports 1080p and 4K cinema master exports',
        'Includes subtitle style parameters and LUT color grading data',
      ],
      visualType: 'export',
    },
  ];

  const currentStep = STEPS[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
      if (onOpenStudio) onOpenStudio();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStepIndex((prev) => prev - 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-modal-title"
    >
      <div
        className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-colors ${
          isDark
            ? 'bg-[#0B0B0B] border-[#1C1C1C] text-[#F4F4F5]'
            : 'bg-[#FCFCFD] border-[#E2E2E2] text-[#111111]'
        }`}
      >
        {/* Top Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
            isDark ? 'border-[#1C1C1C] bg-[#0E0E0E]' : 'border-[#EBEBEB] bg-[#F5F5F7]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
              {currentStep.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-tabular font-bold uppercase tracking-wider text-[#C9A063]">
                  Platform Walkthrough
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-xs font-mono-tabular text-zinc-400">
                  Step {currentStepIndex + 1} of {STEPS.length}
                </span>
              </div>
              <h2 id="tutorial-modal-title" className="text-sm font-bold tracking-tight">
                {currentStep.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close tutorial"
            className={`p-2 rounded-xl border transition-colors ${
              isDark
                ? 'border-[#222222] text-zinc-400 hover:text-white hover:bg-[#161616]'
                : 'border-zinc-300 text-zinc-600 hover:text-black hover:bg-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Line */}
        <div className="w-full h-1 bg-zinc-800/40 relative">
          <div
            className="h-full bg-[#C9A063] transition-all duration-300 ease-out"
            style={{ width: `${((currentStepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Tagline & Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-[#C9A063]">{currentStep.tagline}</p>
            <span
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono-tabular border font-semibold ${
                isDark
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300'
                  : 'bg-zinc-100 border-zinc-300 text-zinc-700'
              }`}
            >
              {currentStep.badge}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Interactive Feature Mockup Banner */}
          <div
            className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
              isDark ? 'bg-[#050505] border-[#1C1C1C]' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            {currentStep.visualType === 'strategy' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-zinc-400 border-b border-zinc-800 pb-2">
                  <Bot className="w-4 h-4 text-[#C9A063]" />
                  <span>AI Strategy Assistant</span>
                  <span className="ml-auto text-emerald-400 text-[10px]">● Online</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-1 rounded-full bg-[#C9A063]/10 text-[#C9A063] border border-[#C9A063]/20">
                    Viral Tech Hooks
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">
                    30-sec Script
                  </span>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">
                    Finance Retention
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 italic">
                  &quot;Hook: Most developers think AI is replacing them. But in 2026, the real danger is ignoring this...&quot;
                </p>
              </div>
            )}

            {currentStep.visualType === 'analyzer' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono-tabular text-zinc-400 border-b border-zinc-800 pb-2">
                  <span>Segment 00:00 - 00:03</span>
                  <span className="text-[#C9A063] font-semibold">AI Beat 1</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tabular bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    #dark-tech
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tabular bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    #ai-compute
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-tabular bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    SFX: #whoosh
                  </span>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono-tabular">
                  Emphasis: <span className="text-[#C9A063] font-bold underline">MOST</span>,{' '}
                  <span className="text-[#C9A063] font-bold underline">DANGER</span>
                </div>
              </div>
            )}

            {currentStep.visualType === 'timeline' && (
              <div className="space-y-1.5 font-mono-tabular text-[10px]">
                <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-1">
                  <span>Timeline Scale: 1x · 2x · 5x Zoom</span>
                  <span className="text-[#C9A063]">Zoom Slider Active</span>
                </div>
                <div className="p-1 rounded bg-[#0E0E0E] border border-zinc-800 flex items-center gap-2">
                  <span className="text-zinc-500 w-16">Track 1 · A1</span>
                  <div className="flex-1 h-3 rounded bg-zinc-800/80" />
                </div>
                <div className="p-1 rounded bg-[#0E0E0E] border border-zinc-800 flex items-center gap-2">
                  <span className="text-zinc-500 w-16">Track 2 · V1</span>
                  <div className="flex-1 h-3 rounded bg-teal-900/60 flex items-center px-1 text-[9px] text-teal-300">
                    B-Roll 4K Stems
                  </div>
                </div>
                <div className="p-1 rounded bg-[#0E0E0E] border border-zinc-800 flex items-center gap-2">
                  <span className="text-zinc-500 w-16">Track 3 · C1</span>
                  <div className="flex-1 h-3 rounded bg-amber-900/60 flex items-center px-1 text-[9px] text-amber-300">
                    Kinetic Captions
                  </div>
                </div>
                <div className="p-1 rounded bg-[#0E0E0E] border border-zinc-800 flex items-center gap-2">
                  <span className="text-zinc-500 w-16">Track 4 · S1</span>
                  <div className="flex-1 h-3 rounded bg-purple-900/60 flex items-center px-1 text-[9px] text-purple-300">
                    SFX Impact Cues
                  </div>
                </div>
              </div>
            )}

            {currentStep.visualType === 'preview' && (
              <div className="flex items-center justify-center p-3 text-center">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-xs text-zinc-200">
                    <Film className="w-3.5 h-3.5 text-[#C9A063]" />
                    <span>Aspect Ratio: 9:16 Vertical · 16:9 Cinema · 1:1 Square</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    24 FPS Frame-Accurate Playback with Real-time Kinetic Canvas
                  </p>
                </div>
              </div>
            )}

            {currentStep.visualType === 'vault' && (
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono-tabular">
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <p className="font-bold text-teal-400">Pexels 4K</p>
                  <p className="text-zinc-500">14ms latency</p>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <p className="font-bold text-amber-400">Freesound</p>
                  <p className="text-zinc-500">19ms latency</p>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <p className="font-bold text-rose-400">Gemini 2.5</p>
                  <p className="text-zinc-500">18ms latency</p>
                </div>
              </div>
            )}

            {currentStep.visualType === 'export' && (
              <div className="flex items-center justify-around text-center text-xs font-mono-tabular">
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">
                  .FCPXML
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">
                  CMX 3600 .EDL
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200">
                  Remotion .JSON
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-[#C9A063]/20 border border-[#C9A063]/40 text-[#C9A063] font-bold">
                  MP4 4K
                </span>
              </div>
            )}
          </div>

          {/* Key Tips Bullet List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono-tabular">
              Key Tips & Workflow
            </h4>
            <div className="space-y-1.5">
              {currentStep.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-[#C9A063] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Navigation */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between shrink-0 ${
            isDark ? 'border-[#1C1C1C] bg-[#0E0E0E]' : 'border-[#EBEBEB] bg-[#F5F5F7]'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`text-xs font-mono-tabular text-zinc-400 hover:text-white transition-colors`}
          >
            Skip Tutorial
          </button>

          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                type="button"
                onClick={handlePrev}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  isDark
                    ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                    : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                isDark
                  ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                  : 'bg-[#111111] text-white hover:bg-zinc-800'
              }`}
            >
              <span>{isLast ? 'Enter Studio Workspace' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
