import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Film,
  Layers,
  Moon,
  Scissors,
  Sliders,
  Sparkles,
  Sun,
  Wand2,
} from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { HeroSection } from './components/HeroSection';
import { OnboardingModal } from './components/OnboardingModal';
import { RoiCalculator } from './components/RoiCalculator';
import { ScrollReveal } from './components/ScrollReveal';
import { StudioWorkspace } from './components/StudioWorkspace';
import { UserDashboard } from './components/UserDashboard';
import { ApiVaultModal } from './components/ApiVaultModal';
import { PlatformTutorialModal } from './components/PlatformTutorialModal';
import {
  BROLL_LIBRARY,
  GENERATED_IMAGES,
  NICHE_WORKSPACE_TEMPLATES,
} from './data/presets';
import {
  getUserProfile,
  logOut,
  onAuthChange,
  saveProject,
  saveUserProfile,
} from './services/firebase';
import {
  ContentNiche,
  OnboardingConfig,
  PricingTierName,
  SavedProject,
  ThemeMode,
  UserProfile,
} from './types';

const PRICING_TIERS: {
  name: PricingTierName;
  audience: string;
  price: number;
  description: string;
  highlighted?: boolean;
  features: string[];
}[] = [
  {
    name: 'Creator',
    audience: 'For solo face-cam & faceless essayists',
    price: 29,
    description:
      'Automated script-to-B-roll timeline assembly, kinetic captions, and 4K stock access for independent channels.',
    features: [
      'Up to 15 automated timeline builds / month',
      'Semantic stock B-roll matching (4K Rec.709)',
      'Kinetic caption templates & safe-zone framing',
      'Direct export to Premiere Pro (.XML) & Final Cut',
      'Talking-Head & 100% Faceless workflow modes',
    ],
  },
  {
    name: 'Pro Agency',
    audience: 'For multi-channel studios & production teams',
    price: 79,
    highlighted: true,
    description:
      'Real-time multiplayer timeline cursors, custom LUT presets, unlimited 6K cinema stems, and batch aspect-ratio reframing.',
    features: [
      'Unlimited automated timeline assemblies',
      '5 real-time multiplayer editor seats & cursor sync',
      'Custom .CUBE LUT upload & brand typography locks',
      'Simultaneous 16:9, 9:16, and 1:1 master renders',
      'Multi-track stem isolation (V1, V2, C1, A1)',
    ],
  },
  {
    name: 'Enterprise BYOK',
    audience: 'For media networks & sovereign cloud pipelines',
    price: 199,
    description:
      'Bring-Your-Own-Key inference routing, private S3/Frame.io asset indexing, and dedicated NLE pipeline automation.',
    features: [
      'Bring Your Own API Keys (zero markup inference)',
      'Private archival vault indexing (up to 50 TB)',
      'Custom webhook triggers & headless EDL/XML API',
      'Unlimited team workspaces & role permissions',
      'Dedicated solutions engineer & SLA guarantee',
    ],
  },
];

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'studio'>('landing');
  const [currentProject, setCurrentProject] = useState<SavedProject | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isApiVaultOpen, setIsApiVaultOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<PricingTierName>('Pro Agency');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [pipelineTab, setPipelineTab] = useState<'semantic' | 'broll' | 'nle'>('semantic');

  const [onboardingConfig, setOnboardingConfig] = useState<OnboardingConfig>({
    workflow: 'Talking Head / Face-Cam Creator',
    creatorFormat: 'Talking Head / Face-Cam Creator',
    niche: 'Tech & AI',
    coreNiche: 'Tech & AI News',
    microTags: ['#ai', '#compute', '#silicon', '#hardware'],
    platform: 'YouTube Longform (16:9 Widescreen)',
    pacingDensity: 'Viral Fast-Paced',
    brandTone: 'Authoritative & Crisp',
    preset: 'Viral Punch',
    completed: false,
  });

  // Listen to Firebase Authentication and restore cloud profile
  // CRITICAL REQUIREMENT: whenever you open the platform and are logged in, you bypass the landing page and land straight on your dashboard
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || 'B-Roll Flow Creator',
          email: firebaseUser.email || 'creator@brollflow.internal',
          authProvider: 'firebase',
          selectedTier: 'Pro Agency',
          uid: firebaseUser.uid,
        });

        try {
          const profile = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setOnboardingConfig((prev) => ({
              ...prev,
              workflow: profile.creatorFormat as any,
              creatorFormat: profile.creatorFormat as any,
              niche: profile.niche.includes('Tech') ? 'Tech & AI' : (profile.niche as any),
              coreNiche: profile.niche as any,
              microTags: profile.microTags || prev.microTags,
              platform: profile.platform as any,
              pacingDensity: profile.pacingDensity as any,
              brandTone: profile.brandTone as any,
              completed: true,
            }));
          }
        } catch (e) {
          console.warn('Firebase profile restore error:', e);
        }

        // Bypass landing page and land straight on dashboard!
        setActiveView('dashboard');
      } else {
        setActiveView((prev) => (prev === 'dashboard' ? 'landing' : prev));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenAuth = (mode: 'signin' | 'signup', tier?: PricingTierName) => {
    if (tier) setSelectedTier(tier);
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = async (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsAuthOpen(false);

    // Check if user already has an existing profile in Firestore
    if (authenticatedUser.uid) {
      try {
        const existingProfile = await getUserProfile(authenticatedUser.uid);
        if (existingProfile && existingProfile.niche) {
          setOnboardingConfig((prev) => ({
            ...prev,
            workflow: existingProfile.creatorFormat as any,
            creatorFormat: existingProfile.creatorFormat as any,
            niche: existingProfile.niche.includes('Tech') ? 'Tech & AI' : (existingProfile.niche as any),
            coreNiche: existingProfile.niche as any,
            microTags: existingProfile.microTags || prev.microTags,
            platform: existingProfile.platform as any,
            pacingDensity: existingProfile.pacingDensity as any,
            brandTone: existingProfile.brandTone as any,
            completed: true,
          }));
          setActiveView('dashboard');
          return;
        }
      } catch (err) {
        console.warn('Profile lookup notice:', err);
      }
    }

    // New user -> prompt onboarding flow
    setIsOnboardingOpen(true);
  };

  const handleOnboardingComplete = async (config: OnboardingConfig) => {
    setOnboardingConfig(config);
    setIsOnboardingOpen(false);

    // Save profile to Firestore
    if (user?.uid) {
      try {
        await saveUserProfile({
          uid: user.uid,
          email: user.email || '',
          displayName: user.name || '',
          creatorFormat: config.creatorFormat || 'Talking Head / Face-Cam Creator',
          niche: config.niche || 'Tech & AI',
          microTags: config.microTags || [],
          platform: config.platform || 'TikTok / Reels / Shorts (9:16 Vertical)',
          pacingDensity: config.pacingDensity || 'Viral Fast-Paced',
          brandTone: config.brandTone || 'Authoritative & Crisp',
          updatedAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Error saving creator profile:', e);
      }
    }

    // Lands on empty dashboard telling them no projects yet that they should create one
    setActiveView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreateNewProject = async (
    templateNiche?: ContentNiche,
    initMode: 'template' | 'ai' | 'blank' = 'template'
  ) => {
    const chosenNiche =
      templateNiche ||
      (NICHE_WORKSPACE_TEMPLATES[onboardingConfig.niche as ContentNiche]
        ? (onboardingConfig.niche as ContentNiche)
        : 'Tech & AI');
    const nicheTemplate =
      NICHE_WORKSPACE_TEMPLATES[chosenNiche] || NICHE_WORKSPACE_TEMPLATES['Tech & AI'];

    let scriptText = nicheTemplate.scriptBeats.map((b) => b.speakerLine).join('\n\n');
    let brollItems: SavedProject['brollItems'] = nicheTemplate.scriptBeats.map((b, idx) => ({
      id: `broll-${idx + 1}`,
      clipId: `clip-${idx + 1}`,
      title: nicheTemplate.tags[idx % nicheTemplate.tags.length] || 'Cinematic B-Roll',
      imageUrl: BROLL_LIBRARY[idx % BROLL_LIBRARY.length]?.imageUrl || '',
      startSec: idx * 5,
      durationSec: 5,
      resolution: '4K Rec.709',
      isLocked: false,
    }));
    let captionItems: SavedProject['captionItems'] = nicheTemplate.scriptBeats.map((b, idx) => ({
      id: `caption-${idx + 1}`,
      text: b.speakerLine,
      startSec: idx * 5,
      durationSec: 5,
      style: 'Hormozi Punch',
    }));
    let sfxItems: SavedProject['sfxItems'] = nicheTemplate.scriptBeats.map((b, idx) => ({
      id: `sfx-${idx + 1}`,
      sfxId: `sfx-${idx + 1}`,
      name: idx % 2 === 0 ? 'Whoosh Fast' : 'Impact Sub Bass',
      startSec: idx * 5 + 0.1,
      durationSec: 0.8,
      category: idx % 2 === 0 ? ('whoosh' as const) : ('impact' as const),
    }));

    let projectName = `${chosenNiche} Sequence #${Math.floor(100 + Math.random() * 900)}`;

    if (initMode === 'blank') {
      scriptText = '';
      brollItems = [];
      captionItems = [];
      sfxItems = [];
      projectName = `Blank Canvas Sequence #${Math.floor(100 + Math.random() * 900)}`;
    } else if (initMode === 'ai') {
      projectName = `${chosenNiche} AI Co-Pilot Script #${Math.floor(100 + Math.random() * 900)}`;
    }

    const newProject: SavedProject = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user?.uid || 'guest-creator',
      name: projectName,
      niche: chosenNiche,
      aspectRatio: chosenNiche.includes('Philosophy') ? '16:9' : '9:16',
      scriptText,
      brollItems,
      captionItems,
      sfxItems,
      subtitleStyle: {
        preset: 'Hormozi Punch',
        fontFamily: 'Inter',
        fontSize: 28,
        strokeWidth: 4,
        shadowOffset: 3,
        isUppercase: true,
        highlightColor: '#FACC15',
        baseTextColor: '#FFFFFF',
        boxColor: '#000000',
        boxOpacity: 0.85,
        animationMode: 'Bounce In',
      },
      updatedAt: new Date().toISOString(),
      thumbnailUrl: brollItems[0]?.imageUrl || BROLL_LIBRARY[0]?.imageUrl,
    };

    if (user?.uid) {
      try {
        await saveProject(user.uid, newProject);
      } catch (err) {
        console.warn('Project save notice:', err);
      }
    }

    setCurrentProject(newProject);
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStudioWithProject = (project: SavedProject) => {
    setCurrentProject(project);
    setActiveView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setUser(null);
    setActiveView('landing');
  };

  const isDark = theme === 'dark';

  // 1. Studio Workspace View
  if (activeView === 'studio') {
    return (
      <>
        <StudioWorkspace
          config={onboardingConfig}
          user={user}
          theme={theme}
          initialProject={currentProject}
          onToggleTheme={toggleTheme}
          onUpdateConfig={setOnboardingConfig}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onBackToLanding={() => setActiveView('landing')}
          onBackToDashboard={() => setActiveView('dashboard')}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          initialConfig={onboardingConfig}
          theme={theme}
          onComplete={handleOnboardingComplete}
        />
      </>
    );
  }

  // 2. Creator Dashboard View (bypasses landing page when logged in)
  if (activeView === 'dashboard' && user) {
    return (
      <>
        <UserDashboard
          user={user}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenStudioWithProject={handleOpenStudioWithProject}
          onCreateNewProject={handleCreateNewProject}
          onOpenApiVault={() => setIsApiVaultOpen(true)}
          onOpenTutorial={() => setIsTutorialOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          onSignOut={handleSignOut}
        />
        <ApiVaultModal
          isOpen={isApiVaultOpen}
          onClose={() => setIsApiVaultOpen(false)}
          theme={theme}
        />
        <PlatformTutorialModal
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
          theme={theme}
          onOpenStudio={() => {
            setIsTutorialOpen(false);
            handleCreateNewProject();
          }}
        />
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          initialConfig={onboardingConfig}
          theme={theme}
          onComplete={handleOnboardingComplete}
        />
      </>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? 'bg-[#050505] text-[#F4F4F5]'
          : 'bg-[#F5F5F7] text-[#111111]'
      }`}
    >
      {/* 1. Header Navigation */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-200 ${
          isDark
            ? 'bg-[#050505]/85 border-[#161616]'
            : 'bg-[#F5F5F7]/85 border-[#E1E1E1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Brand Logo ("B-Roll Flow" with minimal geometry) */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-base font-semibold tracking-tight whitespace-nowrap shrink-0"
          >
            <svg
              className="w-5 h-5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="2"
                y="4"
                width="13"
                height="16"
                rx="1.5"
                stroke="currentColor"
                strokeWidth="1.75"
              />
              <path
                d="M18 7V17M21.5 9.5V14.5"
                stroke={isDark ? '#C9A063' : '#111111'}
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
            <span>B-Roll Flow</span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
            <a
              href="#features"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isDark ? 'hover:text-white' : 'hover:text-black'
              }`}
            >
              Features
            </a>
            <a
              href="#pipeline"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isDark ? 'hover:text-white' : 'hover:text-black'
              }`}
            >
              Pipeline
            </a>
            <a
              href="#roi-calculator"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isDark ? 'hover:text-white' : 'hover:text-black'
              }`}
            >
              Calculator
            </a>
            <a
              href="#pricing"
              className={`transition-colors whitespace-nowrap shrink-0 ${
                isDark ? 'hover:text-white' : 'hover:text-black'
              }`}
            >
              Pricing
            </a>
          </nav>

          {/* Theme Switcher Toggle (Sun/Moon) + CTAs ("Sign In" and "Launch Studio") */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Alabaster Light Mode' : 'Switch to Obsidian Dark Mode'}
              className={`p-2 rounded-lg border transition-colors ${
                isDark
                  ? 'border-[#161616] bg-[#0C0C0C] text-zinc-300 hover:text-[#C9A063] hover:border-zinc-700'
                  : 'border-[#E1E1E1] bg-white text-zinc-700 hover:text-black hover:border-zinc-400'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <button
                type="button"
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isDark
                    ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d4af76]'
                    : 'bg-[#111111] text-white hover:bg-zinc-800'
                }`}
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenAuth('signin')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'text-zinc-300 hover:text-white'
                      : 'text-zinc-700 hover:text-black'
                  }`}
                >
                  Sign In
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenAuth('signup')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isDark
                      ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d4af76]'
                      : 'bg-[#111111] text-white hover:bg-zinc-800'
                  }`}
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Large Video Background & Cinema Gradients */}
      <HeroSection
        theme={theme}
        onOpenAuth={(mode) => handleOpenAuth(mode, 'Pro Agency')}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onLaunchStudio={() => setIsOnboardingOpen(true)}
      />

      {/* 3. Features & Editorial Pipeline Architecture */}
      <section
        id="features"
        className={`py-20 border-b transition-colors duration-200 ${
          isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header with Scroll-Triggered Fade-In */}
          <ScrollReveal delayMs={0} distancePx={16} className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                  <span>01. Core Capabilities</span>
                  <span aria-hidden="true">·</span>
                  <span>Deterministic Editorial Engine</span>
                </div>
                <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
                  Engineered Like a Cinema Finishing Suite.
                </h2>
              </div>
              <p className="text-sm text-zinc-400 max-w-md">
                Every narrative beat is parsed for visual nouns, acoustic transients, and emotional cadence before assembling non-destructive tracks.
              </p>
            </div>
          </ScrollReveal>

          {/* Asymmetric Bento Grid with Staggered Scroll-Triggered Fade-In */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Feature 01 (Span 7) */}
            <ScrollReveal
              className="lg:col-span-7 flex flex-col"
              delayMs={80}
              distancePx={22}
            >
              <div
                className={`h-full rounded-xl border p-7 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 ${
                  isDark
                    ? 'bg-[#0C0C0C] border-[#161616]'
                    : 'bg-white border-[#E1E1E1]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <span className="font-mono-tabular">01. Semantic Script Decomposition</span>
                    <span className="font-mono-tabular">Sub-Frame Precision</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2.5">
                    Context-Aware B-Roll Selection Without Generic Stock Clichés
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Instead of matching isolated keywords, B-Roll Flow evaluates paragraph-level narrative tension, camera focal length continuity, and color temperature so every cutaway feels hand-pulled by a senior documentary editor.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    className={`rounded-lg border overflow-hidden transition-transform duration-300 hover:scale-[1.01] ${
                      isDark ? 'border-[#161616] bg-[#050505]' : 'border-[#E1E1E1] bg-[#F5F5F7]'
                    }`}
                  >
                    <img
                      src={GENERATED_IMAGES.watchmaker}
                      alt="Macro horology B-roll stem"
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3 text-xs">
                      <div className="font-mono-tabular text-zinc-500 mb-0.5">
                        V2 Cutaway · 99.2% Semantic Lock
                      </div>
                      <div className="font-medium">
                        Calibre 89 Chronograph Macro (6K RAW)
                      </div>
                    </div>
                  </div>

                  <div
                    className={`rounded-lg border overflow-hidden transition-transform duration-300 hover:scale-[1.01] ${
                      isDark ? 'border-[#161616] bg-[#050505]' : 'border-[#E1E1E1] bg-[#F5F5F7]'
                    }`}
                  >
                    <img
                      src={GENERATED_IMAGES.architecture}
                      alt="Alpine brutalist architecture B-roll stem"
                      referrerPolicy="no-referrer"
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3 text-xs">
                      <div className="font-mono-tabular text-zinc-500 mb-0.5">
                        V2 Cutaway · 98.4% Semantic Lock
                      </div>
                      <div className="font-medium">
                        Alpine Concrete Pavilion (Anamorphic)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 02 (Span 5) */}
            <ScrollReveal
              className="lg:col-span-5 flex flex-col"
              delayMs={160}
              distancePx={22}
            >
              <div
                className={`h-full rounded-xl border p-7 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 ${
                  isDark
                    ? 'bg-[#0C0C0C] border-[#161616]'
                    : 'bg-white border-[#E1E1E1]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <span className="font-mono-tabular">02. Dual Creator Modes</span>
                    <span className="font-mono-tabular">A-Roll & Faceless</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2.5">
                    Built for Face-Cam Directors & 100% Faceless Channels
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Toggle seamlessly between preserving primary talking-head posture on Track V1 with automatic J/L-cut cutaways, or generating continuous wall-to-wall visual essays synced to neural or studio voiceovers.
                  </p>
                </div>

                <div
                  className={`rounded-lg border p-4 space-y-3 ${
                    isDark ? 'border-[#161616] bg-[#050505]' : 'border-[#E1E1E1] bg-[#F5F5F7]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Silence & Breath Trimming</span>
                    <span className="font-mono-tabular text-[#C9A063]">-42 dB Threshold</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Kinetic Caption Safe Zones</span>
                    <span className="font-mono-tabular">9:16 · 16:9 · 1:1</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Multiplayer Cursor Latency</span>
                    <span className="font-mono-tabular">&lt; 18ms WebRTC Sync</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 03 (Span 6) - Cybernetic Stem Matching */}
            <ScrollReveal
              className="lg:col-span-6 flex flex-col"
              delayMs={240}
              distancePx={22}
            >
              <div
                className={`h-full rounded-xl border p-7 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 ${
                  isDark
                    ? 'bg-[#0C0C0C] border-[#161616]'
                    : 'bg-white border-[#E1E1E1]'
                }`}
              >
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <span className="font-mono-tabular">03. Neural Iris & AR Overlay Conform</span>
                    <span className="font-mono-tabular">8K Anamorphic</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2.5">
                    Frame-Accurate Cybernetic HUD & Spatial Sync
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    Track facial gaze vectors and project contextual UI overlays directly onto narrative subjects. Real-time optical flow tracks motion blur across moving backgrounds.
                  </p>
                </div>

                <div
                  className={`rounded-lg border overflow-hidden ${
                    isDark ? 'border-[#161616] bg-[#050505]' : 'border-[#E1E1E1] bg-[#F5F5F7]'
                  }`}
                >
                  <img
                    src={GENERATED_IMAGES.cyberneticSubway}
                    alt="Cybernetic subway AR HUD B-roll asset"
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover object-center"
                  />
                  <div className="p-3 text-xs flex items-center justify-between font-mono-tabular text-zinc-400">
                    <span>Reel 01 · 8K Anamorphic Cyberpunk</span>
                    <span className="text-[#C9A063]">99.8% Spatial Match</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Feature 04 (Span 6) - Roundtrip NLE Handoff */}
            <ScrollReveal
              className="lg:col-span-6 flex flex-col"
              delayMs={320}
              distancePx={22}
            >
              <div
                className={`h-full rounded-xl border p-7 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700 ${
                  isDark
                    ? 'bg-[#0C0C0C] border-[#161616]'
                    : 'bg-white border-[#E1E1E1]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <span className="font-mono-tabular">04. Lossless NLE Roundtrip</span>
                    <span className="font-mono-tabular">Zero Transcode</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2.5">
                    Multi-Track Stems for DaVinci Resolve & Premiere Pro
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Every exported timeline retains native handles, separate audio tracks for foley and dialogue, and fully editable kinetic text layers without rasterizing.
                  </p>
                </div>

                <div
                  className={`rounded-lg border p-4 space-y-2.5 font-mono-tabular text-xs ${
                    isDark ? 'border-[#161616] bg-[#050505]' : 'border-[#E1E1E1] bg-[#F5F5F7]'
                  }`}
                >
                  <div className="flex items-center justify-between text-zinc-300">
                    <span>Track V2 · B-Roll Cutaway (Handle: +24f)</span>
                    <span className="text-[#C9A063]">Pass-Through</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Track V1 · Master Camera A-Roll</span>
                    <span>Synchronized</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Track C1 · Kinetic SVG Subtitles</span>
                    <span>Vector Text</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Track A1 · 32-Bit Float Dialogue Master</span>
                    <span>Cleaned -14LUFS</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. Interactive Pipeline & Case Study Proof Section */}
      <section
        id="pipeline"
        className={`py-20 border-b transition-colors duration-200 ${
          isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
                <span>02. Production Pipeline & Proof</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-tabular">Non-Destructive XML / EDL</span>
              </div>
              <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight">
                From Raw Script to Multi-Track NLE Master in 90 Seconds.
              </h2>
            </div>

            {/* Interactive Pipeline Stage Selector */}
            <div
              className={`flex items-center gap-1 p-1 rounded-lg border self-start ${
                isDark
                  ? 'bg-[#0C0C0C] border-[#161616]'
                  : 'bg-white border-[#E1E1E1]'
              }`}
            >
              {(
                [
                  { id: 'semantic', label: '01. Script Ingestion' },
                  { id: 'broll', label: '02. Optical Matching' },
                  { id: 'nle', label: '03. NLE Export' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPipelineTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    pipelineTab === tab.id
                      ? isDark
                        ? 'bg-[#050505] text-[#C9A063] border border-[#161616]'
                        : 'bg-[#111111] text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pipeline Interactive Display + Quantified Case Studies */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div
              className={`lg:col-span-6 rounded-xl border p-7 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#0C0C0C] border-[#161616]'
                  : 'bg-white border-[#E1E1E1]'
              }`}
            >
              {pipelineTab === 'semantic' && (
                <div>
                  <div className="text-xs font-mono-tabular text-[#C9A063] mb-2">
                    STAGE 01 · ACOUSTIC & LEXICAL PARSING
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Word-Level Timestamp Alignment & Retention Pacing
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Upload a studio voiceover, raw A-roll camera clip, or markdown script. B-Roll Flow maps every spoken syllable to 24fps/60fps timecode and flags visual hook intervals every 2.4 seconds.
                  </p>
                </div>
              )}
              {pipelineTab === 'broll' && (
                <div>
                  <div className="text-xs font-mono-tabular text-[#C9A063] mb-2">
                    STAGE 02 · COLOR-MATCHED STEM SELECTION
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    LUT-Consistent Footage Across 18,000+ Editorial Reels
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Clips are filtered by dynamic range, lens characteristics, and color histogram so a dark obsidian tech essay never receives an over-exposed daylight stock clip.
                  </p>
                </div>
              )}
              {pipelineTab === 'nle' && (
                <div>
                  <div className="text-xs font-mono-tabular text-[#C9A063] mb-2">
                    STAGE 03 · ROUNDTRIP FINISHING
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    Instant Handoff to DaVinci Resolve, Premiere Pro & Final Cut
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Download a clean, unflattened `.FCPXML` or `.XML` project bundle with separate video tracks, editable caption layers, and 2-second handle trims on every clip.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-5 border-t border-zinc-800/40 text-xs">
                <span className="text-zinc-500">Average 12-Minute Essay Assembly</span>
                <span className="font-mono-tabular font-semibold">
                  1m 24s Total Compute
                </span>
              </div>
            </div>

            {/* Adjacent Proof / Case Studies */}
            <div
              className={`lg:col-span-6 rounded-xl border p-7 flex flex-col justify-between ${
                isDark
                  ? 'bg-[#0C0C0C] border-[#161616]'
                  : 'bg-white border-[#E1E1E1]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                  <span>Verified Studio Production Benchmarks</span>
                  <span className="font-mono-tabular">Q3–Q4 Cohort</span>
                </div>
                <blockquote className="text-sm sm:text-base leading-relaxed mb-6">
                  “We moved our 14-editor documentary network onto B-Roll Flow. Rough-cut assembly dropped from 11 hours per episode to 95 minutes while 60-second audience retention climbed 38%.”
                </blockquote>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-zinc-800/40 text-xs">
                <div>
                  <div className="font-semibold">Julian Vance</div>
                  <div className="text-zinc-500">
                    Head of Post-Production · Monolith Documentary Labs, Zurich
                  </div>
                </div>
                <div className="font-mono-tabular text-[#C9A063] font-semibold">
                  -78% Assembly Hours · 40+ Eps/Mo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Interactive ROI Calculator Widget */}
      <RoiCalculator
        theme={theme}
        onStartTrial={() => handleOpenAuth('signup', 'Pro Agency')}
      />

      {/* 6. Pricing Cards */}
      <section
        id="pricing"
        className={`py-20 border-b transition-colors duration-200 ${
          isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-2 text-xs text-zinc-500 mb-3">
              <span>04. Studio Licensing</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">Transparent Monthly Cadence</span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
              Precision Tiers for Independent Directors & Media Networks.
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              Select a workspace license to authenticate and launch the 4-step studio calibration wizard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {PRICING_TIERS.map((tier) => {
              const isHighlighted = Boolean(tier.highlighted);
              return (
                <div
                  key={tier.name}
                  className={`rounded-xl border p-7 backdrop-blur-xl flex flex-col justify-between transition-all ${
                    isHighlighted
                      ? isDark
                        ? 'bg-[#0C0C0C]/90 border-[#C9A063]'
                        : 'bg-white/95 border-[#111111]'
                      : isDark
                      ? 'bg-[#0C0C0C]/75 border-[#161616]'
                      : 'bg-white/85 border-[#E1E1E1]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 mb-2">
                      <span>{tier.audience}</span>
                      {isHighlighted && (
                        <span
                          className={`font-mono-tabular font-medium ${
                            isDark ? 'text-[#C9A063]' : 'text-[#111111]'
                          }`}
                        >
                          Most Popular
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif-editorial text-2xl font-semibold mb-4">
                      {tier.name}
                    </h3>

                    <div className="flex items-baseline gap-1.5 mb-4">
                      <span className="font-mono-tabular text-4xl font-semibold">
                        ${tier.price}
                      </span>
                      <span className="text-xs font-mono-tabular text-zinc-500">
                        /mo
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                      {tier.description}
                    </p>

                    <div
                      className={`pt-5 border-t space-y-3 mb-8 ${
                        isDark ? 'border-[#161616]' : 'border-[#E1E1E1]'
                      }`}
                    >
                      {tier.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2.5 text-xs">
                          <Check
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isDark ? 'text-[#C9A063]' : 'text-[#111111]'
                            }`}
                          />
                          <span className={isDark ? 'text-zinc-300' : 'text-zinc-700'}>
                            {feat}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAuth('signup', tier.name)}
                    className={`w-full py-3 px-4 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      isHighlighted
                        ? isDark
                          ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d4af76]'
                          : 'bg-[#111111] text-white hover:bg-zinc-800'
                        : isDark
                        ? 'bg-[#050505] border border-[#161616] text-zinc-200 hover:border-[#C9A063]'
                        : 'bg-[#F5F5F7] border border-[#E1E1E1] text-zinc-900 hover:border-black'
                    }`}
                  >
                    Select {tier.name} & Configure
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer */}
      <footer className="py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-zinc-400">B-Roll Flow</span>
            <span aria-hidden="true">·</span>
            <span>Geneva &amp; San Francisco</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-tabular">All Rights Reserved</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => handleOpenAuth('signin')}
              className="hover:text-zinc-300 transition-colors"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              Onboarding Wizard
            </button>
            <button
              type="button"
              onClick={() => setActiveView('studio')}
              className="hover:text-zinc-300 transition-colors"
            >
              Direct Studio Access
            </button>
          </div>
        </div>
      </footer>

      {/* 7. Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
        selectedTier={selectedTier}
        theme={theme}
        onSuccess={handleAuthSuccess}
      />

      {/* 8. Multi-Step Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialConfig={onboardingConfig}
        theme={theme}
        onComplete={handleOnboardingComplete}
      />

      {/* 9. API Integration & Token Vault Modal */}
      <ApiVaultModal
        isOpen={isApiVaultOpen}
        onClose={() => setIsApiVaultOpen(false)}
        theme={theme}
      />

      {/* 10. Platform Tutorial Walkthrough Modal */}
      <PlatformTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        theme={theme}
        onOpenStudio={() => {
          setIsTutorialOpen(false);
          handleCreateNewProject();
        }}
      />
    </div>
  );
}
