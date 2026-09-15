chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.target !== "offscreen" || message.type !== "RAZOR_PLAY") {
    return;
  }
  const player = document.getElementById("chime");
  const src = window.BrainGrowthSounds ? window.BrainGrowthSounds.url(message.cue) : "";
  if (!player || !src) {
    sendResponse({ ok: false });
    return;
  }
  player.src = src;
  player.volume = 1;
  const playing = player.play();
  if (playing && playing.then) {
    playing
      .then(function () {
        sendResponse({ ok: true });
      })
      .catch(function (error) {
        if (window.BrainGrowthSounds) {
          window.BrainGrowthSounds.play(message.cue);
        }
        sendResponse({ ok: false, error: String(error) });
      });
    return true;
  }
  sendResponse({ ok: true });
});
