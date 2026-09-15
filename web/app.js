import { DEMO_INTENTION, DEMO_VIDEOS, evaluate, searchQueryFor } from "./evaluate.js";
import { playCue, unlockAudio } from "./sounds.js";
import {
  clearCooldowns,
  createActiveSession,
  endSession,
  formatCountdown,
  isExpired,
  isOnCooldown,
  loadSession,
  remainingMs,
  saveSession,
  setCooldown,
} from "./session.js";

const root = document.getElementById("app");
const MIN_MINUTES = 1;
const MAX_MINUTES = 240;

const STATUS_LABEL = {
  aligned: "On topic",
  uncertain: "Not sure yet",
  drifting: "Off topic",
};

const EXAMPLE_INTENTIONS = [
  DEMO_INTENTION,
  "Revise IGCSE Biology — cell division",
  "Practice IGCSE Maths — quadratic equations",
];

let durationHours = 0;
let durationMinutes = 25;
let dismissed = {};
let timer = null;
let exampleTimer = null;
let heardEndFor = null;
let heardDriftFor = {};

function parseField(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDurationLabel(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const hourText = hours === 1 ? "1 hour" : `${hours} hours`;
  const minuteText = minutes === 1 ? "1 minute" : `${minutes} minutes`;
  if (hours === 0) {
    return minuteText;
  }
  if (minutes === 0) {
    return hourText;
  }
  return `${hourText} ${minuteText}`;
}

function clampDuration(totalMinutes) {
  return Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, totalMinutes));
}

function setDuration(totalMinutes) {
  const clamped = clampDuration(totalMinutes);
  durationHours = Math.floor(clamped / 60);
  durationMinutes = clamped % 60;
  return clamped;
}

function readDurationFromForm() {
  const hours = parseField(root.querySelector("#hours")?.value, durationHours);
  const minutes = parseField(root.querySelector("#minutes")?.value, durationMinutes);
  return setDuration(hours * 60 + minutes);
}

function syncDurationFields() {
  const hours = root.querySelector("#hours");
  const minutes = root.querySelector("#minutes");
  const preview = root.querySelector("#duration-preview");
  if (hours) {
    hours.value = String(durationHours);
  }
  if (minutes) {
    minutes.value = String(durationMinutes);
  }
  if (preview) {
    preview.textContent = `${formatDurationLabel(durationHours * 60 + durationMinutes)} · up to 4 hours`;
  }
}

function route() {
  return (location.hash || "#/").replace(/^#/, "") || "/";
}

function go(path) {
  location.hash = path;
}

function sessionOrRedirect() {
  const session = hydrate();
  if (!session) {
    go("/start");
    return null;
  }
  if (session.status === "ended") {
    go("/demo/ended");
    return null;
  }
  return session;
}

function hydrate() {
  const session = loadSession();
  if (session && isExpired(session)) {
    const ended = endSession(session);
    saveSession(ended);
    return ended;
  }
  return session;
}

function stopSession() {
  const session = loadSession();
  if (session?.id) {
    heardEndFor = session.id;
  }
  playCue("end");
  if (session) {
    saveSession(endSession(session));
  }
  go("/demo/ended");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function brandLink(extra = "") {
  return `
    <a class="wordmark" href="#/" ${extra}>
      <img class="wordmark__mark" src="./brain-growth-logo.svg" alt="" width="44" height="44" />
      <span>BrainGrowth</span>
    </a>
  `;
}

function renderHome() {
  root.innerHTML = `
    <main class="page">
      <header class="topbar">
        ${brandLink()}
        <nav>
          <a href="#/start">Try it here</a>
          <a href="#extension">Use it on YouTube</a>
        </nav>
      </header>
      <section class="hero">
        <p class="eyebrow">For homework that lives on YouTube</p>
        <h1>Stay on the topic you sat down to study.</h1>
        <p class="lede">
          You need a video for class. Two clicks later you’re somewhere else.
          Brain Growth starts you on a search for <em>your</em> topic, then pauses
          only if what you open looks off. You’re still in charge.
        </p>
        <div class="hero__actions">
          <a class="primary" href="#/start">Start studying</a>
          <a class="ghost" href="#how">How it works</a>
        </div>
      </section>
      <section id="how" class="panel">
        <h2>How a study sitting works</h2>
        <ol class="steps">
          <li>Write what you’re studying. Pick how long.</li>
          <li>You land on search for that topic — not the homepage.</li>
          <li>On-topic videos stay quiet. Vague titles just say “not sure yet.”</li>
          <li>If it looks off-topic, Brain Growth pauses. Go back to search, or keep watching.</li>
          <li>When time’s up, Brain Growth is off. YouTube is normal again.</li>
        </ol>
      </section>
      <section class="split">
        <div class="panel panel--flush">
          <h2>Try the three videos</h2>
          <p>
            Pretend you’re studying <strong>${escapeHtml(DEMO_INTENTION)}</strong>.
            Open these in order — they show Brain Growth reading the title, not just hunting for keywords.
          </p>
          <ul class="demo-list">
            ${DEMO_VIDEOS.map(
              (video) => `
              <li>
                <span class="tag tag--${video.expected}">${STATUS_LABEL[video.expected]}</span>
                <div>
                  <strong>${escapeHtml(video.title)}</strong>
                  <p>${escapeHtml(video.blurb)}</p>
                </div>
              </li>`,
            ).join("")}
          </ul>
        </div>
        <aside class="note">
          <p class="eyebrow">What Brain Growth won’t do</p>
          <p>
            No accounts. No parents watching. No streaks. No blocking the tab.
            It only looks at the video title while you say you’re studying.
          </p>
        </aside>
      </section>
      <section id="extension" class="panel">
        <h2>Use it on real YouTube</h2>
        <p>
          This page is a practice version. The real thing is a Chrome extension
          in the <code>extension</code> folder.
        </p>
        <ol class="steps">
          <li>Go to <code>chrome://extensions</code> and turn on Developer mode.</li>
          <li>Load unpacked, pick the <code>extension</code> folder, then reload it after updates.</li>
          <li>Open the Brain Growth icon, write your topic, tap <strong>Start studying</strong>.</li>
        </ol>
      </section>
    </main>
  `;
}

function stopIntentionExample() {
  if (exampleTimer) {
    window.clearTimeout(exampleTimer);
    exampleTimer = null;
  }
}

function startIntentionExample(input, typedEl, exampleEl) {
  stopIntentionExample();
  let exampleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const sync = () => {
    exampleEl.hidden = input.value.trim().length > 0;
  };

  const step = () => {
    sync();
    if (exampleEl.hidden) {
      exampleTimer = window.setTimeout(step, 400);
      return;
    }
    const current = EXAMPLE_INTENTIONS[exampleIndex];
    if (!deleting) {
      charIndex += 1;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        exampleTimer = window.setTimeout(step, 2200);
        return;
      }
      exampleTimer = window.setTimeout(step, 38);
      return;
    }
    charIndex -= 1;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) {
      deleting = false;
      exampleIndex = (exampleIndex + 1) % EXAMPLE_INTENTIONS.length;
      exampleTimer = window.setTimeout(step, 420);
      return;
    }
    exampleTimer = window.setTimeout(step, 22);
  };

  input.addEventListener("input", sync);
  step();
}

function renderStart() {
  root.innerHTML = `
    <main class="page page--narrow">
      <header class="topbar">
        ${brandLink()}
      </header>
      <h1>What are you studying?</h1>
      <p class="lede">Write it like you’d tell a classmate. Then you land on search for that topic.</p>
      <form class="start-form start-form--compact" id="start-form">
        <label class="sr-only" for="intention">Topic</label>
        <div class="intention-field">
          <textarea id="intention" name="intention" rows="3" autocomplete="off"></textarea>
          <p class="intention-example" id="intention-example" aria-hidden="true">
            <span class="intention-example__prefix">e.g. </span><span id="intention-typed"></span><span class="caret"></span>
          </p>
        </div>
        <p class="duration-label" id="duration-label">For how long?</p>
        <div class="time-pick" role="group" aria-labelledby="duration-label">
          <div class="time-field">
            <button type="button" class="step" data-field="hours" data-delta="-1" aria-label="Less hours">−</button>
            <label>
              <input id="hours" type="number" min="0" max="4" value="${durationHours}" inputmode="numeric" />
              <span>hr</span>
            </label>
            <button type="button" class="step" data-field="hours" data-delta="1" aria-label="More hours">+</button>
          </div>
          <div class="time-field">
            <button type="button" class="step" data-field="minutes" data-delta="-5" aria-label="Less minutes">−</button>
            <label>
              <input id="minutes" type="number" min="0" max="59" value="${durationMinutes}" inputmode="numeric" />
              <span>min</span>
            </label>
            <button type="button" class="step" data-field="minutes" data-delta="5" aria-label="More minutes">+</button>
          </div>
        </div>
        <p id="duration-preview" class="time-preview">${escapeHtml(formatDurationLabel(durationHours * 60 + durationMinutes))} · up to 4 hours</p>
        <p class="privacy">
          Brain Growth only looks at the video title while you study. It stops when you stop.
        </p>
        <p class="form-error" id="error" hidden></p>
        <button class="primary" type="submit">Start studying</button>
      </form>
    </main>
  `;

  root.querySelectorAll(".step").forEach((button) => {
    button.addEventListener("click", () => {
      const delta = Number(button.dataset.delta);
      const field = button.dataset.field;
      const hours = parseField(root.querySelector("#hours").value, durationHours);
      const minutes = parseField(root.querySelector("#minutes").value, durationMinutes);
      if (field === "hours") {
        const nextHours = hours + delta;
        if (nextHours < 0) {
          return;
        }
        setDuration(nextHours * 60 + minutes);
      } else {
        setDuration(hours * 60 + minutes + delta);
      }
      syncDurationFields();
    });
  });

  root.querySelector("#hours").addEventListener("change", () => {
    readDurationFromForm();
    syncDurationFields();
  });
  root.querySelector("#minutes").addEventListener("change", () => {
    readDurationFromForm();
    syncDurationFields();
  });

  startIntentionExample(
    root.querySelector("#intention"),
    root.querySelector("#intention-typed"),
    root.querySelector("#intention-example"),
  );

  root.querySelector("#start-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const intention = root.querySelector("#intention").value.trim();
    const error = root.querySelector("#error");
    if (intention.length < 4) {
      error.hidden = false;
      error.textContent = "Write what you’re studying first.";
      return;
    }
    const totalMinutes = readDurationFromForm();
    syncDurationFields();
    if (totalMinutes < MIN_MINUTES) {
      error.hidden = false;
      error.textContent = "Pick how long you want to study.";
      return;
    }
    clearCooldowns();
    dismissed = {};
    heardDriftFor = {};
    heardEndFor = null;
    saveSession(createActiveSession(intention, totalMinutes));
    playCue("start");
    go("/demo/results");
  });
}

function sessionBar(session) {
  return `
    <header class="session-bar">
      <div>
        <p class="eyebrow">Studying now</p>
        <strong>${escapeHtml(session.intention)}</strong>
      </div>
      <div class="session-bar__meta">
        <span id="countdown">${formatCountdown(remainingMs(session))}</span>
        <button class="ghost ghost--small" id="stop" type="button">I'm done</button>
      </div>
    </header>
  `;
}

function bindSessionChrome() {
  const stop = root.querySelector("#stop");
  if (stop) {
    stop.addEventListener("click", stopSession);
  }
}

function renderSearch() {
  const session = sessionOrRedirect();
  if (!session) {
    return;
  }
  const query = searchQueryFor(session.intention);
  root.innerHTML = `
    <div class="yt">
      ${sessionBar(session)}
      <div class="yt__chrome">
        <div class="yt__logo">▶ Tube</div>
        <div class="yt__search"><span>${escapeHtml(query)}</span></div>
        <p class="yt__mode">Search for your topic — not the homepage.</p>
      </div>
      <div class="yt__layout">
        <section>
          <p class="yt__count">3 results for “${escapeHtml(query)}”</p>
          <ul class="yt__results">
            ${DEMO_VIDEOS.map(
              (video) => `
              <li>
                <a class="yt__card" href="#/demo/watch/${video.id}">
                  <div class="yt__thumb"><span>${video.duration}</span></div>
                  <div>
                    <h2>${escapeHtml(video.title)}</h2>
                    <p>${escapeHtml(video.channel)} · ${escapeHtml(video.views)}</p>
                    <p class="yt__blurb">${escapeHtml(video.blurb)}</p>
                  </div>
                </a>
              </li>`,
            ).join("")}
          </ul>
        </section>
        <aside class="yt__feed">
          <p class="eyebrow">Home would have shown this</p>
          <p class="yt__muted">
            Recommended for you — greyed out on purpose. Brain Growth started you on search
            so the first click is your topic, not a rabbit hole.
          </p>
          <ul>
            <li>Night racing compilation</li>
            <li>You won’t believe this ending</li>
            <li>Study with me, 4 hours</li>
          </ul>
        </aside>
      </div>
    </div>
  `;
  bindSessionChrome();
  root.querySelectorAll(".yt__card").forEach((link) => {
    link.addEventListener("click", () => {
      const id = (link.getAttribute("href") || "").split("/").pop();
      const video = DEMO_VIDEOS.find((item) => item.id === id);
      if (video && video.expected === "drifting" && !heardDriftFor[video.id]) {
        heardDriftFor[video.id] = true;
        playCue("drift");
      }
    });
  });
}

function renderWatch(id) {
  const session = sessionOrRedirect();
  if (!session) {
    return;
  }
  const video = DEMO_VIDEOS.find((item) => item.id === id);
  if (!video) {
    root.innerHTML = `<main class="page"><p>That practice video isn’t here.</p><a href="#/demo/results">Back to search</a></main>`;
    return;
  }
  const evaluation = evaluate(session.intention, { title: video.title });
  const showOverlay =
    evaluation.status === "drifting" && !dismissed[video.id] && !isOnCooldown(video.id);
  const label = STATUS_LABEL[evaluation.status] || "Studying";

  root.innerHTML = `
    <div class="yt yt--watch">
      ${sessionBar(session)}
      <div class="watch">
        <div class="watch__player">
          <p class="watch__kicker">Practice player</p>
          <h1>${escapeHtml(video.title)}</h1>
          <p>${escapeHtml(video.channel)} · ${escapeHtml(video.views)}</p>
          ${
            showOverlay
              ? `
            <div class="overlay" role="dialog" aria-labelledby="drift-title">
              <div class="overlay__card">
                <p class="eyebrow eyebrow--warn">Quick check</p>
                <h2 id="drift-title">This doesn’t look like what you sat down to study.</h2>
                <dl>
                  <div><dt>You started</dt><dd>${escapeHtml(session.intention)}</dd></div>
                  <div><dt>Now playing</dt><dd>${escapeHtml(video.title)}</dd></div>
                  <div><dt>Why we paused</dt><dd>${escapeHtml(evaluation.reason)}</dd></div>
                </dl>
                <div class="overlay__actions">
                  <button class="primary" id="return" type="button">Back to my search</button>
                  <button class="ghost" id="continue" type="button">Keep watching</button>
                </div>
                <p class="overlay__note">You’re in charge. Brain Growth only paused so this is a choice, not a rabbit hole.</p>
              </div>
            </div>`
              : ""
          }
        </div>
        <aside class="watch__side">
          <div class="status-chip status-chip--${evaluation.status}" role="status">
            <span class="status-chip__mark"></span>
            <div>
              <strong>${label}</strong>
              <p>${escapeHtml(session.intention)}</p>
            </div>
          </div>
          <p class="watch__reason">${escapeHtml(evaluation.reason)}</p>
          <a class="ghost" href="#/demo/results">Back to search</a>
        </aside>
      </div>
    </div>
  `;
  bindSessionChrome();
  if (showOverlay && !heardDriftFor[video.id]) {
    heardDriftFor[video.id] = true;
    playCue("drift");
  }
  const back = root.querySelector("#return");
  const cont = root.querySelector("#continue");
  if (back) {
    back.addEventListener("click", () => go("/demo/results"));
  }
  if (cont) {
    cont.addEventListener("click", () => {
      setCooldown(video.id);
      dismissed[video.id] = true;
      render();
    });
  }
}

function renderEnded() {
  const session = loadSession();
  if (session?.id && heardEndFor !== session.id) {
    heardEndFor = session.id;
    playCue("end");
  }
  root.innerHTML = `
    <main class="page page--narrow">
      <header class="topbar">
        ${brandLink('id="home-reset"')}
      </header>
      <p class="eyebrow">Session over</p>
      <h1>Brain Growth is off.</h1>
      <p class="lede">
        ${
          session?.intention
            ? `You were studying “${escapeHtml(session.intention)}.”`
            : "Nothing is being checked."
        }
        YouTube is back to normal.
      </p>
      <div class="hero__actions">
        <a class="primary" href="#/start" id="again">Study again</a>
        <a class="ghost" href="#/" id="story">Back home</a>
      </div>
    </main>
  `;
  const reset = () => {
    clearCooldowns();
    saveSession(null);
    dismissed = {};
    heardDriftFor = {};
    heardEndFor = null;
  };
  root.querySelector("#home-reset").addEventListener("click", reset);
  root.querySelector("#again").addEventListener("click", reset);
  root.querySelector("#story").addEventListener("click", reset);
}

function render() {
  stopIntentionExample();
  const path = route();
  const watch = path.match(/^\/demo\/watch\/([^/]+)/);
  if (path === "/" || path === "") {
    renderHome();
  } else if (path === "/start") {
    renderStart();
  } else if (path === "/demo/results") {
    renderSearch();
  } else if (watch) {
    renderWatch(watch[1]);
  } else if (path === "/demo/ended") {
    renderEnded();
  } else {
    renderHome();
  }
}

function tick() {
  const session = loadSession();
  if (!session || session.status !== "active") {
    return;
  }
  if (isExpired(session)) {
    saveSession(endSession(session));
    go("/demo/ended");
    return;
  }
  const countdown = document.getElementById("countdown");
  if (countdown) {
    countdown.textContent = formatCountdown(remainingMs(session));
  }
}

window.addEventListener("hashchange", render);
window.addEventListener("pointerdown", () => unlockAudio(), { once: true, capture: true });
window.addEventListener("keydown", () => unlockAudio(), { once: true, capture: true });
render();
timer = window.setInterval(tick, 250);
void timer;
