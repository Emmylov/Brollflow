import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Code,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Film,
  Layers,
  Monitor,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Terminal,
  Video,
  X,
  Zap,
} from 'lucide-react';
import {
  ExportFormat,
  ExportPipelinePayload,
  ExportResolution,
  SubtitleStyleConfig,
  ThemeMode,
  TimelineBRollItem,
  TimelineCaptionItem,
  TimelineSfxCue,
} from '../types';
import {
  downloadFile,
  generateEDL,
  generateFCPXML,
  generateRemotionJson,
} from '../utils/exportGenerators';

interface ExportPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  projectName: string;
  totalDurationSec: number;
  lutName: string;
  videoClips: TimelineBRollItem[];
  captions: TimelineCaptionItem[];
  sfxCues: TimelineSfxCue[];
  subtitleStyle: SubtitleStyleConfig;
}

export const ExportPipelineModal: React.FC<ExportPipelineModalProps> = ({
  isOpen,
  onClose,
  theme,
  projectName,
  totalDurationSec,
  lutName,
  videoClips,
  captions,
  sfxCues,
  subtitleStyle,
}) => {
  const isDark = theme === 'dark';

  // Resolution & FPS state
  const [resolution, setResolution] = useState<ExportResolution>('4K @ 60fps');

  // Payload computation
  const fps = resolution.includes('@ 30fps') ? 30 : 60;
  const payload: ExportPipelinePayload = {
    projectName,
    resolution,
    fps,
    totalDurationSec,
    lutName,
    tracks: {
      videoClips,
      captions,
      sfx: sfxCues,
    },
    subtitleStyle,
    exportedAt: new Date().toISOString(),
  };

  // Code Viewer Tab
  const [activeCodeTab, setActiveCodeTab] = useState<'remotion' | 'fcpxml' | 'edl'>('remotion');
  const [isCodeViewerExpanded, setIsCodeViewerExpanded] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // In-Browser Render Simulation State (FFmpeg.wasm simulation)
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [renderPhase, setRenderPhase] = useState<string>('Initializing WebAssembly runtime...');
  const [renderedVideoReady, setRenderedVideoReady] = useState<boolean>(false);
  const renderCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Computed strings
  const jsonPayloadString = generateRemotionJson(payload);
  const fcpxmlString = generateFCPXML(payload);
  const edlString = generateEDL(payload);

  const activeCodeContent =
    activeCodeTab === 'remotion'
      ? jsonPayloadString
      : activeCodeTab === 'fcpxml'
      ? fcpxmlString
      : edlString;

  // Handle Download Action
  const handleDownload = (format: ExportFormat) => {
    const safeProjectName = projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');

    if (format === 'fcpxml') {
      downloadFile(`${safeProjectName}_sequence.fcpxml`, fcpxmlString, 'application/xml');
      triggerToast('Downloaded .FCPXML for DaVinci Resolve & Final Cut Pro');
    } else if (format === 'edl') {
      downloadFile(`${safeProjectName}_edit_list.edl`, edlString, 'text/plain');
      triggerToast('Downloaded .EDL for Adobe Premiere Pro');
    } else if (format === 'remotion-json') {
      downloadFile(`${safeProjectName}_cloud_payload.json`, jsonPayloadString, 'application/json');
      triggerToast('Downloaded Remotion / Cloud FFmpeg JSON Payload');
    } else if (format === 'ffmpeg-wasm') {
      startInBrowserRender();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCodeContent);
    setCopiedCode(true);
    triggerToast(`Copied ${activeCodeTab.toUpperCase()} to clipboard`);
    window.setTimeout(() => setCopiedCode(false), 2000);
  };

  const triggerToast = (msg: string) => {
    setActionSuccessToast(msg);
    window.setTimeout(() => setActionSuccessToast(null), 3500);
  };

  // Start simulated In-Browser Client Render
  const startInBrowserRender = () => {
    setIsRendering(true);
    setRenderProgress(0);
    setRenderedVideoReady(false);

    const phases = [
      { progress: 12, label: 'Spawning FFmpeg.wasm multi-thread Web Workers...' },
      { progress: 28, label: 'Demuxing 4K Rec.709 B-roll frames from cache...' },
      { progress: 48, label: 'Rasterizing kinetic captions & word-by-word shaders...' },
      { progress: 72, label: 'Baking 48kHz audio stems & synthesized SFX cues...' },
      { progress: 88, label: `Encoding H.264 master stream (${resolution})...` },
      { progress: 100, label: 'Finalizing MP4 container & muxing audio tracks...' },
    ];

    let currentStep = 0;
    const interval = window.setInterval(() => {
      if (currentStep < phases.length) {
        setRenderProgress(phases[currentStep].progress);
        setRenderPhase(phases[currentStep].label);
        currentStep++;
      } else {
        window.clearInterval(interval);
        setIsRendering(false);
        setRenderedVideoReady(true);
        triggerToast('Render complete! Preview master ready to download.');
      }
    }, 450);
  };

  // Render on offscreen canvas for browser preview
  useEffect(() => {
    if (!renderedVideoReady) return;
    const canvas = renderCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw active B-roll image preview
    const firstClip = videoClips[0];
    if (firstClip?.imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = firstClip.imageUrl;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Vignette
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          50,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 1.5
        );
        grad.addColorStop(0, 'rgba(0,0,0,0.1)');
        grad.addColorStop(1, 'rgba(0,0,0,0.8)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Watermark badge
        ctx.font = '600 13px "IBM Plex Mono", monospace';
        ctx.fillStyle = '#C9A063';
        ctx.fillText('B-ROLL FLOW · MASTER RENDER', 24, 36);

        ctx.font = '500 11px "Geist", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(`${resolution} · Rec.709 · ${totalDurationSec}s`, 24, 56);
      };
    }
  }, [renderedVideoReady, videoClips, resolution, totalDurationSec]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-pipeline-title"
    >
      <div
        className={`relative w-full max-w-6xl max-h-[92vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl transition-colors duration-200 ${
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
            <span className="p-2.5 rounded-xl bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
              <Download className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="font-semibold text-zinc-400">Export Pipeline Center</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">NLE Interchange &amp; Cloud Render Engine</span>
              </div>
              <h2
                id="export-pipeline-title"
                className="font-serif-editorial text-2xl font-semibold tracking-tight"
              >
                Render &amp; NLE Sequence Export
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actionSuccessToast && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tabular bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30 animate-fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{actionSuccessToast}</span>
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              aria-label="Close export center"
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

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-7">
          {/* ===================================================================
              SECTION 1: RESOLUTION & FRAME RATE CONFIGURATION TOGGLES
              =================================================================== */}
          <div
            className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              isDark ? 'bg-[#050505] border-[#161616]' : 'bg-[#F5F5F7] border-[#E1E1E1]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-[#C9A063]" />
              <div>
                <div className="text-xs font-semibold">Master Sequence Render Profile</div>
                <div className="text-[11px] text-zinc-500">
                  Select export resolution and frame cadence for delivery master
                </div>
              </div>
            </div>

            {/* Resolution Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {(['1080p @ 60fps', '4K @ 30fps', '4K @ 60fps'] as ExportResolution[]).map(
                (resOption) => {
                  const isSelected = resolution === resOption;
                  return (
                    <button
                      key={resOption}
                      type="button"
                      onClick={() => setResolution(resOption)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono-tabular font-medium transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-[#C9A063] text-[#050505] font-semibold shadow-md'
                            : 'bg-[#111111] text-white font-semibold shadow-md'
                          : isDark
                          ? 'border border-[#161616] bg-[#0C0C0C] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                          : 'border border-[#E1E1E1] bg-white text-zinc-700 hover:text-black hover:border-zinc-400'
                      }`}
                    >
                      {resOption}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* ===================================================================
              SECTION 2: EXPORT FORMAT CARDS (4 FORMATS)
              =================================================================== */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
              <span className="font-semibold text-zinc-400">Available Export Packages</span>
              <span className="font-mono-tabular">Standard NLE Formats &amp; Cloud Render</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: FCPXML Generator */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDark
                    ? 'bg-[#080808] border-[#161616] hover:border-[#C9A063]/50'
                    : 'bg-white border-[#E1E1E1] hover:border-[#111111]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Film className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      .FCPXML
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">FCPXML Generator</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Universal sequence XML file with exact cut timestamps, video clips, and title
                    overlays for DaVinci Resolve and Final Cut Pro.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload('fcpxml')}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isDark
                      ? 'bg-zinc-800 text-zinc-100 hover:bg-[#C9A063] hover:text-[#050505]'
                      : 'bg-zinc-100 text-zinc-900 hover:bg-[#111111] hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .FCPXML</span>
                </button>
              </div>

              {/* Card 2: EDL Export */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDark
                    ? 'bg-[#080808] border-[#161616] hover:border-[#C9A063]/50'
                    : 'bg-white border-[#E1E1E1] hover:border-[#111111]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Layers className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      .EDL
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">EDL Export</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Standard CMX 3600 Edit Decision List for Adobe Premiere Pro, Media Composer, and
                    hardware vision mixers with frame markers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload('edl')}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isDark
                      ? 'bg-zinc-800 text-zinc-100 hover:bg-[#C9A063] hover:text-[#050505]'
                      : 'bg-zinc-100 text-zinc-900 hover:bg-[#111111] hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .EDL</span>
                </button>
              </div>

              {/* Card 3: Remotion / FFmpeg JSON Payload */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDark
                    ? 'bg-[#080808] border-[#161616] hover:border-[#C9A063]/50'
                    : 'bg-white border-[#E1E1E1] hover:border-[#111111]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Code className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                      .JSON
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">Remotion / FFmpeg JSON</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Structured JSON frame schema containing media URLs, keyframe timestamps, and
                    kinetic text coordinates for headless cloud rendering.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload('remotion-json')}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isDark
                      ? 'bg-zinc-800 text-zinc-100 hover:bg-[#C9A063] hover:text-[#050505]'
                      : 'bg-zinc-100 text-zinc-900 hover:bg-[#111111] hover:text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON</span>
                </button>
              </div>

              {/* Card 4: In-Browser Video Render (FFmpeg.wasm) */}
              <div
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isDark
                    ? 'bg-[#080808] border-[#C9A063]/40 shadow-lg shadow-[#C9A063]/5'
                    : 'bg-white border-[#111111]/30 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="p-2 rounded-xl bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                      <Zap className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-[#C9A063]/20 text-[#C9A063] font-semibold">
                      Client-Side
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold mb-1">In-Browser Video Render</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Bakes video clips, kinetic typography, and audio stems directly inside the
                    browser using WebAssembly and OffscreenCanvas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload('ffmpeg-wasm')}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    isDark
                      ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                      : 'bg-[#111111] text-white hover:bg-zinc-800'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Render In-Browser</span>
                </button>
              </div>
            </div>
          </div>

          {/* ===================================================================
              IN-BROWSER RENDER PROGRESS MODAL / PANEL (IF ACTIVE OR READY)
              =================================================================== */}
          {(isRendering || renderedVideoReady) && (
            <div
              className={`p-5 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-[#050505] border-[#C9A063]/40 shadow-xl'
                  : 'bg-[#F5F5F7] border-[#111111]/30 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-[#C9A063]/20 text-[#C9A063]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold">
                      {isRendering
                        ? 'Client-Side Composition Engine (FFmpeg.wasm)'
                        : 'Rendered Composition Master Ready'}
                    </h4>
                    <span className="text-[11px] font-mono-tabular text-zinc-400">{renderPhase}</span>
                  </div>
                </div>
                <span className="text-xs font-mono-tabular font-bold text-[#C9A063]">
                  {renderProgress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A063] to-amber-200 transition-all duration-300"
                  style={{ width: `${renderProgress}%` }}
                />
              </div>

              {/* Rendered Canvas / Video Preview and Actions */}
              {renderedVideoReady && (
                <div className="pt-3 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <canvas
                      ref={renderCanvasRef}
                      width={160}
                      height={90}
                      className="rounded-lg border border-zinc-700 bg-black shadow-inner"
                    />
                    <div>
                      <div className="text-xs font-semibold text-zinc-200">
                        {projectName}.mp4
                      </div>
                      <div className="text-[11px] font-mono-tabular text-zinc-500">
                        {resolution} · H.264 / AAC · {totalDurationSec}s Duration
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        triggerToast('Downloading rendered MP4 master...');
                        downloadFile(
                          `${projectName.toLowerCase().replace(/\s+/g, '_')}_master.mp4`,
                          'MOCK_MP4_BINARY_DATA',
                          'video/mp4'
                        );
                      }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isDark
                          ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                          : 'bg-[#111111] text-white hover:bg-zinc-800'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Rendered MP4</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsRendering(false);
                        setRenderedVideoReady(false);
                      }}
                      className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white"
                      title="Reset renderer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              SECTION 3: COLLAPSIBLE JSON CODE PAYLOAD VIEWER
              =================================================================== */}
          <div
            className={`rounded-2xl border overflow-hidden ${
              isDark ? 'bg-[#050505] border-[#161616]' : 'bg-white border-[#E1E1E1]'
            }`}
          >
            {/* Header / Accordion Toggle */}
            <div
              onClick={() => setIsCodeViewerExpanded((prev) => !prev)}
              className={`px-5 py-3.5 flex items-center justify-between cursor-pointer select-none transition-colors ${
                isDark ? 'bg-[#080808] hover:bg-[#0c0c0c]' : 'bg-[#F5F5F7] hover:bg-zinc-200/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#C9A063]" />
                <span className="text-xs font-semibold">Live Pipeline Code Payload Viewer</span>
                <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  {activeCodeTab.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-500 hidden sm:inline">
                  {isCodeViewerExpanded ? 'Collapse' : 'Expand'}
                </span>
                {isCodeViewerExpanded ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </div>

            {/* Collapsible Content */}
            {isCodeViewerExpanded && (
              <div className="p-4 space-y-3">
                {/* Format Tabs & Copy Button */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('remotion')}
                      className={`px-3 py-1 rounded-lg font-mono-tabular text-xs transition-colors ${
                        activeCodeTab === 'remotion'
                          ? 'bg-[#C9A063] text-black font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Remotion / FFmpeg JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('fcpxml')}
                      className={`px-3 py-1 rounded-lg font-mono-tabular text-xs transition-colors ${
                        activeCodeTab === 'fcpxml'
                          ? 'bg-[#C9A063] text-black font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      FCPXML v1.9
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab('edl')}
                      className={`px-3 py-1 rounded-lg font-mono-tabular text-xs transition-colors ${
                        activeCodeTab === 'edl'
                          ? 'bg-[#C9A063] text-black font-semibold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      CMX 3600 EDL
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700 transition-colors"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C9A063]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code Payload</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preformatted Code Block */}
                <pre
                  className={`p-4 rounded-xl text-[11px] font-mono-tabular overflow-x-auto max-h-64 border leading-relaxed ${
                    isDark
                      ? 'bg-[#030303] border-[#161616] text-[#C9A063]/90'
                      : 'bg-zinc-900 border-zinc-800 text-[#C9A063]'
                  }`}
                >
                  <code>{activeCodeContent}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-3.5 border-t flex items-center justify-between text-xs text-zinc-500 shrink-0 ${
            isDark ? 'border-[#161616] bg-[#050505]/70' : 'border-[#E1E1E1] bg-[#F5F5F7]/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono-tabular">NLE Dispatch Pipeline: Active</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
