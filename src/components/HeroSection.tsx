import React, { useRef, useState, useEffect } from 'react';
import {
  ArrowRight,
  Film,
  Layers,
  Maximize2,
  Pause,
  Play,
  Sliders,
  Sparkles,
  Upload,
  VolumeX,
  X,
} from 'lucide-react';
import { GENERATED_IMAGES } from '../data/presets';
import { ThemeMode } from '../types';
import { HeroTimelineMockup } from './HeroTimelineMockup';

interface HeroSectionProps {
  theme: ThemeMode;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenOnboarding: () => void;
  onLaunchStudio: () => void;
}

interface CinemaReel {
  id: string;
  title: string;
  subtitle: string;
  videoSrc: string;
  fallbackImage: string;
  frameRate: string;
  resolution: string;
}

const CINEMA_REELS: CinemaReel[] = [
  {
    id: 'cybernetic-hud',
    title: 'Subway AR HUD & Neural Iris',
    subtitle: 'Reel 01 · Cybernetic Neural Projection',
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    fallbackImage: GENERATED_IMAGES.cyberneticSubway,
    frameRate: '24.00 FPS',
    resolution: '8K Anamorphic',
  },
  {
    id: 'alpine',
    title: 'Alpine Monolith & Mist',
    subtitle: 'Reel 02 · Twilight Architecture',
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    fallbackImage: GENERATED_IMAGES.architecture,
    frameRate: '24.00 FPS',
    resolution: '6K Anamorphic',
  },
  {
    id: 'horology',
    title: 'Molten Precision & Horology',
    subtitle: 'Reel 03 · Swiss Craft Macro',
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fallbackImage: GENERATED_IMAGES.watchmaker,
    frameRate: '60.00 FPS',
    resolution: '4K RED RAW',
  },
  {
    id: 'velocity',
    title: 'Obsidian Flow & Velocity',
    subtitle: 'Reel 04 · Narrative Momentum',
    videoSrc:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fallbackImage: GENERATED_IMAGES.datacenter,
    frameRate: '24.00 FPS',
    resolution: '8K Master',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onOpenAuth,
  onOpenOnboarding,
  onLaunchStudio,
}) => {
  const isDark = theme === 'dark';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [videoOpacity, setVideoOpacity] = useState<number>(0.45); // 0.25 | 0.45 | 0.70
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [customVideoName, setCustomVideoName] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  const currentReel = CINEMA_REELS[activeReelIndex];
  const activeVideoSource = customVideoUrl || currentReel.videoSrc;

  // Configure slow motion and ensure infinite muted loop
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = 0.5; // Apply slow motion playback (0.5x speed)
    videoRef.current.muted = true;
    videoRef.current.defaultMuted = true;
    videoRef.current.loop = true;

    if (isVideoPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback: keep muted & playing
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying, activeReelIndex, activeVideoSource]);

  const toggleVideoPlayback = () => {
    setIsVideoPlaying((prev) => !prev);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomVideoName(file.name);
      setIsVideoPlaying(true);
      setVideoLoaded(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type.startsWith('video/') || file.name.match(/\.(mp4|webm|mov)$/i))) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setCustomVideoName(file.name);
      setIsVideoPlaying(true);
      setVideoLoaded(true);
    }
  };

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
      className={`relative pt-16 pb-24 border-b overflow-hidden transition-colors duration-200 ${
        isDark ? 'border-[#161616] bg-[#050505]' : 'border-[#E1E1E1] bg-[#F5F5F7]'
      }`}
    >
      {/* Hidden File Input for Video Replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/*"
        className="hidden"
        onChange={handleVideoUpload}
      />

      {/* Drag & Drop Visual Indicator Overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md border-2 border-dashed border-[#C9A063] transition-all">
          <div className="text-center p-6 space-y-2">
            <Upload className="w-10 h-10 text-[#C9A063] mx-auto animate-bounce" />
            <h3 className="font-serif-editorial text-2xl font-semibold text-white">
              Drop Your Video File Here
            </h3>
            <p className="text-xs font-mono-tabular text-zinc-400">
              MP4, WebM, or QuickTime · Applies 0.5× Slow-Motion & Silent Infinite Loop
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          FULL-WIDTH BACKGROUND VIDEO ELEMENT & CINEMATIC GRADIENT OVERLAYS
          ========================================================================= */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        {/* Full-width HTML5 Video Element with slow motion animation and infinite loop without audio */}
        <video
          ref={videoRef}
          key={activeVideoSource}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={currentReel.fallbackImage}
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.5;
            setVideoLoaded(true);
          }}
          onCanPlay={(e) => {
            e.currentTarget.playbackRate = 0.5;
            setVideoLoaded(true);
          }}
          onEnded={(e) => {
            // Infinite loop guarantee
            e.currentTarget.currentTime = 0;
            e.currentTarget.play().catch(() => {});
          }}
          style={{
            opacity: isDark ? videoOpacity : videoOpacity * 0.75,
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute inset-0 w-full h-full object-cover object-center animate-slow-motion filter saturate-[1.14] contrast-[1.10]"
        >
          <source src={activeVideoSource} type="video/mp4" />
        </video>

        {/* Fallback Still Image (Visible while video initializes or on low-bandwidth) */}
        {!videoLoaded && (
          <img
            src={currentReel.fallbackImage}
            alt={currentReel.title}
            referrerPolicy="no-referrer"
            style={{
              opacity: isDark ? videoOpacity : videoOpacity * 0.75,
            }}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}

        {/* Subtle radial gradient overlay that blends with the current background color to ensure text legibility */}
        <div
          className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_50%_38%,rgba(5,5,5,0.36)_0%,rgba(5,5,5,0.76)_58%,#050505_100%)]'
              : 'bg-[radial-gradient(circle_at_50%_38%,rgba(245,245,247,0.40)_0%,rgba(245,245,247,0.80)_58%,#F5F5F7_100%)]'
          }`}
        />

        {/* Champagne Gold Focal Flare at the Top Center */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isDark
              ? 'bg-[radial-gradient(ellipse_90%_65%_at_50%_0%,rgba(201,160,99,0.24),transparent_75%)]'
              : 'bg-[radial-gradient(ellipse_90%_65%_at_50%_0%,rgba(180,140,80,0.16),transparent_75%)]'
          }`}
        />

        {/* Horizontal Anamorphic Lens Streak */}
        <div className="absolute top-[28%] left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C9A063]/50 to-transparent pointer-events-none animate-anamorphic" />

        {/* Vertical Bottom Scrim for seamless transition to subsequent sections */}
        <div
          className={`absolute inset-x-0 bottom-0 h-48 pointer-events-none ${
            isDark
              ? 'bg-gradient-to-t from-[#050505] to-transparent'
              : 'bg-gradient-to-t from-[#F5F5F7] to-transparent'
          }`}
        />

        {/* Subtle Cinema Grain Overlay */}
        <div className="absolute inset-0 cinema-grain opacity-55 pointer-events-none mix-blend-overlay" />
      </div>

      {/* =========================================================================
          HERO CONTENT CONTAINER
          ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Top Floating HUD: Ambient Reel Player Controller & Custom Video Replacement */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Left Metadata Stamp */}
          <div
            className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs backdrop-blur-md transition-colors ${
              isDark
                ? 'bg-[#0C0C0C]/80 border-[#C9A063]/30 text-zinc-300'
                : 'bg-white/80 border-[#111111]/20 text-zinc-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDark ? 'bg-[#C9A063]' : 'bg-[#111111]'
              } ${isVideoPlaying ? 'animate-pulse' : 'opacity-50'}`}
            />
            <span className="font-semibold text-[11px] tracking-wide">
              {customVideoName ? 'CUSTOM VIDEO ACTIVE' : 'SWISS PRECISION NLE'}
            </span>
            <span aria-hidden="true" className="text-zinc-500">
              ·
            </span>
            <span className="font-mono-tabular text-[11px] truncate max-w-[180px]">
              {customVideoName || currentReel.title}
            </span>
          </div>

          {/* Right Reel Selector, Video Upload & Playback HUD */}
          <div
            className={`flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-full border text-xs backdrop-blur-md transition-colors ${
              isDark
                ? 'bg-[#0C0C0C]/85 border-[#161616] text-zinc-300'
                : 'bg-white/85 border-[#E1E1E1] text-zinc-800'
            }`}
          >
            {/* Replace Video Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono-tabular border transition-all whitespace-nowrap ${
                isDark
                  ? 'border-[#C9A063]/40 bg-[#C9A063]/10 text-[#C9A063] hover:bg-[#C9A063]/20'
                  : 'border-[#111111]/40 bg-zinc-100 text-[#111111] hover:bg-zinc-200'
              }`}
              title="Replace background with your MP4 video file (or drag & drop)"
            >
              <Upload className="w-3 h-3" />
              <span>{customVideoName ? 'Swap Video' : 'Replace Video'}</span>
            </button>

            {customVideoUrl && (
              <button
                type="button"
                onClick={() => {
                  setCustomVideoUrl(null);
                  setCustomVideoName(null);
                }}
                className="p-1 rounded-full text-zinc-500 hover:text-red-400 transition-colors"
                title="Reset to default cinema stream"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            <div className="w-[1px] h-3 bg-zinc-700/50 mx-0.5" />

            {/* Reel Quick-Switcher */}
            <div className="flex items-center gap-1">
              {CINEMA_REELS.map((reel, idx) => (
                <button
                  key={reel.id}
                  type="button"
                  onClick={() => {
                    setCustomVideoUrl(null);
                    setCustomVideoName(null);
                    setActiveReelIndex(idx);
                    setIsVideoPlaying(true);
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-mono-tabular transition-colors whitespace-nowrap ${
                    !customVideoUrl && activeReelIndex === idx
                      ? isDark
                        ? 'bg-[#C9A063] text-[#050505] font-semibold'
                        : 'bg-[#111111] text-white font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title={`${reel.title} (${reel.resolution})`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>

            <div className="w-[1px] h-3 bg-zinc-700/50 mx-0.5" />

            {/* Play/Pause Video & Slow-Mo Indicator */}
            <button
              type="button"
              onClick={toggleVideoPlayback}
              aria-label={isVideoPlaying ? 'Pause video background' : 'Play video background'}
              className="p-1 rounded-full hover:text-[#C9A063] transition-colors"
            >
              {isVideoPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5" />
              )}
            </button>

            <span className="text-[10px] font-mono-tabular text-zinc-400 hidden lg:inline flex items-center gap-1">
              <VolumeX className="w-3 h-3 text-zinc-500" />
              <span>0.5× SLOW-MO · SILENT LOOP</span>
            </span>

            {/* Opacity Mode Toggle (Subtle / Standard / Deep) */}
            <button
              type="button"
              onClick={() => {
                const next =
                  videoOpacity === 0.25
                    ? 0.45
                    : videoOpacity === 0.45
                    ? 0.7
                    : 0.25;
                setVideoOpacity(next);
              }}
              title="Toggle Video Ambiance Intensity"
              className="px-2 py-0.5 text-[10px] font-mono-tabular text-zinc-400 hover:text-zinc-200"
            >
              {videoOpacity === 0.25
                ? '25%'
                : videoOpacity === 0.45
                ? '45%'
                : '70%'}
            </button>
          </div>
        </div>

        {/* Hero Copy Block */}
        <div className="max-w-3xl mb-12">
          {/* Large Serif Headline */}
          <h1
            className="font-serif-editorial font-semibold tracking-tight leading-[1.04] mb-5 text-balance"
            style={{ fontSize: 'clamp(2.75rem, 5.2vw, 4.75rem)' }}
          >
            The Future of Narrative,{' '}
            <span
              className={
                isDark
                  ? 'bg-gradient-to-r from-[#F4F4F5] via-[#E6C99B] to-[#C9A063] bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-[#111111] via-[#443825] to-[#8C6B32] bg-clip-text text-transparent'
              }
            >
              Automated.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-zinc-300 dark:text-zinc-400 leading-relaxed mb-8 max-w-2xl font-light">
            AI script analysis, frame-accurate stock B-roll matching, kinetic captions, and multi-track NLE exports engineered for both talking-head studio directors and 100% faceless creators.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onOpenAuth('signup')}
              className={`flex items-center gap-2.5 py-3.5 px-7 rounded-xl text-xs font-semibold shadow-lg transition-all duration-200 whitespace-nowrap ${
                isDark
                  ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b] shadow-[#C9A063]/20 hover:shadow-[#C9A063]/30 hover:scale-[1.01]'
                  : 'bg-[#111111] text-white hover:bg-zinc-800 shadow-black/20 hover:scale-[1.01]'
              }`}
            >
              <span>Start Automated Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenOnboarding}
              className={`py-3.5 px-6 rounded-xl border text-xs font-medium backdrop-blur-md transition-all whitespace-nowrap ${
                isDark
                  ? 'bg-[#0C0C0C]/80 border-[#161616] text-zinc-200 hover:border-[#C9A063]/50 hover:bg-[#121212]'
                  : 'bg-white/80 border-[#E1E1E1] text-zinc-800 hover:border-black hover:bg-white'
              }`}
            >
              Configure Workflow Wizard
            </button>

            {/* Clean NLE Badges */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 pl-2">
              <span className="font-mono-tabular">Premiere .XML</span>
              <span aria-hidden="true" className="text-zinc-600">
                ·
              </span>
              <span className="font-mono-tabular">DaVinci .FCPXML</span>
              <span aria-hidden="true" className="text-zinc-600">
                ·
              </span>
              <span className="font-mono-tabular">ProRes 422</span>
            </div>
          </div>
        </div>

        {/* Interactive Animated Multi-Track Timeline Mockup */}
        <div className="relative">
          {/* Subtle Ambient Glow Ring behind the timeline */}
          <div
            className={`absolute -inset-1 rounded-2xl filter blur-xl opacity-50 pointer-events-none ${
              isDark ? 'bg-gradient-to-r from-[#C9A063]/20 via-transparent to-[#C9A063]/15' : 'bg-zinc-300/40'
            }`}
          />
          <HeroTimelineMockup theme={theme} onLaunchStudio={onLaunchStudio} />
        </div>
      </div>
    </section>
  );
};
