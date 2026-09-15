# Brain Growth — STI AI Competition submission copy

The following text is ready to adapt for the **STI AI Competition** submission form.

## Name

Brain Growth

## Tagline

Keeps YouTube aligned with the topic you sat down to study.

## One sentence

Brain Growth is a student-started Chrome extension that opens YouTube on a study-goal search and pauses only when an opened title appears off-topic, then stops observing when the session ends.

## Problem

Students often need YouTube for schoolwork, but the homepage and recommendation surfaces can replace a chosen study intention with an unrelated feed before the student makes a deliberate choice. A conventional blocker is too broad because the lesson itself may be on YouTube. A late warning that says “this is not physics” is also weak because it merely restates what the student can already see.

## What we built

Brain Growth provides a single-field start flow for a study intention and a custom duration from one minute to four hours. It opens YouTube on the intention search rather than Home, keeps unrelated searches from replacing that path during the active session, and evaluates opened titles as **on topic**, **not sure yet**, or **off topic**. For a likely mismatch, playback pauses after a short delay and the student can return to the study search or continue watching. When the student ends the session or the timer expires, observation stops.

The `web/` directory provides a simulated YouTube backup for judges who cannot load the extension.

## Locked demo

Intention: **Study IGCSE Physics — momentum and impulse**

1. *The Most Misunderstood Concept in Physics* → on topic, although it does not include the exact momentum or impulse keywords.
2. *This changed everything* → not sure yet, because the title is too vague to support a confident decision.
3. *I Failed Physics, Then Became a UFC Fighter* → off topic, even though it contains the word “Physics.”

This sequence demonstrates why title alignment needs broader judgment than simple keyword matching.

## What we intentionally excluded

The MVP has no accounts, parent controls, streaks, chat, diagnosis, device-wide monitoring, required review screen, or hard blocking. Brain Growth is a temporary learner-controlled intervention, not a surveillance dashboard.

## Stack

Chrome Manifest V3 extension with a popup, service worker, content script, and deterministic evaluator. The project also includes a zero-build static practice site in `web/`. The current competition demo uses locked fixtures and a labeled heuristic rather than pretending that a live model is running.

## Links and files

| Resource | Location |
|---|---|
| Practice site | <https://razor-stay-on-topic.netlify.app> |
| Extension | Load the `extension/` directory as unpacked in Chrome |
| Demo walkthrough | [`DEMO.md`](DEMO.md) |
| Product decisions | [`DECISIONS.md`](DECISIONS.md) |
| Project instructions | [`README.md`](README.md) |

## Built by

Aye Chan Zay

Yaung Ni Lin

La Yaung Naing

## References

[1]: https://developer.chrome.com/docs/extensions/ "Chrome Extensions documentation"
