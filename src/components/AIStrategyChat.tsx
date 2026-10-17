import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  ArrowRight,
  Bot,
  User,
  Zap,
  Copy,
  Check,
  Flame,
  FileText,
  Lightbulb,
  Target,
  Wand2,
  Film,
  Music,
} from 'lucide-react';
import { ThemeMode } from '../types';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  scriptPayload?: string;
  timestamp: string;
}

interface AIStrategyChatProps {
  theme: ThemeMode;
  niche: string;
  onSendScriptToStudio: (scriptText: string) => void;
}

interface QuickTemplate {
  icon: string;
  label: string;
  prompt: string;
  getResponse: (niche: string) => { text: string; scriptOnly: string };
}

const QUICK_PROMPT_TEMPLATES: QuickTemplate[] = [
  {
    icon: '💡',
    label: 'Viral Hooks',
    prompt: 'Give me 5 high-retention opening hooks for this topic.',
    getResponse: (niche: string) => ({
      text: `### 🎯 High-Retention Opening Hooks (${niche})

Here are 5 psychologically engineered hooks designed to prevent drop-off in the first 3 seconds:

1. **The Inversion Hook**: *"Almost everything you've been told about ${niche} is designed to keep you broke and distracted."*
2. **The High-Stakes Revelation**: *"If you're still doing this manually in 2026, you're literally handing your competitors your market share."*
3. **The Micro-Proof Tease**: *"We tested 40 different workflows last week. Exactly one generated a 94% retention spike."*
4. **The Counter-Intuitive Claim**: *"Why the best performers in ${niche} deliberately break the #1 rule everyone else blindly follows."*
5. **The Visual Pattern Interrupt**: *"Stop scrolling. What you're looking at right now is going to be obsolete in 90 days."*

---

### 📝 Script Lines
[00:00 - 00:04] Almost everything you've been told about ${niche} is designed to keep you broke and distracted.
[00:04 - 00:11] While beginners chase surface-level trends, top operators engineer automated leverage loops.
[00:11 - 00:20] When you align high-speed execution with systemic distribution, compound momentum takes over.
[00:20 - 00:30] Save this breakdown and restructure your next sequence before the algorithm pivots.

---

### 🎥 Visual B-Roll Suggestions
- **00:00 - 00:04**: Rapid-cut macro camera zoom on glowing HUD interface or trading screen.
- **00:04 - 00:11**: Dynamic timelapse of futuristic server racks or Tokyo night traffic with kinetic motion blur.
- **00:11 - 00:20**: Isometric 3D wireframe render of interconnected neural data nodes pulsing in cyan.
- **00:20 - 00:30**: Extreme close-up of fingers adjusting a mechanical dial or keyboard with anamorphic lens flare.

---

### 🔊 Recommended SFX
- **00:00**: Heavy sub-bass impact hit (\`#impact\`) + vinyl tape stop.
- **00:04**: Low-frequency digital riser (\`#riser\`) ramping into transition.
- **00:11**: Crisp multi-layered cinematic whoosh (\`#whoosh\`) on visual switch.
- **00:20**: Kinetic glitch accent (\`#glitch\`) under the final takeaway punchline.`,
      scriptOnly: `Almost everything you've been told about ${niche} is designed to keep you broke and distracted.

While beginners chase surface-level trends, top operators engineer automated leverage loops.

When you align high-speed execution with systemic distribution, compound momentum takes over.

Save this breakdown and restructure your next sequence before the algorithm pivots.`,
    }),
  },
  {
    icon: '📜',
    label: 'Script Outline',
    prompt: 'Outline a 30-second video script about market trends.',
    getResponse: (niche: string) => ({
      text: `### 📊 30-Second Video Script Outline (${niche} Market Trends)

**Cadence Target**: 140 WPM · Fast pacing with micro-interrupts every 3.2s.

---

### 📝 Script Lines
[00:00 - 00:05] A massive macro shift is silently unfolding across ${niche}, and 99% of people are completely blindsided.
[00:05 - 00:12] Historical data shows that every major liquidity cycle starts when retail sentiment hits peak apathy.
[00:12 - 00:21] The institutions aren't waiting; they are deploying capital into automated infrastructure at record speed.
[00:21 - 00:30] Position your assets ahead of the curve today, or get priced out of the modern ecosystem.

---

### 🎥 Visual B-Roll Suggestions
- **00:00 - 00:05**: Aerial drone shot of New York financial district shrouded in cinematic morning fog.
- **00:05 - 00:12**: Holographic candlestick chart accelerating upward with green volumetric particles.
- **00:12 - 00:21**: High-speed shot of automated silicon fab robotic arm placing next-gen wafers.
- **00:21 - 00:30**: Dramatic slow-motion shot of modern creator adjusting high-end studio monitor.

---

### 🔊 Recommended SFX
- **00:00**: Sub-bass boom (\`#impact\`) paired with a high-tension clock tick.
- **00:05**: Fast metallic whoosh (\`#whoosh\`) syncing with the chart spike.
- **00:12**: Mechanical cybernetic click & riser (\`#riser\`) building urgency.
- **00:21**: Deep resonant tonal bell chime (\`#minimal\`) on call-to-action.`,
      scriptOnly: `A massive macro shift is silently unfolding across ${niche}, and 99% of people are completely blindsided.

Historical data shows that every major liquidity cycle starts when retail sentiment hits peak apathy.

The institutions aren't waiting; they are deploying capital into automated infrastructure at record speed.

Position your assets ahead of the curve today, or get priced out of the modern ecosystem.`,
    }),
  },
  {
    icon: '🎯',
    label: 'Topic Ideas',
    prompt: 'Suggest 3 video concepts that are trending this week.',
    getResponse: (niche: string) => ({
      text: `### 🚀 Top 3 Trending Video Concepts (${niche})

Here are 3 viral frameworks currently outperforming on TikTok, YouTube Shorts, and Instagram Reels:

1. **"The Contrarian Playbook"**
   - *Core Angle*: Why conventional wisdom in ${niche} is mathematically flawed.
   - *Viral Anchor*: Exposing high-cost mistakes made by beginners.

2. **"The 10x Efficiency Stack"**
   - *Core Angle*: 3 underground tools and workflows that elite operators use daily.
   - *Viral Anchor*: "How I eliminated 15 hours of busywork in 48 hours."

3. **"The 90-Day Transformation Matrix"**
   - *Core Angle*: Concrete roadmap from zero to top 1% output in ${niche}.
   - *Viral Anchor*: Step-by-step sequential blueprint with high visual density.

---

### 📝 Script Lines
[00:00 - 00:04] Here is the exact 3-step efficiency stack that top 1% operators in ${niche} never share publicly.
[00:04 - 00:12] Step one: eliminate all repetitive friction with real-time autonomous pipelines.
[00:12 - 00:20] Step two: focus exclusively on asymmetric distribution channels with compounding leverage.
[00:20 - 00:30] Step three: execute in sprints, measure ruthlessly, and double down on what retains attention.

---

### 🎥 Visual B-Roll Suggestions
- **00:00 - 00:04**: Clean top-down flatlay of minimalist workstation with mechanical keyboard and espresso.
- **00:04 - 00:12**: Screen capture of automated terminal code executing in real-time with green stdout.
- **00:12 - 00:20**: High-speed time-lapse of London financial district with neon light trails.
- **00:20 - 00:30**: Dynamic portrait of modern founder looking into studio lighting with focused expression.

---

### 🔊 Recommended SFX
- **00:00**: Crisp snap & UI pop (\`#impact\`).
- **00:04**: High-velocity whoosh sweep (\`#whoosh\`).
- **00:12**: Electronic data packet chirp (\`#glitch\`).
- **00:20**: Orchestral sub-drop with cinematic riser (\`#riser\`).`,
      scriptOnly: `Here is the exact 3-step efficiency stack that top 1% operators in ${niche} never share publicly.

Step one: eliminate all repetitive friction with real-time autonomous pipelines.

Step two: focus exclusively on asymmetric distribution channels with compounding leverage.

Step three: execute in sprints, measure ruthlessly, and double down on what retains attention.`,
    }),
  },
];

export const AIStrategyChat: React.FC<AIStrategyChatProps> = ({
  theme,
  niche,
  onSendScriptToStudio,
}) => {
  const isDark = theme === 'dark';
  const modeIndicatorLabel = `Configured for ${
    niche.toLowerCase().includes('short') ? niche : `${niche} Shorts`
  }`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `### 🤖 Welcome to AI Content Strategy Co-Pilot
**${modeIndicatorLabel}**

I am trained on top viral retention curves, pacing patterns, and visual B-roll alignment. Click any quick template below or describe your topic to generate high-retention script beats, B-roll cues, and sound design markers.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Find closest template match
    const templateMatch = QUICK_PROMPT_TEMPLATES.find(
      (t) =>
        t.prompt.toLowerCase() === query.toLowerCase() ||
        t.label.toLowerCase() === query.toLowerCase() ||
        query.toLowerCase().includes(t.label.toLowerCase())
    );

    setTimeout(() => {
      let aiText = '';
      let scriptPayload = '';

      if (templateMatch) {
        const generated = templateMatch.getResponse(niche);
        aiText = generated.text;
        scriptPayload = generated.scriptOnly;
      } else {
        aiText = `### 🎬 Custom High-Retention Strategy for "${query}"
**Target Niche**: ${niche} · Pacing: 140 WPM · Structure: 4 Beats

---

### 📝 Script Lines
[00:00 - 00:05] Most creators never realize this one critical breakthrough about ${query}.
[00:05 - 00:12] When you strip away all the surface noise, what drives exponential performance is relentless focus and speed.
[00:12 - 00:20] Watch how this single workflow shift transforms your baseline output from ordinary to elite.
[00:20 - 00:30] Save this blueprint right now and deploy it before everyone else catches on.

---

### 🎥 Visual B-Roll Suggestions
- **00:00 - 00:05**: Dynamic macro zoom on sleek tech interface with glowing neon accents.
- **00:05 - 00:12**: Cinematic high-contrast timelapse of modern city skyline with hyper-lapse lights.
- **00:12 - 00:20**: Isometric 3D motion graphics showcasing automated data pipeline syncing.
- **00:20 - 00:30**: Creator reviewing finished render on high-resolution curved monitor with studio rim lighting.

---

### 🔊 Recommended SFX
- **00:00**: Heavy sub-bass impact (\`#impact\`) with analog tape stop.
- **00:05**: Kinetic air whoosh (\`#whoosh\`) on first scene cut.
- **00:12**: Subtle digital data sweep (\`#glitch\`) highlighting the key point.
- **00:20**: Cinematic tension riser (\`#riser\`) resolving into a clean punch punchline.`;

        scriptPayload = `Most creators never realize this one critical breakthrough about ${query}.

When you strip away all the surface noise, what drives exponential performance is relentless focus and speed.

Watch how this single workflow shift transforms your baseline output from ordinary to elite.

Save this blueprint right now and deploy it before everyone else catches on.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        scriptPayload,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 550);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 1. Header Area: Title & Mode Indicator */}
      <div
        className={`shrink-0 px-3.5 py-3 border-b flex flex-col gap-1 ${
          isDark ? 'bg-[#0A0A0A] border-[#1C1C1C]' : 'bg-[#FAFAFA] border-zinc-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#C9A063]/20 border border-[#C9A063]/40 flex items-center justify-center text-[#C9A063]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs font-bold tracking-tight">AI Content Strategy Co-Pilot</h2>
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono-tabular bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
          <Target className="w-3 h-3 text-[#C9A063]" />
          <span className="text-[#C9A063] font-semibold">{modeIndicatorLabel}</span>
        </div>
      </div>

      {/* 2. Quick Prompt Templates (Clickable Pills) */}
      <div
        className={`shrink-0 p-3 border-b space-y-2 ${
          isDark ? 'bg-[#090909] border-[#1A1A1A]' : 'bg-zinc-50/80 border-zinc-200'
        }`}
      >
        <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick Prompt Templates</span>
          </div>
          <span className="text-[10px] font-mono-tabular text-zinc-500">1-click ideation</span>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {QUICK_PROMPT_TEMPLATES.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(item.prompt)}
              className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] ${
                isDark
                  ? 'bg-[#121212] border-[#242424] text-zinc-200 hover:border-[#C9A063] hover:text-[#C9A063] hover:bg-[#181818]'
                  : 'bg-white border-zinc-300 text-zinc-800 hover:border-black hover:bg-zinc-100'
              }`}
              title={item.prompt}
            >
              <span>{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Chat Messages Container */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {isAI ? (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#C9A063]" />
                    <span className="font-semibold text-[10px] text-[#C9A063]">
                      Co-Pilot Strategist
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-[10px] text-zinc-400">You</span>
                    <User className="w-3.5 h-3.5 text-zinc-400" />
                  </>
                )}
                <span className="text-[10px] font-mono-tabular text-zinc-500">
                  {msg.timestamp}
                </span>
              </div>

              <div
                className={`max-w-[95%] rounded-xl p-3.5 leading-relaxed shadow-sm ${
                  isAI
                    ? isDark
                      ? 'bg-[#111111] border border-[#222222] text-zinc-200'
                      : 'bg-white border border-zinc-200 text-zinc-900 shadow'
                    : isDark
                    ? 'bg-[#C9A063]/20 border border-[#C9A063]/40 text-zinc-100'
                    : 'bg-black text-white'
                }`}
              >
                <div className="whitespace-pre-line text-xs font-normal space-y-2">
                  {msg.text}
                </div>

                {/* "Push Script to Studio Editor" Button */}
                {msg.scriptPayload && (
                  <div
                    className={`mt-3.5 pt-3 border-t flex flex-wrap items-center justify-between gap-2 ${
                      isDark ? 'border-zinc-800/80' : 'border-zinc-200'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSendScriptToStudio(msg.scriptPayload!)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] ${
                        isDark
                          ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                          : 'bg-black text-white hover:bg-zinc-800'
                      }`}
                      title="Directly transfer script to Tab B and automatically sync timeline in real time"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Push Script to Studio Editor</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(msg.id, msg.scriptPayload!)}
                      className={`p-2 rounded-lg border text-zinc-400 hover:text-white transition-colors ${
                        isDark
                          ? 'border-zinc-800 hover:bg-zinc-800'
                          : 'border-zinc-300 hover:bg-zinc-100 hover:text-black'
                      }`}
                      title="Copy clean script text to clipboard"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-2 text-xs text-zinc-400">
            <Bot className="w-3.5 h-3.5 text-[#C9A063] animate-pulse" />
            <span className="italic font-mono-tabular">
              Synthesizing script lines, B-roll visuals, and SFX cues...
            </span>
          </div>
        )}
      </div>

      {/* 4. Chat Input Bar */}
      <div
        className={`shrink-0 p-3 border-t ${
          isDark ? 'bg-[#0A0A0A] border-[#1C1C1C]' : 'bg-white border-zinc-200'
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask AI to brainstorm hooks or write a 30s script..."
            className={`flex-1 px-3 py-2 rounded-lg border text-xs outline-none transition-colors ${
              isDark
                ? 'bg-[#121212] border-[#242424] text-zinc-200 focus:border-[#C9A063]'
                : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-black'
            }`}
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-lg font-semibold transition-all ${
              inputText.trim()
                ? isDark
                  ? 'bg-[#C9A063] text-[#050505] hover:bg-[#d8b47b]'
                  : 'bg-black text-white hover:bg-zinc-800'
                : 'opacity-40 cursor-not-allowed bg-zinc-800 text-zinc-500'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
