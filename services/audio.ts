class SoundService {
  private audioContext: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Initialize lazily to respect browser autoplay policies
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        // We don't create it here immediately to avoid warnings before user interaction
        // It will be created on first play call
      }
    } catch (e) {
      console.error('Web Audio API not supported', e);
    }
  }

  private init() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContext();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.gain.value = 0.3; // Default volume
        this.masterGain.connect(this.audioContext.destination);
      }
    }
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : 0.3;
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);
    
    gain.gain.setValueAtTime(1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.1);
  }

  public playHover() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioContext || !this.masterGain) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.05);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.05);
  }

  public playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioContext || !this.masterGain) return;

    const now = this.audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C Major Arpeggio

    notes.forEach((freq, i) => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();
        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.2, now + i * 0.05 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.5);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.6);
    });
  }

  public playGachaStart() {
      if (this.isMuted) return;
      this.init();
      if (!this.audioContext || !this.masterGain) return;
      
      const now = this.audioContext.currentTime;
      // Rising tension sound
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 2);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 1.5);
      gain.gain.linearRampToValueAtTime(0, now + 2);
      
      osc.start(now);
      osc.stop(now + 2);
  }

  public playGachaReveal() {
      if (this.isMuted) return;
      this.playSuccess(); // Reuse success for now, or make it grander
      
      // Add a sparkly effect
      if (!this.audioContext || !this.masterGain) return;
      const now = this.audioContext.currentTime;
      
      for(let i=0; i<10; i++) {
          const osc = this.audioContext.createOscillator();
          const gain = this.audioContext.createGain();
          osc.connect(gain);
          gain.connect(this.masterGain);
          
          osc.type = 'sine';
          // Random high frequencies
          osc.frequency.value = 1200 + Math.random() * 1000;
          
          gain.gain.setValueAtTime(0, now + i * 0.05);
          gain.gain.linearRampToValueAtTime(0.1, now + i * 0.05 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.2);
          
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.3);
      }
  }
}

export const soundService = new SoundService();
