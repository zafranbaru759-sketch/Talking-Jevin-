/**
 * Talking Jevin Audio Engine
 * Pure Web Audio API synthesis for zero-dependency, 100% offline sound effects,
 * cute procedural BGM, microphone pitch-shift repeater, and speech synthesis.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmOscs: OscillatorNode[] = [];
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: number | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(muted ? 0 : 0.08, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Cute pop sound (clicking, tapping UI)
  public playPop() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio context restricted before gesture
    }
  }

  // Tickle / Giggle sound (giggles, laugh)
  public playGiggle() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const notes = [520, 680, 580, 750, 620, 800];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq + 100, start + 0.05);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.055);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.06);
      });
    } catch {
      // Audio fallback
    }
  }

  // Yawn sound (sleepy)
  public playYawn() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.4);
      osc.frequency.exponentialRampToValueAtTime(220, now + 1.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    } catch {
      // fallback
    }
  }

  // Eating / munching snack sound
  public playMunch() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      [0, 0.12, 0.24].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const now = ctx.currentTime + delay;
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      });
    } catch {
      // fallback
    }
  }

  // Bath / water bubble sound
  public playSplash() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const freqs = [600, 850, 1100, 750];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const now = ctx.currentTime + idx * 0.05;
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq + 300, now + 0.06);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      });
    } catch {
      // fallback
    }
  }

  // Coin pickup chime
  public playCoin() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.09); // E6

      osc2.frequency.setValueAtTime(987.77 * 0.5, now);
      osc2.frequency.setValueAtTime(1318.51 * 0.5, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.36);
      osc2.stop(now + 0.36);
    } catch {
      // fallback
    }
  }

  // Surprised / Pokéd sound
  public playSurprise() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // fallback
    }
  }

  // Crying / sobbing sound (hiks hiks uwaaa)
  public playCry() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const sobTimes = [0, 0.22, 0.44, 0.7];
      sobTimes.forEach((startT, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const start = ctx.currentTime + startT;
        const baseFreq = i % 2 === 0 ? 550 : 420;

        osc.frequency.setValueAtTime(baseFreq, start);
        osc.frequency.linearRampToValueAtTime(baseFreq - 140, start + 0.18);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.19);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch {
      // fallback
    }
  }

  // Sky baby bear crying / whimpering sound
  public playSkyCry() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const sobTimes = [0, 0.18, 0.38, 0.6];
      sobTimes.forEach((startT, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + startT;
        const baseFreq = i % 2 === 0 ? 820 : 680;

        osc.frequency.setValueAtTime(baseFreq, start);
        osc.frequency.linearRampToValueAtTime(baseFreq - 180, start + 0.15);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.17);
      });
    } catch {
      // fallback
    }
  }



  // Gacha win sound fanfare
  public playGachaWin() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const start = ctx.currentTime + i * 0.1;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + (i === 3 ? 0.6 : 0.2));

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + (i === 3 ? 0.65 : 0.22));
      });
    } catch {
      // fallback
    }
  }

  // Gentle cute background music loop (lo-fi relaxing lullaby)
  public startBGM() {
    if (this.isBgmPlaying) return;
    try {
      const ctx = this.initCtx();
      this.isBgmPlaying = true;

      const masterBgmGain = ctx.createGain();
      masterBgmGain.gain.setValueAtTime(this.isMuted ? 0 : 0.06, ctx.currentTime);
      masterBgmGain.connect(ctx.destination);
      this.bgmGain = masterBgmGain;

      // Relaxing chord progressions: Cmaj7 - Am7 - Fmaj7 - G7
      const melody = [
        261.63, 329.63, 392.00, 493.88, // Cmaj7
        220.00, 261.63, 329.63, 392.00, // Am7
        174.61, 220.00, 261.63, 329.63, // Fmaj7
        196.00, 246.94, 293.66, 349.23  // G7
      ];
      let step = 0;

      this.bgmInterval = window.setInterval(() => {
        if (!this.isBgmPlaying || !this.ctx || this.isMuted) return;
        const currentCtx = this.ctx;
        const note = melody[step % melody.length];
        step++;

        // Soft marimba-like bell
        const osc = currentCtx.createOscillator();
        const noteGain = currentCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, currentCtx.currentTime);

        noteGain.gain.setValueAtTime(0.07, currentCtx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, currentCtx.currentTime + 0.6);

        osc.connect(noteGain);
        noteGain.connect(masterBgmGain);

        osc.start(currentCtx.currentTime);
        osc.stop(currentCtx.currentTime + 0.65);
      }, 550);
    } catch {
      // audio suspended
    }
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // Speech synthesis for Jevin's sleepy chat replies
  public speakIndonesian(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.pitch = 1.35; // cute, slightly high pitched
    utterance.rate = 0.95; // relaxed, sleepy pacing
    utterance.volume = this.isMuted ? 0 : 1;

    // Pick Indonesian voice if available
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.includes('id') || v.lang.includes('ID'));
    if (idVoice) utterance.voice = idVoice;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  }
}

export const soundEngine = new SoundEngine();

/**
 * Microphone Voice Mimic Recorder and Pitch Shifter (Talking Tom style)
 */
export class VoiceMimic {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private isRecording: boolean = false;

  public async startListening(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.warn('Microphone access not granted or unavailable:', err);
      return false;
    }
  }

  public stopAndPlayBack(
    pitchRate: number = 1.45,
    onPlaybackStart?: () => void,
    onPlaybackEnd?: () => void
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecording) {
        resolve(false);
        return;
      }

      this.mediaRecorder.onstop = async () => {
        this.isRecording = false;
        try {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const arrayBuffer = await audioBlob.arrayBuffer();

          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          if (!this.audioContext) {
            this.audioContext = new AudioCtx();
          }

          const decodedData = await this.audioContext.decodeAudioData(arrayBuffer);
          const source = this.audioContext.createBufferSource();
          source.buffer = decodedData;

          // Pitch shifting via playbackRate (classic cute chipmunk/Talking Tom effect)
          source.playbackRate.value = pitchRate;

          source.connect(this.audioContext.destination);

          if (onPlaybackStart) onPlaybackStart();
          source.onended = () => {
            if (onPlaybackEnd) onPlaybackEnd();
          };

          source.start(0);
          resolve(true);
        } catch (e) {
          console.warn('Audio decoding error:', e);
          if (onPlaybackEnd) onPlaybackEnd();
          resolve(false);
        }
      };

      this.mediaRecorder.stop();
      // Stop all mic tracks
      this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    });
  }
}
