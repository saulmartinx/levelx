// Mad Professor Level X Demo — main.js
// All game logic/state here. Extend levels easily by adding to assets or modifying screens/events.

const ANSWER_KEY = ['A', 'B', 'A', 'A', 'B', 'B', 'A', 'B', 'B', 'B'];
const QUIZ_TOTAL = 10;
const SCORE_THRESHOLD = 5;
const RULES_SLIDES = 4;

let assets = {}; // Loaded asset map
let audio = {};  // Audio elements, fallback handled
let currentScreen = '';
let score = 0;
let currentQ = 0;
let timer = null;
let timerTick = 0;
let firstCorrectShown = false;
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function $(id) { return document.getElementById(id); }
function ce(tag, opts={}) {
  const el = document.createElement(tag);
  Object.entries(opts).forEach(([k,v]) => el[k]=v);
  return el;
}
function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

async function loadAssets() {
  let json = null;
  try {
    const res = await fetch('levelx_assets.json');
    if (!res.ok) throw new Error();
    json = await res.json();
  } catch(e) {
    const node = document.querySelector('#assets');
    json = JSON.parse(node.textContent);
  }
  assets = json;

  Object.entries(assets).forEach(([k, v]) => {
    if (typeof v === 'string' && /\.(png|jpg|jpeg)$/i.test(v)) {
      const img = new Image();
      img.src = v;
      img.onerror = () => console.warn('Asset missing:', k, v);
    }
  });

  ['AUDIO_LOOP','AUDIO_START','AUDIO_NEXT','AUDIO_CORRECT','AUDIO_WRONG'].forEach(key => {
    if (assets[key]) {
      const a = new Audio(assets[key]);
      audio[key] = a;
    }
  });
}

function playSFX(type) {
  if (audio[type]) {
    audio[type].currentTime = 0;
    audio[type].play();
    return;
  }
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let o1 = ctx.createOscillator(), g = ctx.createGain();
  o1.connect(g); g.connect(ctx.destination);
  switch(type) {
    case 'AUDIO_START':
      o1.type = 'sawtooth';
      o1.frequency.value = 540;
      g.gain.value = 0.21;
      o1.start(); o1.frequency.setValueAtTime(740, ctx.currentTime+0.08);
      o1.stop(ctx.currentTime+0.22);
      break;
    case 'AUDIO_NEXT':
      o1.type = 'square';
      o1.frequency.value = 420;
      g.gain.value = 0.18;
      o1.start();
      o1.frequency.setValueAtTime(560, ctx.currentTime+0.07);
      o1.stop(ctx.currentTime+0.13);
      break;
    case 'AUDIO_CORRECT':
      o1.type = 'triangle';
      o1.frequency.value = 520;
      g.gain.value = 0.19;
      o1.start();
      o1.frequency.setValueAtTime(690, ctx.currentTime+0.07);
      o1.stop(ctx.currentTime+0.14);
      break;
    case 'AUDIO_WRONG':
      o1.type = 'square';
      o1.frequency.value = 180;
      g.gain.value = 0.16;
      o1.start();
      o1.frequency.setValueAtTime(110, ctx.currentTime+0.08);
      o1.stop(ctx.currentTime+0.18);
      break;
    case 'AUDIO_LOOP':
      break;
  }
}

function showScreen(id) {
  currentScreen = id;
  const root = document.getElementById('game-root');
  root.innerHTML = '';

  if (['START','RULES_0','RULES_1','RULES_2','RULES_3'].includes(id) && assets.BG_TITLE) {
    const bg = ce('div', { className: 'bg-parallax' });
    bg.style.backgroundImage = `url('${assets.BG_TITLE}')`;
    let x = 0;
    bg.style.backgroundPosition = `${x}px 0px`;
    let animId;
    function updateBG() {
      x += 0.15;
      bg.style.backgroundPosition = `${x}px 0px`;
      if (currentScreen.startsWith('RULES_')) animId = requestAnimationFrame(updateBG);
    }
    if (!reducedMotion && id.startsWith('RULES_')) animId = requestAnimationFrame(updateBG);
    root.appendChild(bg);
  }

  switch(id) {
    case 'START':
      root.appendChild(renderStartScreen());
      break;
    case 'INTRO_VIDEO':
      root.appendChild(renderIntroVideo());
      break;
    case 'RULES_0':
    case 'RULES_1':
    case 'RULES_2':
    case 'RULES_3':
      root.appendChild(renderRulesScreen(parseInt(id.split('_')[1])));
      break;
    case 'QUIZ':
      root.appendChild(renderQuizScreen());
      break;
    case 'AFTER':
      root.appendChild(renderAfterScreen());
      break;
    case 'CONGRATS':
      root.appendChild(renderCongratsScreen());
      break;
    case 'RETRY':
      root.appendChild(renderRetryScreen());
      break;
  }
  setTimeout(() => {
    const s = root.querySelector('.screen');
    if (s) s.classList.add('visible');
  }, 25);
}

function renderStartScreen() {
  const s = ce('div', { className: 'screen', tabIndex: 0 });
  const row = ce('div', { className: 'sprite-row' });
  const tilly = ce('img', { className: 'sprite', src: assets.TILLY, alt: 'Tilly' });
  if (!reducedMotion) {
    let tilt = 2, dir = -1, blinkTimeout;
    function tiltAnim() {
      tilt += dir*0.13;
      if (tilt > 2) dir = -1;
      if (tilt < -2) dir = 1;
      tilly.style.transform = `rotate(${tilt}deg)`;
      requestAnimationFrame(tiltAnim);
    }
    tiltAnim();
    function blink() {
      tilly.style.opacity = '0.4';
      setTimeout(() => tilly.style.opacity = '1', 120);
      blinkTimeout = setTimeout(blink, 6000+Math.random()*900);
    }
    blinkTimeout = setTimeout(blink, 6000);
  }
  const reku = ce('img', { className: 'sprite', src: assets.REKU, alt: 'Reku' });
  if (!reducedMotion) {
    let bob = 0, bobDir = 1;
    function bobAnim() {
      bob += bobDir*0.4;
      if (bob > 6) bobDir = -1;
      if (bob < -6) bobDir = 1;
      reku.style.transform = `translateY(${bob}px)`;
      requestAnimationFrame(bobAnim);
    }
    bobAnim();
  }
  const prof = ce('img', { className: 'sprite', src: assets.PROF, alt: 'Prof' });
  if (!reducedMotion) {
    let y = 0, v = 0, bounce = false;
    function bounceAnim() {
      if (!bounce && Math.random() < 0.01) { bounce = true; v = -3.5; }
      if (bounce) { y += v; v += 0.3; if (y >= 0) { y = 0; bounce = false; } }
      prof.style.transform = `translateY(${y}px)`;
      requestAnimationFrame(bounceAnim);
    }
    bounceAnim();
  }
  row.append(tilly, reku, prof);

  const title = ce('div', { className: 'title', textContent: 'Mad Professor Level X' });

  const btn = ce('button', { className: 'button', textContent: 'Start' });
  btn.onclick = () => {
    playSFX('AUDIO_START');
    showScreen('INTRO_VIDEO');
  };
  s.append(row, title, btn);

  s.onkeydown = e => {
    if (e.key === 'Enter') btn.click();
  };

  return s;
}

function renderIntroVideo() {
  const s = ce('div', { className: 'screen' });
  const video = ce('video', {
    src: assets.VIDEO_INTRO,
    width: 340,
    controls: false,
    autoplay: true,
    tabIndex: 0,
    style: "border-radius:1.2em;box-shadow:0 2px 16px rgba(0,0,0,0.13);margin-bottom:1.2em;"
  });
  video.onended = () => {
    showScreen('RULES_0');
    playLoopMusic(true);
  };
  s.appendChild(video);
  return s;
}

function renderRulesScreen(slide) {
  const s = ce('div', { className: 'screen', tabIndex: 0 });
  const imgKey = `RULES_${slide}`;
  const img = ce('img', { className: 'rules-img', src: assets[imgKey], alt: `Rule ${slide}` });
  s.appendChild(img);

  const btn = ce('button', { className: 'button', textContent: slide < RULES_SLIDES-1 ? 'Next' : 'Start Quiz' });
  btn.onclick = () => {
    playSFX('AUDIO_NEXT');
    if (slide < RULES_SLIDES-1) {
      showScreen(`RULES_${slide+1}`);
    } else {
      playLoopMusic(false);
      startGame();
    }
  };
  s.appendChild(btn);

  s.onkeydown = e => {
    if (e.key === 'Enter') btn.click();
  };

  return s;
}

function renderQuizScreen() {
  const s = ce('div', { className: 'screen', tabIndex: 0 });
  const qKey = `Q${currentQ+1}`;
  const img = ce('img', { className: 'quiz-img', src: assets[qKey], alt: `Question ${currentQ+1}` });
  s.appendChild(img);

  const timerHud = ce('div', { className: 'timer-hud', textContent: '20' });
  s.appendChild(timerHud);

  const row = ce('div', { className: 'choice-row' });
  const btnA = ce('button', { className: 'choice-btn', textContent: 'A' });
  const btnB = ce('button', { className: 'choice-btn', textContent: 'B' });

  function handleAnswer(ans) {
    if (timer) clearInterval(timer);
    btnA.disabled = btnB.disabled = true;
    const correct = ANSWER_KEY[currentQ] === ans;
    next(correct);
    playSFX(correct ? 'AUDIO_CORRECT' : 'AUDIO_WRONG');
    if (correct && !firstCorrectShown) {
      firstCorrectShown = true;
      showCorrectCard();
    }
  }
  btnA.onclick = () => handleAnswer('A');
  btnB.onclick = () => handleAnswer('B');

  s.onkeydown = e => {
    if (e.key === 'ArrowLeft') btnA.click();
    if (e.key === 'ArrowRight') btnB.click();
  };
  row.append(btnA, btnB);
  s.appendChild(row);

  timerTick = 20;
  timerHud.textContent = timerTick;
  timerHud.classList.remove('pulse');
  timer = setInterval(() => {
    timerTick--;
    timerHud.textContent = timerTick;
    timerHud.classList.add('pulse');
    setTimeout(() => timerHud.classList.remove('pulse'), 120);
    if (timerTick <= 0) {
      clearInterval(timer);
      handleAnswer('');
    }
  }, 1000);

  return s;
}

function showCorrectCard() {
  const root = document.getElementById('game-root');
  const card = ce('div', { className: 'correct-card', textContent: 'Correct #1!' });
  card.classList.add('visible');
  root.appendChild(card);
  setTimeout(() => {
    card.classList.remove('visible');
    card.remove();
  }, 1500);
}

function renderAfterScreen() {
  const s = ce('div', { className: 'screen' });
  const img = ce('img', { src: assets.AFTER, style: "width:90%;max-width:320px;margin-bottom:1.2em;border-radius:1.2em;" });
  s.appendChild(img);
  return s;
}

function renderCongratsScreen() {
  const s = ce('div', { className: 'screen', tabIndex: 0 });
  const img = ce('img', { src: assets.CONGRATS, style: "width:90%;max-width:320px;margin-bottom:1.2em;border-radius:1.2em;" });
  s.appendChild(img);

  const scoreRow = ce('div', { className: 'score-row', textContent: `Score: ${score}/${QUIZ_TOTAL}` });
  s.appendChild(scoreRow);

  showConfetti();

  const btn = ce('button', { className: 'button', textContent: 'Back to Start' });
  btn.onclick = () => showScreen('START');
  s.appendChild(btn);

  s.onkeydown = e => { if (e.key === 'Enter') btn.click(); };

  return s;
}

function renderRetryScreen() {
  const s = ce('div', { className: 'screen', tabIndex: 0 });
  const img = ce('img', { src: assets.AFTER, style: "width:90%;max-width:320px;margin-bottom:1.2em;border-radius:1.2em;" });
  s.appendChild(img);

  const scoreRow = ce('div', { className: 'score-row', textContent: `Score: ${score}/${QUIZ_TOTAL}` });
  s.appendChild(scoreRow);

  const btn1 = ce('button', { className: 'button', textContent: 'Try Again' });
  btn1.onclick = () => startGame();
  const btn2 = ce('button', { className: 'button', textContent: 'Back to Start' });
  btn2.onclick = () => showScreen('START');
  s.append(btn1, btn2);

  s.onkeydown = e => {
    if (e.key === 'Enter') btn1.click();
  };
  return s;
}

function startGame() {
  score = 0;
  currentQ = 0;
  firstCorrectShown = false;
  showScreen('QUIZ');
  loadQuestion();
}

function loadQuestion() {}

function next(correct) {
  if (correct) score++;
  currentQ++;
  if (currentQ < QUIZ_TOTAL) {
    showScreen('QUIZ');
    loadQuestion();
  } else {
    endLevel();
  }
}

function endLevel() {
  showScreen('AFTER');
  setTimeout(() => {
    if (score >= SCORE_THRESHOLD) {
      showScreen('CONGRATS');
    } else {
      showScreen('RETRY');
    }
  }, 950);
}

function playLoopMusic(on) {
  if (audio.AUDIO_LOOP) {
    audio.AUDIO_LOOP.loop = true;
    audio.AUDIO_LOOP.volume = 0.38;
    if (on) audio.AUDIO_LOOP.play();
    else audio.AUDIO_LOOP.pause();
  }
}

function showConfetti() {
  if (reducedMotion) return;
  const root = document.getElementById('game-root');
  const div = ce('div', { className: 'confetti' });
  for (let i=0; i<36; ++i) {
    const piece = ce('div', { className: 'confetti-piece' });
    const colors = ['#ffecb3','#ffe0b2','#b3e5fc','#c8e6c9','#d1c4e9'];
    piece.style.background = colors[i%colors.length];
    piece.style.left = `${8 + Math.random()*85}%`;
    piece.style.top = `-${Math.random()*44}px`;
    piece.style.transform = `rotate(${Math.random()*80-40}deg)`;
    div.appendChild(piece);
  }
  root.appendChild(div);
  setTimeout(() => div.remove(), 1200);
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadAssets();
  showScreen('START');
});