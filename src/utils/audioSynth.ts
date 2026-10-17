/**
 * Web Audio API synthesizer for instant, realistic SFX previews.
 * Synthesizes whoosh, impact, glitch, riser, and minimal acoustic cues.
 */

class SfxSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playWhoosh(duration = 0.8): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Create white noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + duration * 0.45);
    filter.frequency.exponentialRampToValueAtTime(120, now + duration);
    filter.Q.setValueAtTime(3.5, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.4, now + duration * 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  playImpact(duration = 1.2): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    // Sub-bass pitch drop oscillator
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    // Initial click transient
    const clickOsc = ctx.createOscillator();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(600, now);
    clickOsc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.55, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.4, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(oscGain);
    clickOsc.connect(clickGain);
    oscGain.connect(ctx.destination);
    clickGain.connect(ctx.destination);

    osc.start(now);
    clickOsc.start(now);
    osc.stop(now + duration);
    clickOsc.stop(now + 0.08);
  }

  playGlitch(duration = 0.5): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.setValueAtTime(1840, now + 0.08);
    osc.frequency.setValueAtTime(420, now + 0.16);
    osc.frequency.setValueAtTime(2200, now + 0.28);
    osc.frequency.setValueAtTime(120, now + 0.38);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.setValueAtTime(0.02, now + 0.1);
    gain.gain.setValueAtTime(0.3, now + 0.18);
    gain.gain.setValueAtTime(0.01, now + 0.26);
    gain.gain.setValueAtTime(0.2, now + 0.34);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playRiser(duration = 1.8): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(4500, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + duration * 0.9);
    gain.gain.linearRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playMinimal(duration = 0.3): void {
    const ctx = this.getContext();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(840, now);
    osc.frequency.exponentialRampToValueAtTime(520, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  play(category: 'whoosh' | 'impact' | 'riser' | 'glitch' | 'minimal'): void {
    switch (category) {
      case 'whoosh':
        this.playWhoosh();
        break;
      case 'impact':
        this.playImpact();
        break;
      case 'glitch':
        this.playGlitch();
        break;
      case 'riser':
        this.playRiser();
        break;
      case 'minimal':
      default:
        this.playMinimal();
        break;
    }
  }
}

export const sfxSynth = new SfxSynthesizer();
