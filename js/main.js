// Main Game Controller - Initializes and coordinates all game systems
class LevelXGame {
  constructor() {
    this.gameState = null;
    this.audioManager = null;
    this.animationManager = null;
    this.screenManager = null;
    this.quizManager = null;
    
    this.init();
  }

  async init() {
    try {
      // Initialize core systems
      this.gameState = new GameState();
      this.audioManager = new AudioManager();
      this.animationManager = new AnimationManager();
      
      // Initialize animation system
      this.animationManager.init();
      
      // Wait for audio to initialize
      await this.waitForAudio();
      
      // Initialize managers that depend on core systems
      this.screenManager = new ScreenManager(
        this.gameState, 
        this.audioManager, 
        this.animationManager
      );
      
      this.quizManager = new QuizManager(
        this.gameState, 
        this.audioManager, 
        this.animationManager
      );
      
      // Setup global event listeners
      this.setupGlobalListeners();
      
      // Start the game
      this.startGame();
      
    } catch (error) {
      console.error('Failed to initialize game:', error);
      this.showError('Failed to load the game. Please refresh and try again.');
    }
  }

  async waitForAudio() {
    // Give audio manager time to initialize
    return new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  }

  setupGlobalListeners() {
    // Handle visibility change (pause/resume)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseGame();
      } else {
        this.resumeGame();
      }
    });

    // Handle window focus/blur
    window.addEventListener('blur', () => {
      this.pauseGame();
    });

    window.addEventListener('focus', () => {
      this.resumeGame();
    });

    // Handle errors
    window.addEventListener('error', (event) => {
      console.error('Game error:', event.error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });

    // Prevent context menu on right click (for better game experience)
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Prevent F5 refresh during quiz
      if (e.key === 'F5' && this.gameState.currentScreen === 'quiz') {
        e.preventDefault();
      }
      
      // Handle escape key
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });
  }

  handleEscapeKey() {
    const currentScreen = this.gameState.currentScreen;
    
    switch (currentScreen) {
      case 'quiz':
        // Pause quiz or show pause menu
        this.pauseGame();
        break;
      case 'intro':
        // Skip intro
        this.screenManager.showScreen('rules');
        this.audioManager.playBackgroundMusic();
        break;
      default:
        // Go back to start screen
        if (currentScreen !== 'start') {
          this.gameState.reset();
          this.screenManager.showScreen('start');
        }
        break;
    }
  }

  pauseGame() {
    if (this.gameState.currentScreen === 'quiz') {
      this.gameState.stopTimer();
    }
    this.audioManager.setMuted(true);
  }

  resumeGame() {
    if (this.gameState.currentScreen === 'quiz') {
      this.gameState.startTimer();
    }
    this.audioManager.setMuted(false);
  }

  startGame() {
    // Initialize the screen manager (this will show the start screen)
    this.screenManager.init();
    
    // Log game start
    console.log('Level X Mad Professor Demo - Game Started');
    console.log('Controls: Arrow keys or A/B for answers, Enter for buttons');
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #f95a5a;
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      z-index: 10000;
      font-family: var(--font-family);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    `;
    errorDiv.innerHTML = `
      <h3>Oops!</h3>
      <p>${message}</p>
      <button onclick="location.reload()" style="
        background: white;
        color: #f95a5a;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        margin-top: 1rem;
        cursor: pointer;
        font-weight: 600;
      ">Reload Game</button>
    `;
    document.body.appendChild(errorDiv);
  }

  // Public API for debugging and testing
  getGameState() {
    return {
      currentScreen: this.gameState.currentScreen,
      currentQuestion: this.gameState.getCurrentQuestion(),
      score: this.gameState.getScore(),
      timeRemaining: this.gameState.getTimeRemaining()
    };
  }

  // Cheat codes for testing (only in development)
  skipToQuiz() {
    if (window.location.hostname === 'localhost') {
      this.gameState.reset();
      this.gameState.startQuiz();
      console.log('Skipped to quiz (development mode)');
    }
  }

  skipToResults(score = 5) {
    if (window.location.hostname === 'localhost') {
      this.gameState.score = score;
      this.gameState.setCurrentScreen('results');
      this.screenManager.updateResultsScreen({ score, total: 10 });
      console.log(`Skipped to results with score ${score} (development mode)`);
    }
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Make game instance globally available for debugging
  window.levelXGame = new LevelXGame();
  
  // Add development helpers
  if (window.location.hostname === 'localhost') {
    console.log('Development mode active. Available commands:');
    console.log('- levelXGame.skipToQuiz() - Skip to quiz');
    console.log('- levelXGame.skipToResults(score) - Skip to results');
    console.log('- levelXGame.getGameState() - Get current game state');
  }
});