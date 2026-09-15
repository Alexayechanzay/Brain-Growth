# Brain Growth — 90-second demo

This walkthrough is prepared for the **STI AI Competition**. Use the extension on live YouTube when possible. Use the practice site when the room has limited network access or Chrome extension loading is inconvenient.

## One-time setup

1. Open `chrome://extensions`, enable **Developer mode**, and select **Load unpacked**.
2. Choose the project’s `extension/` directory.
3. Pin the **Brain Growth** icon.
4. Use the prefilled intention: `Study IGCSE Physics — momentum and impulse`.
5. Set the duration to approximately two minutes so the session can expire during the presentation if desired.

## Live YouTube path

1. Open the Brain Growth popup and select **Start studying**. YouTube should open on a search for the study intention, not on Home.
2. Open **The Most Misunderstood Concept in Physics**. The status should be **On topic**. Playback continues without an overlay.
3. Open **This changed everything**. The status should be **Not sure yet**. Brain Growth remains quiet because the title does not provide enough evidence.
4. Open **I Failed Physics, Then Became a UFC Fighter**. After approximately two seconds, playback pauses and an overlay explains that the video may not match the study intention. Choose **Back to my search** or **Keep watching**.
5. Optionally search for `gaming` and press Enter. Brain Growth should return the browser to the study search rather than allowing an unrelated search during the active session.
6. Open the popup and select **I'm done**. The overlay and observation stop, and YouTube returns to its normal behavior.

The key explanation is: **a keyword-only tool would miss the first video and might incorrectly trust the third one because it contains the word “Physics.”**

## Practice-site fallback

Open <https://razor-stay-on-topic.netlify.app>, or run the local site described in `README.md`.

1. Select **Start studying** with the same intention and a two-minute duration.
2. Select the three result titles in the same order.
3. On the UFC title, choose **Back to my search** or **Keep watching**.
4. Select **I'm done** to end the session.

## Claims to avoid

Do not describe the title list as a live AI model. The competition build uses deterministic fixtures for the locked examples and a clearly labeled heuristic for other titles. Do not claim that Brain Growth detects every form of distraction. Its narrower promise is to create a temporary study intention and provide a respectful choice when the opened title appears misaligned.

Do not demonstrate with a generic UFC highlights clip first. The third locked title is more persuasive because it contains a misleading subject keyword.

## References

[1]: https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world "Chrome extension development tutorial"
