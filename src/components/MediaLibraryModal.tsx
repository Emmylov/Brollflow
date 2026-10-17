import React, { useState } from 'react';
import {
  Check,
  Clock,
  Film,
  Music,
  Play,
  Plus,
  Search,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { SFX_LIBRARY, STOCK_VIDEO_LIBRARY } from '../data/presets';
import { ThemeMode } from '../types';
import { sfxSynth } from '../utils/audioSynth';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  playheadSec: number;
  aiSuggestedKeywords?: string[];
  onAssignVideoToPlayhead: (videoAsset: (typeof STOCK_VIDEO_LIBRARY)[0]) => void;
  onAssignSfxToPlayhead: (sfxAsset: (typeof SFX_LIBRARY)[0]) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  theme,
  playheadSec,
  aiSuggestedKeywords = ['#4K', '#Minimal', '#Whoosh'],
  onAssignVideoToPlayhead,
  onAssignSfxToPlayhead,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'sfx'>('video');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [playingSfxId, setPlayingSfxId] = useState<string | null>(null);
  const [assignedFeedback, setAssignedFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const filterTags = ['#4K', '#Drone', '#Minimal', '#Glitch-SFX', '#Whoosh', '#Macro', '#Architecture'];

  const filteredVideos = STOCK_VIDEO_LIBRARY.filter((v) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || v.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const filteredSfx = SFX_LIBRARY.filter((s) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = !selectedTag || s.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handlePlaySfx = (id: string, category: 'whoosh' | 'impact' | 'riser' | 'glitch' | 'minimal') => {
    setPlayingSfxId(id);
    sfxSynth.play(category);
    window.setTimeout(() => setPlayingSfxId(null), 1200);
  };

  const handleAssignVideo = (item: (typeof STOCK_VIDEO_LIBRARY)[0]) => {
    onAssignVideoToPlayhead(item);
    setAssignedFeedback(`Added "${item.title.slice(0, 24)}..." to Track 2 (B-Roll)`);
    window.setTimeout(() => setAssignedFeedback(null), 2500);
  };

  const handleAssignSfx = (item: (typeof SFX_LIBRARY)[0]) => {
    onAssignSfxToPlayhead(item);
    setAssignedFeedback(`Added "${item.name}" to Track 4 (SFX)`);
    window.setTimeout(() => setAssignedFeedback(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="media-library-title"
    >
      <div
        className={`relative w-full max-w-5xl h-[88vh] rounded-2xl border flex flex-col overflow-hidden shadow-2xl transition-colors duration-200 ${
          isDark
            ? 'bg-[#0C0C0C]/95 border-[#161616] text-[#F4F4F5]'
            : 'bg-white/95 border-[#E1E1E1] text-[#111111]'
        }`}
      >
        {/* Top Header Bar */}
        <div
          className={`px-6 py-4 border-b flex items-center justify-between gap-4 shrink-0 ${
            isDark ? 'border-[#161616] bg-[#050505]/70' : 'border-[#E1E1E1] bg-[#F5F5F7]/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-[#C9A063]/15 text-[#C9A063]">
              {activeTab === 'video' ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
            </span>
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span>Studio Asset Vault</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">
                  Playhead at {Math.floor(playheadSec / 60).toString().padStart(2, '0')}:
                  {Math.floor(playheadSec % 60).toString().padStart(2, '0')}.
                  {Math.floor((playheadSec % 1) * 100).toString().padStart(2, '0')}
                </span>
              </div>
              <h2 id="media-library-title" className="font-serif-editorial text-2xl font-semibold tracking-tight">
                Media Library & Sound Vault
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {assignedFeedback && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono-tabular bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                <Check className="w-3.5 h-3.5" />
                <span>{assignedFeedback}</span>
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close media library"
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

        {/* Dual Tab Switcher & Search Bar */}
        <div
          className={`p-6 pb-4 border-b space-y-4 shrink-0 ${
            isDark ? 'border-[#161616] bg-[#080808]' : 'border-[#E1E1E1] bg-white'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Dual Tab Selector */}
            <div
              className={`inline-flex p-1 rounded-lg border self-start ${
                isDark ? 'bg-[#050505] border-[#161616]' : 'bg-[#F5F5F7] border-[#E1E1E1]'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setActiveTab('video');
                  setSelectedTag(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'video'
                    ? isDark
                      ? 'bg-[#0C0C0C] text-[#C9A063] border border-[#161616] shadow-sm'
                      : 'bg-white text-[#111111] shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Stock Video Assets (Pexels / Cinema)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('sfx');
                  setSelectedTag(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'sfx'
                    ? isDark
                      ? 'bg-[#0C0C0C] text-[#C9A063] border border-[#161616] shadow-sm'
                      : 'bg-white text-[#111111] shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>Sound Effects / SFX (Freesound / Pixabay)</span>
              </button>
            </div>

            {/* AI Suggested Keywords Pill Tag */}
            {aiSuggestedKeywords.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A063]" />
                <span className="hidden md:inline">Script Analyzer Suggests:</span>
                <span className="font-mono-tabular text-zinc-400">
                  {aiSuggestedKeywords.slice(0, 3).join(' ')}
                </span>
              </div>
            )}
          </div>

          {/* Search Input & Quick Filter Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  activeTab === 'video'
                    ? 'Search 4K B-roll, macro, drone, cyberpunk, or architecture...'
                    : 'Search whooshes, impacts, glitches, risers, or minimal SFX...'
                }
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-xs outline-none transition-colors ${
                  isDark
                    ? 'bg-[#050505] border-[#161616] text-white focus:border-[#C9A063]'
                    : 'bg-[#F5F5F7] border-[#E1E1E1] text-black focus:border-black'
                }`}
              />
            </div>

            {/* Quick-Filter Tag Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono-tabular transition-colors whitespace-nowrap ${
                  selectedTag === null
                    ? isDark
                      ? 'bg-[#C9A063] text-[#050505] font-semibold'
                      : 'bg-[#111111] text-white font-semibold'
                    : isDark
                    ? 'bg-[#050505] border border-[#161616] text-zinc-400 hover:text-white'
                    : 'bg-[#F5F5F7] border border-[#E1E1E1] text-zinc-600 hover:text-black'
                }`}
              >
                All Tags
              </button>
              {filterTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono-tabular transition-colors whitespace-nowrap ${
                    selectedTag === tag
                      ? isDark
                        ? 'bg-[#C9A063] text-[#050505] font-semibold'
                        : 'bg-[#111111] text-white font-semibold'
                      : isDark
                      ? 'bg-[#050505] border border-[#161616] text-zinc-400 hover:text-white'
                      : 'bg-[#F5F5F7] border border-[#E1E1E1] text-zinc-600 hover:text-black'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Media Grid Cards Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'video' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className={`group relative rounded-xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[#C9A063] hover:shadow-lg ${
                    isDark ? 'bg-[#080808] border-[#161616]' : 'bg-white border-[#E1E1E1]'
                  }`}
                >
                  {/* Thumbnail with Ken Burns Animation on Hover */}
                  <div className="relative h-44 w-full overflow-hidden bg-black">
                    <img
                      src={video.imageUrl}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

                    {/* Resolution & Duration Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono-tabular font-semibold bg-black/75 backdrop-blur-md text-[#C9A063] border border-[#C9A063]/30">
                        {video.resolution}
                      </span>
                      <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono-tabular bg-black/60 backdrop-blur-md text-zinc-300">
                        {video.aspect}
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[11px] font-mono-tabular text-zinc-300 bg-black/60 px-2 py-0.5 rounded-sm">
                      <Clock className="w-3 h-3 text-[#C9A063]" />
                      <span>{video.durationSec}s</span>
                    </div>
                  </div>

                  {/* Card Content & Action Trigger */}
                  <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="text-sm font-semibold mb-1 group-hover:text-[#C9A063] transition-colors line-clamp-1">
                        {video.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                        <span>{video.sourceProvider}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {video.tags.map((t) => (
                          <span key={t} className="text-[11px] font-mono-tabular text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAssignVideo(video)}
                      className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        isDark
                          ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                          : 'bg-[#111111] text-white hover:bg-zinc-800'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Assign to Playhead (Track V2)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSfx.map((sfx) => {
                const isPlaying = playingSfxId === sfx.id;
                return (
                  <div
                    key={sfx.id}
                    className={`rounded-xl border p-5 flex flex-col justify-between transition-all duration-300 hover:border-[#C9A063] ${
                      isDark ? 'bg-[#080808] border-[#161616]' : 'bg-white border-[#E1E1E1]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                        <span className="font-mono-tabular uppercase tracking-wider text-[#C9A063]">
                          #{sfx.category}
                        </span>
                        <span className="font-mono-tabular">{sfx.durationSec}s</span>
                      </div>

                      <h4 className="text-sm font-semibold mb-3">{sfx.name}</h4>

                      {/* Animated Audio Waveform Simulation Bar */}
                      <div
                        className={`h-12 rounded-lg border px-3 flex items-center justify-between gap-1 mb-4 overflow-hidden ${
                          isDark ? 'bg-[#050505] border-[#161616]' : 'bg-[#F5F5F7] border-[#E1E1E1]'
                        }`}
                      >
                        {Array.from({ length: 32 }).map((_, i) => {
                          const baseHeight = 20 + ((i * 17 + 11) % 65);
                          const activeHeight = isPlaying
                            ? Math.min(100, baseHeight + ((i * 29) % 45))
                            : baseHeight;
                          return (
                            <div
                              key={i}
                              className={`w-1 rounded-full transition-all duration-150 ${
                                isPlaying
                                  ? 'bg-[#C9A063]'
                                  : isDark
                                  ? 'bg-zinc-700'
                                  : 'bg-zinc-400'
                              }`}
                              style={{ height: `${activeHeight}%` }}
                            />
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {sfx.tags.map((t) => (
                          <span key={t} className="text-[11px] font-mono-tabular text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handlePlaySfx(sfx.id, sfx.category)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                          isPlaying
                            ? 'bg-[#C9A063]/15 border-[#C9A063] text-[#C9A063]'
                            : isDark
                            ? 'border-[#161616] bg-[#050505] text-zinc-300 hover:text-white hover:border-zinc-700'
                            : 'border-[#E1E1E1] bg-[#F5F5F7] text-zinc-800 hover:bg-zinc-200'
                        }`}
                      >
                        {isPlaying ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlaying ? 'Playing...' : 'Play Preview'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAssignSfx(sfx)}
                        className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                          isDark
                            ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                            : 'bg-[#111111] text-white hover:bg-zinc-800'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Assign Track 4</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
