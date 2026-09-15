# BrainGrowth — Vision, Challenge, Solution, Features

**STI AI Competition**  
**Team BrainGrowth** · The Lumbini Mandalay  
Aye Chan Zay · La Yaung Naing · Yaung Ni Lin

---

```
        THE FEED WANTS THE NEXT CLICK.
        THE STUDENT WANTED A LESSON.
        WE SIDE WITH THE SECOND.
```

**Line for the room:** BrainGrowth does not ban YouTube. It protects the purpose that brought the student online.

---

## 01  Vision

A student can open YouTube for IGCSE homework and still finish the sitting they meant to start — without being blocked, scored, or watched after they close the tab.

We are not building a quieter internet.  
We are building a **fairer first minute**.

If BrainGrowth disappears from the student’s life the moment the timer ends, that is success. The product should feel like a study lamp: on for the sitting, off for the rest of the night.

---

## 02  Mission

Give every learner a **temporary study contract** with YouTube.

1. They write the topic in their own words.
2. They choose how long.
3. They land on search for that topic — not Home.
4. A title is judged against *their* intention, not against a ban-list.
5. They stay in charge.
6. When they stop, we stop.

**Mission test:** if a feature would still make sense if the student were a suspect, we do not ship it. Thiri is a student, not a case file.

---

## 03  The challenge

### The scene (seven seconds)

She knows the topic: *momentum and impulse*.  
She opens YouTube because the good explanation is there.  
Home is already offering a race, a prank, and a clip that happens to say “Physics.”

She did not fail Physics.  
**The door failed.**

### The real opponent

Not “teenagers have no willpower.”  
Not “YouTube exists.”

The opponent is this:

> YouTube can replace a chosen study intention with a recommendation feed **before the student has made a deliberate choice.**

By the time a tool shouts “you drifted,” the sitting is already gone. That is a late, slightly rude product. We refuse to build it.

### The wrong wars (and why we don’t fight them)

| If we fight this… | We lose because… |
|---|---|
| Ban YouTube | The lesson is on YouTube |
| Keyword blocklists | A good video may never say “momentum.” A bad video may say “Physics” |
| Parent dashboards | Study becomes surveillance; students hide the tool |
| Streaks and shame | We punish the student for a feed they did not design |
| All-day monitoring | The sitting is 25 minutes. The rest of the day is none of our business |
| A chatbot tutor | She does not lack another paragraph. She lacks a protected path |

### The trap the demo must survive

Intention: **Study IGCSE Physics — momentum and impulse**

| What she opens | Naive tool | What is actually true |
|---|---|---|
| *The Most Misunderstood Concept in Physics* | Miss (no “momentum”) | Still a physics lesson |
| *This changed everything* | Guess | Nobody can be sure from that title |
| *I Failed Physics, Then Became a UFC Fighter* | Trust (it says “Physics”) | A fighting story, not the homework |

If our product cannot tell those three apart, it is not intelligent. It is a word search.

---

## 04  Our solution

BrainGrowth is a **student-started Chrome extension** (with a practice site for judges). It is assistive AI for one job:

**Compare the intention she typed with the title she opened — then act with restraint.**

Think of it as a contract, not a cage.

### The BrainGrowth contract

| # | Clause | In the product |
|---|---|---|
| I | She starts it | One field. Topic + time. Under 15 seconds |
| II | The first click is hers | Session opens **search for her topic**, never Home |
| III | We read almost nothing | Video **title** only, and only while the session is active |
| IV | Judgment has three states | On topic · Not sure yet · Off topic |
| V | Silence is a feature | Aligned titles are not interrupted |
| VI | Uncertainty is honest | Vague titles get a quiet chip, not a fake block |
| VII | A pause is a choice | Off-topic: reason in plain language, then *back to search* or *keep watching* |
| VIII | Ended means ended | Timer or *I’m done* → observation hard-stops |

### How the intelligence works (said plainly)

We do not claim a hidden live model on the critical path. We built the **decision a model must make**, and we labelled our method:

- three locked titles → **demo fixtures** (the proof)
- other titles → **labeled heuristic** (never costumed as “the AI”)
- every answer fits one contract: status, confidence, reason, suggested action
- a future live model can fill that same contract; output would be checked before it can change the screen

**Winning honesty:** judges can see the thinking. Students can disagree with the reason. That is better than a black box that confiscates a tab.

### What the student feels

Not a siren.  
Not a report card.  
A lamp, a search, and — only if needed — a calm “this doesn’t look like what you sat down to study.”

---

## 05  Core features

Presented as **time**, because that is how a sitting actually feels.

### A. The first 15 seconds — *Start*

| Feature | What it does | Why it is ours |
|---|---|---|
| **One-field start** | “What are you studying?” + duration (1 min–4 hours) | No account, no setup, no lecture |
| **Search Mode** | Opens YouTube on her goal search | The feed does not get the first move |
| **Session chip** | Intention stays visible while she works | Remembers the contract she wrote |

### B. During the sitting — *Judge, don’t nag*

| Feature | On topic | Not sure yet | Off topic |
|---|---|---|---|
| **Title classifier** | Match to her intention | Admit the title is too thin | Purpose mismatch, even if a subject word appears |
| **Quiet chip** | — | Small, non-blocking | — |
| **Quick check overlay** | — | — | Pause, show *you started / now playing / why*, two buttons |
| **Search lock** | Off-topic queries return her to the study search | Same | Same |
| **Student override** | Always | Always | *Keep watching* is always legal |

### C. The last second — *Hard stop*

| Feature | What it does |
|---|---|
| **I’m done** | She ends it herself |
| **Timer expiry** | The contract ends without a speech |
| **Hard stop** | No leftover overlay, no leftover watching, YouTube is ordinary again |

### D. For the competition room — *Same product, two doors*

| Door | Use |
|---|---|
| **Chrome extension** | Live YouTube |
| **Practice site** | Same sitting, three locked titles, if the room cannot load an extension |

One product. Two ways to show it. No second personality.

---

## 06  Feature names, on a poster

If you can only put six words under the laptop:

1. **Search Mode** — she never starts on Home  
2. **On topic** — silence  
3. **Not sure yet** — humility  
4. **Off topic** — a choice, not a ban  
5. **Title only** — privacy as architecture  
6. **Hard stop** — ended means ended  

---

## 07  We refuse (this is also the product)

BrainGrowth will not ship:

accounts · parent dashboards · streaks · chat · transcription · medical advice · device-wide monitoring · hard blocking of the tab · a required “shame review” after the sitting

Those products exist. They solve a different fear.  
Ours is smaller, and that is why it can win: **it is the only tool in the room that still treats the student as the user.**

---

## 08  Thirty-second close

Vision: finish the sitting you meant to start.  
Mission: a study contract you switch on, then off.  
Challenge: YouTube replaces intention with a feed *before* a choice.  
Solution: start on search, judge the title against her words, pause with a reason, never confiscate, never linger.  
Proof: a physics explainer with no “momentum” stays on; a UFC story that says “Physics” does not.

**BrainGrowth. Stay on your topic.**
