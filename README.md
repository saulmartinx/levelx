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
    rules_of_the_game_image1.png
    rules_of_the_game_first_rule_image2.png
    rules_of_the_game_second_rule_image3.png
    rules_of_the_game_third_rule_next_button_image4.png
    15.png
    15_image_3.png
    15_image_4.png
    15_image_5.png
    15_image_6.png
    15_image_7.png
    15_image_8.png
    15_image_9.png
    15_image_10.png
    15_image_11.png
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
