import Phaser from 'phaser';

const MERGE_FREQUENCIES = [
  261.63, // C4 - tier 1
  329.63, // E4 - tier 2
  392.00, // G4 - tier 3
  440.00, // A4 - tier 4
  523.25, // C5 - tier 5
  659.25, // E5 - tier 6
  783.99, // G5 - tier 7
  1046.50, // C6 - tier 8
];

export class AudioManager {
  scene: Phaser.Scene;
  audioContext: AudioContext | null = null;
  muted = false;
  initialized = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  init() {
    if (this.initialized) return;
    try {
      this.audioContext = new AudioContext();
      this.initialized = true;
    } catch {
      // Audio not available
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.audioContext) this.init();
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  playDrop(tierRadius: number) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150 - tierRadius, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  playMerge(tierId: number) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const freq = MERGE_FREQUENCIES[tierId - 1] || 440;
    const duration = 0.2 + tierId * 0.05;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = tierId >= 5 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq * 0.8, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.2, ctx.currentTime + duration * 0.3);
    osc.frequency.exponentialRampToValueAtTime(freq, ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.2 + tierId * 0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);

    if (tierId >= 3) {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(freq * 2, ctx.currentTime + duration * 0.5);
      gain2.gain.setValueAtTime(0.08, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.5);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + duration * 0.5);
    }
  }

  playChain(chainCount: number) {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const baseFreq = 600 + chainCount * 100;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  playGameOver() {
    if (this.muted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 1);
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  destroy() {
    this.audioContext?.close();
    this.audioContext = null;
    this.initialized = false;
  }
}
