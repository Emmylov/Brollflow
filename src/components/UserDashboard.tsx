import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  Clock,
  Copy,
  Film,
  Filter,
  FolderOpen,
  HelpCircle,
  Key,
  Layers,
  LogOut,
  Maximize2,
  Mic,
  Moon,
  MoreVertical,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Sun,
  Tag,
  Trash2,
  User,
  Video,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import {
  BROLL_LIBRARY,
  NICHE_WORKSPACE_TEMPLATES,
  SFX_LIBRARY,
} from '../data/presets';
import {
  deleteProject,
  logOut,
  saveProject,
  subscribeProjects,
} from '../services/firebase';
import {
  ContentNiche,
  OnboardingConfig,
  SavedProject,
  ThemeMode,
  UserProfile,
} from '../types';

interface UserDashboardProps {
  user: UserProfile;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenStudioWithProject: (project: SavedProject) => void;
  onCreateNewProject: (templateNiche?: ContentNiche, initMode?: 'template' | 'ai' | 'blank') => void;
  onOpenApiVault: () => void;
  onOpenTutorial: () => void;
  onOpenOnboarding: () => void;
  onSignOut: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  theme,
  onToggleTheme,
  onOpenStudioWithProject,
  onCreateNewProject,
  onOpenApiVault,
  onOpenTutorial,
  onOpenOnboarding,
  onSignOut,
}) => {
  const isDark = theme === 'dark';
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRatio, setFilterRatio] = useState<'all' | '9:16' | '16:9' | '1:1'>('all');
  const [selectedNicheFilter, setSelectedNicheFilter] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState<boolean>(false);
  const [selectedInitNiche, setSelectedInitNiche] = useState<ContentNiche>('Tech & AI');
  const [selectedInitMode, setSelectedInitMode] = useState<'template' | 'ai' | 'blank'>('template');

  // Subscribe to Firestore projects in real-time
  useEffect(() => {
    if (!user.uid) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeProjects(
      user.uid,
      (fetchedProjects) => {
        setProjects(fetchedProjects);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Dashboard projects listener notice:', err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user.uid]);

  const handleDelete = async (projectId: string) => {
    if (!user.uid) return;
    try {
      await deleteProject(user.uid, projectId);
      setConfirmDeleteId(null);
    } catch (e) {
      console.error('Delete project error:', e);
    }
  };

  const handleDuplicate = async (project: SavedProject) => {
    if (!user.uid) return;
    const duplicated: SavedProject = {
      ...project,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: `${project.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    try {
      await saveProject(user.uid, duplicated);
    } catch (e) {
      console.error('Duplicate project error:', e);
    }
  };

  // Helper to determine project niche
  const getProjectNiche = (p: SavedProject): string => {
    if (p.niche) return p.niche;
    const lowerName = p.name.toLowerCase();
    if (lowerName.includes('finance') || lowerName.includes('crypto')) return 'Finance & Crypto';
    if (lowerName.includes('philosophy') || lowerName.includes('motivation')) return 'Motivation & Philosophy';
    if (lowerName.includes('fitness') || lowerName.includes('health')) return 'Fitness & Health';
    return 'Tech & AI';
  };

  // Extract available niches across saved projects
  const availableNiches = useMemo(() => {
    const list: string[] = ['Tech & AI', 'Finance & Crypto', 'Motivation & Philosophy'];
    projects.forEach((p) => {
      const niche = getProjectNiche(p);
      if (niche && !list.includes(niche)) {
        list.push(niche);
      }
    });
    return list;
  }, [projects]);

  // Filter projects by query (name or niche or tags or script) and filters
  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return projects.filter((p) => {
      const projectNiche = getProjectNiche(p);
      const matchesName = p.name.toLowerCase().includes(q);
      const matchesNiche = projectNiche.toLowerCase().includes(q);
      const matchesTags = p.brollItems?.some((b) => b.title.toLowerCase().includes(q));
      const matchesScript = Boolean(p.scriptText && p.scriptText.toLowerCase().includes(q));

      const matchesQuery = !q || matchesName || matchesNiche || matchesTags || matchesScript;
      const matchesNichePill =
        selectedNicheFilter === 'all' ||
        projectNiche.toLowerCase() === selectedNicheFilter.toLowerCase();
      const matchesRatio = filterRatio === 'all' || p.aspectRatio === filterRatio;

      return matchesQuery && matchesNichePill && matchesRatio;
    });
  }, [projects, searchQuery, selectedNicheFilter, filterRatio]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-[#060606] text-[#F4F4F5]' : 'bg-[#F7F7F9] text-[#111111]'
      }`}
    >
      {/* 1. Dashboard Top Navigation Bar */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 ${
          isDark ? 'bg-[#080808]/90 border-[#181818]' : 'bg-white/90 border-[#E5E5E5]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-bold tracking-tight">
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="13" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
                <path d="M18 7V17M21.5 9.5V14.5" stroke="#C9A063" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
              <span className="text-sm">B-Roll Flow</span>
            </div>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-mono-tabular text-zinc-400">Creator Dashboard</span>
          </div>

          {/* Action Center */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* API Vault Button */}
            <button
              type="button"
              onClick={onOpenApiVault}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-300 hover:text-white hover:border-zinc-700'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:text-black hover:border-zinc-300'
              }`}
            >
              <Key className="w-3.5 h-3.5 text-[#C9A063]" />
              <span className="hidden sm:inline">API Vault</span>
            </button>

            {/* Platform Tutorial */}
            <button
              type="button"
              onClick={onOpenTutorial}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isDark
                  ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-300 hover:text-white hover:border-zinc-700'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:text-black hover:border-zinc-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#C9A063]" />
              <span className="hidden sm:inline">Tutorial</span>
            </button>

            {/* Light/Dark Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-400 hover:text-white'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:text-black'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* New Project Primary CTA */}
            <button
              type="button"
              onClick={() => onCreateNewProject()}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow-sm transition-all ${
                isDark
                  ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                  : 'bg-[#111111] text-white hover:bg-zinc-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>

            {/* User Profile & Sign Out */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800/60">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  isDark ? 'bg-zinc-800 text-zinc-200' : 'bg-zinc-200 text-zinc-800'
                }`}
                title={user.email}
              >
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <button
                type="button"
                onClick={onSignOut}
                title="Sign out of workspace"
                className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome Hero Banner */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden transition-all ${
            isDark
              ? 'bg-gradient-to-r from-[#0D0D0D] via-[#0A0A0A] to-[#0A0A0A] border-[#1C1C1C]'
              : 'bg-gradient-to-r from-amber-50/40 via-white to-white border-zinc-200'
          }`}
        >
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-tabular uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                {user.selectedTier || 'Pro Studio'} Active
              </span>
              <span className="text-zinc-500 font-mono-tabular text-xs">
                Firestore Cloud Vault Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif-editorial">
              Welcome back, {user.name || 'Creator'}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Your AI-automated studio timeline workspace. Ingest raw scripts, extract semantic
              B-roll tags, synchronize kinetic captions, and export directly to Premiere Pro & Final Cut.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenTutorial}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#C9A063]" />
              <span>Platform Tour</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewProjectModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all ${
                isDark
                  ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                  : 'bg-[#111111] text-white hover:bg-zinc-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Create New Project</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            PROJECTS VAULT SECTION
            Empty state if no projects yet, or grid of saved projects
            ===================================================================== */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <FolderOpen className="w-4 h-4 text-[#C9A063]" />
                <h2 className="text-sm font-bold tracking-tight uppercase font-mono-tabular text-zinc-300">
                  Saved Video Projects ({projects.length})
                </h2>
                {projects.length > 0 && (searchQuery.trim() || selectedNicheFilter !== 'all' || filterRatio !== 'all') && (
                  <span className="text-[10px] font-mono-tabular font-bold px-2 py-0.5 rounded-full bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                    Showing {filteredProjects.length} of {projects.length}
                  </span>
                )}
              </div>

              {/* Search & Ratio Filter Controls */}
              {projects.length > 0 && (
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
                  {/* Text-based search input with clear button */}
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') setSearchQuery('');
                      }}
                      placeholder="Search by name or niche (e.g. Tech, Finance)..."
                      className={`w-full py-1.5 pl-8 pr-7 text-xs rounded-lg border outline-none font-mono-tabular transition-colors ${
                        isDark
                          ? 'bg-[#0E0E0E] border-[#222222] text-zinc-200 placeholder:text-zinc-500 focus:border-[#C9A063]'
                          : 'bg-white border-zinc-300 text-zinc-800 placeholder:text-zinc-400 focus:border-black'
                      }`}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        title="Clear search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Aspect Ratio Filters */}
                  <div
                    className={`inline-flex p-0.5 rounded-lg border text-[11px] font-mono-tabular shrink-0 ${
                      isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-white border-zinc-200'
                    }`}
                  >
                    {(['all', '9:16', '16:9', '1:1'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFilterRatio(r)}
                        className={`px-2 py-1 rounded transition-colors ${
                          filterRatio === r
                            ? isDark
                              ? 'bg-[#C9A063] text-black font-bold'
                              : 'bg-black text-white font-bold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {r.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Niche Filter Tags Row */}
            {projects.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-[11px] font-mono-tabular">
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-semibold mr-1 flex items-center gap-1 shrink-0">
                  <Tag className="w-3 h-3 text-[#C9A063]" />
                  Filter Niche:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedNicheFilter('all')}
                  className={`px-2.5 py-0.5 rounded-full border text-[10px] transition-all shrink-0 ${
                    selectedNicheFilter === 'all'
                      ? isDark
                        ? 'bg-[#C9A063]/20 border-[#C9A063] text-[#C9A063] font-bold'
                        : 'bg-black text-white border-black font-bold'
                      : isDark
                      ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
                  }`}
                >
                  All Niches
                </button>
                {availableNiches.map((niche) => {
                  const isSelected = selectedNicheFilter.toLowerCase() === niche.toLowerCase();
                  return (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setSelectedNicheFilter(isSelected ? 'all' : niche)}
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] transition-all shrink-0 ${
                        isSelected
                          ? isDark
                            ? 'bg-[#C9A063]/20 border-[#C9A063] text-[#C9A063] font-bold'
                            : 'bg-black text-white border-black font-bold'
                          : isDark
                          ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                          : 'bg-white border-zinc-200 text-zinc-600 hover:text-black'
                      }`}
                    >
                      {niche}
                    </button>
                  );
                })}

                {(searchQuery.trim() || selectedNicheFilter !== 'all' || filterRatio !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedNicheFilter('all');
                      setFilterRatio('all');
                    }}
                    className="ml-auto text-[10px] text-zinc-400 hover:text-zinc-200 underline underline-offset-2 flex items-center gap-1 shrink-0"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset All</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* EMPTY STATE: "no projects yet that they should create one" */}
          {!isLoading && projects.length === 0 && (
            <div
              className={`p-10 rounded-2xl border text-center flex flex-col items-center justify-center space-y-6 transition-all ${
                isDark ? 'bg-[#0A0A0A] border-[#1C1C1C]' : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[#C9A063]/10 text-[#C9A063] border border-[#C9A063]/25 shadow-inner">
                <Video className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md">
                <h3 className="text-lg font-bold tracking-tight">No projects yet</h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  Your project vault is empty. Create your first automated video sequence or choose a
                  quick starter template below to jump right into the studio workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(true)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                  isDark
                    ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                    : 'bg-[#111111] text-white hover:bg-zinc-800'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Project</span>
              </button>

              {/* Quick Template Starters */}
              <div className="pt-6 border-t border-zinc-800/40 w-full max-w-2xl">
                <p className="text-xs font-mono-tabular text-zinc-400 mb-4 font-semibold uppercase tracking-wider">
                  Or launch with an AI niche starter:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => onCreateNewProject('Tech & AI')}
                    className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                      isDark
                        ? 'bg-[#0E0E0E] border-zinc-800 hover:border-[#C9A063]/50'
                        : 'bg-zinc-50 border-zinc-200 hover:border-black'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-[#C9A063] mb-1">
                      <span>Tech & AI</span>
                      <span className="text-[10px] font-mono-tabular text-zinc-500">9:16</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Fast-paced silicon, robotics & AI compute B-roll with kinetic pop captions.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onCreateNewProject('Finance & Crypto')}
                    className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                      isDark
                        ? 'bg-[#0E0E0E] border-zinc-800 hover:border-[#C9A063]/50'
                        : 'bg-zinc-50 border-zinc-200 hover:border-black'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400 mb-1">
                      <span>Finance & Crypto</span>
                      <span className="text-[10px] font-mono-tabular text-zinc-500">9:16</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Market charts, luxury aesthetics, whooshes, and high-retention finance hooks.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onCreateNewProject('Motivation & Philosophy')}
                    className={`p-3 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                      isDark
                        ? 'bg-[#0E0E0E] border-zinc-800 hover:border-[#C9A063]/50'
                        : 'bg-zinc-50 border-zinc-200 hover:border-black'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                      <span>Motivation & Philosophy</span>
                      <span className="text-[10px] font-mono-tabular text-zinc-500">16:9</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Moody marble sculptures, ambient soundscapes, and cinematic serif typography.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PROJECT GRID CARDS */}
          {!isLoading && filteredProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => {
                const isConfirmingDelete = confirmDeleteId === project.id;
                const formattedDate = new Date(project.updatedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={project.id}
                    className={`group rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${
                      isDark
                        ? 'bg-[#0B0B0B] border-[#1C1C1C] hover:border-zinc-700'
                        : 'bg-white border-zinc-200 hover:border-zinc-400'
                    }`}
                  >
                    {/* Card Thumbnail / Preview Banner */}
                    <div
                      onClick={() => onOpenStudioWithProject(project)}
                      className="relative h-40 bg-zinc-900 cursor-pointer overflow-hidden flex items-center justify-center group-hover:opacity-95 transition-opacity"
                    >
                      <img
                        src={
                          project.thumbnailUrl ||
                          project.brollItems[0]?.imageUrl ||
                          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
                        }
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Aspect Ratio Badge */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono-tabular font-bold bg-black/75 text-zinc-200 border border-white/10 backdrop-blur-md">
                        {project.aspectRatio}
                      </div>

                      {/* Niche Badge */}
                      <div className="absolute top-3 left-16 px-2 py-0.5 rounded-md text-[10px] font-mono-tabular font-bold bg-[#C9A063]/90 text-black border border-[#C9A063]/40 backdrop-blur-md">
                        #{getProjectNiche(project)}
                      </div>

                      {/* Duration Tag */}
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono-tabular font-semibold bg-[#C9A063] text-black">
                        00:30.00
                      </div>

                      {/* Quick Open Indicator */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
                        <span className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold shadow-lg flex items-center gap-1.5">
                          <span>Open Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[10px] font-mono-tabular uppercase tracking-wider font-semibold text-[#C9A063] flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{getProjectNiche(project)}</span>
                          </span>
                          <span className="text-[10px] font-mono-tabular text-zinc-500">
                            {project.aspectRatio}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold tracking-tight text-zinc-100 truncate">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] font-mono-tabular text-zinc-400 mt-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>Edited {formattedDate}</span>
                        </div>
                      </div>

                      {/* Stems & Tracks Summary */}
                      <div className="flex items-center gap-2 text-[10px] font-mono-tabular text-zinc-400 pt-2 border-t border-zinc-800/40">
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                          {project.brollItems.length} B-Roll Clips
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                          {project.captionItems.length} Captions
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300">
                          {project.sfxItems.length} SFX
                        </span>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div
                      className={`px-4 py-3 border-t flex items-center justify-between text-xs ${
                        isDark ? 'border-[#181818] bg-[#0E0E0E]' : 'border-zinc-100 bg-zinc-50'
                      }`}
                    >
                      {isConfirmingDelete ? (
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[11px] text-rose-400 font-mono-tabular">
                            Delete project?
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-0.5 rounded text-[11px] border border-zinc-700 hover:bg-zinc-800"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(project.id)}
                              className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-500"
                            >
                              Confirm
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onOpenStudioWithProject(project)}
                            className="font-bold text-[#C9A063] hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <span>Launch Studio</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDuplicate(project)}
                              title="Duplicate project"
                              className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(project.id)}
                              title="Delete project"
                              className="p-1.5 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ZERO SEARCH RESULTS STATE */}
          {!isLoading && projects.length > 0 && filteredProjects.length === 0 && (
            <div
              className={`p-10 rounded-2xl border text-center flex flex-col items-center justify-center space-y-4 transition-all ${
                isDark ? 'bg-[#0A0A0A] border-[#1C1C1C]' : 'bg-white border-zinc-200 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#C9A063]/10 text-[#C9A063] border border-[#C9A063]/25">
                <Search className="w-5 h-5" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <h3 className="text-base font-bold tracking-tight">No matching projects found</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  No saved projects matched{' '}
                  <span className="text-[#C9A063] font-semibold font-mono-tabular">
                    "{searchQuery || selectedNicheFilter}"
                  </span>
                  {filterRatio !== 'all' ? ` in ${filterRatio}` : ''}. Try another keyword or reset filters.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedNicheFilter('all');
                  setFilterRatio('all');
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs border transition-all ${
                  isDark
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 hover:text-white'
                    : 'border-zinc-300 bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Search &amp; Filters</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* =====================================================================
          INITIALIZE NEW PROJECT MODAL (3 CHOICES)
          1. Niche Template (pre-curated beats & clips)
          2. AI Strategy Co-Pilot Script (ideation & viral hooks)
          3. Blank Timeline Canvas (clean slate from scratch)
          ===================================================================== */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-2xl bg-black/80 animate-fade-in">
          <div
            className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all ${
              isDark
                ? 'bg-[#0D0D0E]/95 border-zinc-800 text-zinc-100 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
                : 'bg-white border-zinc-200 text-zinc-900 shadow-2xl'
            }`}
          >
            {/* Header */}
            <div
              className={`px-6 py-4 border-b flex items-center justify-between ${
                isDark ? 'border-zinc-800/80 bg-[#121214]' : 'border-zinc-200 bg-zinc-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#C9A063]/15 border border-[#C9A063]/30 flex items-center justify-center text-[#C9A063]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Create New Project</h3>
                  <p className="text-[11px] font-mono-tabular text-zinc-400">
                    Choose how you want to initialize your studio workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isDark
                    ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    : 'border-zinc-200 text-zinc-600 hover:text-black hover:bg-zinc-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content: 3 Cards */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Option 1: Niche Sequence Template */}
                <div
                  onClick={() => setSelectedInitMode('template')}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    selectedInitMode === 'template'
                      ? 'border-[#C9A063] bg-[#C9A063]/10 ring-1 ring-[#C9A063]'
                      : isDark
                      ? 'border-zinc-800 bg-[#141416] hover:border-zinc-700'
                      : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🎬</span>
                      {selectedInitMode === 'template' && (
                        <Check className="w-4 h-4 text-[#C9A063]" />
                      )}
                    </div>
                    <div className="font-bold text-xs">Niche Template</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Pre-populated with 4 script beats, 4K b-roll clips, kinetic captions, and sound effects.
                    </p>
                  </div>
                  <span className="mt-3 inline-block text-[10px] font-mono-tabular font-semibold text-[#C9A063]">
                    Recommended
                  </span>
                </div>

                {/* Option 2: AI Strategy Co-Pilot Script */}
                <div
                  onClick={() => setSelectedInitMode('ai')}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    selectedInitMode === 'ai'
                      ? 'border-[#C9A063] bg-[#C9A063]/10 ring-1 ring-[#C9A063]'
                      : isDark
                      ? 'border-zinc-800 bg-[#141416] hover:border-zinc-700'
                      : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">🤖</span>
                      {selectedInitMode === 'ai' && (
                        <Check className="w-4 h-4 text-[#C9A063]" />
                      )}
                    </div>
                    <div className="font-bold text-xs">AI Co-Pilot Script</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Launches directly into the AI Strategy Chat to brainstorm viral hooks &amp; outline beats first.
                    </p>
                  </div>
                  <span className="mt-3 inline-block text-[10px] font-mono-tabular font-semibold text-sky-400">
                    Brainstorm First
                  </span>
                </div>

                {/* Option 3: Blank Canvas */}
                <div
                  onClick={() => setSelectedInitMode('blank')}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    selectedInitMode === 'blank'
                      ? 'border-[#C9A063] bg-[#C9A063]/10 ring-1 ring-[#C9A063]'
                      : isDark
                      ? 'border-zinc-800 bg-[#141416] hover:border-zinc-700'
                      : 'border-zinc-200 bg-zinc-50 hover:border-zinc-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">📄</span>
                      {selectedInitMode === 'blank' && (
                        <Check className="w-4 h-4 text-[#C9A063]" />
                      )}
                    </div>
                    <div className="font-bold text-xs">Blank Timeline</div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      Clean slate with empty tracks ready for your custom script, b-roll footage, and voiceover stems.
                    </p>
                  </div>
                  <span className="mt-3 inline-block text-[10px] font-mono-tabular font-semibold text-zinc-500">
                    From Scratch
                  </span>
                </div>
              </div>

              {/* Niche Selector */}
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  isDark ? 'bg-[#121214] border-zinc-800/80' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold">Select Project Niche</label>
                  <span className="text-[10px] font-mono-tabular text-zinc-500">
                    Customizes AI prompts and media tags
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      'Tech & AI',
                      'Finance & Crypto',
                      'Motivation & Philosophy',
                      'Fitness & Health',
                    ] as ContentNiche[]
                  ).map((niche) => {
                    const isSelected = selectedInitNiche === niche;
                    return (
                      <button
                        key={niche}
                        type="button"
                        onClick={() => setSelectedInitNiche(niche)}
                        className={`px-3 py-2 rounded-lg border text-xs font-semibold text-left transition-all ${
                          isSelected
                            ? isDark
                              ? 'bg-[#C9A063] text-[#050505] border-[#C9A063]'
                              : 'bg-black text-white border-black'
                            : isDark
                            ? 'bg-[#18181A] border-zinc-700/80 text-zinc-300 hover:text-white'
                            : 'bg-white border-zinc-300 text-zinc-700 hover:text-black'
                        }`}
                      >
                        {niche}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`px-6 py-4 border-t flex items-center justify-between ${
                isDark ? 'border-zinc-800/80 bg-[#121214]' : 'border-zinc-200 bg-zinc-50'
              }`}
            >
              <button
                type="button"
                onClick={() => setIsNewProjectModalOpen(false)}
                className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100'
                }`}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNewProjectModalOpen(false);
                  onCreateNewProject(selectedInitNiche, selectedInitMode);
                }}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs shadow-lg transition-all ${
                  isDark
                    ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b] active:scale-95'
                    : 'bg-black text-white hover:bg-zinc-800 active:scale-95'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Launch Studio Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
