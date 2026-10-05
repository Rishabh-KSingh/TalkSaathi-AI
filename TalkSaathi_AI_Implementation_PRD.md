# TalkSaathi AI — Implementation-Ready Product Requirements Document (PRD)

**Product:** TalkSaathi AI  
**Tagline:** Your AI Saathi for English Speaking  
**Hackathon:** DEV Community — Hacktoberfest Weekend Challenge 2026  
**Theme:** Build for a Friend  
**Platform:** Desktop Web Application  
**Primary user:** Beginner and Intermediate English learners  
**MVP principle:** Build a small, working, end-to-end product before adding secondary features.

---

# 0. ANTIGRAVITY EXECUTION INSTRUCTION

You are the lead product engineer responsible for turning this PRD into a working application.

## Non-negotiable rules

1. **Do not build a fake/static UI.**
   Every major MVP interaction must work end-to-end.
2. **Do not overbuild.**
   Prioritize the MVP acceptance criteria in this document before optional features.
3. **Use the specified architecture unless there is a strong technical reason to change it.**
4. **Keep the application desktop-first.**
   Mobile responsiveness is not an MVP requirement.
5. **No login is required for MVP.**
6. **Never expose API secrets in client-side code.**
   ElevenLabs and LLM calls that require secrets must go through server-side API routes.
7. **Use an open-weight LLM as the AI reasoning/core intelligence layer.**
   Do not replace it with a closed LLM API just to simplify development.
8. **ElevenLabs is the voice layer, not the AI brain.**
9. **Persist learning state locally for MVP using LocalStorage.**
10. **Keep the code database-ready** so PostgreSQL + Prisma can be added later without rewriting the product logic.
11. **Do not permanently store raw voice recordings or uploaded photos unless explicitly required.**
12. **If an external API key is missing, provide a clearly labeled development/mock mode so the UI remains testable.**
13. **Do not invent unsupported AI scores.**
   If a score is estimated rather than measured by an actual speech-analysis service, label it as an estimate.
14. **Use accessible buttons, keyboard navigation where practical, loading states, empty states, errors, and retry actions.**
15. **Do not use excessive gradients, cyberpunk visuals, glassmorphism, or distracting animation.**

## Development order

Build in this order:

1. Project foundation
2. Design system + sidebar
3. Onboarding + local profile
4. Dashboard
5. Daily Practice flow
6. Listening → comprehension → speaking → correction → repeat
7. Open-weight LLM integration
8. ElevenLabs STT/TTS integration
9. Conversation mode
10. Mistake memory + progress
11. Hindi → English mode
12. Photo grammar checker
13. Phrases/vocabulary
14. Optional gamification
15. Testing, polish, README and deployment

Do not spend time polishing secondary features before the core speaking loop works.

---

# 1. PRODUCT VISION

TalkSaathi AI is a personalized AI English-speaking companion built for a friend who understands English but struggles to speak confidently.

It is not simply:

- a grammar checker;
- a translation tool;
- a vocabulary flashcard app;
- or a generic AI chatbot.

Its central experience is:

> **Listen → Understand → Recall → Speak → Correct → Repeat → Converse → Track → Adapt**

The learner should gradually move from:

> Hindi thinking → English translation → hesitation

towards:

> Think in English → Speak naturally → Communicate confidently

Hindi is a bridge, not the final learning method.

---

# 2. HACKATHON STORY

The product should be presented as:

> **“I built an AI speaking companion for my friend who understands English but struggles to speak it.”**

## Problem

The friend can understand English content but has difficulty speaking.

Common barriers:

- hesitation;
- mentally translating from Hindi;
- fear of making mistakes;
- lack of a regular speaking partner;
- repeated grammar mistakes;
- knowing vocabulary but not using it naturally.

## Solution

TalkSaathi gives the learner a supportive speaking partner that:

- listens;
- understands;
- corrects;
- asks them to repeat;
- continues the conversation;
- remembers recurring mistakes;
- adapts future practice.

## Story structure for the hackathon

> Problem → Build → Friend uses it → Feedback → Improvement

Do not market it as “another AI English learning app.”

---

# 3. TARGET USERS

## Primary

Beginner and Intermediate English learners.

Especially learners who:

- understand basic English;
- want better spoken English;
- are initially more comfortable speaking Hindi;
- do not have a daily English conversation partner.

## Learning goals

The product should support improvement in:

- speaking fluency;
- confidence;
- grammar;
- pronunciation;
- vocabulary;
- listening;
- conversation ability.

---

# 4. PRODUCT PRINCIPLES

## 4.1 Speaking first

Active speaking should receive more emphasis than passive reading.

## 4.2 Correction without embarrassment

The AI must be supportive and encouraging.

Never shame the learner.

## 4.3 Hindi as a bridge

Hindi can help when the learner is stuck, but the app should gradually encourage direct English expression.

## 4.4 Personalization

The app should use the learner's history, mistakes, level, interests and available time to choose useful practice.

## 4.5 Small daily progress

10–30 minutes of consistent practice should feel achievable.

## 4.6 Natural conversation

During free conversation, do not interrupt after every tiny mistake.

Correct important mistakes lightly and provide deeper analysis at the end.

---

# 5. CORE LEARNING LOOP

```text
LISTEN
   ↓
UNDERSTAND
   ↓
RECALL
   ↓
SPEAK
   ↓
AI CORRECTS
   ↓
REPEAT
   ↓
CONVERSE
   ↓
ANALYZE
   ↓
ADAPT
   ↓
NEXT PRACTICE
```

The MVP must demonstrate this loop clearly.

---

# 6. INFORMATION ARCHITECTURE

Use a fixed left sidebar.

```text
TalkSaathi AI

Home
Practice
Conversation
Phrases
Progress
Settings
```

Recommended routes:

```text
/
  → Home / Dashboard

/onboarding
  → First-time setup

/practice
  → Daily guided practice

/conversation
  → Free conversation

/phrases
  → Useful phrases + personalized vocabulary

/progress
  → Skills, mistakes, streaks, history

/settings
  → Preferences, voice, explanation language, data controls
```

Do not create unnecessary routes for MVP.

---

# 7. DESIGN SYSTEM

The user has provided a visual reference. Follow its overall visual language rather than copying it literally.

## Visual direction

- soft purple;
- lavender;
- warm off-white background;
- white cards;
- rounded modern SaaS/AI interface;
- clean rounded sans-serif typography;
- deep purple primary actions;
- soft lavender AI/info cards;
- spacious layout;
- fixed sidebar;
- minimal outline icons;
- premium but friendly.

Avoid:

- cyberpunk;
- neon;
- excessive gradients;
- excessive glassmorphism;
- cluttered dashboards;
- unnecessary animation.

## Approximate design tokens

Use these as starting tokens and adjust to visually match the supplied reference:

```text
Background: #FAF7F5
Primary:    #5B247A
Secondary:  #E8DDF4
Surface:    #FFFFFF
Text:       #241B2B
Muted:      #756B7D
Border:     #E8E2EA
```

The design must remain visually consistent across all screens.

## UI principles

- rounded cards;
- rounded buttons;
- subtle borders;
- soft shadows;
- generous spacing;
- strong visual hierarchy;
- readable typography;
- clear primary CTA;
- useful hover/focus states.

---

# 8. TECHNICAL ARCHITECTURE

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide icons or another clean outline icon set

## Backend

Use **Next.js Route Handlers / API Routes**.

There is no need for a separate FastAPI server in the MVP.

Backend responsibilities:

- AI requests;
- ElevenLabs STT requests;
- ElevenLabs TTS requests;
- OCR/AI image analysis orchestration;
- conversation processing;
- mistake analysis;
- structured AI responses.

## AI brain

Primary model:

> **Qwen3-8B or the currently available compatible open-weight Qwen3 8B inference model**

Use a Hugging Face or compatible inference provider.

The open-weight model is responsible for:

- English correction;
- explanation;
- Hindi → English conversion;
- conversation;
- lesson generation;
- mistake analysis;
- personalized exercises;
- vocabulary/phrase suggestions;
- image-text grammar analysis;
- structured learning feedback.

Do not use ElevenLabs as the reasoning model.

## Voice

### Speech-to-Text

ElevenLabs STT.

```text
User microphone
      ↓
Audio
      ↓
Server API
      ↓
ElevenLabs STT
      ↓
Text
```

### Text-to-Speech

ElevenLabs TTS.

```text
AI response
      ↓
Server API
      ↓
ElevenLabs TTS
      ↓
Audio
      ↓
Browser playback
```

## OCR

Use a practical OCR implementation suitable for the MVP.

The OCR pipeline should be:

```text
Image
  ↓
OCR
  ↓
Extracted text
  ↓
Open-weight LLM
  ↓
Grammar + spelling + naturalness analysis
  ↓
Corrected sentence
  ↓
Speaking practice
```

If a browser/client OCR solution is reliable enough for the MVP, use it. Otherwise route OCR through an appropriate server/API.

## Storage

### MVP

Use LocalStorage.

Persist only:

- profile;
- level;
- goals;
- interests;
- daily duration;
- explanation language;
- voice preferences;
- practice history;
- skill scores;
- mistakes;
- phrase progress;
- streak;
- XP;
- achievements.

Do not store raw audio or photos unnecessarily.

### Future

Database-ready architecture:

```text
PostgreSQL
    +
Prisma
```

Do not make the MVP dependent on a database.

---

# 9. ENVIRONMENT VARIABLES

Create `.env.example`.

Expected variables should include the equivalents of:

```text
ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
HF_TOKEN=
HF_MODEL=
```

If the chosen inference provider requires additional configuration, document it.

Rules:

- never commit `.env`;
- never expose secret values in browser bundles;
- never hard-code API keys;
- server routes only for secret-dependent requests.

---

# 10. ONBOARDING

No login.

First visit:

```text
Welcome
   ↓
Profile
   ↓
Self assessment
   ↓
Placement test
   ↓
1–2 minute speaking assessment
   ↓
Recommended level + weak areas
   ↓
Dashboard
```

## Step 1 — Welcome

Example:

> Hi! 👋  
> Let's improve your English speaking together.

Do not hard-code a real person's name. Use the name entered during onboarding.

## Step 2 — Profile

Collect:

- name;
- current level;
- learning goal;
- daily available time;
- interests;
- preferred topics;
- speaking goal.

## Step 3 — Self assessment

Options:

- Beginner;
- Intermediate.

## Step 4 — Placement test

Short questions.

The system should combine:

- self-selected level;
- quiz performance;
- speaking assessment.

## Step 5 — Speaking assessment

Ask the learner to speak for approximately 1–2 minutes.

Evaluate:

- grammar;
- fluency;
- vocabulary;
- pronunciation/clarity when measurable;
- sentence formation;
- confidence indicators.

Output:

```text
Your level: Intermediate

Strongest:
Listening

Needs improvement:
Grammar + Fluency
```

Important: do not pretend that a text-only model can perfectly measure acoustic pronunciation. If pronunciation is not actually analyzed, label the result accordingly.

---

# 11. DASHBOARD

The dashboard should immediately answer:

> “What should I do today?”

Layout:

```text
Good morning, [Name] 👋

[ Today's Practice ]
[ Start Practice → ]

[ Speaking ] [ Listening ] [ Grammar ] [ Vocabulary ]

🔥 7 Day Streak

🎯 Today's Goal

🧠 Recommended Focus
Past Tense
```

## Hero card

Show:

- recommended session duration;
- today's focus;
- estimated activities;
- Start Practice button.

## Skill cards

At minimum:

- Speaking;
- Listening;
- Grammar;
- Vocabulary.

## Weak-area focus

Example:

> Your recent conversations show repeated past-tense mistakes.

CTA:

> Practice Past Tense

---

# 12. DAILY PRACTICE

Available durations:

- 10 minutes;
- 15 minutes;
- 20 minutes;
- 30 minutes.

The AI creates the session using:

- current level;
- recent performance;
- recurring mistakes;
- interests;
- preferred topics;
- available time.

The user can customize activities.

## Example 15-minute plan

```text
2 min  — Listening
2 min  — Comprehension
3 min  — Recall
4 min  — Speaking + correction
4 min  — Conversation
```

The exact timing may adapt.

---

# 13. LISTENING MODULE

Provide a short English passage.

Controls:

- play;
- pause;
- replay;
- slow;
- normal;
- fast.

Example:

> “I usually wake up at seven in the morning…”

The audio can be generated using TTS.

The learner should listen before seeing the full transcript where practical.

---

# 14. COMPREHENSION MODULE

After listening, ask a simple question.

Example:

> What time does the speaker usually wake up?

Provide:

- multiple choice for beginners;
- optional typed/spoken answer for higher difficulty.

Feedback:

```text
Correct:
Great! You understood the main detail.

Incorrect:
Not quite. Listen once more and try again.
```

---

# 15. RECALL MODULE

Hide the transcript.

Ask:

> What do you remember from what you heard?

Input:

- voice;
- typing.

The AI should evaluate whether the learner can reproduce the main idea, not require word-for-word copying.

---

# 16. SPEAKING MODULE

Give a realistic prompt.

Examples:

> Tell me about your morning routine.

> Describe your college.

> What did you do yesterday?

> Explain why you want to learn programming.

The user speaks.

Pipeline:

```text
Microphone
 ↓
ElevenLabs STT
 ↓
Transcript
 ↓
Open-weight LLM
 ↓
Structured evaluation
 ↓
Feedback UI
```

---

# 17. AI CORRECTION

Correction must have four parts.

## 1. Original

Show what the learner said.

## 2. Corrected sentence

Example:

> I have breakfast at 8 and I go to college.

## 3. Explanation

Example:

> We usually say “have breakfast.”
> We use “to” before a destination.

## 4. Natural/native version

Example:

> I usually have breakfast at 8 and then go to college.

Then:

> 🎤 Now say the corrected sentence.

---

# 18. REPEAT + RE-CHECK

After correction, the learner repeats.

The app should run the same STT/evaluation pipeline again.

Show what can actually be measured.

Example:

```text
Grammar      Improved
Sentence     Correct
Clarity      Good
```

If acoustic pronunciation scoring is not implemented, do not fabricate a numeric pronunciation score.

The central loop is:

```text
Mistake
  ↓
Correction
  ↓
Explanation
  ↓
Repeat
  ↓
Re-check
  ↓
Improvement
```

---

# 19. FREE CONVERSATION

Users can start conversation anytime.

## Topic categories

### Daily Life

- family;
- friends;
- food;
- college;
- hobbies.

### Professional

- job interview;
- workplace;
- meetings;
- presentations.

### Social

- shopping;
- restaurant;
- travel;
- asking directions.

### Education & Technology

- programming;
- AI;
- college;
- learning.

### Custom

User enters any safe topic.

## Conversation behavior

During conversation:

- be natural;
- maintain context;
- ask one question at a time;
- do not interrupt every minor error;
- lightly correct important mistakes;
- keep responses concise enough for speaking practice.

At the end provide a report:

```text
Grammar        78%
Fluency        81%
Vocabulary     74%
Pronunciation  Not measured / available only if supported

Important corrections: 4

Focus next:
1. Past tense
2. Articles
3. Prepositions
```

Only show numeric scores when the system has a defensible basis for them.

---

# 20. AI RESPONSE CONTRACT

The AI should return structured JSON whenever the backend needs machine-readable learning data.

Example:

```json
{
  "reply": "I usually have breakfast at 8 and then go to college.",
  "correction": {
    "original": "I take breakfast at 8 and I go college.",
    "corrected": "I have breakfast at 8 and I go to college.",
    "natural": "I usually have breakfast at 8 and then go to college.",
    "explanation": [
      "Use 'have breakfast' in natural English.",
      "Use 'to' before a destination."
    ]
  },
  "scores": {
    "grammar": 78,
    "fluency": 81,
    "vocabulary": 74
  },
  "mistakes": [
    {
      "category": "grammar",
      "topic": "preposition",
      "pattern": "go college"
    }
  ],
  "next_question": "What do you usually do after reaching college?",
  "next_goals": [
    "Practice prepositions",
    "Use one new phrase"
  ]
}
```

The exact schema can be refined during implementation, but responses must be predictable and validated before rendering.

---

# 21. HINDI → ENGLISH MODE

This is an important differentiating feature.

User activates:

> 🎤 Hindi → English

User says:

> “मुझे कल कॉलेज जाना है।”

Pipeline:

```text
Hindi voice
 ↓
ElevenLabs STT
 ↓
Hindi text
 ↓
Open-weight LLM
 ↓
English translation + explanation
 ↓
English TTS
```

Output:

> English: I have to go to college tomorrow.

Then:

> Why?
>
> “Have to” is used when you need to do something.

Then:

> 🎤 Now say it in English.

After repetition, continue with related conversation:

> What do you usually do at college?

## Learning rule

Hindi should be a temporary bridge.

The app should gradually encourage:

```text
Hindi → English
```

to become:

```text
Direct English thinking → English speaking
```

---

# 22. PHRASES

Do not focus only on isolated vocabulary.

Teach useful sentence patterns and phrases.

Example:

```text
Phrase:
I'm looking forward to it.

Meaning:
I'm excited about something that will happen.

Practice:
Create your own sentence.
```

User:

> I'm looking forward to my vacation.

AI:

> Great usage!
```

Allow users to save useful phrases.

---

# 23. PERSONALIZED VOCABULARY

Observe conversation history.

If a learner repeatedly uses:

- good;
- very good;
- nice;

suggest context-appropriate alternatives such as:

- excellent;
- impressive;
- enjoyable;
- useful.

Do not force synonyms when they are unnatural for the context.

Immediately practice new words in sentences.

---

# 24. SHADOWING / PRONUNCIATION

This is a secondary MVP feature.

Flow:

```text
AI plays sentence
       ↓
User listens
       ↓
User repeats
       ↓
STT transcript comparison
       ↓
Word match / clarity feedback
```

Potential metrics:

- word match;
- clarity;
- fluency;
- speaking speed.

Only provide true pronunciation/acoustic scores if the implemented stack actually measures them.

---

# 25. PHOTO / CAMERA / GALLERY GRAMMAR CHECKER

User can:

- take/select an image;
- upload it;
- extract visible text;
- analyze the text.

Example:

Original:

> I am going market yesterday.

Correct:

> I went to the market yesterday.

Why:

> “Yesterday” indicates the past, so we use “went.”

Natural:

> I went to the market yesterday.

Then:

> 🎤 Try saying the corrected sentence.

The image itself should not be permanently retained unless the user explicitly chooses to save it.

---

# 26. MISTAKE MEMORY

Store recurring learning mistakes locally.

Example:

```text
Past tense        8 mistakes
Prepositions      6 mistakes
Articles          4 mistakes
Vocabulary        3 mistakes
```

If the learner repeatedly says:

> I didn't went.

record the recurring pattern.

Future practice should include:

> Past Tense Challenge

The system should distinguish:

- one-time typo;
- recurring grammar pattern;
- vocabulary weakness;
- pronunciation issue when measurable.

---

# 27. ADAPTIVE LEARNING

The system should continuously answer:

> **What does this learner need to practice next?**

Pipeline:

```text
Performance
   ↓
Mistake analysis
   ↓
Weak area detection
   ↓
Personalized exercise
   ↓
Practice
   ↓
Re-evaluate
```

Example:

```text
Recent problem:
Past tense

Next practice:
Past-tense speaking prompts

After practice:
Check whether the same error frequency decreases
```

---

# 28. PROGRESS

Show:

## Skill scores

- Speaking;
- Listening;
- Grammar;
- Vocabulary;
- Pronunciation;
- Fluency.

## Time views

- daily;
- weekly;
- monthly.

## Metrics

- total practice time;
- conversations completed;
- new phrases;
- corrections;
- repeated mistakes;
- improvement;
- current streak.

## Confidence

Ask:

> How confident do you feel speaking English today?

Scale:

```text
1 — Very uncomfortable
2 — Uncomfortable
3 — Okay
4 — Confident
5 — Very confident
```

Track the trend locally.

---

# 29. AI FEEDBACK

End every meaningful session with:

## What you did well

Example:

> You spoke continuously without long pauses.

## What needs improvement

Example:

> You frequently used incorrect past tense.

## Next goals

Example:

1. Practice past tense.
2. Use 3 new phrases.
3. Speak for 2 minutes without switching to Hindi.

---

# 30. GAMIFICATION

Secondary feature.

Include where practical:

- daily streak;
- XP;
- badges;
- daily goals;
- weekly challenges;
- optional leaderboard.

Gamification must support learning rather than distract from it.

---

# 31. AI PERSONALITY

The AI should adapt its tone.

## Learning

Friendly teacher.

## Conversation

Natural friend.

## Correction

Supportive tutor.

## Speaking

Encouraging coach.

Never shame the learner.

Good:

> Nice attempt! Let’s make that sentence sound more natural.

Bad:

> Wrong. Your English is poor.

---

# 32. EXPLANATION LANGUAGE

User chooses:

- English;
- Hindi;
- Hinglish.

The explanation language affects:

- grammar explanations;
- correction explanations;
- learning tips;
- feedback.

Practice itself should remain primarily English.

---

# 33. VOICE SETTINGS

Allow:

- male/female voice where available;
- multiple configured voices;
- slow;
- normal;
- fast.

Do not assume all voices are available. Populate options from configured/available ElevenLabs voices or provide a sensible default.

---

# 34. DATA MODEL — LOCAL-FIRST

Use a typed application state.

Recommended conceptual model:

```ts
type UserProfile = {
  name: string
  level: "beginner" | "intermediate"
  learningGoal: string
  dailyMinutes: 10 | 15 | 20 | 30
  interests: string[]
  preferredTopics: string[]
  speakingGoal: string
  explanationLanguage: "english" | "hindi" | "hinglish"
  voiceId?: string
  speechSpeed: "slow" | "normal" | "fast"
}

type Mistake = {
  id: string
  category: "grammar" | "vocabulary" | "pronunciation" | "fluency" | "sentence"
  topic: string
  original: string
  corrected: string
  count: number
  lastSeen: string
}

type PracticeSession = {
  id: string
  date: string
  durationMinutes: number
  activities: string[]
  completed: boolean
  scores?: Record<string, number>
  mistakesFound: string[]
}

type ProgressState = {
  speaking: number
  listening: number
  grammar: number
  vocabulary: number
  pronunciation?: number
  fluency: number
}

type Phrase = {
  id: string
  phrase: string
  meaning: string
  example?: string
  practiced: boolean
}
```

Keep this schema easy to migrate to Prisma later.

---

# 35. LOCAL STORAGE

Use one versioned storage key, for example:

```text
talksaathi:v1
```

Store a single serializable application state where practical.

Include:

```text
profile
progress
mistakes
sessions
phrases
streak
xp
achievements
settings
```

Add safe parsing and fallback defaults.

If stored data is corrupted, recover gracefully rather than crashing the application.

---

# 36. DATA CONTROLS

Settings should include:

> Delete my local learning data

Optionally:

> Export my learning data

Do not silently upload learning history to a database.

---

# 37. BACKEND API DESIGN

Use server-side routes with clear responsibilities.

Suggested routes:

```text
POST /api/ai/correct
POST /api/ai/conversation
POST /api/ai/translate
POST /api/ai/evaluate
POST /api/ai/generate-practice

POST /api/voice/stt
POST /api/voice/tts

POST /api/image/analyze
```

These are conceptual names; adapt them to the actual Next.js App Router structure.

## `/api/ai/correct`

Input:

```json
{
  "text": "I take breakfast at 8 and I go college.",
  "level": "beginner",
  "explanationLanguage": "hinglish"
}
```

Output:

```json
{
  "corrected": "...",
  "natural": "...",
  "explanation": ["..."],
  "mistakes": [...]
}
```

## `/api/ai/conversation`

Input:

```json
{
  "messages": [],
  "userText": "...",
  "level": "intermediate",
  "topic": "college"
}
```

Output:

```json
{
  "reply": "...",
  "correction": null,
  "nextQuestion": "...",
  "mistakes": []
}
```

## `/api/ai/translate`

Input:

```json
{
  "text": "मुझे कल कॉलेज जाना है।",
  "from": "hi",
  "to": "en",
  "explanationLanguage": "hindi"
}
```

## `/api/ai/evaluate`

Used for speaking assessment, recall, repeat practice and session analysis.

## `/api/voice/stt`

Accept audio and forward securely to ElevenLabs STT.

## `/api/voice/tts`

Accept text and return/play TTS audio from ElevenLabs.

## `/api/image/analyze`

Accept an image transiently, extract text, send text to the open-weight model, and return the analysis.

---

# 38. AI PROMPTING REQUIREMENTS

The system prompt for the English tutor should establish:

```text
You are TalkSaathi AI, a supportive English-speaking companion.

Your goals:
1. Help the learner speak more confidently.
2. Correct important mistakes clearly.
3. Explain corrections at the learner's level.
4. Prefer natural English over unnatural literal translations.
5. Encourage repetition after important corrections.
6. Remember recurring mistakes when supplied in context.
7. Adapt exercises to the learner's level and history.
8. Use the user's selected explanation language.
9. During free conversation, prioritize natural flow.
10. Never shame the learner.
11. Keep speaking-practice responses concise enough to continue conversation.
12. Return structured data when requested by the application.
```

The model should receive relevant context such as:

- user level;
- explanation language;
- current topic;
- recent mistakes;
- current session activity;
- user interests.

Do not send the entire history unnecessarily.

---

# 39. ERROR HANDLING

Every external integration must handle:

- missing API key;
- timeout;
- rate limit;
- invalid response;
- malformed JSON;
- network failure;
- unsupported audio;
- OCR failure.

User-facing example:

> Something went wrong while processing your voice. Please try again.

Do not expose:

- stack traces;
- API secrets;
- raw provider errors.

Server logs may contain useful debugging information but never secrets.

---

# 40. LOADING STATES

Voice:

> Listening…

AI:

> Thinking…

TTS:

> Preparing voice…

Image:

> Reading your image…

Practice generation:

> Creating your practice…

Buttons must not allow accidental duplicate requests while a request is in progress.

---

# 41. EMPTY STATES

Examples:

No mistakes yet:

> You’re doing great — no recurring mistakes detected yet.

No phrases:

> Complete a practice session to start building your phrase list.

No progress:

> Finish your first practice to see your progress.

---

# 42. DASHBOARD UX PRIORITY

The user should never wonder what to click next.

Primary action:

> **Start Today's Practice**

Secondary actions:

- Continue conversation;
- Practice weak area;
- Review phrases.

---

# 43. PRACTICE SCREEN

Use a hybrid interface.

## Learning task

Large focused card.

Example:

```text
Listening Practice

▶ ━━━━━━━━━━━━━━━ 00:42

What did the speaker do after breakfast?

○ Went to college
○ Started working
○ Went shopping

[ Continue ]
```

## Conversation

Switch naturally to a chat-style layout when conversation begins.

Do not mix too many cards or controls on screen simultaneously.

---

# 44. RESPONSIVE SCOPE

MVP is desktop-first.

Minimum expected desktop size:

```text
1280 × 720
```

The layout should work comfortably on common laptop/desktop screens.

Mobile optimization is future scope.

---

# 45. ACCESSIBILITY

Implement:

- visible focus states;
- semantic buttons;
- labels for form inputs;
- sufficient text contrast;
- keyboard-friendly controls where practical;
- meaningful aria labels for icon-only buttons;
- no information conveyed by color alone.

---

# 46. PERFORMANCE

Prioritize:

- fast first render;
- lazy loading for heavy image/OCR functionality;
- no unnecessary client-side bundles;
- no repeated AI calls;
- disable duplicate requests;
- cache where safe and useful.

Do not sacrifice correctness for premature optimization.

---

# 47. SECURITY

Required:

- server-side API secrets;
- input validation;
- file type/size validation for image/audio uploads;
- do not persist uploaded media unnecessarily;
- do not execute user-provided text as code;
- sanitize rendered content where needed;
- safe error messages.

---

# 48. MOCK / DEVELOPMENT MODE

If API credentials are not available during development, implement a development mode.

Example:

```text
AI_PROVIDER_MODE=mock
```

Mock mode may return realistic deterministic examples for:

- correction;
- conversation;
- translation;
- practice generation;
- TTS status.

But the UI must clearly indicate development/mock mode.

Do not submit a fake-only application.

The deployed hackathon version should use real integrations where required.

---

# 49. MVP DEFINITION

## MUST HAVE

1. No-login onboarding
2. User profile
3. Level assessment
4. Dashboard
5. Daily practice
6. Listening
7. Comprehension
8. Speaking
9. ElevenLabs STT
10. Open-weight LLM
11. AI correction
12. Repeat practice
13. ElevenLabs TTS
14. Conversation
15. Hindi → English voice mode
16. Mistake memory
17. Basic progress
18. Basic phrases
19. Photo grammar checker
20. LocalStorage persistence
21. Next.js backend/API routes
22. Working error/loading states
23. GitHub README
24. Working deployment

## SHOULD HAVE

- shadowing;
- pronunciation scoring;
- XP;
- streaks;
- badges;
- weekly challenges;
- personalized vocabulary;
- adaptive lesson generation.

## FUTURE

- user accounts;
- cloud sync;
- PostgreSQL + Prisma;
- advanced pronunciation/acoustic analysis;
- mobile app;
- more languages;
- teacher dashboard;
- community challenges.

---

# 50. MVP ACCEPTANCE CRITERIA

The MVP is considered successful only if a new user can complete this journey:

```text
Open app
  ↓
Complete onboarding
  ↓
See personalized dashboard
  ↓
Start today's practice
  ↓
Listen to English
  ↓
Answer comprehension question
  ↓
Speak an answer
  ↓
Voice becomes text
  ↓
Open-weight AI analyzes it
  ↓
User sees correction + explanation + natural version
  ↓
User repeats corrected sentence
  ↓
AI re-checks
  ↓
User enters conversation
  ↓
AI continues naturally
  ↓
Session report appears
  ↓
Mistake is saved locally
  ↓
Progress updates
```

Additionally:

```text
Hindi voice
  ↓
English translation
  ↓
Explanation
  ↓
Repeat in English
  ↓
Related conversation
```

And:

```text
Image
  ↓
OCR
  ↓
Grammar/spelling/naturalness analysis
  ↓
Correction
  ↓
Speaking practice
```

If these three journeys work, the project has a strong hackathon MVP.

---

# 51. HACKATHON DEMO SCRIPT

Do not show disconnected features.

Show one story.

## Demo

1. Open TalkSaathi.
2. Show the friend's profile.
3. Start Today's Practice.
4. Play a short listening passage.
5. Answer comprehension.
6. Speak a response.
7. Intentionally make a realistic grammar mistake.
8. Show AI correction.
9. Repeat corrected sentence.
10. Show re-check.
11. Continue a short conversation.
12. Show session report.
13. Show that the mistake was remembered.
14. Briefly demonstrate Hindi → English.
15. Briefly demonstrate Photo → Grammar correction.
16. Finish on the progress dashboard.

The demo should make judges understand the product in a few minutes.

---

# 52. SUCCESS METRICS

## Engagement

- daily practice completion;
- streak;
- practice duration.

## Speaking

- speaking time;
- fluency trend;
- grammar improvement.

## Learning

- repeated mistakes reduced;
- new phrases used correctly;
- listening comprehension.

## Confidence

- 1–5 self-rated confidence;
- confidence trend over time.

---

# 53. PROJECT STRUCTURE

Prefer a clean structure similar to:

```text
talksaathi-ai/
├── app/
│   ├── page.tsx
│   ├── onboarding/
│   ├── practice/
│   ├── conversation/
│   ├── phrases/
│   ├── progress/
│   ├── settings/
│   └── api/
│       ├── ai/
│       ├── voice/
│       └── image/
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── practice/
│   ├── conversation/
│   ├── voice/
│   ├── progress/
│   └── ui/
│
├── lib/
│   ├── ai/
│   ├── elevenlabs/
│   ├── ocr/
│   ├── storage/
│   ├── scoring/
│   └── validation/
│
├── types/
├── hooks/
├── public/
├── .env.example
├── README.md
└── package.json
```

Adapt the exact structure to the selected Next.js version.

---

# 54. CODE QUALITY

Use:

- TypeScript strict mode;
- reusable components;
- typed API contracts;
- small focused functions;
- clear naming;
- environment validation;
- centralized provider clients;
- no duplicated provider logic;
- no huge monolithic components.

Avoid:

- giant `page.tsx` files;
- API calls directly scattered across UI components;
- hard-coded API keys;
- hard-coded user-specific data;
- fake score generation presented as real measurement;
- unnecessary dependencies.

---

# 55. TESTING CHECKLIST

Before declaring the MVP complete, test:

## Onboarding

- first visit;
- refresh;
- saved profile;
- invalid input.

## Practice

- audio plays;
- comprehension works;
- microphone permission denied;
- STT success;
- STT failure;
- AI success;
- AI failure;
- correction renders;
- repeat works.

## Conversation

- first message;
- context maintained;
- important correction;
- session report;
- empty/error states.

## Hindi → English

- Hindi voice input;
- translation;
- explanation;
- repeat;
- follow-up question.

## Image

- valid image;
- unreadable image;
- large image;
- no extracted text;
- grammar analysis.

## Storage

- refresh keeps data;
- delete data works;
- corrupted local state does not crash the app.

## Security

- API keys are not exposed in client code;
- `.env` is ignored;
- uploaded media is not unnecessarily persisted.

---

# 56. README REQUIREMENTS

README must explain:

1. What TalkSaathi AI is.
2. Why it was built.
3. The friend/problem story.
4. Core learning loop.
5. Main features.
6. Architecture.
7. Tech stack.
8. Open-weight AI usage.
9. ElevenLabs role.
10. LocalStorage/no-login approach.
11. Setup instructions.
12. Environment variables.
13. Local development.
14. Deployment.
15. Screenshots/GIF/demo link placeholders.
16. Hackathon context.
17. Future roadmap.
18. Privacy approach.

Include:

> **Don't just learn English. Practice speaking it.**

---

# 57. DEPLOYMENT

Target:

> Vercel

Before deployment:

- configure environment variables;
- test production build;
- verify server API routes;
- verify microphone permissions;
- verify CORS/provider requirements;
- verify TTS audio playback;
- verify LocalStorage;
- verify image upload limits.

Run:

```text
npm run lint
npm run build
```

Fix build errors before deployment.

---

# 58. IMPLEMENTATION PHASES

## Phase 1 — Foundation

Build:

- Next.js app;
- TypeScript;
- Tailwind;
- shadcn/ui;
- design tokens;
- fixed sidebar;
- routes;
- shared layout.

## Phase 2 — Onboarding

Build:

- welcome;
- profile;
- level;
- goals;
- daily time;
- interests;
- explanation language;
- LocalStorage.

## Phase 3 — Dashboard

Build:

- greeting;
- Today's Practice hero;
- skill cards;
- streak;
- goal;
- weak-area recommendation.

## Phase 4 — Core Learning Loop

Build:

```text
Listen
→ Understand
→ Recall
→ Speak
→ Correct
→ Repeat
```

Do not move on until this is usable.

## Phase 5 — AI

Integrate:

- open-weight model;
- structured prompts;
- correction;
- evaluation;
- practice generation;
- conversation.

## Phase 6 — Voice

Integrate:

- ElevenLabs STT;
- ElevenLabs TTS;
- recording states;
- playback;
- speed control.

## Phase 7 — Conversation

Build:

- topic selection;
- chat;
- voice input;
- voice output;
- context;
- end-of-session report.

## Phase 8 — Personalization

Build:

- mistake memory;
- progress;
- weak areas;
- adaptive practice;
- phrases.

## Phase 9 — Differentiators

Build:

- Hindi → English mode;
- photo grammar checker.

## Phase 10 — Polish

Build/refine:

- loading states;
- errors;
- empty states;
- accessibility;
- responsive desktop layout;
- animations only where useful;
- README;
- deployment.

---

# 59. PRIORITY RULE FOR LIMITED TIME

If development time becomes limited, use this priority:

```text
P0 — Required for the demo
    Onboarding
    Dashboard
    Listen
    Speak
    AI correction
    Repeat
    Conversation
    Open-weight LLM
    ElevenLabs STT/TTS
    LocalStorage

P1 — Strong differentiators
    Hindi → English
    Mistake memory
    Progress
    Photo grammar checker
    Phrases

P2 — Polish
    Streak
    XP
    Badges
    Shadowing
    Advanced pronunciation

P3 — Future
    Accounts
    Cloud database
    Mobile
    Teacher dashboard
```

Never sacrifice the working P0 journey to add a P2 feature.

---

# 60. FINAL PRODUCT STATEMENT

> **TalkSaathi AI is a personal English-speaking companion built for a friend who understands English but struggles to speak confidently. It combines listening, recall, speaking, correction, repetition, pronunciation practice, and natural conversation into one personalized daily learning experience.**

Core philosophy:

> **Don't just learn English. Practice speaking it.**

---

# 61. FINAL ANTIGRAVITY CHECKLIST

Before saying “done”, verify:

- [ ] App starts successfully.
- [ ] No login is required.
- [ ] Onboarding works.
- [ ] Profile persists after refresh.
- [ ] Dashboard is personalized.
- [ ] Today's Practice opens.
- [ ] Listening works.
- [ ] Comprehension works.
- [ ] Microphone flow works.
- [ ] ElevenLabs STT works when configured.
- [ ] Open-weight LLM works when configured.
- [ ] AI correction works.
- [ ] Explanation language works.
- [ ] Repeat/re-check works.
- [ ] ElevenLabs TTS works when configured.
- [ ] Conversation works.
- [ ] Conversation context is maintained.
- [ ] Session feedback is generated.
- [ ] Mistakes are stored locally.
- [ ] Progress updates.
- [ ] Hindi → English works.
- [ ] Photo grammar flow works.
- [ ] Phrases work.
- [ ] Error states work.
- [ ] Loading states work.
- [ ] API keys are server-side only.
- [ ] `.env` is not committed.
- [ ] `.env.example` exists.
- [ ] Production build succeeds.
- [ ] Vercel deployment works.
- [ ] README is complete.
- [ ] Hackathon demo can be completed without manual code changes.

## Definition of Done

The project is not “done” because the UI looks good.

It is done when a real learner can open TalkSaathi AI and complete:

> **Listen → Understand → Speak → Get corrected → Repeat → Converse → See progress**

with real AI and voice integrations in the deployed application.
