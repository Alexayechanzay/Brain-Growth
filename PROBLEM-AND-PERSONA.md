# Problem Statement and User Personal



**Team:** BrainGrowth  
**School:** The Lumbini Mandalay  
**Members:** Aye Chan Zay, La Yaung Naing, Yaung Ni Lin  
**Product:** BrainGrowth — a student-started Chrome extension that keeps YouTube on the topic you sat down to study

---

## 1. Problem Statement

### The moment that fails

A student sits down with a real school task: *study IGCSE Physics — momentum and impulse*. They open YouTube because the useful explanation is there. Two clicks later they are not on that topic. They are on Home, Shorts, or a recommended clip that happens to contain the word “Physics.”

The lesson did not fail. The **path** failed.

YouTube is built to replace a chosen intention with a feed. For homework that lives on YouTube, that design is the problem.

### Why this is the problem we own

BrainGrowth does not treat the core problem as “students cannot tell that they are distracted.” By the time a student has already drifted, telling them they drifted is late and slightly insulting. They can already see the video.

The problem we own is earlier and more precise:

> **YouTube can replace a study intention with a recommendation feed before the student makes a deliberate choice.**

That is a choice-architecture problem, not a character problem.

### Who is hurt, and when

The people hurt are ordinary IGCSE and high-school students who are **trying to work**, not students who want the internet banned.

Typical scene:

1. They know the topic.
2. They need a video, because the textbook explanation is thin or the teacher assigned a clip.
3. YouTube Home greets them with racing, comedy, and “you won’t believe this.”
4. Even a “Physics” title can be a trap: *I Failed Physics, Then Became a UFC Fighter* contains the subject word and is still not the lesson.
5. Twenty minutes later, the homework is unfinished and the student feels as if *they* failed, when the interface did.

This happens during short, high-stakes windows: the night before a quiz, a 25-minute revision block, a Sunday afternoon catch-up. It does not require an addiction diagnosis. It requires a better door into YouTube.

### Why existing answers are the wrong shape


| Common answer                            | Why it fails this problem                                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Block YouTube                            | The lesson itself may be on YouTube. Blocking the site blocks the homework.                                   |
| Parent dashboards and all-day monitoring | Turns study into surveillance. Students hide it or resent it. The session is theirs, not a parent’s.          |
| Keyword blockers                         | A good physics video may never say “momentum.” A bad video may say “Physics.” Keywords are not understanding. |
| Streaks, scores, and shame               | Punishes the student for a feed they did not design.                                                          |
| A late “you drifted” toast               | Restates the obvious after the intention is already gone.                                                     |


BrainGrowth is built against those traps. It is a **temporary, student-started study contract**: write the topic, pick how long, land on search for that topic, stay quiet when the title looks aligned, admit uncertainty when the title is vague, and pause respectfully only when the opened title looks off. When the student stops or the timer ends, observation stops. YouTube is normal again.

### The outcome we are designing for

Success is not “perfect focus” and not “no entertainment ever.” Success is:

- the first click is the student’s topic, not Home;
- an off-topic title becomes a **choice**, not a rabbit hole;
- the student remains in charge;
- nothing is watched, stored, or judged after the session ends.

If BrainGrowth works, a student can use YouTube for IGCSE Physics and still finish the sitting they meant to start.

---



## 2. User Persona



### Thiri Win, 16 — IGCSE student

**School:** The Lumbini Mandalay  
**Year:** IGCSE / Year 11  
**Typical sitting:** 25–40 minutes after dinner  
**Devices:** Chromebook at school, Chrome on a shared laptop at home  
**Subject this week:** Physics — momentum and impulse

> “I don’t need someone to tell me UFC isn’t homework. I need YouTube to start on *my* topic, not on whatever it wants me to watch next.”



### Who she is

Thiri is a capable student, not a cautionary tale. She does well when the task is clear. She uses YouTube the way many IGCSE students do: to hear a concept explained out loud after a dense textbook page. She is not asking to be locked away from the internet. She is asking to keep the reason she opened the laptop.

She is privacy-conscious in a practical way. She does not want an account, a parent feed, a weekly “attention score,” or a tool that watches her all day. If a product feels like it is diagnosing her, she will uninstall it.

### A day in her shoes

- **4:10 p.m.** School ends. She has Physics revision: momentum and impulse.
- **7:20 p.m.** After dinner she opens YouTube to find one clear explanation.
- **7:21 p.m.** Home is already offering compilations and “study with me” livestreams. She did not search yet.
- **7:24 p.m.** She opens a video with “Physics” in the title. It is a fighter’s life story. Playback feels like her decision because she clicked it. It was still the feed’s idea.
- **7:50 p.m.** She has two half-watched clips and no notes. She feels behind. Tomorrow she will say she “got distracted,” as if that were a personality trait.

The missed work is real. The shame is misplaced. The interface won.

### Goals

- Finish a short, honest study sitting.
- Find one video that actually teaches the topic.
- Stay in control: keep watching if she chooses, leave if she chooses.
- Close the laptop without a report being sent to anyone.



### Frustrations

- YouTube Home treats every visit as entertainment, even when she arrived with a syllabus.
- Blockers that ban YouTube also ban the only good explanation she can find.
- Tools that shout “off task!” after she has already clicked feel rude and late.
- A keyword filter would skip *The Most Misunderstood Concept in Physics* (aligned, but no “momentum”) and trust *I Failed Physics, Then Became a UFC Fighter* (off topic, but it says “Physics”).



### What she needs from BrainGrowth

1. **One field, under 15 seconds:** “What are you studying?” and for how long.
2. **Search, not Home:** the session must open on her topic.
3. **Quiet when she is on track.** No badge of honor. No interruption.
4. **Honesty when the title is vague.** “Not sure yet” is better than a fake confident block.
5. **A respectful pause when it looks off-topic.** Explain why. Let her go back to search or keep watching.
6. **A hard stop.** When she taps *I’m done* or the timer ends, nothing is still watching her.



### Success for Thiri

She writes *Study IGCSE Physics — momentum and impulse*, starts a 25-minute sitting, and lands on search. The useful video plays without a lecture. A misleading title pauses once, she chooses, and she gets back. At 25 minutes BrainGrowth is off. She still has notes.

That is a win: not a perfect student, a **kept intention**.

### Who this product is not for

BrainGrowth is not built for:

- parents who want a dashboard of a child’s day;
- schools that want device-wide surveillance;
- users who want YouTube banned;
- a medical or psychological diagnosis of attention.

Those are real markets. They are the wrong market for this problem. Thiri is the user. She starts the session. She ends it. She stays in charge.

---



## 3. How the persona maps to the product


| Thiri’s need             | What BrainGrowth does                                                                  |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Start fast, on her words | One intention field and a duration of 1 minute to 4 hours                              |
| Don’t dump her on Home   | Session opens a YouTube search for her topic                                           |
| Don’t fake intelligence  | Titles are **on topic**, **not sure yet**, or **off topic**                            |
| Don’t punish her         | Uncertain titles stay quiet; off-topic titles can be continued                         |
| Don’t watch her forever  | Observation runs only during an active session and stops when it ends                  |
| Keep her dignity         | Calm language, a reason for the pause, no streaks, no accounts, no parents in the loop |


The locked demo is her exact homework:

1. *The Most Misunderstood Concept in Physics* → on topic
2. *This changed everything* → not sure yet
3. *I Failed Physics, Then Became a UFC Fighter* → off topic

Together they prove the point of the persona: **the student is trying to study, the feed is trying to replace that intention, and a keyword list is not enough to tell the difference.**

---



## 4. One-sentence versions (for forms)

**Problem:** Students open YouTube to study, but Home and recommendations replace their chosen topic before they have made a deliberate choice, and blunt blockers cannot be used because the lesson itself is on YouTube.

**User:** Thiri, a 16-year-old IGCSE student at The Lumbini Mandalay, who needs a short, private, student-started way to keep YouTube on the topic she sat down to study — without being blocked, scored, or watched after she is done.

**Promise:** BrainGrowth is a temporary study contract: it starts you on your search, pauses only when a title looks off-topic, and stops the moment you stop.