// Audio Manager - Handles all audio functionality
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.musicVolume = 0.3;
    this.sfxVolume = 0.5;
    this.isMuted = false;
    this.backgroundMusic = null;
    
    this.initializeAudio();
  }

  async initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume audio context on user interaction
      document.addEventListener('click', () => {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      }, { once: true });
      
      await this.loadSounds();
    } catch (error) {
      console.warn('Audio initialization failed:', error);
      this.createFallbackSounds();
    }
  }

  async loadSounds() {
    const soundFiles = {
      start: 'assets/start.wav',
      next: 'assets/next.wav',
      correct: 'assets/correct.wav',
      wrong: 'assets/wrong.wav',
      loop: 'assets/loop.mp3'
    };

    for (const [name, url] of Object.entries(soundFiles)) {
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = name === 'loop' ? this.musicVolume : this.sfxVolume;
        
        // Test if audio can load
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', reject, { once: true });
          audio.load();
        });
        
        this.sounds[name] = audio;
      } catch (error) {
        console.warn(`Failed to load ${name} audio:`, error);
        this.sounds[name] = this.createBeepSound(name);
      }
    }
  }

  createFallbackSounds() {
    const soundNames = ['start', 'next', 'correct', 'wrong', 'loop'];
    soundNames.forEach(name => {
      this.sounds[name] = this.createBeepSound(name);
    });
  }

  createBeepSound(type) {
    return {
      play: () => {
        if (this.isMuted || !this.audioContext) return;
        
        try {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          const frequencies = {
            start: [440, 550],
            next: [330, 440],
            correct: [440, 660],
            wrong: [220, 165],
            loop: [440]
          };
          
          const [freq1, freq2] = frequencies[type] || [440, 440];
          
          oscillator.frequency.setValueAtTime(freq1, this.audioContext.currentTime);
          if (freq2) {
            oscillator.frequency.setValueAtTime(freq2, this.audioContext.currentTime + 0.1);
          }
          
          gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.3);
        } catch (error) {
          console.warn('Beep sound failed:', error);
        }
      },
      pause: () => {},
      currentTime: 0,
      loop: false
    };
  }

  play(soundName) {
    if (this.isMuted || !this.sounds[soundName]) return;
    
    try {
      const sound = this.sounds[soundName];
      sound.currentTime = 0;
      const playPromise = sound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn(`Failed to play ${soundName}:`, error);
        });
      }
    } catch (error) {
      console.warn(`Error playing ${soundName}:`, error);
    }
  }

  playBackgroundMusic() {
    if (this.isMuted || !this.sounds.loop) return;
    
    try {
      const music = this.sounds.loop;
      music.loop = true;
      music.volume = this.musicVolume;
      music.currentTime = 0;
      
      const playPromise = music.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Background music failed:', error);
        });
      }
      
      this.backgroundMusic = music;
    } catch (error) {
      console.warn('Background music error:', error);
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopBackgroundMusic();
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.musicVolume;
    }
  }

  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    Object.keys(this.sounds).forEach(key => {
      if (key !== 'loop' && this.sounds[key].volume !== undefined) {
        this.sounds[key].volume = this.sfxVolume;
      }
    });
  }
}

// Export for use in other modules
window.AudioManager = AudioManager;