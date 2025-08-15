// Quiz Manager - Specialized handling for quiz functionality
class QuizManager {
  constructor(gameState, audioManager, animationManager) {
    this.gameState = gameState;
    this.audioManager = audioManager;
    this.animationManager = animationManager;
    
    this.setupQuizListeners();
  }

  setupQuizListeners() {
    this.gameState.on('quizStarted', () => {
      this.initializeQuiz();
    });

    this.gameState.on('questionChanged', () => {
      this.loadQuestion();
    });

    this.gameState.on('answerSubmitted', (data) => {
      this.processAnswer(data);
    });

    this.gameState.on('timerUpdate', (timeRemaining) => {
      this.updateTimerDisplay(timeRemaining);
    });
  }

  initializeQuiz() {
    this.loadQuestion();
    this.updateQuizProgress();
  }

  loadQuestion() {
    const questionNumber = this.gameState.getCurrentQuestion() + 1;
    const totalQuestions = this.gameState.getTotalQuestions();
    
    // Update question counter
    const currentQuestionElement = document.getElementById('current-question');
    const totalQuestionsElement = document.getElementById('total-questions');
    
    if (currentQuestionElement) {
      currentQuestionElement.textContent = questionNumber;
    }
    
    if (totalQuestionsElement) {
      totalQuestionsElement.textContent = totalQuestions;
    }

    // Load question image
    const questionImage = document.getElementById('question-image');
    if (questionImage) {
      questionImage.src = this.gameState.getQuestionAsset();
      questionImage.alt = `Question ${questionNumber}`;
    }

    // Reset answer buttons
    this.resetAnswerButtons();
    
    // Update progress
    this.updateQuizProgress();
  }

  resetAnswerButtons() {
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(button => {
      button.classList.remove('selected', 'correct', 'incorrect');
      button.disabled = false;
      button.style.animation = '';
    });
  }

  processAnswer(data) {
    const { answer, correct, score } = data;
    
    // Visual feedback for the selected answer
    const selectedButton = document.querySelector(`[data-answer="${answer}"]`);
    if (selectedButton) {
      selectedButton.classList.add(correct ? 'correct' : 'incorrect');
      
      if (correct) {
        this.animationManager.pulseElement(selectedButton);
      } else {
        this.animationManager.shakeElement(selectedButton);
        
        // Show the correct answer
        const correctAnswer = this.gameState.answerKey[this.gameState.getCurrentQuestion()];
        const correctButton = document.querySelector(`[data-answer="${correctAnswer}"]`);
        if (correctButton && correctButton !== selectedButton) {
          setTimeout(() => {
            correctButton.classList.add('correct');
          }, 300);
        }
      }
    }

    // Disable all buttons
    const answerButtons = document.querySelectorAll('.answer-button');
    answerButtons.forEach(button => {
      button.disabled = true;
    });

    // Update progress immediately
    this.updateQuizProgress();
  }

  updateQuizProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
      const progress = ((this.gameState.getCurrentQuestion() + 1) / this.gameState.getTotalQuestions()) * 100;
      this.animationManager.animateProgressBar(progressFill, progress);
    }
  }

  updateTimerDisplay(timeRemaining) {
    const timerText = document.getElementById('timer-text');
    const timerCircle = document.querySelector('.timer-circle');
    
    if (timerText) {
      timerText.textContent = timeRemaining;
    }

    if (timerCircle) {
      // Change color and animation based on remaining time
      if (timeRemaining <= 5) {
        timerCircle.style.backgroundColor = '#f95a5a';
        timerCircle.style.animation = 'timerPulse 0.3s ease-in-out infinite';
      } else if (timeRemaining <= 10) {
        timerCircle.style.backgroundColor = '#ff9800';
        timerCircle.style.animation = 'timerPulse 0.6s ease-in-out infinite';
      } else {
        timerCircle.style.backgroundColor = '#f95a5a';
        timerCircle.style.animation = 'timerPulse 1s ease-in-out infinite';
      }
    }
  }

  // Get quiz statistics
  getQuizStats() {
    return {
      currentQuestion: this.gameState.getCurrentQuestion() + 1,
      totalQuestions: this.gameState.getTotalQuestions(),
      score: this.gameState.getScore(),
      progress: this.gameState.getProgressPercentage(),
      timeRemaining: this.gameState.getTimeRemaining()
    };
  }

  // Check if quiz is complete
  isQuizComplete() {
    return this.gameState.getCurrentQuestion() >= this.gameState.getTotalQuestions();
  }

  // Get performance rating
  getPerformanceRating() {
    const score = this.gameState.getScore();
    const total = this.gameState.getTotalQuestions();
    const percentage = (score / total) * 100;

    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Great';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Fair';
    return 'Keep Trying';
  }
}

// Export for use in other modules
window.QuizManager = QuizManager;