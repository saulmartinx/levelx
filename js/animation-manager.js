// Animation Manager - Handles visual effects and animations
class AnimationManager {
  constructor() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.activeAnimations = new Set();
  }

  // Create confetti effect
  createConfetti() {
    if (this.reducedMotion) return;

    const container = document.getElementById('confetti-container');
    const colors = ['#2bba68', '#5ad7f7', '#f95a5a', '#ffecb3', '#ffe0b2'];
    
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        
        container.appendChild(confetti);
        
        // Remove confetti after animation
        setTimeout(() => {
          if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
          }
        }, 4000);
      }, i * 50);
    }
  }

  // Animate score counting
  animateScore(element, finalScore, duration = 1000) {
    if (this.reducedMotion) {
      element.textContent = finalScore;
      return;
    }

    let startTime = null;
    const startScore = 0;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.floor(startScore + (finalScore - startScore) * easeOut);
      
      element.textContent = currentScore;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }

  // Animate progress bar
  animateProgressBar(element, progress) {
    if (this.reducedMotion) {
      element.style.width = progress + '%';
      return;
    }

    element.style.transition = 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    element.style.width = progress + '%';
  }

  // Shake animation for wrong answers
  shakeElement(element) {
    if (this.reducedMotion) return;

    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
      element.style.animation = '';
    }, 500);
  }

  // Pulse animation for correct answers
  pulseElement(element) {
    if (this.reducedMotion) return;

    element.style.animation = 'none';
    element.offsetHeight; // Trigger reflow
    element.style.animation = 'pulse 0.6s ease-in-out';
    
    setTimeout(() => {
      element.style.animation = '';
    }, 600);
  }

  // Fade transition between screens
  fadeTransition(fromElement, toElement, duration = 300) {
    if (this.reducedMotion) {
      fromElement.classList.remove('active');
      toElement.classList.add('active');
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      fromElement.style.transition = `opacity ${duration}ms ease-out`;
      fromElement.style.opacity = '0';
      
      setTimeout(() => {
        fromElement.classList.remove('active');
        toElement.classList.add('active');
        toElement.style.opacity = '0';
        toElement.style.transition = `opacity ${duration}ms ease-in`;
        
        setTimeout(() => {
          toElement.style.opacity = '1';
          setTimeout(() => {
            fromElement.style.opacity = '';
            fromElement.style.transition = '';
            toElement.style.opacity = '';
            toElement.style.transition = '';
            resolve();
          }, duration);
        }, 50);
      }, duration);
    });
  }

  // Add CSS keyframes dynamically
  addKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize animations
  init() {
    this.addKeyframes();
  }
}

// Export for use in other modules
window.AnimationManager = AnimationManager;