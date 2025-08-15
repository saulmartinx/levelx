// Game State Manager - Handles all game data and state
class GameState {
  constructor() {
    this.currentScreen = 'loading';
    this.currentQuestion = 0;
    this.score = 0;
    this.totalQuestions = 10;
    this.timeRemaining = 20;
    this.timer = null;
    this.firstCorrectShown = false;
    this.currentRulesSlide = 0;
    this.totalRulesSlides = 4;
    
    // Answer key for the quiz
    this.answerKey = ['A', 'B', 'A', 'A', 'B', 'B', 'A', 'B', 'B', 'B'];
    
    // Asset paths
    this.assets = {
      characters: {
        tilly: 'assets/Tilly_transparent.png',
        reku: 'assets/Reku_transparent.png',
        professor: 'assets/Mad_Professor_transparent.png'
      },
      backgrounds: {
        start: 'assets/start_screen_image1.png'
      },
      rules: [
        'assets/rules_of_the_game_image1.png',
        'assets/rules_of_the_game_first_rule_image2.png',
        'assets/rules_of_the_game_second_rule_image3.png',
        'assets/rules_of_the_game_third_rule_next_button_image4.png'
      ],
      questions: [
        'assets/15.png',
        'assets/15_image_3.png',
        'assets/15_image_4.png',
        'assets/15_image_5.png',
        'assets/15_image_6.png',
        'assets/15_image_7.png',
        'assets/15_image_8.png',
        'assets/15_image_9.png',
        'assets/15_image_10.png',
        'assets/15_image_11.png'
      ],
      celebration: 'assets/16.png',
      results: {
        after: 'assets/35.png',
        congrats: 'assets/37.png'
      },
      video: 'assets/intro_video_lab.mp4'
    };
    
    this.callbacks = {};
  }

  // Event system for state changes
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  // Screen management
  setCurrentScreen(screen) {
    const previousScreen = this.currentScreen;
    this.currentScreen = screen;
    this.emit('screenChanged', { from: previousScreen, to: screen });
  }

  // Quiz management
  startQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    this.firstCorrectShown = false;
    this.setCurrentScreen('quiz');
    this.emit('quizStarted');
  }

  nextQuestion() {
    this.currentQuestion++;
    if (this.currentQuestion >= this.totalQuestions) {
      this.endQuiz();
    } else {
      this.emit('questionChanged', this.currentQuestion);
    }
  }

  submitAnswer(answer) {
    const correct = this.answerKey[this.currentQuestion] === answer;
    if (correct) {
      this.score++;
      if (!this.firstCorrectShown) {
        this.firstCorrectShown = true;
        this.emit('firstCorrect');
      }
    }
    
    this.emit('answerSubmitted', { answer, correct, score: this.score });
    
    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  endQuiz() {
    this.stopTimer();
    this.emit('quizEnded', { score: this.score, total: this.totalQuestions });
    
    setTimeout(() => {
      this.setCurrentScreen('results');
    }, 1000);
  }

  // Timer management
  startTimer() {
    this.timeRemaining = 20;
    this.emit('timerUpdate', this.timeRemaining);
    
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.emit('timerUpdate', this.timeRemaining);
      
      if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.submitAnswer(''); // Submit empty answer (wrong)
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Rules management
  nextRulesSlide() {
    if (this.currentRulesSlide < this.totalRulesSlides - 1) {
      this.currentRulesSlide++;
      this.emit('rulesSlideChanged', this.currentRulesSlide);
      return true;
    }
    return false;
  }

  previousRulesSlide() {
    if (this.currentRulesSlide > 0) {
      this.currentRulesSlide--;
      this.emit('rulesSlideChanged', this.currentRulesSlide);
      return true;
    }
    return false;
  }

  // Game reset
  reset() {
    this.stopTimer();
    this.currentQuestion = 0;
    this.score = 0;
    this.timeRemaining = 20;
    this.firstCorrectShown = false;
    this.currentRulesSlide = 0;
    this.emit('gameReset');
  }

  // Getters
  getCurrentQuestion() {
    return this.currentQuestion;
  }

  getScore() {
    return this.score;
  }

  getTotalQuestions() {
    return this.totalQuestions;
  }

  getTimeRemaining() {
    return this.timeRemaining;
  }

  getCurrentRulesSlide() {
    return this.currentRulesSlide;
  }

  getTotalRulesSlides() {
    return this.totalRulesSlides;
  }

  getQuestionAsset() {
    return this.assets.questions[this.currentQuestion];
  }

  getRulesAsset() {
    return this.assets.rules[this.currentRulesSlide];
  }

  getResultsAsset() {
    return this.score >= 5 ? this.assets.results.congrats : this.assets.results.after;
  }

  isPassingScore() {
    return this.score >= 5;
  }

  getProgressPercentage() {
    return (this.currentQuestion / this.totalQuestions) * 100;
  }
}

// Export for use in other modules
window.GameState = GameState;