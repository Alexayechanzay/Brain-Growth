# Brain Growth — product decisions

These decisions define the competition MVP for the **STI AI Competition**. They take priority over earlier concepts when the two conflict.

## Confirmed constraints

| Constraint | Decision |
|---|---|
| Build time | Approximately four hours for the MVP. |
| Required stack | No mandatory workflow platform. Live AI is optional and is not required for the critical demo path. |
| Demo format | Chrome extension plus a simulated YouTube practice site. |
| Authentication and database | None. |
| Excluded features | Accounts, parent dashboards, streaks, chat, and all-day monitoring. |

## Problem definition

The project does not treat the main problem as a learner failing to recognize entertainment after playback has already begun. The more useful problem is earlier: YouTube can replace a learner’s chosen study intention with a recommendation path before the learner makes a deliberate choice.

> Brain Growth creates a temporary, learner-started study contract. It opens an intentional search path and pauses only when an opened video may not match the purpose the learner selected.

This is a choice-architecture problem rather than a claim that the learner cannot recognize distraction.

## Locked MVP shape

1. The primary value is an intention-locked YouTube search entry and a visible session chip.
2. The secondary value is one respectful pause when the opened video looks misaligned. An uncertain result remains quiet; the extension never hard-blocks the learner.
3. The evaluator must handle cases that keyword matching misses: an aligned video without exact topic words and a drifting video that includes a relevant subject word.
4. The start flow uses one intention field and a duration selector. No review screen is required.
5. The extension popup controls the live YouTube loop. The web app is an explainer and standalone simulated backup.
6. Session states are `idle`, `active`, and `ended`. Observation stops as soon as the session ends or expires.
7. The current evaluator uses deterministic demo fixtures plus a labeled heuristic. A future model can implement the same `DriftEvaluation` contract without changing the session flow.

## Locked competition demo

The intention is **Study IGCSE Physics — momentum and impulse**.

| Video | Expected status | Demonstration purpose |
|---|---|---|
| The Most Misunderstood Concept in Physics | `aligned` | Shows that exact topic keywords are not required for an aligned result. |
| This changed everything | `uncertain` | Shows that Brain Growth does not fabricate confidence from an ambiguous title. |
| I Failed Physics, Then Became a UFC Fighter | `drifting` | Shows that a relevant keyword alone does not guarantee alignment. |

UFC-only titles are too easy and should not be used as the lead example.

## Implementation boundary

The Chrome extension stores the active session in `chrome.storage.local` and opens a YouTube search for the learner’s intention. The `web/` directory provides a zero-build static backup. There are no accounts, no live model dependency on the critical path, and no requirement for n8n or another orchestration system.

Internal storage keys and DOM identifiers remain stable for compatibility. User-facing product copy uses the Brain Growth name.

## References

[1]: https://developer.chrome.com/docs/extensions/reference/api/storage "Chrome storage API reference"
