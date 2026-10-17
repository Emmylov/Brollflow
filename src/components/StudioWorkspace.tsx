import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Film,
  FolderOpen,
  GripVertical,
  Layers,
  Lock,
  Maximize2,
  Mic,
  Minimize2,
  Moon,
  Music,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  MousePointer2,
  Share2,
  Sliders,
  SlidersHorizontal,
  Smile,
  Sparkles,
  Sun,
  Tag,
  Type,
  Unlock,
  Upload,
  User,
  Users,
  Volume2,
  VolumeX,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import {
  BROLL_LIBRARY,
  NICHE_WORKSPACE_TEMPLATES,
  PLATFORM_OPTIONS,
  PRESET_OPTIONS,
  SFX_LIBRARY,
  STOCK_VIDEO_LIBRARY,
  analyzeScriptWithAI,
  generatePersonalizedTemplate,
} from '../data/presets';
import {
  AestheticPreset,
  ContentNiche,
  OnboardingConfig,
  SavedProject,
  ScriptBeat,
  SentimentAnalysisResult,
  SubtitleStyleConfig,
  TargetPlatform,
  ThemeMode,
  TimelineBRollItem,
  TimelineCaptionItem,
  TimelineSfxCue,
  UserProfile,
} from '../types';
import { sfxSynth } from '../utils/audioSynth';
import { saveProject } from '../services/firebase';
import { AIStrategyChat } from './AIStrategyChat';
import { ApiVaultModal } from './ApiVaultModal';
import { ExportPipelineModal } from './ExportPipelineModal';
import { MediaLibraryModal } from './MediaLibraryModal';
import { PlatformTutorialModal } from './PlatformTutorialModal';
import { ProjectVaultModal } from './ProjectVaultModal';
import { SubtitleStyleStudioModal } from './SubtitleStyleStudioModal';
import { ShareInviteModal, Collaborator } from './ShareInviteModal';

interface StudioWorkspaceProps {
  config: OnboardingConfig;
  user: UserProfile | null;
  theme: ThemeMode;
  initialProject?: SavedProject | null;
  onToggleTheme: () => void;
  onUpdateConfig: (next: OnboardingConfig) => void;
  onOpenOnboarding: () => void;
  onBackToLanding: () => void;
  onBackToDashboard?: () => void;
export const GRAPHIC_ELEMENTS = [
  { id: 'el-1', icon: '⚡', name: 'Retention Flash', category: 'Energy & Transitions', tag: '#flash', color: '#FACC15' },
  { id: 'el-2', icon: '🎯', name: 'Focus Target', category: 'Retention Hooks', tag: '#focus', color: '#EF4444' },
  { id: 'el-3', icon: '📈', name: 'Growth Arrow', category: 'Visual Callouts', tag: '#growth', color: '#10B981' },
  { id: 'el-4', icon: '🔥', name: 'Viral Flame', category: 'Retention Hooks', tag: '#viral', color: '#F97316' },
  { id: 'el-5', icon: '💬', name: 'Speech Callout', category: 'Visual Callouts', tag: '#quote', color: '#3B82F6' },
  { id: 'el-6', icon: '⚠️', name: 'Urgency Alert', category: 'Attention Triggers', tag: '#alert', color: '#EAB308' },
  { id: 'el-7', icon: '💡', name: 'Insight Glow', category: 'Breakthrough Ideas', tag: '#insight', color: '#C9A063' },
  { id: 'el-8', icon: '🔔', name: 'Subscribe Ring', category: 'CTAs', tag: '#subscribe', color: '#8B5CF6' },
  { id: 'el-9', icon: '✨', name: 'Magic Sparkle', category: 'Visual Callouts', tag: '#magic', color: '#EC4899' },
  { id: 'el-10', icon: '📊', name: 'Metric Spike', category: 'Data & Proof', tag: '#metric', color: '#00FFFF' },
];

export const StudioWorkspace: React.FC<StudioWorkspaceProps> = ({
  config,
  user,
  theme,
  initialProject,
  onToggleTheme,
  onUpdateConfig,
  onOpenOnboarding,
  onBackToLanding,
  onBackToDashboard,
}) => {
  const isDark = theme === 'dark';
  const template = useMemo(() => {
    if (config.pacingDensity || config.coreNiche) {
      return generatePersonalizedTemplate(config);
    }
    return (
      NICHE_WORKSPACE_TEMPLATES[config.niche as ContentNiche] ||
      NICHE_WORKSPACE_TEMPLATES['Tech & AI']
    );
  }, [config]);

  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================

  // Layout Controls: Responsive Split with Drag Divider and Collapsible Panel
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(35); // 35% default
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState<boolean>(false);
  const isDraggingDivider = useRef<boolean>(false);

  // Left Panel Tab: Tab A (AI Content Strategy Chat) vs Tab B (Script Ingestion & AI Analysis) vs Tab C (Elements & Overlays)
  const [activeLeftTab, setActiveLeftTab] = useState<'strategy' | 'script' | 'elements'>('script');

  // Script input & AI Analyzer State
  const defaultScriptText = template.scriptBeats.map((b) => b.speakerLine).join('\n\n');
  const [scriptInput, setScriptInput] = useState<string>(defaultScriptText);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<SentimentAnalysisResult>(() =>
    analyzeScriptWithAI(defaultScriptText, template.niche)
  );

  // Quick edit tag input state per card
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [newTagInput, setNewTagInput] = useState<string>('');

  // Playhead & Transport (0 to 30 seconds range)
  const TOTAL_DURATION_SEC = 30.0;
  const [playheadSec, setPlayheadSec] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [timelineZoom, setTimelineZoom] = useState<1 | 2 | 5>(1);
  const [activeBeatIndex, setActiveBeatIndex] = useState<number>(0);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);

  // Timeline Visual Density Preference: Pro High-Density, Spacious, Auto-Expanding
  const [densityMode, setDensityMode] = useState<'compact' | 'spacious' | 'auto'>('compact');

  // Multi-Track Timeline Items
  const [brollItems, setBrollItems] = useState<TimelineBRollItem[]>(() =>
    template.scriptBeats.map((beat, i) => {
      const clip = BROLL_LIBRARY[i % BROLL_LIBRARY.length] || BROLL_LIBRARY[0];
      return {
        id: `timeline-broll-${i}`,
        clipId: clip.id,
        title: clip.title,
        imageUrl: clip.imageUrl,
        startSec: beat.startSec,
        durationSec: beat.durationSec,
        resolution: clip.resolution,
        isLocked: false,
      };
    })
  );

  const [captionItems, setCaptionItems] = useState<TimelineCaptionItem[]>(() =>
    template.scriptBeats.map((beat, i) => ({
      id: `timeline-cap-${i}`,
      text: beat.speakerLine,
      startSec: beat.startSec,
      durationSec: beat.durationSec,
      style: beat.captionStyle,
    }))
  );

  const [sfxItems, setSfxItems] = useState<TimelineSfxCue[]>([
    {
      id: 'cue-0',
      sfxId: 'sfx-whoosh-01',
      name: 'Cinema Whoosh',
      startSec: 0.2,
      durationSec: 1.0,
      category: 'whoosh',
    },
    {
      id: 'cue-1',
      sfxId: 'sfx-impact-01',
      name: 'Impact Pop',
      startSec: 4.5,
      durationSec: 1.5,
      category: 'impact',
    },
    {
      id: 'cue-2',
      sfxId: 'sfx-glitch-01',
      name: 'Hologram Glitch',
      startSec: 9.3,
      durationSec: 0.8,
      category: 'glitch',
    },
    {
      id: 'cue-3',
      sfxId: 'sfx-riser-01',
      name: 'Tension Riser',
      startSec: 14.8,
      durationSec: 2.2,
      category: 'riser',
    },
  ]);

  // Media Library Drawer Modal & Project Vault State
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState<boolean>(false);
  const [isSubtitleStudioOpen, setIsSubtitleStudioOpen] = useState<boolean>(false);
  const [isExportPipelineOpen, setIsExportPipelineOpen] = useState<boolean>(false);
  const [isProjectVaultOpen, setIsProjectVaultOpen] = useState<boolean>(false);
  const [isApiVaultOpen, setIsApiVaultOpen] = useState<boolean>(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>(initialProject?.id);
  const [currentProjectName, setCurrentProjectName] = useState<string>(
    initialProject?.name || 'My First Video Project'
  );
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Dual-mode Collaboration & Simulation State
  const [isSimulateCollab, setIsSimulateCollab] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [collabToast, setCollabToast] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<{
    id: string;
    name: string;
    icon: string;
    category: string;
    tag: string;
    color: string;
  } | null>(null);
  const [isVideoDropActive, setIsVideoDropActive] = useState<boolean>(false);
  const [isTimelineDropActive, setIsTimelineDropActive] = useState<boolean>(false);

  // Active Project Collaborators List (Default solo, activates Sarah and Alex on Simulate Collab)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: 'collab-owner',
      name: user?.name ? `${user.name} (Lead Creator)` : 'You (Lead Creator)',
      email: user?.email || 'creator@brollflow.studio',
      role: 'Admin',
      avatarBg: '#F59E0B', // Amber Gold
      isOwner: true,
      online: true,
    },
    {
      id: 'collab-sarah',
      name: 'Sarah (Lead Editor)',
      email: 'sarah.editor@cinema.studio',
      role: 'Editor',
      avatarBg: '#8B5CF6', // Vivid Violet
      isOwner: false,
      online: false,
    },
    {
      id: 'collab-alex',
      name: 'Alex (Reviewer)',
      email: 'alex.reviewer@agency.com',
      role: 'Reviewer',
      avatarBg: '#00FFFF', // Electric Cyan
      isOwner: false,
      online: false,
    },
  ]);

  // Sync collaborator online state when isSimulateCollab updates
  useEffect(() => {
    setCollaborators((prev) =>
      prev.map((c) => {
        if (c.isOwner) return { ...c, online: true };
        return { ...c, online: isSimulateCollab };
      })
    );
  }, [isSimulateCollab]);

  const handleAddCollaborator = (email: string, role: 'Admin' | 'Editor' | 'Reviewer') => {
    const namePart = email.split('@')[0] || 'Member';
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newMember: Collaborator = {
      id: `collab-${Date.now()}`,
      name: `${capitalized} (${role})`,
      email,
      role,
      avatarBg: '#F43F5E', // Coral Pink
      isOwner: false,
      online: true,
    };
    setCollaborators((prev) => [...prev, newMember]);
  };

  const handleRemoveCollaborator = (id: string) => {
    setCollaborators((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateRole = (id: string, role: 'Admin' | 'Editor' | 'Reviewer') => {
    setCollaborators((prev) =>
      prev.map((c) => (c.id === id ? { ...c, role, name: `${c.name.split(' (')[0]} (${role})` } : c))
    );
  };

  const handleAddElementToPlayhead = (elem: (typeof GRAPHIC_ELEMENTS)[0]) => {
    const newCap: TimelineCaptionItem = {
      id: `elem-cap-${Date.now()}`,
      text: `${elem.icon} ${elem.name.toUpperCase()}`,
      startSec: Number(playheadSec.toFixed(1)),
      durationSec: 3.0,
      style: 'Kinetic Pop',
    };
    setCaptionItems((prev) => [...prev, newCap].sort((a, b) => a.startSec - b.startSec));
    setCollabToast(`Added "${elem.name}" overlay to playhead (${formatTimecode(playheadSec)})`);
    setTimeout(() => setCollabToast(null), 2500);
  };

  const handleDropElementOnTimeline = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsTimelineDropActive(false);
    if (!draggedElement || !timelineRulerRef.current) return;

    const rulerRect = timelineRulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rulerRect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rulerRect.width));
    const targetSec = Number((ratio * TOTAL_DURATION_SEC).toFixed(1));

    const newCap: TimelineCaptionItem = {
      id: `elem-cap-${Date.now()}`,
      text: `${draggedElement.icon} ${draggedElement.name.toUpperCase()}`,
      startSec: targetSec,
      durationSec: 3.0,
      style: 'Kinetic Pop',
    };
    setCaptionItems((prev) => [...prev, newCap].sort((a, b) => a.startSec - b.startSec));
    setPlayheadSec(targetSec);
    setCollabToast(`Placed "${draggedElement.name}" onto timeline at ${formatTimecode(targetSec)}`);
    setTimeout(() => setCollabToast(null), 2500);
    setDraggedElement(null);
  };

  const handleDropElementOnVideo = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsVideoDropActive(false);
    if (!draggedElement) return;

    const newCap: TimelineCaptionItem = {
      id: `elem-cap-${Date.now()}`,
      text: `${draggedElement.icon} ${draggedElement.name.toUpperCase()}`,
      startSec: Number(playheadSec.toFixed(1)),
      durationSec: 3.5,
      style: 'Kinetic Pop',
    };
    setCaptionItems((prev) => [...prev, newCap].sort((a, b) => a.startSec - b.startSec));
    setCollabToast(`Placed "${draggedElement.name}" directly onto video canvas!`);
    setTimeout(() => setCollabToast(null), 2500);
    setDraggedElement(null);
  };

  const handleLoadProject = useCallback((proj: SavedProject) => {
    setCurrentProjectId(proj.id);
    setCurrentProjectName(proj.name);
    if (proj.scriptText) setScriptInput(proj.scriptText);
    if (proj.brollItems && proj.brollItems.length > 0) setBrollItems(proj.brollItems);
    if (proj.captionItems && proj.captionItems.length > 0) setCaptionItems(proj.captionItems);
    if (proj.sfxItems && proj.sfxItems.length > 0) setSfxItems(proj.sfxItems);
    if (proj.subtitleStyle) setSubtitleStyle(proj.subtitleStyle);
  }, []);

  useEffect(() => {
    if (initialProject) {
      handleLoadProject(initialProject);
    }
  }, [initialProject, handleLoadProject]);

  const handleSaveActiveProject = async () => {
    if (!user?.uid) {
      setExportFeedback('Sign in to sync project with Firestore vault');
      window.setTimeout(() => setExportFeedback(null), 3000);
      return;
    }
    const pid = currentProjectId || `proj-${Date.now()}`;
    const projToSave: SavedProject = {
      id: pid,
      userId: user.uid,
      name: currentProjectName,
      niche: initialProject?.niche || config.niche || 'Tech & AI',
      aspectRatio: config.platform.includes('9:16') ? '9:16' : config.platform.includes('1:1') ? '1:1' : '16:9',
      scriptText: scriptInput,
      brollItems,
      captionItems,
      sfxItems,
      subtitleStyle,
      updatedAt: new Date().toISOString(),
      thumbnailUrl: brollItems[0]?.imageUrl || BROLL_LIBRARY[0]?.imageUrl,
    };
    try {
      await saveProject(user.uid, projToSave);
      setCurrentProjectId(pid);
      setExportFeedback('Saved to Firestore cloud vault!');
      window.setTimeout(() => setExportFeedback(null), 2500);
    } catch (e) {
      console.error('Error saving project to firestore:', e);
      setExportFeedback('Could not save to cloud');
      window.setTimeout(() => setExportFeedback(null), 2500);
    }
  };

  // Subtitle & Style Emulation Configuration
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStyleConfig>({
    preset: 'Hormozi Punch',
    fontFamily: 'Geist',
    fontSize: 28,
    strokeWidth: 4,
    shadowOffset: 4,
    isUppercase: true,
    highlightColor: '#FACC15',
    baseTextColor: '#FFFFFF',
    boxColor: '#000000',
    boxOpacity: 0.75,
    animationMode: 'Bounce In',
    customPrompt: 'Bold yellow highlight text, heavy black outline, high-velocity punch jumps',
  });

  // Multiplayer Cursor Animation Tick
  const [cursorTick, setCursorTick] = useState<number>(0);

  // References
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timelineRulerRef = useRef<HTMLDivElement | null>(null);
  const workspaceContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingPlayhead = useRef<boolean>(false);

  // Current active B-Roll clip
  const currentBRoll =
    brollItems.find(
      (item) => playheadSec >= item.startSec && playheadSec < item.startSec + item.durationSec
    ) || brollItems[0] || {
      id: 'default',
      clipId: 'default',
      title: 'Default Visual',
      imageUrl: BROLL_LIBRARY[0].imageUrl,
      startSec: 0,
      durationSec: 5,
      resolution: '4K UHD',
      isLocked: false,
    };

  // Current active caption
  const currentCaption =
    captionItems.find(
      (c) => playheadSec >= c.startSec && playheadSec < c.startSec + c.durationSec
    ) || captionItems[0] || {
      id: 'default-cap',
      text: 'B-Roll Flow Kinetic Subtitle Engine',
      startSec: 0,
      durationSec: 5,
      style: 'Kinetic Pop',
    };

  // Sync timeline, beats, and subtitle styles when personalized config updates
  useEffect(() => {
    const text = template.scriptBeats.map((b) => b.speakerLine).join('\n\n');
    setScriptInput(text);
    setAnalysisResult(analyzeScriptWithAI(text, template.niche));
    setBrollItems(
      template.scriptBeats.map((beat, i) => {
        const clip = BROLL_LIBRARY[i % BROLL_LIBRARY.length] || BROLL_LIBRARY[0];
        return {
          id: `timeline-broll-${i}`,
          clipId: clip.id,
          title: clip.title,
          imageUrl: clip.imageUrl,
          startSec: beat.startSec,
          durationSec: beat.durationSec,
          resolution: clip.resolution,
          isLocked: false,
        };
      })
    );
    setCaptionItems(
      template.scriptBeats.map((beat, i) => ({
        id: `timeline-cap-${i}`,
        text: beat.speakerLine,
        startSec: beat.startSec,
        durationSec: beat.durationSec,
        style: beat.captionStyle,
      }))
    );
  }, [template]);

  // Active Preset Metadata
  const activePresetMeta =
    PRESET_OPTIONS.find((p) => p.id === config.preset) || PRESET_OPTIONS[0];

  // =========================================================================
  // TRANSPORT & PLAYHEAD TICKER
  // =========================================================================
  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setPlayheadSec((prev) => {
        const next = prev + 0.05;
        if (next >= TOTAL_DURATION_SEC) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
      setCursorTick((prev) => prev + 1);
    }, 50);

    return () => window.clearInterval(interval);
  }, [isPlaying]);

  // Sync active beat card with playhead
  useEffect(() => {
    const cardIdx = analysisResult.timestampCards.findIndex(
      (c) => playheadSec >= c.startSec && playheadSec < c.startSec + c.durationSec
    );
    if (cardIdx !== -1) {
      setActiveBeatIndex(cardIdx);
    }
  }, [playheadSec, analysisResult.timestampCards]);

  // =========================================================================
  // HTML5 CANVAS KINETIC TYPOGRAPHY LAYER
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (!currentCaption || !currentCaption.text) return;

    const activeText = subtitleStyle.isUppercase
      ? currentCaption.text.toUpperCase()
      : currentCaption.text;

    const words = activeText.split(' ');
    const progressInCaption =
      (playheadSec - currentCaption.startSec) / Math.max(0.1, currentCaption.durationSec);
    const activeWordIdx = Math.min(
      words.length - 1,
      Math.max(0, Math.floor(progressInCaption * words.length))
    );

    const fontString = `bold ${subtitleStyle.fontSize}px "${subtitleStyle.fontFamily}", sans-serif`;
    ctx.font = fontString;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lineY = height * 0.78;
    const totalTextWidth = ctx.measureText(words.join(' ')).width;

    // Background pill box if opacity > 0
    if (subtitleStyle.boxOpacity > 0) {
      ctx.fillStyle = subtitleStyle.boxColor;
      ctx.globalAlpha = subtitleStyle.boxOpacity;
      const boxPadX = 16;
      const boxPadY = 8;
      ctx.beginPath();
      ctx.roundRect(
        width / 2 - totalTextWidth / 2 - boxPadX,
        lineY - subtitleStyle.fontSize / 2 - boxPadY,
        totalTextWidth + boxPadX * 2,
        subtitleStyle.fontSize + boxPadY * 2,
        10
      );
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }

    let currentX = width / 2 - totalTextWidth / 2;

    words.forEach((word, index) => {
      const isHighlighted = index === activeWordIdx;
      const wordMetrics = ctx.measureText(word + ' ');

      ctx.save();

      // Shadow / Outline
      if (subtitleStyle.strokeWidth > 0) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = subtitleStyle.strokeWidth;
        ctx.lineJoin = 'round';
        ctx.strokeText(word, currentX + wordMetrics.width / 2, lineY);
      }

      if (subtitleStyle.shadowOffset > 0) {
        ctx.shadowColor = 'rgba(0,0,0,0.85)';
        ctx.shadowBlur = subtitleStyle.shadowOffset * 2;
        ctx.shadowOffsetY = subtitleStyle.shadowOffset;
      }

      // Word animation bounce
      if (isHighlighted && subtitleStyle.animationMode === 'Bounce In') {
        const bounceScale = 1.15;
        ctx.translate(currentX + wordMetrics.width / 2, lineY);
        ctx.scale(bounceScale, bounceScale);
        ctx.translate(-(currentX + wordMetrics.width / 2), -lineY);
      }

      // Fill color
      ctx.fillStyle = isHighlighted ? subtitleStyle.highlightColor : subtitleStyle.baseTextColor;
      ctx.fillText(word, currentX + wordMetrics.width / 2, lineY);

      ctx.restore();
      currentX += wordMetrics.width;
    });

    // Style badge readout
    ctx.shadowBlur = 0;
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#C9A063';
    ctx.fillText(
      `● ${subtitleStyle.preset.toUpperCase()} · ${formatTimecode(playheadSec)}`,
      width / 2,
      lineY - (subtitleStyle.fontSize / 2 + 18)
    );
  }, [playheadSec, currentCaption, subtitleStyle]);

  // =========================================================================
  // ACTIONS & HANDLERS
  // =========================================================================

  // Run AI Script Analysis with Automatic Real-Time Timeline Synchronization
  const handleRunAiAnalysis = (customScript?: string) => {
    const textToAnalyze = customScript !== undefined ? customScript : scriptInput;
    setIsAnalyzing(true);
    window.setTimeout(() => {
      const result = analyzeScriptWithAI(textToAnalyze, template.niche);
      setAnalysisResult(result);

      // Re-populate timeline items based on analysis in real time
      const newBroll: TimelineBRollItem[] = result.timestampCards.map((card, idx) => {
        const clip = BROLL_LIBRARY[idx % BROLL_LIBRARY.length] || BROLL_LIBRARY[0];
        const primaryTag = card.visualTags[0] ? card.visualTags[0].replace('#', '') : clip.title;
        return {
          id: `timeline-broll-${idx}`,
          clipId: clip.id,
          title: `${primaryTag.toUpperCase()} Clip`,
          imageUrl: clip.imageUrl,
          startSec: card.startSec,
          durationSec: card.durationSec,
          resolution: clip.resolution,
          isLocked: false,
        };
      });

      const newCaptions: TimelineCaptionItem[] = result.timestampCards.map((card, idx) => ({
        id: `timeline-cap-${idx}`,
        text: card.text,
        startSec: card.startSec,
        durationSec: card.durationSec,
        style: card.sfxTrigger.includes('whoosh') ? 'Kinetic Pop' : 'Editorial Serif',
      }));

      const newSfx: TimelineSfxCue[] = result.timestampCards.map((card, idx) => ({
        id: `timeline-sfx-${idx}`,
        sfxId: `sfx-${idx}`,
        name: card.sfxTrigger.replace('#', '').toUpperCase(),
        startSec: Number((card.startSec + 0.15).toFixed(1)),
        durationSec: 1.0,
        category: (card.sfxTrigger.includes('whoosh')
          ? 'whoosh'
          : card.sfxTrigger.includes('impact') || card.sfxTrigger.includes('pop')
          ? 'impact'
          : card.sfxTrigger.includes('glitch')
          ? 'glitch'
          : 'riser') as 'whoosh' | 'impact' | 'riser' | 'glitch' | 'minimal',
      }));

      setBrollItems(newBroll);
      setCaptionItems(newCaptions);
      setSfxItems(newSfx);
      setIsAnalyzing(false);
      setPlayheadSec(0);
    }, 400);
  };

  // Handler for Tab A "Send Script to Studio"
  const handleSendScriptFromChat = (scriptText: string) => {
    setScriptInput(scriptText);
    setActiveLeftTab('script');
    handleRunAiAnalysis(scriptText);
  };

  // Tag editing in Tab B Timestamp Cards
  const handleAddTagToCard = (cardId: string) => {
    if (!newTagInput.trim()) return;
    const formattedTag = newTagInput.startsWith('#')
      ? newTagInput.trim().toLowerCase()
      : `#${newTagInput.trim().toLowerCase()}`;

    setAnalysisResult((prev) => {
      const updatedCards = prev.timestampCards.map((c) => {
        if (c.id === cardId && !c.visualTags.includes(formattedTag)) {
          return { ...c, visualTags: [...c.visualTags, formattedTag] };
        }
        return c;
      });
      return { ...prev, timestampCards: updatedCards };
    });

    // Sync to B-Roll item title
    const cardIdx = analysisResult.timestampCards.findIndex((c) => c.id === cardId);
    if (cardIdx !== -1 && brollItems[cardIdx]) {
      setBrollItems((prev) =>
        prev.map((item, idx) =>
          idx === cardIdx ? { ...item, title: `${formattedTag.replace('#', '').toUpperCase()} Cutaway` } : item
        )
      );
    }

    setNewTagInput('');
    setEditingCardId(null);
  };

  const handleRemoveTagFromCard = (cardId: string, tagToRemove: string) => {
    setAnalysisResult((prev) => {
      const updatedCards = prev.timestampCards.map((c) => {
        if (c.id === cardId) {
          return { ...c, visualTags: c.visualTags.filter((t) => t !== tagToRemove) };
        }
        return c;
      });
      return { ...prev, timestampCards: updatedCards };
    });
  };

  // Cycle SFX Trigger on Card and immediately update audio track
  const handleCycleCardSfx = (cardId: string) => {
    const SFX_CHOICES = ['#whoosh', '#impact-pop', '#glitch', '#sub-bass', '#riser'];
    setAnalysisResult((prev) => {
      const updatedCards = prev.timestampCards.map((c) => {
        if (c.id === cardId) {
          const currentIdx = SFX_CHOICES.indexOf(c.sfxTrigger);
          const nextChoice = SFX_CHOICES[(currentIdx + 1) % SFX_CHOICES.length];
          return { ...c, sfxTrigger: nextChoice };
        }
        return c;
      });
      return { ...prev, timestampCards: updatedCards };
    });

    // Update corresponding SFX track item
    const cardIdx = analysisResult.timestampCards.findIndex((c) => c.id === cardId);
    if (cardIdx !== -1) {
      const card = analysisResult.timestampCards[cardIdx];
      const category = (card.sfxTrigger.includes('whoosh')
        ? 'impact'
        : card.sfxTrigger.includes('impact') || card.sfxTrigger.includes('pop')
        ? 'glitch'
        : 'whoosh') as 'whoosh' | 'impact' | 'riser' | 'glitch' | 'minimal';
      sfxSynth.play(category);
    }
  };

  const handleStepFrame = (deltaSec: number) => {
    setPlayheadSec((prev) =>
      Math.max(0, Math.min(TOTAL_DURATION_SEC, Number((prev + deltaSec).toFixed(2))))
    );
  };

  const handleTimelineScrub = useCallback(
    (clientX: number) => {
      if (!timelineRulerRef.current) return;
      const rect = timelineRulerRef.current.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const newSec = (offsetX / rect.width) * TOTAL_DURATION_SEC;
      setPlayheadSec(Number(newSec.toFixed(2)));
    },
    [TOTAL_DURATION_SEC]
  );

  const toggleBrollLock = (id: string) => {
    setBrollItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isLocked: !item.isLocked } : item))
    );
  };

  const handleAssignVideoFromLibrary = (video: (typeof STOCK_VIDEO_LIBRARY)[0]) => {
    const newItem: TimelineBRollItem = {
      id: `timeline-broll-${Date.now()}`,
      clipId: video.id,
      title: video.title,
      imageUrl: video.imageUrl,
      startSec: Number(playheadSec.toFixed(1)),
      durationSec: Math.min(video.durationSec, 5.0),
      resolution: video.resolution,
      isLocked: false,
    };
    setBrollItems((prev) => [...prev, newItem].sort((a, b) => a.startSec - b.startSec));
  };

  const handleAssignSfxFromLibrary = (sfx: (typeof SFX_LIBRARY)[0]) => {
    const newCue: TimelineSfxCue = {
      id: `timeline-sfx-${Date.now()}`,
      sfxId: sfx.id,
      name: sfx.name,
      startSec: Number(playheadSec.toFixed(1)),
      durationSec: sfx.durationSec,
      category: sfx.category,
    };
    setSfxItems((prev) => [...prev, newCue].sort((a, b) => a.startSec - b.startSec));
    sfxSynth.play(sfx.category);
  };

  // Drag Divider between Left Panel and Right Panel
  const handleDividerMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingDivider.current = true;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingDivider.current || !workspaceContainerRef.current) return;
      const containerRect = workspaceContainerRef.current.getBoundingClientRect();
      const rawPercent = ((moveEvent.clientX - containerRect.left) / containerRect.width) * 100;
      // Clamp between 22% and 55%
      const clamped = Math.max(22, Math.min(55, rawPercent));
      setLeftPanelWidth(clamped);
      if (isLeftPanelCollapsed) setIsLeftPanelCollapsed(false);
    };

    const handleMouseUp = () => {
      isDraggingDivider.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Format MM:SS.SS
  function formatTimecode(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }

  // Ratio Label
  const ratioLabel = config.platform.includes('9:16')
    ? '9:16 Vertical'
    : config.platform.includes('1:1')
    ? '1:1 Square'
    : '16:9 Widescreen';

  // Multiplayer live cursor coordinates & vanishing motion trails (Active when isSimulateCollab is true)
  // Sarah: Vivid Violet #8B5CF6 (Lead Editor)
  const sarahVideoX = 30 + Math.sin(cursorTick * 0.04) * 20;
  const sarahVideoY = 32 + Math.cos(cursorTick * 0.035) * 16;
  const sarahVideoTrail = [
    { x: 30 + Math.sin((cursorTick - 2) * 0.04) * 20, y: 32 + Math.cos((cursorTick - 2) * 0.035) * 16, opacity: 0.55 },
    { x: 30 + Math.sin((cursorTick - 4) * 0.04) * 20, y: 32 + Math.cos((cursorTick - 4) * 0.035) * 16, opacity: 0.3 },
    { x: 30 + Math.sin((cursorTick - 6) * 0.04) * 20, y: 32 + Math.cos((cursorTick - 6) * 0.035) * 16, opacity: 0.12 },
  ];
  const sarahTimelinePct = 32 + Math.sin(cursorTick * 0.025) * 20;
  const sarahTimelineTrail = [
    { pct: 32 + Math.sin((cursorTick - 2) * 0.025) * 20, opacity: 0.55 },
    { pct: 32 + Math.sin((cursorTick - 4) * 0.025) * 20, opacity: 0.3 },
    { pct: 32 + Math.sin((cursorTick - 6) * 0.025) * 20, opacity: 0.12 },
  ];

  // Alex: Electric Cyan #00FFFF (Reviewer)
  const alexVideoX = 64 + Math.cos(cursorTick * 0.038) * 18;
  const alexVideoY = 60 + Math.sin(cursorTick * 0.042) * 15;
  const alexVideoTrail = [
    { x: 64 + Math.cos((cursorTick - 2) * 0.038) * 18, y: 60 + Math.sin((cursorTick - 2) * 0.042) * 15, opacity: 0.55 },
    { x: 64 + Math.cos((cursorTick - 4) * 0.038) * 18, y: 60 + Math.sin((cursorTick - 4) * 0.042) * 15, opacity: 0.3 },
    { x: 64 + Math.cos((cursorTick - 6) * 0.038) * 18, y: 60 + Math.sin((cursorTick - 6) * 0.042) * 15, opacity: 0.12 },
  ];
  const alexTimelinePct = 66 + Math.cos(cursorTick * 0.028) * 20;
  const alexTimelineTrail = [
    { pct: 66 + Math.cos((cursorTick - 2) * 0.028) * 20, opacity: 0.55 },
    { pct: 66 + Math.cos((cursorTick - 4) * 0.028) * 20, opacity: 0.3 },
    { pct: 66 + Math.cos((cursorTick - 6) * 0.028) * 20, opacity: 0.12 },
  ];

  const handleFocusCollaborator = (collabId: string) => {
    if (collabId === 'collab-sarah') {
      const targetTime = Number(((sarahTimelinePct / 100) * TOTAL_DURATION_SEC).toFixed(1));
      setPlayheadSec(targetTime);
      setCollabToast(`Snapped timeline to Sarah (Lead Editor) on Track 2 [${formatTimecode(targetTime)}]`);
      setTimeout(() => setCollabToast(null), 2500);
    } else if (collabId === 'collab-alex') {
      const targetTime = Number(((alexTimelinePct / 100) * TOTAL_DURATION_SEC).toFixed(1));
      setPlayheadSec(targetTime);
      setCollabToast(`Snapped timeline to Alex (Reviewer) on Track 1 [${formatTimecode(targetTime)}]`);
      setTimeout(() => setCollabToast(null), 2500);
    } else {
      setCollabToast('Viewing your current playhead position');
      setTimeout(() => setCollabToast(null), 2000);
    }
  };

  return (
    <div
      className={`h-screen flex flex-col transition-colors duration-200 select-none overflow-hidden ${
        isDark ? 'bg-[#050505] text-[#F4F4F5]' : 'bg-[#F5F5F7] text-[#111111]'
      }`}
    >
      {/* =========================================================================
          1. TOP NAVIGATION BAR (FIXED 56PX HEIGHT)
          Strict spatial separation, breadcrumb, switcher, API badge, export
          ========================================================================= */}
      <header
        className={`h-14 px-4 border-b flex items-center justify-between gap-3 shrink-0 z-30 ${
          isDark ? 'bg-[#0A0A0A] border-[#181818]' : 'bg-white border-[#E2E2E2]'
        }`}
      >
        {/* Left: App Logo & Project Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBackToDashboard ? (
            <button
              type="button"
              onClick={onBackToDashboard}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors shrink-0 ${
                isDark
                  ? 'border-zinc-800 bg-[#121212] text-zinc-200 hover:text-[#C9A063] hover:border-zinc-700'
                  : 'border-zinc-300 bg-white text-zinc-800 hover:text-black hover:border-zinc-400'
              }`}
              title="Return to Creator Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToLanding}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors shrink-0 ${
                isDark
                  ? 'border-zinc-800 text-zinc-300 hover:bg-[#141414]'
                  : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
              }`}
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landing</span>
            </button>
          )}

          {/* Project Name Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium truncate">
            <span className="font-semibold text-zinc-200 truncate">
              {currentProjectName}
            </span>
            <span aria-hidden="true" className="text-zinc-600">
              /
            </span>
            <span className="text-[#C9A063] font-mono-tabular font-medium whitespace-nowrap">
              {ratioLabel}
            </span>
            {config.pacingDensity && (
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-tabular bg-[#C9A063]/15 text-[#C9A063] border border-[#C9A063]/30">
                <Zap className="w-2.5 h-2.5" />
                <span>{config.pacingDensity}</span>
              </span>
            )}
          </div>
        </div>

        {/* Center / Right: API Health Badge + Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* API Vault Health Badge (Green indicator) - Clickable to open API Vault */}
          <button
            type="button"
            onClick={() => setIsApiVaultOpen(true)}
            className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-mono-tabular transition-all hover:scale-[1.02] cursor-pointer ${
              isDark
                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-400 hover:border-emerald-500'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:border-emerald-400'
            }`}
            title="Click to open API Integration & Token Vault"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium">APIs Connected (Pexels + Freesound)</span>
          </button>

          {/* Interactive Tutorial Button */}
          <button
            type="button"
            onClick={() => setIsTutorialOpen(true)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              isDark
                ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-300 hover:bg-[#181818]'
                : 'border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100'
            }`}
            title="Start Interactive Platform Tutorial"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C9A063]" />
            <span className="hidden lg:inline">Tutorial</span>
          </button>

          {/* Save to Firestore Vault Button */}
          <button
            type="button"
            onClick={handleSaveActiveProject}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              isDark
                ? 'border-zinc-800 bg-[#0E0E0E] text-emerald-400 hover:bg-[#181818] hover:border-emerald-500/50'
                : 'border-zinc-300 bg-white text-emerald-600 hover:bg-zinc-100'
            }`}
            title="Save active timeline to Firestore cloud vault"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Project Vault Button (Slide-Out Panel Trigger) */}
          <button
            type="button"
            onClick={() => setIsProjectVaultOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              isDark
                ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-200 hover:bg-[#181818]'
                : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100'
            }`}
            title="Open Project Vault"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Vault</span>
          </button>

          {/* Subtitles & Styles Studio */}
          <button
            type="button"
            onClick={() => setIsSubtitleStudioOpen(true)}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              isDark
                ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-300 hover:bg-[#181818]'
                : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100'
            }`}
            title="Configure kinetic typography & caption styles"
          >
            <Type className="w-3.5 h-3.5 text-[#C9A063]" />
            <span>Subtitles</span>
          </button>

          {/* Media Library */}
          <button
            type="button"
            onClick={() => setIsMediaLibraryOpen(true)}
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
              isDark
                ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-300 hover:bg-[#181818]'
                : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100'
            }`}
            title="Search 4K B-Roll & SFX Audio Library"
          >
            <Film className="w-3.5 h-3.5" />
            <span>Media</span>
          </button>

          {/* Light/Dark Mode Switcher Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme mode"
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'border-zinc-800 text-zinc-300 hover:bg-[#181818]'
                : 'border-zinc-300 text-zinc-700 hover:bg-zinc-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* "Export Sequence" Button (FCPXML / EDL / JSON / MP4) */}
          <button
            type="button"
            onClick={() => setIsExportPipelineOpen(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md transition-all whitespace-nowrap ${
              isDark
                ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                : 'bg-[#111111] text-white hover:bg-zinc-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Sequence</span>
          </button>
        </div>
      </header>

      {/* Export Confirmation Feedback Toast */}
      {exportFeedback && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-lg border bg-[#0C0C0C]/95 border-[#C9A063] text-[#C9A063] text-xs font-mono-tabular shadow-2xl animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{exportFeedback}</span>
        </div>
      )}

      {/* =========================================================================
          WORKSPACE BODY: RESPONSIVE SPLIT WITH DRAGGABLE DIVIDER
          Left Panel (35% default) & Right Panel (65% default)
          ========================================================================= */}
      <div
        ref={workspaceContainerRef}
        className="flex-1 flex flex-col lg:flex-row overflow-hidden relative"
      >
        {/* =======================================================================
            2. LEFT PANEL (35% Screen Width - Vertical Split Container)
            Tab A: AI Content Strategy & Planning Chatbot
            Tab B: Script Ingestion & AI Analysis Engine
            ======================================================================= */}
        <div
          style={{
            width: isLeftPanelCollapsed ? '48px' : `${leftPanelWidth}%`,
          }}
          className={`flex flex-col shrink-0 overflow-hidden transition-all duration-150 border-r ${
            isDark ? 'bg-[#080808] border-[#181818]' : 'bg-white border-[#E2E2E2]'
          } ${isLeftPanelCollapsed ? 'w-12 items-center' : ''}`}
        >
          {/* Collapsed Strip View */}
          {isLeftPanelCollapsed ? (
            <div className="flex flex-col items-center py-4 gap-4 h-full">
              <button
                type="button"
                onClick={() => setIsLeftPanelCollapsed(false)}
                className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Expand Left Panel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="w-full h-[1px] bg-zinc-800" />
              <button
                type="button"
                onClick={() => {
                  setIsLeftPanelCollapsed(false);
                  setActiveLeftTab('strategy');
                }}
                className={`p-2 rounded-lg transition-colors ${
                  activeLeftTab === 'strategy' ? 'text-[#C9A063] bg-[#C9A063]/10' : 'text-zinc-500 hover:text-zinc-200'
                }`}
                title="AI Strategy Chatbot"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLeftPanelCollapsed(false);
                  setActiveLeftTab('script');
                }}
                className={`p-2 rounded-lg transition-colors ${
                  activeLeftTab === 'script' ? 'text-[#C9A063] bg-[#C9A063]/10' : 'text-zinc-500 hover:text-zinc-200'
                }`}
                title="Script & AI Analysis"
              >
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Left Panel Tabs Header */}
              <div
                className={`h-11 px-3 border-b flex items-center justify-between shrink-0 ${
                  isDark ? 'bg-[#0C0C0C] border-[#181818]' : 'bg-[#FAFAFA] border-[#E2E2E2]'
                }`}
              >
                <div className="flex items-center gap-1.5 p-0.5 rounded-lg bg-black/20 border border-zinc-800/40">
                  <button
                    type="button"
                    onClick={() => setActiveLeftTab('strategy')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeLeftTab === 'strategy'
                        ? isDark
                          ? 'bg-[#C9A063] text-[#050505] font-semibold shadow-sm'
                          : 'bg-[#111111] text-white font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Strategy Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveLeftTab('script')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                      activeLeftTab === 'script'
                        ? isDark
                          ? 'bg-[#C9A063] text-[#050505] font-semibold shadow-sm'
                          : 'bg-[#111111] text-white font-semibold shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Script &amp; AI Analysis</span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono-tabular text-zinc-500">
                    {config.niche}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLeftPanelCollapsed(true)}
                    className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                    title="Collapse Left Panel"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 overflow-y-auto">
                {activeLeftTab === 'strategy' ? (
                  /* ==============================================================
                      TAB A: AI CONTENT STRATEGY & PLANNING CHATBOT
                      ============================================================== */
                  <AIStrategyChat
                    theme={theme}
                    niche={String(config.niche)}
                    onSendScriptToStudio={handleSendScriptFromChat}
                  />
                ) : (
                  /* ==============================================================
                      TAB B: SCRIPT INGESTION & AI ANALYSIS ENGINE
                      ============================================================== */
                  <div className="p-4 space-y-4">
                    {/* Raw Script Textarea */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                        <label htmlFor="raw-script-input" className="font-semibold text-zinc-300">
                          Raw Script or Transcript
                        </label>
                        <span className="font-mono-tabular text-[11px] text-zinc-500">
                          {scriptInput.length} chars
                        </span>
                      </div>
                      <textarea
                        id="raw-script-input"
                        rows={4}
                        value={scriptInput}
                        onChange={(e) => setScriptInput(e.target.value)}
                        placeholder="Paste or write your raw script or transcript here..."
                        className={`w-full p-3 rounded-lg border text-xs leading-relaxed outline-none transition-colors resize-none font-sans ${
                          isDark
                            ? 'bg-[#050505] border-[#1E1E1E] text-zinc-200 focus:border-[#C9A063]'
                            : 'bg-[#F9F9FA] border-[#E2E2E2] text-zinc-900 focus:border-black'
                        }`}
                      />

                      {/* Primary Action Button */}
                      <button
                        type="button"
                        onClick={() => handleRunAiAnalysis()}
                        disabled={isAnalyzing}
                        className={`mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold shadow-sm transition-all ${
                          isAnalyzing
                            ? 'bg-[#C9A063]/60 text-[#050505] animate-pulse cursor-wait'
                            : isDark
                            ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                            : 'bg-[#111111] text-white hover:bg-zinc-800'
                        }`}
                      >
                        <Wand2 className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <span>{isAnalyzing ? 'Processing AI Neural Sync...' : 'Run AI Script Analysis'}</span>
                      </button>
                    </div>

                    {/* Detected Voice Profile Bar */}
                    <div
                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                        isDark ? 'bg-[#0E0E0E] border-[#1E1E1E]' : 'bg-[#F5F5F7] border-[#E2E2E2]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Mic className="w-3.5 h-3.5 text-[#C9A063]" />
                        <span>Voice Profile:</span>
                      </div>
                      <span className="font-semibold text-zinc-200 truncate font-mono-tabular text-[11px]">
                        {analysisResult.voiceProfile}
                      </span>
                    </div>

                    {/* Analysis Results Cards Stacked Vertically with Clear Spacing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-400 px-0.5">
                        <span className="font-semibold">Analysis Results Cards</span>
                        <span className="font-mono-tabular text-[11px] text-zinc-500">
                          {analysisResult.timestampCards.length} Segments
                        </span>
                      </div>

                      <div className="space-y-3">
                        {analysisResult.timestampCards.map((card, idx) => {
                          const isActive = activeBeatIndex === idx;
                          return (
                            <div
                              key={card.id}
                              onClick={() => {
                                setActiveBeatIndex(idx);
                                setPlayheadSec(card.startSec);
                              }}
                              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isActive
                                  ? isDark
                                    ? 'bg-[#0E0E0E] border-[#C9A063] shadow-md ring-1 ring-[#C9A063]/30'
                                    : 'bg-[#F5F5F7] border-[#111111] shadow-md ring-1 ring-black/20'
                                  : isDark
                                  ? 'bg-[#070707] border-[#181818] hover:border-zinc-700'
                                  : 'bg-white border-[#E2E2E2] hover:border-zinc-400'
                              }`}
                            >
                              {/* Header: Timestamp Segment Card (00:00 - 00:03) & SFX Trigger Badge */}
                              <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-2">
                                <span className="font-bold text-[#C9A063] bg-[#C9A063]/10 px-2 py-0.5 rounded border border-[#C9A063]/20">
                                  {card.timecode}
                                </span>

                                {/* SFX Trigger Badge */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCycleCardSfx(card.id);
                                  }}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:scale-105 transition-transform flex items-center gap-1"
                                  title="Click to cycle SFX cue sound and test trigger"
                                >
                                  <Music className="w-2.5 h-2.5" />
                                  <span>{card.sfxTrigger}</span>
                                </button>
                              </div>

                              {/* Script Sentence */}
                              <p className="text-xs text-zinc-300 leading-relaxed mb-2.5">
                                {card.text}
                              </p>

                              {/* Subtitle Emphasis Words (Highlighted Keywords detected by AI) */}
                              {card.emphasisWords && card.emphasisWords.length > 0 && (
                                <div className="mb-2.5 flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[10px] font-mono-tabular text-zinc-500">Emphasis:</span>
                                  {card.emphasisWords.map((word, wIdx) => (
                                    <span
                                      key={wIdx}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-mono-tabular font-bold bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40"
                                    >
                                      {word}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Extracted B-roll tags with Quick-Edit Tag Inputs */}
                              <div className="pt-2 border-t border-zinc-800/50 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-[10px] font-mono-tabular text-zinc-500">
                                  <div className="flex items-center gap-1">
                                    <Tag className="w-3 h-3 text-[#C9A063]" />
                                    <span>B-Roll Tags:</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingCardId(editingCardId === card.id ? null : card.id);
                                    }}
                                    className="text-[10px] text-[#C9A063] hover:underline"
                                  >
                                    {editingCardId === card.id ? 'Done' : '+ Edit Tags'}
                                  </button>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5">
                                  {card.visualTags.map((t) => (
                                    <span
                                      key={t}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono-tabular bg-zinc-800/80 text-zinc-300 border border-zinc-700/60"
                                    >
                                      <span>{t}</span>
                                      {editingCardId === card.id && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveTagFromCard(card.id, t);
                                          }}
                                          className="text-zinc-400 hover:text-red-400"
                                        >
                                          <X className="w-2.5 h-2.5" />
                                        </button>
                                      )}
                                    </span>
                                  ))}
                                </div>

                                {/* Quick-edit input box when editing */}
                                {editingCardId === card.id && (
                                  <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 mt-1"
                                  >
                                    <input
                                      type="text"
                                      value={newTagInput}
                                      onChange={(e) => setNewTagInput(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          handleAddTagToCard(card.id);
                                        }
                                      }}
                                      placeholder="Add #tag and press Enter..."
                                      className={`flex-1 px-2 py-1 rounded text-[10px] font-mono-tabular outline-none border ${
                                        isDark
                                          ? 'bg-black border-zinc-700 text-white focus:border-[#C9A063]'
                                          : 'bg-white border-zinc-300 text-black focus:border-black'
                                      }`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => handleAddTagToCard(card.id)}
                                      className="px-2 py-1 rounded bg-[#C9A063] text-[#050505] text-[10px] font-semibold"
                                    >
                                      Add
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Draggable Divider Bar */}
        <div
          onMouseDown={handleDividerMouseDown}
          className={`hidden lg:flex w-1.5 hover:w-2 items-center justify-center cursor-col-resize select-none transition-all z-20 ${
            isDark ? 'bg-[#181818] hover:bg-[#C9A063]' : 'bg-[#E2E2E2] hover:bg-zinc-700'
          }`}
          title="Drag to resize panels"
        >
          <GripVertical className="w-3 h-3 text-zinc-500 opacity-60" />
        </div>

        {/* =======================================================================
            3. RIGHT PANEL (65% Screen Width - Stacked Vertical Split)
            Top Section: Video Preview Canvas (45% Height)
            Bottom Section: Multi-Track Timeline Editor (55% Height)
            ======================================================================= */}
        <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
          {/* =====================================================================
              TOP SECTION: VIDEO PREVIEW CANVAS (45% Height)
              Aspect ratio preview box centered with clean dark background padding
              ===================================================================== */}
          <div
            className={`h-[45%] min-h-[290px] flex flex-col justify-between p-3 sm:p-4 border-b relative overflow-hidden ${
              isDark ? 'bg-[#050505] border-[#181818]' : 'bg-[#F2F2F4] border-[#E2E2E2]'
            }`}
          >
            {/* Top Toolbar: Aspect Ratio Switcher & NLE Metadata */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              {/* Aspect Ratio Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono-tabular text-zinc-500">Ratio:</span>
                <div
                  className={`inline-flex p-0.5 rounded-lg border ${
                    isDark ? 'bg-[#0E0E0E] border-[#222222]' : 'bg-white border-[#E2E2E2]'
                  }`}
                >
                  {(
                    [
                      'TikTok / Reels / Shorts (9:16)',
                      'YouTube Longform (16:9)',
                      'Square Feeds (1:1)',
                    ] as TargetPlatform[]
                  ).map((plat) => {
                    const isSelected = config.platform === plat;
                    const label = plat.includes('9:16') ? '9:16' : plat.includes('16:9') ? '16:9' : '1:1';
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => onUpdateConfig({ ...config, platform: plat })}
                        className={`px-2.5 py-1 rounded text-xs font-mono-tabular font-medium transition-colors ${
                          isSelected
                            ? isDark
                              ? 'bg-[#C9A063] text-[#050505] font-semibold'
                              : 'bg-[#111111] text-white font-semibold'
                            : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Resolution & FPS Readout */}
              <div className="flex items-center gap-2.5 text-[11px] font-mono-tabular text-zinc-400">
                <span className="hidden sm:inline">{activePresetMeta.id}</span>
                <span aria-hidden="true" className="hidden sm:inline text-zinc-600">
                  ·
                </span>
                <span className="hidden md:inline">LUT: {template.lutName}</span>
                <span aria-hidden="true" className="hidden md:inline text-zinc-600">
                  ·
                </span>
                <span className="text-[#C9A063] font-semibold">24.00 FPS</span>
              </div>
            </div>

            {/* Centered Video Engine with Layered Real-Time Kinetic Caption Overlays */}
            <div className="flex-1 flex items-center justify-center p-1 relative overflow-hidden min-h-0">
              <div
                className={`relative rounded-xl overflow-hidden border bg-black shadow-2xl transition-all duration-200 flex items-center justify-center ${
                  isDark ? 'border-[#222222]' : 'border-zinc-300'
                } ${
                  isFullscreenPreview
                    ? 'fixed inset-4 z-50 w-auto h-auto max-w-none max-h-none'
                    : config.platform.includes('9:16')
                    ? 'aspect-[9/16] h-full max-h-[95%] max-w-[280px]'
                    : config.platform.includes('1:1')
                    ? 'aspect-square h-full max-h-[95%] max-w-[340px]'
                    : 'aspect-[16/9] w-full max-w-lg max-h-[95%]'
                }`}
              >
                {/* HTML5 Video Layer */}
                <video
                  ref={videoRef}
                  key={currentBRoll.clipId}
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  poster={currentBRoll.imageUrl}
                  className="absolute inset-0 w-full h-full object-cover object-center filter saturate-[1.12] contrast-[1.08]"
                >
                  <source
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
                    type="video/mp4"
                  />
                </video>

                {/* Animated Kinetic Typography Canvas */}
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={360}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
                />

                {/* Multiplayer Cursors (Sarah & Alex) */}
                <div
                  className="absolute z-20 pointer-events-none transition-transform duration-100"
                  style={{
                    left: `${cursor1X}%`,
                    top: `${cursor1Y}%`,
                  }}
                >
                  <svg
                    className="w-4 h-4 text-[#C9A063] -rotate-12 drop-shadow-md"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 2l7.5 18 2.8-7.2L20.5 10 3 2z" />
                  </svg>
                  <span className="ml-2 -mt-1 inline-block px-1.5 py-0.5 text-[9px] font-mono-tabular rounded-sm bg-[#C9A063] text-[#050505] font-semibold whitespace-nowrap shadow-md">
                    Sarah (Editor)
                  </span>
                </div>

                <div
                  className="absolute z-20 pointer-events-none transition-transform duration-100"
                  style={{
                    left: `${cursor2X}%`,
                    top: `${cursor2Y}%`,
                  }}
                >
                  <svg
                    className="w-4 h-4 text-[#38BDF8] -rotate-12 drop-shadow-md"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M3 2l7.5 18 2.8-7.2L20.5 10 3 2z" />
                  </svg>
                  <span className="ml-2 -mt-1 inline-block px-1.5 py-0.5 text-[9px] font-mono-tabular rounded-sm bg-[#38BDF8] text-slate-950 font-semibold whitespace-nowrap shadow-md">
                    Alex (Reviewer)
                  </span>
                </div>
              </div>
            </div>

            {/* Transport Controls Bar Beneath Video */}
            <div
              className={`p-2 rounded-xl border flex items-center justify-between gap-3 shrink-0 ${
                isDark ? 'bg-[#0B0B0B] border-[#1C1C1C]' : 'bg-white border-[#E2E2E2]'
              }`}
            >
              {/* Play/Pause & Frame Step Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStepFrame(-1.0)}
                  aria-label="Step back 1 second"
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-300 hover:text-white'
                      : 'border-zinc-300 bg-[#F5F5F7] text-zinc-700 hover:text-black'
                  }`}
                  title="Step -1s"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? 'Pause timeline' : 'Play timeline'}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-semibold shadow-sm transition-all ${
                    isDark
                      ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                      : 'bg-[#111111] text-white hover:bg-zinc-800'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleStepFrame(1.0)}
                  aria-label="Step forward 1 second"
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-300 hover:text-white'
                      : 'border-zinc-300 bg-[#F5F5F7] text-zinc-700 hover:text-black'
                  }`}
                  title="Step +1s"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setPlayheadSec(0)}
                  aria-label="Reset to beginning"
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    isDark
                      ? 'border-zinc-800 bg-[#0E0E0E] text-zinc-400 hover:text-white'
                      : 'border-zinc-300 bg-[#F5F5F7] text-zinc-500 hover:text-black'
                  }`}
                  title="Rewind to 00:00"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              {/* Timecode Display: 00:00.00 / 00:30.00 */}
              <div className="flex items-center gap-1.5 text-xs font-mono-tabular">
                <span className="font-bold text-sm text-[#C9A063]">
                  {formatTimecode(playheadSec)}
                </span>
                <span className="text-zinc-600">/</span>
                <span className="text-zinc-400">
                  {formatTimecode(TOTAL_DURATION_SEC)}
                </span>
              </div>

              {/* Volume Slider, Mute & Fullscreen Toggle */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted((m) => !m)}
                  aria-label={isMuted ? 'Unmute preview audio' : 'Mute preview audio'}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVolume(val);
                    setIsMuted(val === 0);
                  }}
                  className="w-16 h-1 editorial-slider accent-[#C9A063]"
                />

                <button
                  type="button"
                  onClick={() => setIsFullscreenPreview((prev) => !prev)}
                  className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                  title={isFullscreenPreview ? 'Exit Fullscreen' : 'Fullscreen Video Canvas'}
                >
                  {isFullscreenPreview ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================================
              BOTTOM SECTION: MULTI-TRACK TIMELINE EDITOR (55% Height)
              Horizontal track dividers with strict vertical alignment
              Track 1: Audio Baseline | Track 2: B-Roll | Track 3: Subtitles | Track 4: SFX
              ===================================================================== */}
          <div
            className={`h-[55%] min-h-[300px] flex flex-col justify-between p-3 sm:p-4 select-none overflow-y-auto ${
              isDark ? 'bg-[#080808]' : 'bg-white'
            }`}
          >
            {/* Timeline Header Bar: Title, Density Selector & Zoom Slider */}
            <div className="flex items-center justify-between gap-4 mb-2 shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-zinc-200">
                  Multi-Track Timeline
                </span>
                <span className="hidden sm:inline text-[11px] font-mono-tabular text-zinc-500">
                  (Scrub playhead or click tracks)
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Visual Density Selector (Compact / Spacious / Auto-Expand) */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="hidden md:inline text-zinc-500 font-mono-tabular text-[11px]">
                    Density:
                  </span>
                  <div
                    className={`inline-flex p-0.5 rounded-md border ${
                      isDark ? 'bg-[#050505] border-[#1C1C1C]' : 'bg-[#F5F5F7] border-[#E2E2E2]'
                    }`}
                  >
                    {(
                      [
                        { id: 'compact', label: 'Pro Density' },
                        { id: 'spacious', label: 'Spacious' },
                        { id: 'auto', label: 'Auto' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setDensityMode(m.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono-tabular transition-colors ${
                          densityMode === m.id
                            ? isDark
                              ? 'bg-[#C9A063] text-[#050505] font-bold'
                              : 'bg-[#111111] text-white font-bold'
                            : 'text-zinc-500 hover:text-zinc-200'
                        }`}
                        title={`Switch timeline density to ${m.label}`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Zoom Slider (1x, 2x, 5x) in Top-Right Corner */}
                {/* Interactive Timeline Zoom Slider Component (1x, 2x, 5x) in Top-Right Corner */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-500 font-mono-tabular text-[11px] flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-[#C9A063]" />
                    <span className="hidden sm:inline">Zoom:</span>
                  </span>

                  {/* Range Slider for horizontal scale (1x, 2x, 5x) */}
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={1}
                      value={timelineZoom === 1 ? 1 : timelineZoom === 2 ? 2 : 3}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        const mapped = val === 1 ? 1 : val === 2 ? 2 : 5;
                        setTimelineZoom(mapped as 1 | 2 | 5);
                      }}
                      className="w-16 sm:w-20 h-1.5 rounded-lg accent-[#C9A063] cursor-pointer bg-zinc-700/60"
                      title="Drag to dynamically zoom all 4 tracks horizontally (1x, 2x, 5x)"
                    />

                    {/* Scale Step Indicators */}
                    <div
                      className={`inline-flex p-0.5 rounded-md border ${
                        isDark ? 'bg-[#050505] border-[#1C1C1C]' : 'bg-[#F5F5F7] border-[#E2E2E2]'
                      }`}
                    >
                      {([1, 2, 5] as const).map((z) => (
                        <button
                          key={z}
                          type="button"
                          onClick={() => setTimelineZoom(z)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono-tabular transition-colors ${
                            timelineZoom === z
                              ? isDark
                                ? 'bg-[#C9A063] text-[#050505] font-bold'
                                : 'bg-[#111111] text-white font-bold'
                              : 'text-zinc-500 hover:text-zinc-200'
                          }`}
                          title={`Scale timeline tracks to ${z}x width`}
                        >
                          {z}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Multi-Track Canvas & Interactive Scrubbing Playhead Container */}
            <div className="flex-1 overflow-x-auto relative pb-2 min-h-0">
              <div
                ref={timelineRulerRef}
                onMouseDown={(e) => {
                  isDraggingPlayhead.current = true;
                  handleTimelineScrub(e.clientX);
                }}
                onMouseMove={(e) => {
                  if (isDraggingPlayhead.current) {
                    handleTimelineScrub(e.clientX);
                  }
                }}
                onMouseUp={() => {
                  isDraggingPlayhead.current = false;
                }}
                onMouseLeave={() => {
                  isDraggingPlayhead.current = false;
                }}
                className="relative space-y-2 cursor-crosshair"
                style={{ width: `${100 * timelineZoom}%`, minWidth: '780px' }}
              >
                {/* Interactive Playhead Line Smoothly Crossing All 4 Tracks */}
                <div
                  className="absolute top-0 bottom-0 z-30 pointer-events-none"
                  style={{
                    left: `calc(7.5rem + (100% - 7.5rem) * ${playheadSec / TOTAL_DURATION_SEC})`,
                    transition: isPlaying ? 'left 50ms linear' : 'left 60ms ease-out',
                  }}
                >
                  <div className="w-3.5 h-3.5 -ml-1.5 -mt-1.5 rotate-45 bg-[#C9A063] shadow-lg border border-white/60" />
                  <div className="w-[1.5px] h-full bg-[#C9A063] shadow-md" />
                </div>

                {/* Timecode Ruler */}
                <div className="flex items-center justify-between text-[10px] font-mono-tabular text-zinc-500 pl-32 pr-2 py-1 border-b border-zinc-800/40">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const sec = (i * 5).toFixed(0);
                    return <span key={i}>00:00:{sec.padStart(2, '0')}.00</span>;
                  })}
                </div>

                {/* TRACK 1 (Audio Baseline): Waveform visualizer with text fragment cards */}
                <div className="flex items-center gap-3">
                  <div className="w-28 shrink-0 flex items-center gap-1.5 text-xs font-mono-tabular text-zinc-400">
                    <Mic className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Track 1 · Audio</span>
                  </div>
                  <div
                    className={`flex-1 rounded-lg border px-3 flex items-center justify-between overflow-hidden transition-all duration-200 ${
                      densityMode === 'compact' ? 'h-8' : densityMode === 'spacious' ? 'h-12' : 'h-9 hover:h-12'
                    } ${isDark ? 'bg-[#050505] border-[#181818]' : 'bg-[#F5F5F7] border-[#E2E2E2]'}`}
                  >
                    {/* Simulated Waveform Visualizer */}
                    <div className="flex-1 flex items-center gap-0.5 h-full mr-3">
                      {Array.from({ length: 96 }).map((_, i) => {
                        const barHeight = 20 + ((i * 31 + 7) % 65);
                        const isPassed = (i / 96) * TOTAL_DURATION_SEC <= playheadSec;
                        return (
                          <div
                            key={i}
                            className={`w-0.5 rounded-full transition-colors ${
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
                    <span className="text-[10px] font-mono-tabular text-zinc-500 shrink-0">
                      48kHz Master Stems
                    </span>
                  </div>
                </div>

                {/* TRACK 2 (B-Roll Track): Video thumbnail blocks with drag handles and tag labels */}
                <div className="flex items-center gap-3">
                  <div className="w-28 shrink-0 flex items-center gap-1.5 text-xs font-mono-tabular text-zinc-400">
                    <Film className="w-3.5 h-3.5 text-[#C9A063]" />
                    <span>Track 2 · B-Roll</span>
                  </div>
                  <div
                    className={`flex-1 grid grid-cols-4 gap-2 transition-all duration-200 ${
                      densityMode === 'compact' ? 'h-10' : densityMode === 'spacious' ? 'h-16' : 'h-11 hover:h-16'
                    }`}
                  >
                    {brollItems.map((item) => {
                      const isActive =
                        playheadSec >= item.startSec && playheadSec < item.startSec + item.durationSec;
                      return (
                        <div
                          key={item.id}
                          className={`group relative rounded-lg border p-1 flex items-center gap-2 overflow-hidden transition-all duration-200 ${
                            isActive
                              ? 'border-[#C9A063] bg-[#C9A063]/15'
                              : isDark
                              ? 'border-[#181818] bg-[#0A0A0A]'
                              : 'border-[#E2E2E2] bg-white'
                          }`}
                        >
                          {/* Thumbnail with Ken Burns scale on hover */}
                          <div
                            className={`relative rounded overflow-hidden shrink-0 bg-black ${
                              densityMode === 'spacious' ? 'w-16 h-full' : 'w-10 h-full'
                            }`}
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                            />
                          </div>

                          <div className="flex-1 min-w-0 pr-1">
                            <div className="text-[10px] font-semibold truncate group-hover:text-[#C9A063] transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[9px] font-mono-tabular text-zinc-500 truncate">
                              {item.durationSec}s · {item.resolution}
                            </div>
                          </div>

                          {/* Lock badge */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBrollLock(item.id);
                            }}
                            aria-label={item.isLocked ? 'Unlock clip' : 'Lock clip'}
                            className="p-1 rounded text-zinc-500 hover:text-white transition-colors"
                          >
                            {item.isLocked ? (
                              <Lock className="w-3 h-3 text-[#C9A063]" />
                            ) : (
                              <Unlock className="w-3 h-3 opacity-40 hover:opacity-100" />
                            )}
                          </button>

                          {/* Drag handles at right edge */}
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#C9A063]/40 cursor-ew-resize hover:bg-[#C9A063]" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TRACK 3 (Kinetic Subtitle Track): Text markers showing active subtitle duration */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsSubtitleStudioOpen(true)}
                    className="w-28 shrink-0 flex items-center gap-1.5 text-xs font-mono-tabular text-zinc-400 hover:text-[#C9A063] transition-colors text-left"
                    title="Open Subtitle & Style Studio"
                  >
                    <Type className="w-3.5 h-3.5 text-[#C9A063]" />
                    <span>Track 3 · Subtitles</span>
                  </button>
                  <div
                    className={`flex-1 grid grid-cols-4 gap-2 transition-all duration-200 ${
                      densityMode === 'compact' ? 'h-7' : densityMode === 'spacious' ? 'h-10' : 'h-8 hover:h-10'
                    }`}
                  >
                    {captionItems.map((c) => {
                      const isActive =
                        playheadSec >= c.startSec && playheadSec < c.startSec + c.durationSec;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setIsSubtitleStudioOpen(true)}
                          className={`rounded-lg border px-2.5 flex items-center justify-between text-[10px] font-mono-tabular truncate cursor-pointer transition-all ${
                            isActive
                              ? 'border-[#C9A063] bg-[#C9A063]/15 text-white'
                              : isDark
                              ? 'border-[#181818] bg-[#0A0A0A] text-zinc-400 hover:border-zinc-700'
                              : 'border-[#E2E2E2] bg-white text-zinc-600 hover:border-zinc-400'
                          }`}
                          title="Click to edit subtitle style"
                        >
                          <span className="truncate">{c.text}</span>
                          <span className="text-zinc-500 ml-1 shrink-0">{c.durationSec}s</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TRACK 4 (SFX Track): Pulsing audio marker icons (#whoosh, #pop) */}
                <div className="flex items-center gap-3">
                  <div className="w-28 shrink-0 flex items-center gap-1.5 text-xs font-mono-tabular text-zinc-400">
                    <Music className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Track 4 · SFX</span>
                  </div>
                  <div
                    className={`flex-1 rounded-lg border px-3 relative flex items-center overflow-hidden transition-all duration-200 ${
                      densityMode === 'compact' ? 'h-7' : densityMode === 'spacious' ? 'h-10' : 'h-8 hover:h-10'
                    } ${isDark ? 'bg-[#050505] border-[#181818]' : 'bg-[#F5F5F7] border-[#E2E2E2]'}`}
                  >
                    {sfxItems.map((sfx) => {
                      const leftPercent = (sfx.startSec / TOTAL_DURATION_SEC) * 100;
                      const isActive =
                        playheadSec >= sfx.startSec && playheadSec < sfx.startSec + sfx.durationSec;
                      return (
                        <button
                          key={sfx.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            sfxSynth.play(sfx.category);
                          }}
                          style={{ left: `${leftPercent}%` }}
                          className={`absolute -translate-y-1/2 top-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono-tabular transition-all ${
                            isActive
                              ? 'bg-[#C9A063] text-[#050505] font-bold scale-110 shadow-lg ring-2 ring-white/40 animate-pulse'
                              : isDark
                              ? 'bg-zinc-800 text-zinc-300 hover:scale-105'
                              : 'bg-zinc-200 text-zinc-800 hover:scale-105'
                          }`}
                          title={`Click to preview SFX cue: ${sfx.name}`}
                        >
                          <Volume2 className="w-2.5 h-2.5" />
                          <span>#{sfx.category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODALS & DRAWERS
          ========================================================================= */}
      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        theme={theme}
        playheadSec={playheadSec}
        aiSuggestedKeywords={analysisResult.dominantVisualKeywords}
        onAssignVideoToPlayhead={handleAssignVideoFromLibrary}
        onAssignSfxToPlayhead={handleAssignSfxFromLibrary}
      />

      {/* Subtitle Style Studio Modal */}
      <SubtitleStyleStudioModal
        isOpen={isSubtitleStudioOpen}
        onClose={() => setIsSubtitleStudioOpen(false)}
        theme={theme}
        currentConfig={subtitleStyle}
        onApplyConfig={(newConfig) => setSubtitleStyle(newConfig)}
      />

      {/* Project Vault Slide-Out Drawer Modal */}
      <ProjectVaultModal
        isOpen={isProjectVaultOpen}
        onClose={() => setIsProjectVaultOpen(false)}
        user={user}
        theme={theme}
        currentProject={{
          id: currentProjectId,
          name: currentProjectName,
          aspectRatio: config.platform.includes('9:16')
            ? '9:16'
            : config.platform.includes('1:1')
            ? '1:1'
            : '16:9',
          scriptText: scriptInput,
          brollItems,
          captionItems,
          sfxItems,
          subtitleStyle,
        }}
        onLoadProject={handleLoadProject}
      />

      {/* Export Pipeline Center Modal */}
      <ExportPipelineModal
        isOpen={isExportPipelineOpen}
        onClose={() => setIsExportPipelineOpen(false)}
        theme={theme}
        projectName={currentProjectName}
        totalDurationSec={TOTAL_DURATION_SEC}
        lutName={template.lutName}
        videoClips={brollItems}
        captions={captionItems}
        sfxCues={sfxItems}
        subtitleStyle={subtitleStyle}
      />

      {/* API Integration & Token Vault Modal */}
      <ApiVaultModal
        isOpen={isApiVaultOpen}
        onClose={() => setIsApiVaultOpen(false)}
        theme={theme}
      />

      {/* Interactive Platform Tutorial Modal */}
      <PlatformTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
        theme={theme}
        onOpenStudio={() => setIsTutorialOpen(false)}
      />
    </div>
  );
};
