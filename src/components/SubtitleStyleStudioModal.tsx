import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Type,
  Wand2,
  X,
} from 'lucide-react';
import {
  CreatorStylePreset,
  SubtitleAnimationMode,
  SubtitleStyleConfig,
  ThemeMode,
} from '../types';

interface SubtitleStyleStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  currentConfig: SubtitleStyleConfig;
  onApplyConfig: (config: SubtitleStyleConfig) => void;
}

const PRESET_STYLES: Record<CreatorStylePreset, SubtitleStyleConfig> = {
  'Hormozi Punch': {
    preset: 'Hormozi Punch',
    fontFamily: 'Geist',
    fontSize: 34,
    strokeWidth: 4,
    shadowOffset: 4,
    isUppercase: true,
    highlightColor: '#FACC15', // Bright Yellow
    baseTextColor: '#FFFFFF',
    boxColor: '#000000',
    boxOpacity: 0.85,
    animationMode: 'Bounce In',
    customPrompt: 'Bold yellow highlight text, heavy black outline, high-velocity punch jumps',
  },
  'Ali Abdaal Minimal': {
    preset: 'Ali Abdaal Minimal',
    fontFamily: 'Inter',
    fontSize: 22,
    strokeWidth: 0,
    shadowOffset: 2,
    isUppercase: false,
    highlightColor: '#38BDF8', // Soft Sky Blue
    baseTextColor: '#F4F4F5',
    boxColor: '#18181B',
    boxOpacity: 0.7,
    animationMode: 'Fade Slide',
    customPrompt: 'Clean minimalist sans-serif, quiet dark pill box, subtle word fade',
  },
  'Noir Serif': {
    preset: 'Noir Serif',
    fontFamily: 'Cormorant Garamond',
    fontSize: 30,
    strokeWidth: 1,
    shadowOffset: 6,
    isUppercase: false,
    highlightColor: '#C9A063', // Champagne Gold
    baseTextColor: '#E4E4E7',
    boxColor: '#0C0C0C',
    boxOpacity: 0.35,
    animationMode: 'Word-by-Word',
    customPrompt: 'Italic luxury serif, warm champagne gold highlight, fine cinematic shadow',
  },
  'Neon Cyberpunk': {
    preset: 'Neon Cyberpunk',
    fontFamily: 'IBM Plex Mono',
    fontSize: 24,
    strokeWidth: 2,
    shadowOffset: 8,
    isUppercase: true,
    highlightColor: '#00F0FF', // Electric Cyan
    baseTextColor: '#FF007F', // Neon Magenta
    boxColor: '#050505',
    boxOpacity: 0.9,
    animationMode: 'Typewriter',
    customPrompt: 'Cybernetic neon cyan and magenta text, monospace glitch typewriter cadence',
  },
};

const SAMPLE_PHRASES = [
  'Every frontier model bottleneck traces back to moving photons across silicon.',
  'Mastery is never loud. It lives in the quiet resistance of aligned gears.',
  'When sovereign desks rebalance billions, they execute in sub-millisecond corridors.',
  'Here is how deterministic compilation cuts latency by seventy-eight percent.',
];

export const SubtitleStyleStudioModal: React.FC<SubtitleStyleStudioModalProps> = ({
  isOpen,
  onClose,
  theme,
  currentConfig,
  onApplyConfig,
}) => {
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [style, setStyle] = useState<SubtitleStyleConfig>(currentConfig);
  const [customPromptInput, setCustomPromptInput] = useState<string>(
    currentConfig.customPrompt || 'Yellow highlight text, high-velocity jumps, soft paper-tear SFX'
  );
  const [isPromptApplying, setIsPromptApplying] = useState<boolean>(false);
  const [samplePhraseIndex, setSamplePhraseIndex] = useState<number>(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(true);
  const [previewProgress, setPreviewProgress] = useState<number>(0);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const activePhrase = SAMPLE_PHRASES[samplePhraseIndex];
  const words = activePhrase.split(' ');

  // Live Canvas Animation Loop
  useEffect(() => {
    if (!isOpen) return;
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlayingPreview) {
        setPreviewProgress((prev) => {
          const next = prev + dt * 0.45;
          return next >= 1 ? 0 : next;
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, isPlayingPreview]);

  // Render to Live Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Dark cinematic preview background
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, 0, width, height);

    // Subtle atmospheric vignette & center spotlight
    const rad = ctx.createRadialGradient(width / 2, height / 2, 40, width / 2, height / 2, width / 1.5);
    rad.addColorStop(0, 'rgba(201, 160, 99, 0.08)');
    rad.addColorStop(1, 'rgba(5, 5, 5, 0.95)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, width, height);

    // Calculate active word index
    const totalWords = words.length;
    const currentWordIndex = Math.min(totalWords - 1, Math.floor(previewProgress * totalWords));

    // Measure and render words
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontStyle = style.fontFamily === 'Cormorant Garamond' ? 'italic 600' : '700';
    ctx.font = `${fontStyle} ${style.fontSize}px "${style.fontFamily}", sans-serif`;

    const displayText = style.isUppercase ? activePhrase.toUpperCase() : activePhrase;
    const displayWords = displayText.split(' ');

    const lineY = height / 2;

    // Background pill box if opacity > 0
    if (style.boxOpacity > 0) {
      const metrics = ctx.measureText(displayText);
      const boxWidth = Math.min(width - 40, metrics.width + 36);
      const boxHeight = style.fontSize + 24;
      const boxX = (width - boxWidth) / 2;
      const boxY = lineY - boxHeight / 2;

      ctx.save();
      ctx.globalAlpha = style.boxOpacity;
      ctx.fillStyle = style.boxColor;
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
      ctx.fill();
      ctx.restore();
    }

    // Shadow setup
    if (style.shadowOffset > 0) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = style.shadowOffset * 2;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = style.shadowOffset;
    } else {
      ctx.shadowBlur = 0;
    }

    // Render words with highlight & animation mode
    const totalLineWidth = ctx.measureText(displayText).width;
    let currentX = (width - totalLineWidth) / 2;

    displayWords.forEach((word, idx) => {
      const isHighlighted = idx === currentWordIndex;
      const wordMetrics = ctx.measureText(word + ' ');

      ctx.save();

      // Animation Mode effects
      if (isHighlighted && style.animationMode === 'Bounce In') {
        const bounceScale = 1.15;
        ctx.translate(currentX + wordMetrics.width / 2, lineY);
        ctx.scale(bounceScale, bounceScale);
        ctx.translate(-(currentX + wordMetrics.width / 2), -lineY);
      } else if (isHighlighted && style.animationMode === 'Fade Slide') {
        ctx.translate(0, -3);
      } else if (style.animationMode === 'Typewriter' && idx > currentWordIndex) {
        ctx.restore();
        currentX += wordMetrics.width;
        return;
      }

      // Stroke outline
      if (style.strokeWidth > 0) {
        ctx.lineWidth = style.strokeWidth;
        ctx.strokeStyle = '#000000';
        ctx.lineJoin = 'round';
        ctx.strokeText(word, currentX + wordMetrics.width / 2, lineY);
      }

      // Fill color
      ctx.fillStyle = isHighlighted ? style.highlightColor : style.baseTextColor;
      ctx.fillText(word, currentX + wordMetrics.width / 2, lineY);

      ctx.restore();
      currentX += wordMetrics.width;
    });

    // Timecode & HUD stamp on bottom
    ctx.shadowBlur = 0;
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(
      `MODE: ${style.animationMode.toUpperCase()} · SPEED: 1.0X · PREVIEW ACTIVE`,
      width / 2,
      height - 24
    );
  }, [previewProgress, style, activePhrase, words]);

  const handleApplyCustomPrompt = () => {
    setIsPromptApplying(true);
    window.setTimeout(() => {
      const lower = customPromptInput.toLowerCase();
      let nextPreset: CreatorStylePreset | 'Custom' = 'Custom';
      let nextHighlight = style.highlightColor;
      let nextFont = style.fontFamily;
      let nextAnim = style.animationMode;
      let nextUppercase = style.isUppercase;
      let nextStroke = style.strokeWidth;

      if (lower.includes('yellow') || lower.includes('hormozi') || lower.includes('jump')) {
        nextHighlight = '#FACC15';
        nextAnim = 'Bounce In';
        nextUppercase = true;
        nextStroke = 4;
        nextPreset = 'Hormozi Punch';
      } else if (lower.includes('minimal') || lower.includes('ali') || lower.includes('clean')) {
        nextHighlight = '#38BDF8';
        nextAnim = 'Fade Slide';
        nextUppercase = false;
        nextStroke = 0;
        nextPreset = 'Ali Abdaal Minimal';
      } else if (lower.includes('serif') || lower.includes('noir') || lower.includes('gold')) {
        nextHighlight = '#C9A063';
        nextFont = 'Cormorant Garamond';
        nextAnim = 'Word-by-Word';
        nextUppercase = false;
        nextPreset = 'Noir Serif';
      } else if (lower.includes('neon') || lower.includes('cyber') || lower.includes('typewriter')) {
        nextHighlight = '#00F0FF';
        nextFont = 'IBM Plex Mono';
        nextAnim = 'Typewriter';
        nextUppercase = true;
        nextPreset = 'Neon Cyberpunk';
      }

      setStyle((prev) => ({
        ...prev,
        preset: nextPreset,
        highlightColor: nextHighlight,
        fontFamily: nextFont,
        animationMode: nextAnim,
        isUppercase: nextUppercase,
        strokeWidth: nextStroke,
        customPrompt: customPromptInput,
      }));
      setIsPromptApplying(false);
    }, 350);
  };

  const handleSaveToTimeline = () => {
    onApplyConfig(style);
    setSaveToast(`Applied "${style.preset}" style to timeline!`);
    window.setTimeout(() => {
      setSaveToast(null);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subtitle-studio-title"
    >
      <div
        className={`relative w-full max-w-6xl h-[90vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl transition-colors duration-200 ${
          isDark
            ? 'bg-[#0C0C0C]/95 border-[#161616] text-[#F4F4F5]'
            : 'bg-white/95 border-[#E1E1E1] text-[#111111]'
        }`}
      >
        {/* Top Header */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between gap-4 shrink-0 ${
            isDark ? 'border-[#161616] bg-[#050505]/70' : 'border-[#E1E1E1] bg-[#F5F5F7]/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#C9A063]/15 text-[#C9A063]">
              <Type className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>Typography Engine</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">Live Canvas Kinetic Rendering</span>
              </div>
              <h2 id="subtitle-studio-title" className="font-serif-editorial text-2xl font-semibold tracking-tight">
                Subtitle &amp; Style Emulation Studio
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tabular bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                <Check className="w-3.5 h-3.5" />
                <span>{saveToast}</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleSaveToTimeline}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                isDark
                  ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                  : 'bg-[#111111] text-white hover:bg-zinc-800'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Style to Studio Timeline</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close subtitle studio"
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-[#161616] text-zinc-400 hover:text-white hover:bg-[#161616]'
                  : 'border-[#E1E1E1] text-zinc-500 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Column Split: Left Controls Drawer (5 cols) & Right Live Canvas Preview (7 cols) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* =====================================================================
              LEFT PANEL: STYLE & CONTROLS DRAWER (5 COLS)
              ===================================================================== */}
          <div
            className={`lg:col-span-5 border-b lg:border-b-0 lg:border-r p-6 overflow-y-auto space-y-6 ${
              isDark ? 'bg-[#080808] border-[#161616]' : 'bg-white border-[#E1E1E1]'
            }`}
          >
            {/* 1. Creator Style Presets */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-2.5">
                <span className="font-semibold text-zinc-400">Creator Style Presets</span>
                <span className="font-mono-tabular">4 Icons</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {(Object.keys(PRESET_STYLES) as CreatorStylePreset[]).map((presetKey) => {
                  const isSelected = style.preset === presetKey;
                  const pConfig = PRESET_STYLES[presetKey];
                  return (
                    <button
                      key={presetKey}
                      type="button"
                      onClick={() => setStyle({ ...pConfig, preset: presetKey })}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-[#050505] border-[#C9A063] shadow-md'
                            : 'bg-[#F5F5F7] border-[#111111] shadow-md'
                          : isDark
                          ? 'bg-[#050505]/50 border-[#161616] hover:border-zinc-700'
                          : 'bg-white border-[#E1E1E1] hover:border-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold">{presetKey}</span>
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: pConfig.highlightColor }}
                        />
                      </div>
                      <div className="text-[10px] font-mono-tabular text-zinc-500 truncate">
                        {pConfig.fontFamily} · {pConfig.animationMode}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Custom Style Prompting Input */}
            <div
              className={`p-4 rounded-xl border space-y-3 ${
                isDark ? 'bg-[#050505] border-[#161616]' : 'bg-[#F5F5F7] border-[#E1E1E1]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium flex items-center gap-1.5 text-zinc-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A063]" />
                  <span>Custom Style AI Prompting</span>
                </span>
                <span className="text-[10px] font-mono-tabular text-zinc-500">Natural Language</span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPromptInput}
                  onChange={(e) => setCustomPromptInput(e.target.value)}
                  placeholder="e.g. Yellow highlight text, high-velocity jumps, soft paper-tear SFX"
                  className={`flex-1 px-3 py-2 rounded-lg border text-xs outline-none transition-colors ${
                    isDark
                      ? 'bg-[#0C0C0C] border-[#161616] text-white focus:border-[#C9A063]'
                      : 'bg-white border-[#E1E1E1] text-black focus:border-black'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleApplyCustomPrompt}
                  disabled={isPromptApplying}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isPromptApplying
                      ? 'bg-[#C9A063]/50 text-[#050505] animate-pulse'
                      : isDark
                      ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                      : 'bg-[#111111] text-white hover:bg-zinc-800'
                  }`}
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isPromptApplying ? 'animate-spin' : ''}`} />
                  <span>Apply</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono-tabular text-zinc-500">
                <span className="text-zinc-400">Quick Prompts:</span>
                <button
                  type="button"
                  onClick={() => setCustomPromptInput('Neon cyan and magenta cyberpunk typewriter')}
                  className="hover:text-[#C9A063] transition-colors"
                >
                  #Cyberpunk
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setCustomPromptInput('Italic Swiss luxury serif with golden pull')}
                  className="hover:text-[#C9A063] transition-colors"
                >
                  #LuxurySerif
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setCustomPromptInput('Bright yellow bold punch with heavy black outline')}
                  className="hover:text-[#C9A063] transition-colors"
                >
                  #HormoziPunch
                </button>
              </div>
            </div>

            {/* 3. Typography Controls */}
            <div className="space-y-4">
              <span className="text-xs font-semibold text-zinc-400 block">Typography Controls</span>

              {/* Font Family Selector */}
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Font Family</label>
                <select
                  value={style.fontFamily}
                  onChange={(e) =>
                    setStyle({
                      ...style,
                      fontFamily: e.target.value as SubtitleStyleConfig['fontFamily'],
                      preset: 'Custom',
                    })
                  }
                  className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${
                    isDark ? 'bg-[#050505] border-[#161616] text-white' : 'bg-white border-[#E1E1E1] text-black'
                  }`}
                >
                  <option value="Geist">Geist (Modern Neo-Grotesque Sans)</option>
                  <option value="Inter">Inter (Ultra-Clean Screen Sans)</option>
                  <option value="Cormorant Garamond">Cormorant Garamond (Editorial Luxury Serif)</option>
                  <option value="IBM Plex Mono">IBM Plex Mono (Technical Monospace)</option>
                </select>
              </div>

              {/* Font Size Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Font Size</span>
                  <span className="font-mono-tabular">{style.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min={18}
                  max={60}
                  value={style.fontSize}
                  onChange={(e) => setStyle({ ...style, fontSize: Number(e.target.value), preset: 'Custom' })}
                  className="w-full editorial-slider"
                />
              </div>

              {/* Stroke / Outline Width */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Stroke / Outline Width</span>
                  <span className="font-mono-tabular">{style.strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  value={style.strokeWidth}
                  onChange={(e) => setStyle({ ...style, strokeWidth: Number(e.target.value), preset: 'Custom' })}
                  className="w-full editorial-slider"
                />
              </div>

              {/* Shadow Offset Slider */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Shadow Depth / Blur</span>
                  <span className="font-mono-tabular">{style.shadowOffset}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={16}
                  value={style.shadowOffset}
                  onChange={(e) => setStyle({ ...style, shadowOffset: Number(e.target.value), preset: 'Custom' })}
                  className="w-full editorial-slider"
                />
              </div>

              {/* Uppercase Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-zinc-400">All Uppercase Characters</span>
                <button
                  type="button"
                  onClick={() => setStyle({ ...style, isUppercase: !style.isUppercase, preset: 'Custom' })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    style.isUppercase
                      ? isDark
                        ? 'bg-[#C9A063]'
                        : 'bg-[#111111]'
                      : isDark
                      ? 'bg-zinc-800'
                      : 'bg-zinc-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      style.isUppercase ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 4. Color Selectors & Box Opacity */}
            <div className="space-y-4 pt-3 border-t border-zinc-800/40">
              <span className="text-xs font-semibold text-zinc-400 block">Color &amp; Pill Box</span>

              <div className="grid grid-cols-2 gap-4">
                {/* Active Highlight Color */}
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Active Word Highlight</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={style.highlightColor}
                      onChange={(e) => setStyle({ ...style, highlightColor: e.target.value, preset: 'Custom' })}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono-tabular uppercase">{style.highlightColor}</span>
                  </div>
                </div>

                {/* Base Text Color */}
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Base Inactive Text</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={style.baseTextColor}
                      onChange={(e) => setStyle({ ...style, baseTextColor: e.target.value, preset: 'Custom' })}
                      className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono-tabular uppercase">{style.baseTextColor}</span>
                  </div>
                </div>
              </div>

              {/* Background Box Opacity */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>Background Box Opacity</span>
                  <span className="font-mono-tabular">{Math.round(style.boxOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={style.boxOpacity}
                  onChange={(e) => setStyle({ ...style, boxOpacity: Number(e.target.value), preset: 'Custom' })}
                  className="w-full editorial-slider"
                />
              </div>
            </div>

            {/* 5. Animation Modes */}
            <div className="space-y-2 pt-3 border-t border-zinc-800/40">
              <label className="block text-xs font-semibold text-zinc-400">Kinetic Animation Mode</label>
              <select
                value={style.animationMode}
                onChange={(e) =>
                  setStyle({
                    ...style,
                    animationMode: e.target.value as SubtitleAnimationMode,
                    preset: 'Custom',
                  })
                }
                className={`w-full px-3 py-2 rounded-lg border text-xs outline-none ${
                  isDark ? 'bg-[#050505] border-[#161616] text-white' : 'bg-white border-[#E1E1E1] text-black'
                }`}
              >
                <option value="Word-by-Word">Word-by-Word (Karaoke Highlight)</option>
                <option value="Bounce In">Bounce In (High-Velocity Scale Punch)</option>
                <option value="Fade Slide">Fade Slide (Subtle Vertical Deceleration)</option>
                <option value="Typewriter">Typewriter (Progressive Character Revealer)</option>
              </select>
            </div>
          </div>

          {/* =====================================================================
              RIGHT PANEL: LIVE CANVAS PREVIEW (7 COLS)
              ===================================================================== */}
          <div
            className={`lg:col-span-7 flex flex-col justify-between p-6 ${
              isDark ? 'bg-[#050505]' : 'bg-[#F5F5F7]'
            }`}
          >
            {/* Top Preview Bar */}
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A063] animate-pulse" />
                <span className="font-semibold text-zinc-300">Live Kinetic Canvas</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">{style.preset}</span>
              </div>

              {/* Sample Sentence Switcher */}
              <div className="flex items-center gap-1.5 font-mono-tabular">
                <span>Sample Line:</span>
                {SAMPLE_PHRASES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSamplePhraseIndex(i)}
                    className={`px-2 py-0.5 rounded text-xs transition-colors ${
                      samplePhraseIndex === i
                        ? isDark
                          ? 'bg-[#C9A063] text-[#050505] font-semibold'
                          : 'bg-[#111111] text-white font-semibold'
                        : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    0{i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Center Canvas Preview Box */}
            <div className="flex-1 flex items-center justify-center p-2">
              <div
                className={`relative w-full max-w-2xl h-[340px] rounded-2xl overflow-hidden border shadow-2xl flex items-center justify-center ${
                  isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
                }`}
              >
                <canvas
                  ref={canvasRef}
                  width={720}
                  height={340}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Bottom Preview Controls Bar */}
            <div
              className={`mt-4 p-3 rounded-xl border flex items-center justify-between gap-4 ${
                isDark ? 'bg-[#0C0C0C] border-[#161616]' : 'bg-white border-[#E1E1E1]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPlayingPreview((p) => !p)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isDark
                      ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                      : 'bg-[#111111] text-white hover:bg-zinc-800'
                  }`}
                >
                  {isPlayingPreview ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewProgress(0)}
                  className={`p-2 rounded-lg border text-xs ${
                    isDark ? 'border-[#161616] text-zinc-400 hover:text-white' : 'border-[#E1E1E1] text-zinc-600'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="flex-1 max-w-sm flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={previewProgress}
                  onChange={(e) => {
                    setIsPlayingPreview(false);
                    setPreviewProgress(Number(e.target.value));
                  }}
                  className="w-full editorial-slider"
                />
                <span className="font-mono-tabular text-xs text-zinc-500 w-12 text-right">
                  {Math.round(previewProgress * 100)}%
                </span>
              </div>

              <span className="text-[11px] font-mono-tabular text-zinc-500 hidden sm:inline">
                Word {Math.min(words.length, Math.floor(previewProgress * words.length) + 1)} / {words.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
