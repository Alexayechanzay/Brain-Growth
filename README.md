# Brain Growth

## STI AI Competition project

Brain Growth is a student-started Chrome extension that helps learners use YouTube deliberately during a study session. A learner writes a goal, chooses a time limit, and is sent to a YouTube search for that goal instead of the homepage. If an opened video appears unrelated, Brain Growth pauses briefly and lets the learner choose whether to return to the study search or continue.

The project is designed for the **STI AI Competition**. It demonstrates a focused, privacy-conscious use of AI-assisted decision support without turning study into surveillance. The extension observes only the active YouTube title and search query while a session is running. Observation ends when the learner stops or the timer expires.

The `web/` directory contains a simulated YouTube practice site for judges who cannot load a Chrome extension. It is a demonstration fallback, not a separate product.

## What the demo proves

Use the intention `Study IGCSE Physics — momentum and impulse` and open the following titles in order:

| Video title | Expected result | Why it matters |
|---|---|---|
| The Most Misunderstood Concept in Physics | On topic | The title does not repeat the exact topic keywords, so a simple keyword matcher would miss it. |
| This changed everything | Not sure yet | Brain Growth avoids pretending to be confident when the title is too vague. |
| I Failed Physics, Then Became a UFC Fighter | Off topic | The title includes “Physics,” but the broader meaning does not match the study intention. |

The third example is intentionally a keyword trap. It shows why topic alignment requires more than checking whether one subject word appears in a title.

## Load the Chrome extension

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked** and choose the `extension/` directory.
4. Pin **Brain Growth**, open its popup, and start a study session.
5. After source changes, select **Reload** on the Brain Growth extension card.

## Run the practice site locally

From the project root, run:

```bash
python3 -m http.server 5173 --directory web
```

Then open <http://localhost:5173> and select **Start studying**. The practice site provides the same session flow and the three locked demonstration titles.

A hosted backup is available at <https://razor-stay-on-topic.netlify.app> if the competition environment uses the deployed version.

## Design boundaries

Brain Growth does not require accounts, parent dashboards, streaks, chat, or device-wide monitoring. It does not block YouTube or claim to diagnose attention. The learner remains in control: uncertain titles stay quiet, off-topic titles can be continued, and the extension stops observing as soon as the session ends.

The competition demo uses deterministic fixtures for the three locked titles and a labeled heuristic for other titles. The implementation keeps the evaluation contract replaceable so a future live model could be introduced without changing the session experience. The current demo is intentionally transparent and does not present the fixture set as a production AI model.

## Verification

```bash
node scripts/check-evaluate.mjs
node scripts/check-journey.mjs
```

## Project structure

- `extension/` — Chrome Manifest V3 popup, service worker, content script, and evaluator.
- `web/` — zero-build simulated YouTube experience for the competition demo.
- `scripts/` — repeatable evaluation and journey checks.
- `DEMO.md` — judge-facing 90-second walkthrough.
- `SUBMISSION.md` — copy-ready competition description.
- `DECISIONS.md` — product constraints and implementation rationale.

## References

[1]: https://developer.chrome.com/docs/extensions/develop 
