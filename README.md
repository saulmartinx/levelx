<<<<<<< codex/update-readme-for-file-naming-consistency
# levelx
 A fully playable Level‑1 demo that runs offline and in any modern web  browser (desktop + mobile).
Level X — Mad Professor 
Demo Build Specs for Codex (Developer) 
You’re building a fully playable Level‑1 demo that runs offline and in any modern web 
browser (desktop + mobile). Keep it sleek, stable, and easy to extend. 
0) Objectives (what “done” means) 
● Playable loop: Start → Intro Video → Rules (3 slides) → Quiz (10 A/B questions, 
20s each) → After → Congrats/Retry. 
● Answer key baked in: 
Q1: A · Q2: B · Q3: A · Q4: A · Q5: B · Q6: B · Q7: A · Q8: B · Q9: B · Q10: B. 
● Score gating: Pass on ≥5/10 → Congrats; else Retry. 
● First‑correct flair: On the first correct answer only (Q1 if correct), show a 
celebratory card for ~1.5s, then resume. 
● Offline‑ready: No network dependency at runtime when assets are local. 
● Clean code: Single repo folder, readable structure, zero console errors, smooth at 
60fps on mid hardware. 
1) Deliverables 
1. index.html — single entry point (can be double‑clicked to run). 
2. style.css — all styling and animations. 
3. main.js — game logic, state machine, audio, timers. 
4. /assets/ — images + video (and optional audio files). 
5. levelx_assets.json — asset map (file paths or data URIs). 
6. README.md — setup, run, and authoring instructions. 
 
7. QA_CHECKLIST.md — manual test steps & acceptance tests. 
 
 
2) Tech constraints & targets 
● Vanilla HTML/CSS/JS. No frameworks. No build step required. 
 
● Animations: CSS transform/opacity only (GPU‑friendly). 
 
● Audio: HTML5 <audio> + WebAudio fallback (see §6). 
 
● Browser support: Chrome, Edge, Firefox, Safari (latest); Android Chrome, iOS 
Safari. 
 
● Performance: keep total payload < ~25MB for demo; images ≤1920×1080. 
 
 
3) Files & structure 
/levelx-demo/ 
  index.html 
  style.css 
  main.js 
  levelx_assets.json      # map of all assets (filenames OR data 
URIs) 
  /assets/ 
    start_screen_image1.png
    Tilly_transparent.png 
    Reku_transparent.png 
    Mad_Professor_transparent.png
    intro_video_lab.mp4 
=======
Level X – Mad Professor Demo
A fully playable Level‑1 web demo that runs offline in any modern browser (desktop + mobile).
Flow: Start → Intro Video → Rules (4 slides) → Quiz (10 A/B questions, 20 s each) → After → Congrats/Retry.
Answer key: A, B, A, A, B, B, A, B, B, B. Score ≥ 5 shows Congrats, otherwise Retry.
The first correct answer displays a “Correct #1” card for ~1.5 s, then resumes.

Files & structure
/levelx/
  index.html
  style.css
  main.js
  levelx_assets.json
  /assets/
    start_screen_image1.png
    Tilly_transparent.png
    Reku_transparent.png
    Mad_Professor_transparent.png
    intro_video_lab.mp4
>>>>>>> main
    rules_of_the_game_image1.png
    rules_of_the_game_first_rule_image2.png
    rules_of_the_game_second_rule_image3.png
    rules_of_the_game_third_rule_next_button_image4.png
<<<<<<< codex/update-readme-for-file-naming-consistency
    15.png 
=======
    15.png
>>>>>>> main
    15_image_3.png
    15_image_4.png
    15_image_5.png
    15_image_6.png
    15_image_7.png
    15_image_8.png
    15_image_9.png
    15_image_10.png
    15_image_11.png
<<<<<<< codex/update-readme-for-file-naming-consistency
    16.png                # Correct #1 celebration 
    35.png                # After screen 
    37.png                # Congrats screen 
    # optional: 
    start.wav next.wav correct.wav wrong.wav loop.mp3 (or .ogg) 
 
 
4) Asset map (JSON schema) 
levelx_assets.json (or inline JSON inside index.html for local double‑click): 
{ 
  "BG_TITLE":  "assets/start screen_image1.png", 
  "TILLY":     "assets/Tilly_transparent.png", 
  "REKU":      "assets/Reku_transparent.png", 
  "PROF":      "assets/Mad Professor_transparent.png", 
 
  "VIDEO_INTRO":"assets/intro_video_lab.mp4", 
 
  "RULES_0":   "assets/rules of the game_image 1.png", 
  "RULES_1":   "assets/rules of the game_first rule_image 2.png", 
  "RULES_2":   "assets/rules of the game_second rule_image 3.png", 
  "RULES_3":   "assets/rules of the game_third rule_next 
button_image 4.png", 
 
  "Q1":  "assets/15.png", 
  "Q2":  "assets/15_image (3).png", 
  "Q3":  "assets/15_image (4).png", 
  "Q4":  "assets/15_image (5).png", 
  "Q5":  "assets/15_image (6).png", 
  "Q6":  "assets/15_image (7).png", 
  "Q7":  "assets/15_image (8).png", 
  "Q8":  "assets/15_image (9).png", 
  "Q9":  "assets/15_image (10).png", 
"Q10": "assets/15_image (11).png", 
"CORRECT1":  "assets/16.png", 
"AFTER":     
"assets/35.png", 
"CONGRATS":  "assets/37.png", 
"AUDIO_LOOP":    
"assets/loop.mp3", 
"AUDIO_START":   "assets/start.wav", 
"AUDIO_NEXT":    
"assets/next.wav", 
"AUDIO_CORRECT": "assets/correct.wav", 
"AUDIO_WRONG":   "assets/wrong.wav" 
} 
If audio files are not present, leave the audio fields as ""; game must 
auto‑fallback to WebAudio beeps. 
5) Game states & flow (must implement) 
State order: 
START → INTRO_VIDEO → RULES_0 → RULES_1 → RULES_2 → RULES_3 → 
QUIZ_Q1 … QUIZ_Q10 → AFTER → (CONGRATS if score≥5 else RETRY) 
Transitions (hard requirements): 
● Start → Video: play Start sting. 
● Video → Rules: on video.onended. 
● Rules: “Next” cycles 0→1→2→3; optional loop music plays on Rules only, then stops 
before Quiz. 
● Quiz: each question has a 20s countdown; timeout counts as wrong and advances. 
● Answer: A/B click plays SFX; first correct triggers Correct #1 overlay for ~1500ms. 
● After → End: show After image ~1.2s, then route by score. 
6) Audio system 
● Primary: <audio> elements bound to AUDIO_* entries if provided. 
● Fallback: WebAudio generator when file paths are empty. 
○ Start: short bright sting (~0.18–0.25s; saw + square). 
○ Next: two short notes (~0.10–0.15s). 
○ Correct: two‑note rise (~0.10–0.15s). 
○ Wrong: low square blip (~0.16–0.22s). 
● Loop: play only during Rules at low volume; stop (or fade) when Quiz starts. 
7) Visuals & animation 
● Characters: place Tilly, Reku, Professor on Start screen; keep visible with idle 
loops: 
○ Tilly: tilt ±2° + blink every ~6s. 
○ Reku: gentle bob ±6px. 
○ Professor: bounce lift and settle. 
● Buttons: big rounded, gradient, hover brighten, pressed compress (1px), drop 
shadow. 
● Parallax (optional): single slow background pan on Start/Rules for depth; keep 
subtle. 
● Transitions: screen fade 300–450ms, no layout thrash (opacity/transform only). 
● Timer pulse: scale HUD 1.0 → 1.04 → 1.0 each second (optional). 
8) Quiz logic (must‑have) 
● Question data (hardcoded array): 
const QUESTIONS = [ 
{ imgKey:'Q1',  correct:'A' }, 
{ imgKey:'Q2',  correct:'B' }, 
{ imgKey:'Q3',  correct:'A' }, 
{ imgKey:'Q4',  correct:'A' }, 
{ imgKey:'Q5',  correct:'B' }, 
{ imgKey:'Q6',  correct:'B' }, 
{ imgKey:'Q7',  correct:'A' }, 
{ imgKey:'Q8',  correct:'B' }, 
{ imgKey:'Q9',  correct:'B' }, 
{ imgKey:'Q10', correct:'B' } 
]; 
● Timer: 20s; setInterval(1000); on 0 → next(false). 
● Correctness: compare picked 'A'|'B' to correct. 
● Score: score++ on correct. 
● First‑correct overlay: if currentQ===0 && correct, show CORRECT1 screen for 
~1500ms, then continue. 
9) UI/UX specifics 
● Disable buttons during screen transitions to avoid double‑fires. 
● Responsive: scales to 16:9 and tall phones; clamp fonts with clamp(). 
● Accessibility: 
○ Focus ring on buttons. 
○ Keyboard: Enter = Start/Next; ArrowLeft = A; ArrowRight = B. 
○ prefers-reduced-motion: reduce → cut idle loops and timer pulse. 
10) Pseudocode (core functions) 
function loadAssets() { 
  // read JSON (inline script tag or local file); bind 
image/video/audio src 
  // set start/rules backgrounds, character sprites, rules images, 
end screens 
  // conditionally set audio element sources from JSON 
} 
 
function showScreen(id) { 
  // remove .visible from .screen; add to target 
} 
 
function startGame() { 
  score = 0; currentQ = 0; 
  showScreen('scr-qa'); 
  loadQuestion(); 
} 
 
function loadQuestion() { 
  const q = QUESTIONS[currentQ]; 
  qImg.src = assets[q.imgKey]; 
  qNum.textContent = currentQ + 1; 
  startTimer(20); 
} 
 
function startTimer(n) { 
  timeLeft = n; qTimer.textContent = n; 
  clearInterval(timerInt); 
  timerInt = setInterval(()=> { 
    timeLeft--; qTimer.textContent = timeLeft; 
    if (timeLeft <= 0) { clearInterval(timerInt); next(false); } 
  }, 1000); 
} 
 
function answer(pick) { 
  const correct = (pick === QUESTIONS[currentQ].correct); 
  playSfx(correct ? 'ok' : 'no'); 
  if (correct && currentQ === 0) { 
    showScreen('scr-correct1'); 
    setTimeout(()=>{ next(true); showScreen('scr-qa'); }, 1500); 
  } else { 
    next(correct); 
} 
} 
function next(correct) { 
clearInterval(timerInt); 
if (correct) score++; 
currentQ++; 
if (currentQ < QUESTIONS.length) loadQuestion(); 
else endLevel(); 
} 
function endLevel() { 
showScreen('scr-after'); 
setTimeout(()=> { 
if (score >= 5) showScreen('scr-congrats'); 
else { retryScore.textContent = score; showScreen('scr-retry'); 
} 
}, 1200); 
} 
11) Acceptance tests (must pass) 
1. Start Flow: Start button plays sting → video plays → ends → Rules 0 shows. 
2. Rules Flow: Next advances 0→1→2→3; loop music audible; stops when Quiz starts. 
3. Timer: shows 20→0; on 0, advances as wrong. 
4. Answers: A/B click works; SFX plays; first correct shows CORRECT1 then 
continues. 
5. End Routing: After screen shows ~1.2s; score ≥5 → Congrats, else Retry with score 
displayed. 
6. Retry/Back: Retry restarts Q1 with fresh timer and score; Back returns to Start. 
7. No errors: Console clean; assets load; animations smooth. 
12) Non‑functional requirements 
● No network dependency when /assets/ and HTML/JSON are local. 
● Mobile friendly: hit targets ≥44px; no horizontal scroll. 
● Maintainability: clear comments, small functions, no dead code. 
13) Risks & mitigations 
● Huge Base64 JSON → Prefer file paths; only embed Base64 for tiny audio if 
necessary. 
● Autoplay policy → SFX should be user‑initiated (click). Video starts after Start click. 
● Performance drops → Avoid heavy filters; keep images compressed; throttle 
parallax. 
14) IP & credits (footer) 
Display: © All IP belongs to Andres Lainela. REKU LLC. 
15) Milestones 
● M1 (Scaffold): States, screen switches, asset binding, idle animations. 
● M2 (Gameplay): Timer, A/B logic, scoring, first‑correct overlay. 
● M3 (Audio): Wire <audio>; implement WebAudio fallback; loop in Rules. 
● M4 (Polish): Transitions, button feel, optional parallax, keyboard controls. 
● M5 (QA): Pass acceptance tests on desktop + mobile; finalize README. 
16) Handoff notes 
● Provide a ZIP with /levelx-demo ready to unzip and run. 
● README includes local test instructions (double‑click or python3 -m 
http.server). 
● Document where to drop new question images and how to edit the QUESTIONS 
array. 
You’ve got the map. Build lean, keep the fun crisp, and ship a demo that feels like a toy you 
want to keep poking. 
=======
    16.png                 # Correct #1 celebration
    35.png                 # After screen
    37.png                 # Congrats screen
    start.wav
    next.wav
    correct.wav
    wrong.wav
    loop.mp3
Asset map (levelx_assets.json)
{
  "BG_TITLE":  "assets/start_screen_image1.png",
  "TILLY":     "assets/Tilly_transparent.png",
  "REKU":      "assets/Reku_transparent.png",
  "PROF":      "assets/Mad_Professor_transparent.png",

  "VIDEO_INTRO": "assets/intro_video_lab.mp4",

  "RULES_0":   "assets/rules_of_the_game_image1.png",
  "RULES_1":   "assets/rules_of_the_game_first_rule_image2.png",
  "RULES_2":   "assets/rules_of_the_game_second_rule_image3.png",
  "RULES_3":   "assets/rules_of_the_game_third_rule_next_button_image4.png",

  "Q1":  "assets/15.png",
  "Q2":  "assets/15_image_3.png",
  "Q3":  "assets/15_image_4.png",
  "Q4":  "assets/15_image_5.png",
  "Q5":  "assets/15_image_6.png",
  "Q6":  "assets/15_image_7.png",
  "Q7":  "assets/15_image_8.png",
  "Q8":  "assets/15_image_9.png",
  "Q9":  "assets/15_image_10.png",
  "Q10": "assets/15_image_11.png",

  "CORRECT1":  "assets/16.png",
  "AFTER":     "assets/35.png",
  "CONGRATS":  "assets/37.png",

  "AUDIO_LOOP":    "assets/loop.mp3",
  "AUDIO_START":   "assets/start.wav",
  "AUDIO_NEXT":    "assets/next.wav",
  "AUDIO_CORRECT": "assets/correct.wav",
  "AUDIO_WRONG":   "assets/wrong.wav"
}
If an audio file is missing, leave the value ""—the game falls back to WebAudio beeps.

Gameplay & controls
Timer: Each question counts down from 20 s. When it hits 0, the answer is marked wrong and the next question loads.

Controls:

Start / Next / Back – click or press Enter

Answer A – click “A” or press ←

Answer B – click “B” or press →

Idle animations: On the Start screen, Tilly tilts & blinks, Reku bobs, and the Mad Professor bounces (disabled if prefers-reduced-motion).

Audio notes
Audio elements are wrapped in a safePlay helper that catches autoplay‑policy rejections and resumes suspended contexts. All buttons provide visual and sound feedback (start, next, correct, wrong, looped music on Rules).

Local run
# From repo root
python3 -m http.server
# then open http://localhost:8000/
Double‑clicking index.html also works if all assets are local.

QA checklist
Start → Video → Rules → Quiz → After → Congrats/Retry flows correctly.

Every image/video/audio loads (no 404s).

Answer key operates: A,B,A,A,B,B,A,B,B,B.

Timer counts 20→0; timeout advances as wrong.

Buttons give both visual and audio feedback.

Idle animations run on Start screen.

First correct shows celebratory card once.

Score ≥5 leads to Congrats; otherwise Retry.

Credits
All intellectual property © Andres Lainela / REKU LLC. If you are interested in Level X Mad Professor, contact me.
>>>>>>> main
