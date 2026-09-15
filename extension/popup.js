const EXAMPLE_INTENTIONS = [
  "Study IGCSE Physics — momentum and impulse",
  "Revise IGCSE Biology — cell division",
  "Practice IGCSE Maths — quadratic equations",
];

const idleView = document.getElementById("idle");
const activeView = document.getElementById("active");
const endedView = document.getElementById("ended");
const intentionInput = document.getElementById("intention");
const intentionExample = document.getElementById("intention-example");
const intentionTyped = document.getElementById("intention-typed");
const errorEl = document.getElementById("error");
const activeIntention = document.getElementById("active-intention");
const endedIntention = document.getElementById("ended-intention");
const countdownEl = document.getElementById("countdown");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const durationPreview = document.getElementById("duration-preview");

const MIN_MINUTES = 1;
const MAX_MINUTES = 240;

let tick = null;
let exampleTimer = null;

function syncIntentionExample() {
  intentionExample.hidden = intentionInput.value.trim().length > 0;
}

function startIntentionExample() {
  if (exampleTimer) {
    window.clearTimeout(exampleTimer);
  }
  let exampleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const step = () => {
    syncIntentionExample();
    if (intentionExample.hidden) {
      exampleTimer = window.setTimeout(step, 400);
      return;
    }
    const current = EXAMPLE_INTENTIONS[exampleIndex];
    if (!deleting) {
      charIndex += 1;
      intentionTyped.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        exampleTimer = window.setTimeout(step, 2200);
        return;
      }
      exampleTimer = window.setTimeout(step, 38);
      return;
    }
    charIndex -= 1;
    intentionTyped.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) {
      deleting = false;
      exampleIndex = (exampleIndex + 1) % EXAMPLE_INTENTIONS.length;
      exampleTimer = window.setTimeout(step, 420);
      return;
    }
    exampleTimer = window.setTimeout(step, 22);
  };

  step();
}

intentionInput.addEventListener("input", syncIntentionExample);
startIntentionExample();

function parseField(input, fallback) {
  const value = Number.parseInt(String(input.value), 10);
  return Number.isFinite(value) ? value : fallback;
}

function formatDurationLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourText = hours === 1 ? "1 hour" : hours + " hours";
  const minuteText = minutes === 1 ? "1 minute" : minutes + " minutes";
  if (hours === 0) {
    return minuteText;
  }
  if (minutes === 0) {
    return hourText;
  }
  return hourText + " " + minuteText;
}

function writeDuration(totalMinutes) {
  const clamped = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, totalMinutes));
  hoursInput.value = String(Math.floor(clamped / 60));
  minutesInput.value = String(clamped % 60);
  durationPreview.textContent = formatDurationLabel(clamped) + " · up to 4 hours";
  return clamped;
}

function readDuration() {
  const hours = parseField(hoursInput, 0);
  const minutes = parseField(minutesInput, 0);
  return writeDuration(hours * 60 + minutes);
}

document.querySelectorAll(".step").forEach((button) => {
  button.addEventListener("click", () => {
    const delta = Number(button.dataset.delta);
    const field = button.dataset.field;
    const hours = parseField(hoursInput, 0);
    const minutes = parseField(minutesInput, 0);
    if (field === "hours") {
      const nextHours = hours + delta;
      if (nextHours < 0) {
        return;
      }
      writeDuration(nextHours * 60 + minutes);
      return;
    }
    writeDuration(hours * 60 + minutes + delta);
  });
});

hoursInput.addEventListener("change", readDuration);
minutesInput.addEventListener("change", readDuration);

function remainingMs(session) {
  if (!session || session.status !== "active" || !session.endsAt) {
    return 0;
  }
  return Math.max(0, Date.parse(session.endsAt) - Date.now());
}

function formatCountdown(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return hours + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }
  return minutes + ":" + String(seconds).padStart(2, "0");
}

function show(view) {
  idleView.hidden = view !== "idle";
  activeView.hidden = view !== "active";
  endedView.hidden = view !== "ended";
}

function stopTick() {
  if (tick) {
    window.clearInterval(tick);
    tick = null;
  }
}

function render(session) {
  stopTick();
  if (!session || session.status === "idle") {
    show("idle");
    return;
  }
  if (session.status === "ended") {
    show("ended");
    endedIntention.textContent = session.intention
      ? "You were studying “" + session.intention + ".”"
      : "";
    return;
  }

  show("active");
  activeIntention.textContent = session.intention;
  const update = () => {
    const left = remainingMs(session);
    countdownEl.textContent = formatCountdown(left);
    if (left <= 0) {
      stopTick();
      chrome.runtime.sendMessage({ type: "RAZOR_GET" }, render);
    }
  };
  update();
  tick = window.setInterval(update, 250);
}

document.getElementById("start").addEventListener("click", () => {
  const intention = intentionInput.value.trim();
  if (intention.length < 4) {
    errorEl.hidden = false;
    errorEl.textContent = "Write what you're studying first.";
    return;
  }
  const durationMinutes = readDuration();
  if (durationMinutes < MIN_MINUTES) {
    errorEl.hidden = false;
    errorEl.textContent = "Pick how long you want to study.";
    return;
  }
  errorEl.hidden = true;
  chrome.runtime.sendMessage(
    { type: "RAZOR_START", intention: intention, durationMinutes: durationMinutes },
    render,
  );
});

document.getElementById("stop").addEventListener("click", () => {
  if (window.BrainGrowthSounds) {
    window.BrainGrowthSounds.play("end");
  }
  chrome.runtime.sendMessage({ type: "RAZOR_STOP", silent: true }, render);
});

document.getElementById("again").addEventListener("click", () => {
  show("idle");
});

chrome.runtime.sendMessage({ type: "RAZOR_GET" }, render);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.razorSession) {
    render(changes.razorSession.newValue || null);
  }
});
