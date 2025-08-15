// Screen Manager - Handles screen transitions and UI updates
class ScreenManager {
  constructor(gameState, audioManager, animationManager) {
    this.gameState = gameState;
    this.audioManager = audioManager;
    this.animationManager = animationManager;
    
    this.screens = {
      loading: document.getElementById('loading-screen'),
      start: document.getElementById('start-screen'),
      intro: document.getElementById('intro-screen'),
      rules: document.getElementById('rules-screen'),
      quiz: document.getElementById('quiz-screen'),
      celebration: document.getElementById('celebration-screen'),
      results: document.getElementById('results-screen')
    };
    
    this.initializeEventListeners();
    this.setupGameStateListeners();
  }

  initializeEventListeners() {
    // Start screen
    document.getElementById('start-btn').addEventListener('click', () => {
      this.audioManager.play('start');
      this.showScreen('intro');
    });

    // Intro screen
    const introVideo = document.getElementById('intro-video');
    const skipIntroBtn = document.getElementById('skip-intro');
    
    introVideo.addEventListener('ended', () => {
      this.showScreen('rules');
      this.audioManager.playBackgroundMusic();
    });
    
    skipIntroBtn.addEventListener('click', () => {
      this.audioManager.play('next');
      this.showScreen('rules');
      this.audioManager.playBackgroundMusic();
    });

    // Rules screen
    document.getElementById('rules-prev').addEventListener('click', () => {
      if (this.gameState.previousRulesSlide()) {
        this.audioManager.play('next');
      }
    });

    document.getElementById('rules-next').addEventListener('click', () => {
      this.audioManager.play('next');
      if (!this.gameState.nextRulesSlide()) {
        // Last slide, start quiz
        this.audioManager.stopBackgroundMusic();
        this.gameState.startQuiz();
      }
    });

    // Results screen
    document.getElementById('try-again-btn').addEventListener('click', () => {
      this.audioManager.play('start');
      this.gameState.reset();
      this.gameState.startQuiz();
    });

    document.getElementById('back-to-start-btn').addEventListener('click', () => {
      this.audioManager.play('next');
      this.gameState.reset();
      this.showScreen('start');
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (this.gameState.currentScreen === 'quiz') {
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          document.getElementById('answer-a').click();
        } else if (e.key === 'ArrowRight' || e.key === 'b' || e.key === 'B') {
          document.getElementById('answer-b').click();
        }
      }
    });
  }

  setupGameStateListeners() {
    this.gameState.on('screenChanged', (data) => {
      this.showScreen(data.to);
    });

    this.gameState.on('quizStarted', () => {
      this.updateQuizScreen();
      this.gameState.startTimer();
    });

    this.gameState.on('questionChanged', () => {
      this.updateQuizScreen();
      this.gameState.startTimer();
    });

    this.gameState.on('answerSubmitted', (data) => {
      this.handleAnswerFeedback(data);
    });

    this.gameState.on('firstCorrect', () => {
      this.showCelebration();
    });

    this.gameState.on('quizEnded', (data) => {
      this.updateResultsScreen(data);
    });

    this.gameState.on('timerUpdate', (timeRemaining) => {
      this.updateTimer(timeRemaining);
    });

    this.gameState.on('rulesSlideChanged', () => {
      this.updateRulesScreen();
    });
  }

  showScreen(screenName) {
    // Hide all screens
    Object.values(this.screens).forEach(screen => {
      screen.classList.remove('active');
    });

    // Show target screen
    if (this.screens[screenName]) {
      this.screens[screenName].classList.add('active');
      this.gameState.setCurrentScreen(screenName);
      
      // Screen-specific initialization
      switch (screenName) {
        case 'rules':
          this.updateRulesScreen();
          break;
        case 'quiz':
          this.updateQuizScreen();
          break;
        case 'results':
          // Results will be updated by quiz end event
          break;
      }
    }
  }

  updateRulesScreen() {
    const rulesImage = document.getElementById('rules-image');
    const rulesCounter = document.getElementById('rules-counter');
    const prevBtn = document.getElementById('rules-prev');
    const nextBtn = document.getElementById('rules-next');
    
    const currentSlide = this.gameState.getCurrentRulesSlide();
    const totalSlides = this.gameState.getTotalRulesSlides();
    
    rulesImage.src = this.gameState.getRulesAsset();
    rulesCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.textContent = currentSlide === totalSlides - 1 ? 'Start Quiz' : 'Next';
  }

  updateQuizScreen() {
    const questionImage = document.getElementById('question-image');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressFill = document.querySelector('.progress-fill');
    
    // Reset answer buttons
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(btn => {
      btn.classList.remove('selected', 'correct', 'incorrect');
      btn.disabled = false;
    });
    
    // Update content
    questionImage.src = this.gameState.getQuestionAsset();
    currentQuestionSpan.textContent = this.gameState.getCurrentQuestion() + 1;
    totalQuestionsSpan.textContent = this.gameState.getTotalQuestions();
    
    // Update progress bar
    const progress = this.gameState.getProgressPercentage();
    this.animationManager.animateProgressBar(progressFill, progress);
    
    // Setup answer buttons
    this.setupAnswerButtons();
  }

  setupAnswerButtons() {
    const answerButtons = document.querySelectorAll('.answer-button');
    
    answerButtons.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', () => {
        if (newBtn.disabled) return;
        
        // Disable all buttons
        answerButtons.forEach(b => b.disabled = true);
        
        // Mark selected
        newBtn.classList.add('selected');
        
        // Submit answer
        const answer = newBtn.dataset.answer;
        this.gameState.submitAnswer(answer);
      });
    });
  }

  handleAnswerFeedback(data) {
    const { answer, correct } = data;
    const selectedButton = document.querySelector(`[data-answer="${answer}"]`);
    const correctButton = document.querySelector(`[data-answer="${this.gameState.answerKey[this.gameState.getCurrentQuestion()]}"]`);
    
    if (selectedButton) {
      selectedButton.classList.remove('selected');
      selectedButton.classList.add(correct ? 'correct' : 'incorrect');
      
      if (correct) {
        this.animationManager.pulseElement(selectedButton);
        this.audioManager.play('correct');
      } else {
        this.animationManager.shakeElement(selectedButton);
        this.audioManager.play('wrong');
        
        // Show correct answer
        if (correctButton && correctButton !== selectedButton) {
          correctButton.classList.add('correct');
        }
      }
    }
  }

  showCelebration() {
    this.showScreen('celebration');
    setTimeout(() => {
      this.showScreen('quiz');
    }, 1500);
  }

  updateResultsScreen(data) {
    const resultsImage = document.getElementById('results-image');
    const finalScoreSpan = document.getElementById('final-score');
    
    resultsImage.src = this.gameState.getResultsAsset();
    
    // Animate score counting
    this.animationManager.animateScore(finalScoreSpan, data.score);
    
    // Show confetti for passing score
    if (this.gameState.isPassingScore()) {
      setTimeout(() => {
        this.animationManager.createConfetti();
      }, 500);
    }
  }

  updateTimer(timeRemaining) {
    const timerText = document.getElementById('timer-text');
    if (timerText) {
      timerText.textContent = timeRemaining;
      
      // Add visual feedback for low time
      const timerCircle = document.querySelector('.timer-circle');
      if (timeRemaining <= 5) {
        timerCircle.style.background = '#f95a5a';
        timerCircle.style.animation = 'timerPulse 0.5s ease-in-out infinite';
      } else {
        timerCircle.style.background = '#f95a5a';
        timerCircle.style.animation = 'timerPulse 1s ease-in-out infinite';
      }
    }
  }

  // Initialize the screen manager
  init() {
    // Hide loading screen after assets are loaded
    setTimeout(() => {
      this.showScreen('start');
    }, 1000);
  }
}

// Export for use in other modules
window.ScreenManager = ScreenManager;