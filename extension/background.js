importScripts("evaluate.js");

const SESSION_KEY = "razorSession";
const ALARM_NAME = "razor-session-end";
const OFFSCREEN_URL = "offscreen.html";

async function ensureOffscreen() {
  try {
    const contexts = await chrome.runtime.getContexts({
      contextTypes: ["OFFSCREEN_DOCUMENT"],
    });
    if (contexts && contexts.length > 0) {
      return;
    }
  } catch (error) {
    console.info("[Brain Growth] Could not list audio helper", error);
  }
  try {
    await chrome.offscreen.createDocument({
      url: OFFSCREEN_URL,
      reasons: ["AUDIO_PLAYBACK"],
      justification: "Play short chimes when a study session starts, an off-topic video appears, or the session ends.",
    });
  } catch (error) {
    if (!String(error.message || error).includes("already exists")) {
      console.info("[Brain Growth] Could not open audio helper", error);
    }
  }
}

async function playCue(cue) {
  await ensureOffscreen();
  let lastError = null;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "RAZOR_PLAY",
        target: "offscreen",
        cue: cue,
      });
      if (response && response.ok) {
        return;
      }
      lastError = response && response.error ? response.error : "Audio helper was not ready";
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  console.info("[BrainGrowth] Could not play chime", lastError);
}

function sanitizeDuration(minutes) {
  const value = Math.round(Number(minutes));
  if (!Number.isFinite(value)) {
    return 25;
  }
  return Math.min(240, Math.max(1, value));
}

function createSession(intention, durationMinutes) {
  durationMinutes = sanitizeDuration(durationMinutes);
  const startedAt = new Date();
  const endsAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);
  return {
    id: "session-" + startedAt.getTime().toString(36),
    intention: intention.trim(),
    durationMinutes: durationMinutes,
    startedAt: startedAt.toISOString(),
    endsAt: endsAt.toISOString(),
    status: "active",
  };
}

async function getSession() {
  const stored = await chrome.storage.local.get(SESSION_KEY);
  return stored[SESSION_KEY] || null;
}

async function setSession(session) {
  if (!session) {
    await chrome.storage.local.remove(SESSION_KEY);
    return;
  }
  await chrome.storage.local.set({ [SESSION_KEY]: session });
}

async function startSession(intention, durationMinutes) {
  const session = createSession(intention, durationMinutes);
  await setSession(session);
  await chrome.alarms.clear(ALARM_NAME);
  await chrome.alarms.create(ALARM_NAME, { when: Date.parse(session.endsAt) });
  await playCue("start");
  const url = RazorEvaluate.youtubeSearchUrl(session.intention);
  await chrome.tabs.create({ url: url });
  return session;
}

async function endSession(options) {
  const session = await getSession();
  if (!session) {
    return null;
  }
  if (session.status === "ended") {
    return session;
  }
  const ended = Object.assign({}, session, { status: "ended" });
  await setSession(ended);
  await chrome.alarms.clear(ALARM_NAME);
  if (!options || !options.silent) {
    await playCue("end");
  }
  return ended;
}

chrome.runtime.onInstalled.addListener(() => {
  console.info("[Brain Growth] Extension ready. Nothing is observed until a session starts.");
  ensureOffscreen();
});

chrome.runtime.onStartup.addListener(() => {
  ensureOffscreen();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) {
    return;
  }
  await endSession();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !message.type || message.target === "offscreen") {
    return;
  }

  if (message.type === "RAZOR_START") {
    startSession(message.intention, message.durationMinutes).then(sendResponse);
    return true;
  }

  if (message.type === "RAZOR_STOP") {
    endSession({ silent: Boolean(message.silent) }).then(sendResponse);
    return true;
  }

  if (message.type === "RAZOR_GET") {
    ensureOffscreen();
    getSession().then(sendResponse);
    return true;
  }

  if (message.type === "RAZOR_PLAY") {
    playCue(message.cue).then(function () {
      sendResponse({ ok: true });
    });
    return true;
  }

  if (message.type === "RAZOR_DRIFT_WARNING") {
    const title = message.pageTitle || "unrelated activity";
    chrome.notifications.create("razor-drift-" + Date.now(), {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Hold on — this might not be your topic",
      message:
        "You started: " +
        (message.intention || "") +
        "\nNow: " +
        title,
      priority: 2,
    });
    sendResponse({ ok: true });
    return true;
  }
});
