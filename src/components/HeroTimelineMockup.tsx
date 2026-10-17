import React, { useEffect, useState } from 'react';
import {
  Film,
  Layers,
  Pause,
  Play,
  RotateCcw,
  Scissors,
  Sliders,
  Volume2,
  Wand2,
} from 'lucide-react';
import { BROLL_LIBRARY, NICHE_WORKSPACE_TEMPLATES } from '../data/presets';
import { ThemeMode } from '../types';

interface HeroTimelineMockupProps {
  theme: ThemeMode;
  onLaunchStudio: () => void;
}

export const HeroTimelineMockup: React.FC<HeroTimelineMockupProps> = ({
  theme,
  onLaunchStudio,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playheadPercent, setPlayheadPercent] = useState(28);
  const [selectedBeatIndex, setSelectedBeatIndex] = useState(1);
  const [cursorTick, setCursorTick] = useState(0);

  const isDark = theme === 'dark';
  const beats = NICHE_WORKSPACE_TEMPLATES['Tech & AI'].scriptBeats;

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setPlayheadPercent((prev) => {
        const next = prev + 0.45;
        return next >= 98 ? 4 : next;
      });
      setCursorTick((prev) => prev + 1);
    }, 60);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const activeIdx = Math.min(
      beats.length - 1,
      Math.floor((playheadPercent / 100) * beats.length)
    );
    setSelectedBeatIndex(activeIdx);
  }, [playheadPercent, beats.length]);

  const activeBeat = beats[selectedBeatIndex] || beats[0];
  const matchedAsset =
    BROLL_LIBRARY.find((c) => c.id === activeBeat.matchedClipId) || BROLL_LIBRARY[0];

  // Format playhead timecode 00:00:XX:FF
  const totalSeconds = (playheadPercent / 100) * 20;
  const secs = Math.floor(totalSeconds);
  const frames = Math.floor((totalSeconds - secs) * 24);
  const formattedTimecode = `00:00:${String(secs).padStart(2, '0')}:${String(
    frames
  ).padStart(2, '0')}`;

  // Smooth sinusoidal positions for multiplayer cursors
  const cursor1X = 24 + Math.sin(cursorTick * 0.04) * 18;
  const cursor1Y = 26 + Math.cos(cursorTick * 0.03) * 10;

  const cursor2X = 68 + Math.cos(cursorTick * 0.035) * 16;
  const cursor2Y = 58 + Math.sin(cursorTick * 0.045) * 12;

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors duration-200 ${
        isDark
          ? 'bg-[#0C0C0C] border-[#161616]'
          : 'bg-white border-[#E1E1E1]'
      }`}
    >
      {/* Top NLE Transport & Metadata Header */}
      <div
        className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-4 ${
          isDark ? 'border-[#161616] bg-[#050505]/50' : 'border-[#E1E1E1] bg-[#F5F5F7]/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPlaying((p) => !p)}
            aria-label={isPlaying ? 'Pause timeline preview' : 'Play timeline preview'}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isDark
                ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d5b078]'
                : 'bg-[#111111] text-white hover:bg-zinc-800'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setPlayheadPercent(0)}
            aria-label="Reset playhead"
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'border-[#161616] text-zinc-400 hover:text-white hover:bg-[#161616]'
                : 'border-[#E1E1E1] text-zinc-600 hover:text-black hover:bg-zinc-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono-tabular font-medium">{formattedTimecode}</span>
            <span aria-hidden="true" className="text-zinc-500">
              /
            </span>
            <span className="font-mono-tabular text-zinc-500">00:00:20:00</span>
            <span aria-hidden="true" className="text-zinc-500">
              ·
            </span>
            <span className="font-mono-tabular text-zinc-500">24.00 fps</span>
          </div>
        </div>

        {/* Collaborators & Match Confidence */}
        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-zinc-500">
            <span>3 Active Editors</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">
              Semantic Match {activeBeat.confidenceScore}%
            </span>
          </div>
          <button
            type="button"
            onClick={onLaunchStudio}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              isDark
                ? 'border-[#C9A063]/40 text-[#C9A063] hover:bg-[#C9A063]/10'
                : 'border-[#111111]/30 text-[#111111] hover:bg-zinc-100'
            }`}
          >
            Open in Full NLE Studio
          </button>
        </div>
      </div>

      {/* Upper Split: Program Monitor + Live Script-to-B-Roll Matcher */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 border-b ${
          isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
        }`}
      >
        {/* Left: Program Monitor Frame */}
        <div
          className={`lg:col-span-7 relative overflow-hidden min-h-[250px] sm:min-h-[280px] flex flex-col justify-between p-5 border-b lg:border-b-0 lg:border-r ${
            isDark ? 'border-[#161616] bg-[#050505]' : 'border-[#E1E1E1] bg-zinc-900'
          }`}
        >
          <img
            src={matchedAsset.imageUrl}
            alt={matchedAsset.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

          {/* Top Overlay Metadata */}
          <div className="relative z-10 flex items-center justify-between gap-2 text-xs text-zinc-300">
            <div className="flex items-center gap-2 font-mono-tabular">
              <span>REC.709</span>
              <span aria-hidden="true">·</span>
              <span>{matchedAsset.resolution}</span>
              <span aria-hidden="true">·</span>
              <span>{matchedAsset.sourceCollection}</span>
            </div>
            <span className="font-mono-tabular text-[#C9A063]">
              MATCH {activeBeat.confidenceScore}%
            </span>
          </div>

          {/* Bottom Kinetic Caption Overlay */}
          <div className="relative z-10 space-y-2 pt-16">
            <div className="text-[11px] font-mono-tabular text-zinc-400">
              {activeBeat.captionStyle} · {activeBeat.timecodeStart}
            </div>
            <p className="font-serif-editorial italic text-xl sm:text-2xl text-white leading-snug max-w-xl">
              “{activeBeat.speakerLine}”
            </p>
          </div>
        </div>

        {/* Right: Semantic Script Beats Inspector */}
        <div className="lg:col-span-5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-medium text-zinc-400">
                AI Script Decomposition & Auto-Match
              </span>
              <span className="text-xs font-mono-tabular text-zinc-500">
                4 / 4 Stems Locked
              </span>
            </div>

            <div className="space-y-2">
              {beats.map((beat, idx) => {
                const isCurrent = idx === selectedBeatIndex;
                return (
                  <button
                    key={beat.id}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setSelectedBeatIndex(idx);
                      setPlayheadPercent(idx * 25 + 8);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      isCurrent
                        ? isDark
                          ? 'bg-[#050505] border-[#C9A063]/60'
                          : 'bg-[#F5F5F7] border-[#111111]'
                        : isDark
                        ? 'bg-transparent border-[#161616] hover:border-zinc-800'
                        : 'bg-transparent border-[#E1E1E1] hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono-tabular text-zinc-500 mb-1">
                      <span>
                        0{idx + 1}. {beat.timecodeStart}
                      </span>
                      <span className={isCurrent ? 'text-[#C9A063]' : ''}>
                        {beat.confidenceScore}% Match
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2 leading-relaxed">
                      {beat.speakerLine}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`mt-4 pt-3 border-t flex items-center justify-between text-xs text-zinc-500 ${
              isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
            }`}
          >
            <span>Click any script beat to scrub frame</span>
            <span className="font-mono-tabular">XML · EDL · FCPXML</span>
          </div>
        </div>
      </div>

      {/* Lower Multi-Track Timeline with Colored Multiplayer Cursors */}
      <div
        className={`relative p-5 select-none overflow-hidden ${
          isDark ? 'bg-[#050505]' : 'bg-[#F5F5F7]'
        }`}
      >
        {/* Timecode Ruler */}
        <div className="flex items-center justify-between text-[11px] font-mono-tabular text-zinc-500 mb-3 pl-28 pr-2">
          <span>00:00:00:00</span>
          <span>00:00:05:00</span>
          <span>00:00:10:00</span>
          <span>00:00:15:00</span>
          <span>00:00:20:00</span>
        </div>

        {/* Interactive Scrub Area */}
        <div
          className="relative space-y-2 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const offsetX = Math.max(0, e.clientX - rect.left - 112);
            const trackWidth = Math.max(1, rect.width - 112);
            const pct = Math.min(98, Math.max(2, (offsetX / trackWidth) * 100));
            setPlayheadPercent(pct);
          }}
        >
          {/* Vertical Playhead Line */}
          <div
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{
              left: `calc(7rem + (100% - 7rem) * ${playheadPercent / 100})`,
              transition: isPlaying ? 'left 60ms linear' : 'left 150ms ease-out',
            }}
          >
            <div className="w-2.5 h-2.5 -ml-1 -mt-1 rotate-45 bg-[#C9A063]" />
            <div className="w-[1.5px] h-full bg-[#C9A063]" />
          </div>

          {/* Multiplayer Cursor 1: Elena R. (Colorist) */}
          <div
            className="absolute z-30 pointer-events-none transition-transform duration-150"
            style={{
              left: `${cursor1X}%`,
              top: `${cursor1Y}%`,
            }}
          >
            <svg
              className="w-3.5 h-3.5 text-[#C9A063] -rotate-12 drop-shadow-xs"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 2l7.5 18 2.8-7.2L20.5 10 3 2z" />
            </svg>
            <span className="ml-2 -mt-1 inline-block px-1.5 py-0.5 text-[10px] font-mono-tabular rounded-xs bg-[#C9A063] text-[#050505] font-medium whitespace-nowrap">
              Elena R. · Color
            </span>
          </div>

          {/* Multiplayer Cursor 2: Marcus V. (Lead Editor) */}
          <div
            className="absolute z-30 pointer-events-none transition-transform duration-150"
            style={{
              left: `${cursor2X}%`,
              top: `${cursor2Y}%`,
            }}
          >
            <svg
              className="w-3.5 h-3.5 text-sky-400 -rotate-12 drop-shadow-xs"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M3 2l7.5 18 2.8-7.2L20.5 10 3 2z" />
            </svg>
            <span className="ml-2 -mt-1 inline-block px-1.5 py-0.5 text-[10px] font-mono-tabular rounded-xs bg-sky-400 text-slate-950 font-medium whitespace-nowrap">
              Marcus V. · Cutaway
            </span>
          </div>

          {/* Track V2: AI B-Roll Cutaways */}
          <div className="flex items-center gap-3">
            <div className="w-25 shrink-0 flex items-center gap-1.5 text-xs font-mono-tabular text-zinc-400">
              <Wand2 className="w-3.5 h-3.5 text-[#C9A063]" />
              <span>V2 · B-Roll</span>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-1.5 h-10">
              {beats.map((beat, idx) => {
                const clip =
                  BROLL_LIBRARY.find((c) => c.id === beat.matchedClipId) ||
                  BROLL_LIBRARY[0];
                const active = idx === selectedBeatIndex;
                return (
                  <div
                    key={beat.id}
                    className={`rounded-md border px-2.5 flex items-center justify-between text-[11px] truncate transition-colors ${
                      active
                        ? isDark
                          ? 'bg-[#C9A063]/15 border-[#C9A063] text-[#F4F4F5]'
                          : 'bg-[#111111] border-[#111111] text-white'
                        : isDark
                        ? 'bg-[#0C0C0C] border-[#161616] text-zinc-400'
                        : 'bg-white border-[#E1E1E1] text-zinc-700'
                    }`}
                  >
                    <span className="truncate font-medium">{clip.title}</span>
                    <span className="font-mono-tabular text-[10px] opacity-75 ml-1.5 shrink-0">
                      {beat.durationSec}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Track C1: Kinetic Captions */}
          <div className="flex items-center gap-3">
            <div className="w-25 shrink-0 flex items-center gap-1.5 text-xs font-mono-tabular text-zinc-400">
              <Layers className="w-3.5 h-3.5 text-zinc-500" />
              <span>C1 · Captions</span>
            </div>
            <div className="flex-1 grid grid-cols-4 gap-1.5 h-8">
              {beats.map((beat) => (
                <div
                  key={beat.id}
                  className={`rounded-md border px-2.5 flex items-center text-[11px] font-mono-tabular truncate ${
                    isDark
                      ? 'bg-[#0C0C0C]/80 border-[#161616] text-zinc-400'
                      : 'bg-white border-[#E1E1E1] text-zinc-600'
                  }`}
                >
                  <span className="truncate">{beat.captionStyle}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Track V1: Master A-Roll Spine */}
          <div className="flex items-center gap-3">
            <div className="w-25 shrink-0 flex items-center gap-1.5 text-xs font-mono-tabular text-zinc-400">
              <Film className="w-3.5 h-3.5 text-zinc-500" />
              <span>V1 · A-Roll</span>
            </div>
            <div
              className={`flex-1 h-8 rounded-md border px-3 flex items-center justify-between text-[11px] ${
                isDark
                  ? 'bg-[#0C0C0C] border-[#161616] text-zinc-400'
                  : 'bg-white border-[#E1E1E1] text-zinc-600'
              }`}
            >
              <span className="truncate">
                MASTER_DIALOGUE_CAM_A_4K_PRORES.MOV (Silence Trimmed: -14.2s)
              </span>
              <span className="font-mono-tabular text-zinc-500 shrink-0">
                J-Cut +4f
              </span>
            </div>
          </div>

          {/* Track A1: Dialogue & Foley Waveform */}
          <div className="flex items-center gap-3">
            <div className="w-25 shrink-0 flex items-center gap-1.5 text-xs font-mono-tabular text-zinc-400">
              <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
              <span>A1 · Stems</span>
            </div>
            <div
              className={`flex-1 h-8 rounded-md border px-3 flex items-center gap-1 overflow-hidden ${
                isDark
                  ? 'bg-[#0C0C0C] border-[#161616]'
                  : 'bg-white border-[#E1E1E1]'
              }`}
            >
              {Array.from({ length: 48 }).map((_, i) => {
                const barHeight = 25 + ((i * 19 + 7) % 65);
                const isPassed = (i / 48) * 100 <= playheadPercent;
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-colors ${
                      isPassed
                        ? isDark
                          ? 'bg-[#C9A063]'
                          : 'bg-[#111111]'
                        : isDark
                        ? 'bg-zinc-800'
                        : 'bg-zinc-300'
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
