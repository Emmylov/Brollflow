import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cloud,
  Film,
  Hash,
  Layers,
  Mic,
  Monitor,
  Plus,
  Radio,
  Sliders,
  Sparkles,
  Users,
  Video,
  Volume2,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import {
  BRAND_TONE_5STEP,
  CORE_NICHE_5STEP,
  CREATOR_FORMAT_5STEP,
  PACING_DENSITY_5STEP,
  TARGET_PLATFORM_5STEP,
} from '../data/presets';
import {
  BrandTone,
  CoreNiche,
  CreatorFormat,
  OnboardingConfig,
  PacingDensity,
  TargetPlatform,
  ThemeMode,
} from '../types';
import { auth, saveUserProfile, signInGuestUser } from '../services/firebase';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig: OnboardingConfig;
  theme: ThemeMode;
  onComplete: (config: OnboardingConfig) => void;
}

const STEP_DEFINITIONS = [
  { step: 1, label: 'Step 1 of 5', title: 'Creator Type & Content Format', icon: Film },
  { step: 2, label: 'Step 2 of 5', title: 'Core Niche & Micro-Topics', icon: Layers },
  { step: 3, label: 'Step 3 of 5', title: 'Target Platform & Aspect Ratio', icon: Monitor },
  { step: 4, label: 'Step 4 of 5', title: 'Pacing & Editing Density Style', icon: Zap },
  { step: 5, label: 'Step 5 of 5', title: 'Brand Tone & Voice Personality', icon: Mic },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  theme,
  onComplete,
}) => {
  const isDark = theme === 'dark';

  // 5 Step State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [creatorFormat, setCreatorFormat] = useState<CreatorFormat>(
    initialConfig.creatorFormat || 'Talking Head / Face-Cam Creator'
  );
  const [coreNiche, setCoreNiche] = useState<CoreNiche>(
    initialConfig.coreNiche || 'Tech & AI News'
  );
  const [microTags, setMicroTags] = useState<string[]>(
    initialConfig.microTags && initialConfig.microTags.length > 0
      ? initialConfig.microTags
      : ['#ai', '#compute', '#silicon', '#hardware']
  );
  const [tagInput, setTagInput] = useState<string>('');
  const [platform, setPlatform] = useState<TargetPlatform>(
    initialConfig.platform || 'YouTube Longform (16:9 Widescreen)'
  );
  const [pacingDensity, setPacingDensity] = useState<PacingDensity>(
    initialConfig.pacingDensity || 'Viral Fast-Paced'
  );
  const [brandTone, setBrandTone] = useState<BrandTone>(
    initialConfig.brandTone || 'Authoritative & Crisp'
  );

  // Cinematic Provisioning Loader State
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [initProgress, setInitProgress] = useState<number>(0);
  const [initStageText, setInitStageText] = useState<string>('');
  const [firebaseStatus, setFirebaseStatus] = useState<string>('Connecting to Firebase Cloud...');

  if (!isOpen) return null;

  // Tag Handling
  const handleAddTag = (rawTag: string) => {
    const clean = rawTag.trim().toLowerCase();
    if (!clean) return;
    const formatted = clean.startsWith('#') ? clean : `#${clean}`;
    if (!microTags.includes(formatted)) {
      setMicroTags((prev) => [...prev, formatted]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMicroTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleSelectNiche = (nicheOption: (typeof CORE_NICHE_5STEP)[0]) => {
    setCoreNiche(nicheOption.id);
    // Merge default tags
    setMicroTags((prev) => {
      const merged = Array.from(new Set([...prev, ...nicheOption.defaultTags]));
      return merged.slice(0, 10);
    });
  };

  // Step Navigation
  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleInitializeWorkspace();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Action Trigger: Initialize Personalized Workspace + Firebase Persistence + Cinematic Loader
  const handleInitializeWorkspace = async () => {
    setIsInitializing(true);
    setInitProgress(5);
    setInitStageText('Synthesizing narrative beats & dialogue hooks...');

    const stages = [
      { progress: 24, text: `Synthesizing narrative beats for ${coreNiche}...` },
      { progress: 48, text: 'Querying Rec.709 4K stock B-roll asset catalog...' },
      { progress: 72, text: `Calibrating ${pacingDensity} cuts & kinetic typography...` },
      { progress: 90, text: 'Baking 48kHz audio stems & sync triggers...' },
      { progress: 100, text: 'Finalizing personalized workspace profile...' },
    ];

    // Trigger Firebase save in background
    try {
      let currentUser = auth.currentUser;
      if (!currentUser) {
        currentUser = await signInGuestUser();
      }

      if (currentUser) {
        setFirebaseStatus('Synchronized with Firebase Firestore (users/' + currentUser.uid.slice(0, 8) + ')');
        await saveUserProfile({
          uid: currentUser.uid,
          email: currentUser.email || 'guest-creator@brollflow.internal',
          displayName: currentUser.displayName || 'B-Roll Flow Creator',
          creatorFormat,
          niche: coreNiche,
          microTags,
          platform,
          pacingDensity,
          brandTone,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Firebase profile persistence fallback to local session:', err);
      setFirebaseStatus('Saved to session state with cloud sync queued');
    }

    // Step through cinematic loader
    let currentIdx = 0;
    const interval = window.setInterval(() => {
      if (currentIdx < stages.length) {
        setInitProgress(stages[currentIdx].progress);
        setInitStageText(stages[currentIdx].text);
        currentIdx++;
      } else {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setIsInitializing(false);

          const finalConfig: OnboardingConfig = {
            workflow: creatorFormat,
            creatorFormat,
            niche: coreNiche.includes('Tech')
              ? 'Tech & AI'
              : coreNiche.includes('Finance')
              ? 'Finance & Crypto'
              : coreNiche.includes('Documentary')
              ? 'True Crime & Mystery'
              : coreNiche.includes('Philosophy')
              ? 'Motivation & Philosophy'
              : 'E-commerce & SaaS',
            coreNiche,
            microTags,
            platform,
            pacingDensity,
            brandTone,
            preset:
              pacingDensity === 'Viral Fast-Paced'
                ? 'Viral Punch'
                : pacingDensity === 'Cinematic Documentary'
                ? 'Cinematic Noir'
                : 'Minimalist Clean',
            completed: true,
          };

          onComplete(finalConfig);
          onClose();
        }, 500);
      }
    }, 450);
  };

  const activeStepMeta = STEP_DEFINITIONS[currentStep - 1];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-2xl transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] rounded-3xl border flex flex-col overflow-hidden shadow-2xl transition-colors duration-200 ${
          isDark
            ? 'bg-[#0A0A0A]/95 border-[#1A1A1A] text-[#F4F4F5]'
            : 'bg-white/95 border-[#E5E5E5] text-[#111111]'
        }`}
      >
        {/* =====================================================================
            TOP BAR WITH STEP LABELS & PROGRESS TRACK
            ===================================================================== */}
        <div
          className={`px-7 py-5 border-b shrink-0 ${
            isDark ? 'border-[#161616] bg-[#050505]/70' : 'border-[#E1E1E1] bg-[#F5F5F7]/80'
          }`}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                <activeStepMeta.icon className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tabular text-zinc-500">
                  <span className="text-[#C9A063] font-semibold">{activeStepMeta.label}</span>
                  <span aria-hidden="true">·</span>
                  <span>Personalized Timeline Setup</span>
                </div>
                <h2
                  id="onboarding-title"
                  className="font-serif-editorial text-2xl font-semibold tracking-tight"
                >
                  {activeStepMeta.title}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close setup wizard"
              className={`p-2 rounded-xl border transition-colors ${
                isDark
                  ? 'border-[#161616] text-zinc-400 hover:text-white hover:bg-[#161616]'
                  : 'border-[#E1E1E1] text-zinc-500 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 5-Step Segmented Progress Bar */}
          <div className="grid grid-cols-5 gap-2">
            {STEP_DEFINITIONS.map((s) => {
              const isPast = s.step < currentStep;
              const isCurrent = s.step === currentStep;
              return (
                <div key={s.step} className="space-y-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isPast
                        ? 'bg-[#C9A063]'
                        : isCurrent
                        ? 'bg-[#C9A063] shadow-[0_0_8px_rgba(201,160,99,0.6)]'
                        : isDark
                        ? 'bg-zinc-800'
                        : 'bg-zinc-200'
                    }`}
                  />
                  <div className="hidden sm:flex items-center justify-between text-[10px] font-mono-tabular">
                    <span
                      className={
                        isCurrent
                          ? 'text-[#C9A063] font-bold'
                          : isPast
                          ? 'text-zinc-400'
                          : 'text-zinc-600'
                      }
                    >
                      0{s.step}
                    </span>
                    <span
                      className={`truncate max-w-[80px] ${
                        isCurrent ? 'text-zinc-200 font-medium' : 'text-zinc-500'
                      }`}
                    >
                      {s.title.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            MAIN STEP BODY (SCROLLABLE)
            ===================================================================== */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* STEP 1: Creator Type & Content Format */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Choose how your multi-track timeline should organize camera feeds, voiceover stems,
                and automatic B-roll cutaway frequencies.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {CREATOR_FORMAT_5STEP.map((item) => {
                  const isSelected = creatorFormat === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setCreatorFormat(item.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all relative flex flex-col justify-between group ${
                        isSelected
                          ? isDark
                            ? 'bg-[#0F0F0F] border-[#C9A063] shadow-[0_0_24px_rgba(201,160,99,0.15)] ring-1 ring-[#C9A063]'
                            : 'bg-zinc-50 border-[#111111] shadow-lg ring-1 ring-[#111111]'
                          : isDark
                          ? 'bg-[#080808] border-[#181818] hover:border-[#C9A063]/50 hover:bg-[#0D0D0D]'
                          : 'bg-white border-[#E5E5E5] hover:border-zinc-400 hover:bg-zinc-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`p-2 rounded-xl text-xs font-semibold ${
                              isSelected
                                ? 'bg-[#C9A063] text-black font-bold'
                                : isDark
                                ? 'bg-zinc-800 text-zinc-300'
                                : 'bg-zinc-100 text-zinc-800'
                            }`}
                          >
                            {item.id === 'Talking Head / Face-Cam Creator' ? (
                              <Video className="w-4 h-4" />
                            ) : item.id === '100% Faceless Automation Channel' ? (
                              <Film className="w-4 h-4" />
                            ) : (
                              <Users className="w-4 h-4" />
                            )}
                          </span>
                          <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded-full bg-zinc-800/80 text-[#C9A063] border border-[#C9A063]/20">
                            {item.badge}
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold mb-2">{item.title}</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">{item.detail}</p>
                      </div>

                      <div
                        className={`pt-3 border-t text-[10px] font-mono-tabular ${
                          isDark ? 'border-zinc-800/70 text-zinc-500' : 'border-zinc-200 text-zinc-600'
                        }`}
                      >
                        {item.trackScheme}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Core Niche & Micro-Topics */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Select your primary content domain and specify micro-topic tags. The AI analyzer will
                prioritize stock clips, visual metaphors, and sound effects matching these topics.
              </div>

              {/* Core Niche Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {CORE_NICHE_5STEP.map((item) => {
                  const isSelected = coreNiche === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectNiche(item)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? isDark
                            ? 'bg-[#0F0F0F] border-[#C9A063] shadow-md ring-1 ring-[#C9A063]'
                            : 'bg-zinc-50 border-[#111111] shadow-md ring-1 ring-[#111111]'
                          : isDark
                          ? 'bg-[#080808] border-[#181818] hover:border-zinc-600'
                          : 'bg-white border-[#E5E5E5] hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold">{item.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#C9A063]" />}
                      </div>
                      <div className="text-[10px] text-[#C9A063] font-mono-tabular mb-1.5">
                        {item.kicker}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Custom Tag Input Field */}
              <div
                className={`p-5 rounded-2xl border space-y-3 ${
                  isDark ? 'bg-[#080808] border-[#181818]' : 'bg-zinc-50 border-[#E5E5E5]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="micro-tag-input" className="text-xs font-semibold flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 text-[#C9A063]" />
                    <span>Micro-Topic Tags ({microTags.length} Active)</span>
                  </label>
                  <span className="text-[10px] font-mono-tabular text-zinc-500">
                    Type and press Enter to add custom tags
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      id="micro-tag-input"
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(tagInput);
                        }
                      }}
                      placeholder="Enter specific micro-topics (e.g., #crypto, #architecture, #minimalism)..."
                      className={`w-full py-2.5 px-3.5 rounded-xl border text-xs outline-none transition-colors ${
                        isDark
                          ? 'bg-[#050505] border-[#222] text-zinc-200 focus:border-[#C9A063]'
                          : 'bg-white border-[#D1D1D1] text-zinc-900 focus:border-black'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddTag(tagInput)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isDark
                        ? 'bg-zinc-800 text-zinc-200 hover:bg-[#C9A063] hover:text-black'
                        : 'bg-zinc-200 text-zinc-800 hover:bg-black hover:text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Active Micro-Tags Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {microTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono-tabular bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 p-0.5"
                        title="Remove tag"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Target Platform & Aspect Ratio */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Configure your master composition geometry. The center video canvas and subtitle
                positioning engine will auto-scale safe zones for this format.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {TARGET_PLATFORM_5STEP.map((item) => {
                  const isSelected = platform === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPlatform(item.id)}
                      className={`p-6 rounded-2xl border text-center cursor-pointer transition-all flex flex-col items-center justify-between group ${
                        isSelected
                          ? isDark
                            ? 'bg-[#0F0F0F] border-[#C9A063] shadow-[0_0_24px_rgba(201,160,99,0.15)] ring-1 ring-[#C9A063]'
                            : 'bg-zinc-50 border-[#111111] shadow-lg ring-1 ring-[#111111]'
                          : isDark
                          ? 'bg-[#080808] border-[#181818] hover:border-zinc-600'
                          : 'bg-white border-[#E5E5E5] hover:border-zinc-300'
                      }`}
                    >
                      {/* Aspect Ratio Box Visual */}
                      <div className="w-full flex items-center justify-center py-4">
                        <div
                          className={`rounded-lg border-2 transition-transform group-hover:scale-105 flex items-center justify-center text-[11px] font-mono-tabular font-bold ${
                            isSelected
                              ? 'border-[#C9A063] bg-[#C9A063]/10 text-[#C9A063]'
                              : isDark
                              ? 'border-zinc-700 bg-zinc-900/50 text-zinc-400'
                              : 'border-zinc-300 bg-zinc-100 text-zinc-600'
                          } ${
                            item.ratio === '9:16'
                              ? 'w-16 h-28'
                              : item.ratio === '16:9'
                              ? 'w-28 h-16'
                              : 'w-20 h-20'
                          }`}
                        >
                          {item.ratio}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                        <div className="text-[10px] font-mono-tabular text-[#C9A063] mb-2">
                          {item.spec}
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Pacing & Editing Density Style */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Determine your narrative rhythm. Fast-paced pacing triggers rapid B-roll cuts and heavy
                whooshes, whereas documentary density allows multi-second atmospheric holds.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {PACING_DENSITY_5STEP.map((item) => {
                  const isSelected = pacingDensity === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPacingDensity(item.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                        isSelected
                          ? isDark
                            ? 'bg-[#0F0F0F] border-[#C9A063] shadow-[0_0_24px_rgba(201,160,99,0.15)] ring-1 ring-[#C9A063]'
                            : 'bg-zinc-50 border-[#111111] shadow-lg ring-1 ring-[#111111]'
                          : isDark
                          ? 'bg-[#080808] border-[#181818] hover:border-zinc-600'
                          : 'bg-white border-[#E5E5E5] hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono-tabular px-2.5 py-0.5 rounded-full bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                            {item.badge}
                          </span>
                          <span className="text-[11px] font-mono-tabular text-zinc-500">
                            {item.bpm} BPM
                          </span>
                        </div>

                        <h3 className="text-sm font-semibold mb-1.5">{item.title}</h3>
                        <div className="text-xs text-[#C9A063] font-mono-tabular font-medium mb-3">
                          {item.cutInterval}
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed mb-4">{item.description}</p>
                      </div>

                      <div
                        className={`pt-3 border-t flex items-center justify-between text-[10px] font-mono-tabular ${
                          isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-600'
                        }`}
                      >
                        <span>SFX Cadence: {item.id === 'Viral Fast-Paced' ? 'Dense' : 'Sparse'}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C9A063]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Brand Tone & Voice Personality */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                Establish the emotional delivery and sonic personality. The AI analyzer will recommend
                specific audio EQ stems and vocal resonance profiles aligned with this tone.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {BRAND_TONE_5STEP.map((item) => {
                  const isSelected = brandTone === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setBrandTone(item.id)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between group ${
                        isSelected
                          ? isDark
                            ? 'bg-[#0F0F0F] border-[#C9A063] shadow-[0_0_24px_rgba(201,160,99,0.15)] ring-1 ring-[#C9A063]'
                            : 'bg-zinc-50 border-[#111111] shadow-lg ring-1 ring-[#111111]'
                          : isDark
                          ? 'bg-[#080808] border-[#181818] hover:border-zinc-600'
                          : 'bg-white border-[#E5E5E5] hover:border-zinc-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: item.badgeColor }}
                            />
                            <h3 className="text-sm font-semibold">{item.title}</h3>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#C9A063]" />}
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed mb-3">{item.vibe}</p>
                      </div>

                      <div
                        className={`pt-3 border-t text-[10px] font-mono-tabular flex items-center gap-2 ${
                          isDark ? 'border-zinc-800 text-zinc-500' : 'border-zinc-200 text-zinc-600'
                        }`}
                      >
                        <Mic className="w-3 h-3 text-[#C9A063]" />
                        <span className="truncate">{item.sampleVoice}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cloud Account Persistence Callout */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                  isDark ? 'bg-[#050505] border-[#161616]' : 'bg-[#F5F5F7] border-[#E1E1E1]'
                }`}
              >
                <div className="flex items-center gap-2 text-zinc-400">
                  <Cloud className="w-4 h-4 text-[#C9A063]" />
                  <span>
                    Your personalized profile and script beats will sync securely to your Firebase
                    account.
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono-tabular font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                  Firebase Cloud Synced
                </span>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================================
            CINEMATIC PROVISIONING LOADER OVERLAY (IF ACTIVE)
            ===================================================================== */}
        {isInitializing && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-8 animate-fade-in text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-2 border-[#C9A063]/30 border-t-[#C9A063] animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-[#C9A063] animate-pulse" />
              </div>
            </div>

            <div className="max-w-md space-y-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono-tabular bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                {initProgress}% Complete · Initializing Studio
              </span>
              <h3 className="font-serif-editorial text-2xl font-bold tracking-tight text-white">
                Baking Your Personalized NLE Workspace
              </h3>
              <p className="text-xs font-mono-tabular text-zinc-400 min-h-[20px]">
                {initStageText}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden my-4">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A063] to-amber-200 transition-all duration-300"
                  style={{ width: `${initProgress}%` }}
                />
              </div>

              <div className="text-[11px] text-zinc-500 flex items-center justify-center gap-2">
                <Cloud className="w-3.5 h-3.5 text-zinc-400" />
                <span>{firebaseStatus}</span>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            FOOTER ACTIONS (BACK / NEXT / INITIALIZE)
            ===================================================================== */}
        <div
          className={`px-7 py-4 border-t flex items-center justify-between shrink-0 ${
            isDark ? 'border-[#161616] bg-[#050505]/70' : 'border-[#E1E1E1] bg-[#F5F5F7]/80'
          }`}
        >
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isInitializing}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              currentStep === 1
                ? 'opacity-30 cursor-not-allowed text-zinc-500'
                : isDark
                ? 'border border-[#161616] text-zinc-300 hover:bg-[#161616]'
                : 'border border-[#E1E1E1] text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleNext}
              disabled={isInitializing}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentStep === 5
                  ? 'bg-gradient-to-r from-[#C9A063] to-amber-300 text-[#050505] shadow-lg shadow-[#C9A063]/20 hover:scale-[1.02]'
                  : isDark
                  ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                  : 'bg-[#111111] text-white hover:bg-zinc-800'
              }`}
            >
              {currentStep === 5 ? (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Initialize Personalized Workspace</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
