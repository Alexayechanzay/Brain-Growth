# AI-Driven Solution and User Persona

  
**Team:** BrainGrowth  
**School:** The Lumbini Mandalay  
**Members:** Aye Chan Zay, La Yaung Naing, Yaung Ni Lin  
**Product:** BrainGrowth — AI-assisted intention alignment for YouTube study sittings

---

## 1. What “AI-driven” means for this product

Most student tools use AI to *talk*: chatbots, summaries, quiz generators. Thiri does not fail because she lacks another explanation of momentum. She fails because **YouTube’s recommendation engine overwrites the intention she already had**.

BrainGrowth uses AI where that fight actually happens: **a short, explainable judgment that compares “what I sat down to study” with “what this video title is.”**

It is not a tutor. It is not a parent. It is not a feed blocker. It is **decision support for a study contract the student starts and stops**.

> Assistive AI, session-scoped, honest about uncertainty, silent when aligned, and off the moment the sitting ends.

That is a narrower and more responsible use of AI than “watch the student all day and score their focus.”

---



## 2. The solution, in one sitting

Thiri writes *Study IGCSE Physics — momentum and impulse* and picks how long. BrainGrowth:

1. **Locks the door she meant to walk through.** The session opens a YouTube search for her topic, not Home. The first click is hers.
2. **Reads only the title** of what she opens, and only while the session is active.
3. **Classifies the title against her intention** as **on topic**, **not sure yet**, or **off topic**.
4. **Acts with restraint.** On topic: silence. Not sure yet: a quiet chip, no interruption. Off topic: a short pause, a reason in plain language, and two choices — back to her search, or keep watching.
5. **Stops.** When she taps *I’m done* or the timer ends, observation ends. No history trail. No leftover watching.

The AI does not confiscate YouTube. It makes the off-topic click a **decision** instead of a slide.

---



## 3. The AI decision model

Every evaluation returns the same contract. That is the product’s intelligence layer, whether the answer comes from the locked demo fixtures, the labeled heuristic, or a future live model.


| Field             | Role                                              |
| ----------------- | ------------------------------------------------- |
| `status`          | `aligned` · `uncertain` · `drifting`              |
| `confidence`      | How sure the classifier is, used to stay humble   |
| `reason`          | A sentence Thiri can actually read                |
| `suggestedAction` | `continue` · `review` · `return_to_goal`          |
| `classifier`      | Labeled honestly as `demo-fixture` or `heuristic` |




### Three outputs, on purpose

Binary “block / allow” is a bad model of homework on YouTube. Titles are messy. BrainGrowth therefore has a **middle class**.


| Status           | What it means for Thiri                       | What the product does                                   |
| ---------------- | --------------------------------------------- | ------------------------------------------------------- |
| **On topic**     | This still looks like the sitting she started | Nothing. Playback continues.                            |
| **Not sure yet** | The title does not give enough evidence       | Quiet chip only. No pause. No fake certainty.           |
| **Off topic**    | The title looks like a different purpose      | Pause after a short delay. Explain why. Let her choose. |


Uncertainty is not a bug. It is the difference between assistive AI and a brittle filter.

### Why this is not a keyword list pretending to be a model

A keyword tool fails Thiri’s exact homework in both directions:


| Video title                                   | Keyword tool                                  | BrainGrowth                                            |
| --------------------------------------------- | --------------------------------------------- | ------------------------------------------------------ |
| *The Most Misunderstood Concept in Physics*   | Likely **miss** — no “momentum,” no “impulse” | **On topic** — it still reads as a physics explainer   |
| *This changed everything*                     | Guess, or ignore                              | **Not sure yet** — too little context to claim a match |
| *I Failed Physics, Then Became a UFC Fighter* | Likely **trust** — it contains “Physics”      | **Off topic** — a fighting story, not the lesson       |


The demo is the proof of the AI problem: **alignment is about purpose, not shared words.**

The competition build is transparent about how that proof is delivered:

- The three locked titles use **deterministic demo fixtures**, labeled `demo-fixture`.
- Other titles use a **labeled heuristic**, never described as “the live model.”
- The session flow already speaks the language of a classifier: status, confidence, reason, action.
- The same `DriftEvaluation` contract can be filled later by a live model. Model output would be **validated before it is shown**. The product never trusts a raw response blindly.

We would rather win by being precise than by dressing a word list in a lab coat.

---



## 4. Solution architecture (what the AI is allowed to see)

```
Thiri starts a session
        ↓
intention + duration  →  active study contract
        ↓
YouTube search for that intention (not Home)
        ↓
title only, session only  →  evaluator
        ↓
aligned / uncertain / drifting + reason
        ↓
silence / quiet chip / respectful pause
        ↓
session ends  →  observation hard-stops
```

**Inputs (minimal on purpose):** the student’s written intention, and the current video title during an active session.

**Outputs (actionable on purpose):** a status, a reason she can disagree with, and a suggested next step she can override.

**Non-inputs:** no face, no microphone, no full browsing history, no account, no parent feed, no all-day timeline.

That constraint is an AI design choice. A model that sees everything can become surveillance. A model that sees **title vs intention, for a timer the student set**, can stay a tool.

---



## 5. User persona — what she needs from the AI



### Thiri Win, 16 — IGCSE student, The Lumbini Mandalay

**Year:** IGCSE / Year 11  
**Typical sitting:** 25–40 minutes after dinner  
**This week’s intention:** Study IGCSE Physics — momentum and impulse  
**Devices:** Chromebook at school; Chrome on a shared laptop at home

> “Don’t lecture me. Don’t spy on me. If a title looks off, tell me why — then let me choose.”



### The job she hires AI to do

Thiri does **not** hire AI to:

- write her notes;
- diagnose “addiction”;
- message her parents;
- ban YouTube;
- pretend it watched the video when it only saw the title.

She hires AI to **protect a short intention** in a place that is engineered to dissolve intentions.


| Thiri’s need                      | AI-driven behaviour                                                |
| --------------------------------- | ------------------------------------------------------------------ |
| Start on *her* words              | Session lands on a goal search, not a recommendation surface       |
| Stay in flow when she is right    | Aligned titles produce silence                                     |
| Don’t get gaslit by a vague title | Uncertain titles stay quiet instead of a fake block                |
| Catch the keyword trap            | “Physics” + UFC is drifting, even though a subject word is present |
| Remain the adult in the room      | Off-topic pause is a choice: back to search, or keep watching      |
| Trust the tool tomorrow           | When the sitting ends, the AI is gone                              |




### A sitting with the model in the loop

1. **7:20 p.m.** She types her Physics topic. Duration: 25 minutes. First useful moment is under 15 seconds.
2. **Search, not Home.** The recommendation rail is not the first thing she sees.
3. She opens *The Most Misunderstood Concept in Physics*. The classifier says **on topic**. No overlay. She studies.
4. She opens *This changed everything*. The classifier says **not sure yet**. BrainGrowth does not invent a story. She is not interrupted.
5. She opens *I Failed Physics, Then Became a UFC Fighter*. After a short delay, playback pauses. The reason is specific: it says Physics, but it is a fighting story, not her topic. She can go back, or continue.
6. **7:45 p.m.** Timer ends, or she taps *I’m done*. Nothing is still classifying her.

That sequence is the product. The AI is the judgment in the middle. The dignity is in what it **refuses** to do.

### Anti-persona (who the AI is not serving)

The model is not trained, in product terms, for:

- a parent who wants a dashboard;
- a school that wants device-wide monitoring;
- a coach that wants streaks and shame;
- a chatbot that wants a conversation during homework.

If those users win, Thiri loses. The AI stays on her side of the desk.

---



## 6. Guardrails: how we keep the AI from becoming the problem


| Guardrail                    | Why it matters to Thiri                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------------------------- |
| Session-scoped only          | AI is not a background personality test                                                        |
| Title only                   | No transcript, no webcam, no keystrokes                                                        |
| Explain the pause            | A model that cannot say *why* should not interrupt                                             |
| Show uncertainty             | Overconfident AI is worse than no AI                                                           |
| Student can continue         | The model advises; it does not confiscate                                                      |
| Hard stop                    | Ended means ended — no “just one more check”                                                   |
| Label the classifier         | Fixtures and heuristics are named. We do not fake a live model                                 |
| Validate future model output | A webhook or LLM answer is checked against the evaluation contract before it can change the UI |


These are not extras. They are how an AI study tool stays usable in a real household at The Lumbini Mandalay.

---



## 7. Why this solution wins the brief

1. **The AI has a job.** Compare intention to title. Not “be a friend.” Not “run the student’s life.”
2. **The job is harder than it looks.** The locked demo is a miniature adversarial test: missing keywords, empty titles, misleading subject words.
3. **The UX is the model card.** Silence, uncertainty, and a respectful pause *are* the inference results, rendered for a 16-year-old.
4. **The path to a live model is already drawn.** Same session. Same three states. Same reason field. Swap the evaluator; keep Thiri in charge.
5. **Privacy is the product constraint that makes the AI believable.** Students will use a tool that stops when they stop.

BrainGrowth is AI-driven in the way that helps a student at 7:20 p.m.: **it protects the purpose that brought her online, then gets out of the way.**

---



## 8. One-sentence versions (for forms)

**AI-driven solution:** BrainGrowth is a session-scoped classifier that compares a student’s written study intention with the YouTube title they opened, then stays silent, admits uncertainty, or pauses with a reason — without blocking the tab or watching them after the sitting ends.

**User persona:** Thiri Win, 16, IGCSE student at The Lumbini Mandalay, who needs AI to keep YouTube on *Study IGCSE Physics — momentum and impulse* for a short sitting she controls, not to chat, score, or surveil her.

**Honest method line:** The competition demo uses labeled fixtures for the three locked titles and a labeled heuristic otherwise; the product is built on a replaceable evaluation contract so a live model can fill the same aligned / uncertain / drifting decision without changing the student experience.