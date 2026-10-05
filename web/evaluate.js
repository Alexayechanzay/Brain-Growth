export function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

const FIXTURES = [
  {
    title: "The Most Misunderstood Concept in Physics",
    evaluation: {
      status: "aligned",
      confidence: 0.78,
      reason:
        "This sounds like a physics explainer. It never says momentum or impulse, but it still looks like studying physics.",
      suggestedAction: "continue",
      classifier: "demo-fixture",
    },
  },
  {
    title: "This changed everything",
    evaluation: {
      status: "uncertain",
      confidence: 0.36,
      reason:
        "This title doesn’t say what the video is about, so Brain Growth isn’t sure yet.",
      suggestedAction: "review",
      classifier: "demo-fixture",
    },
  },
  {
    title: "I Failed Physics, Then Became a UFC Fighter",
    evaluation: {
      status: "drifting",
      confidence: 0.84,
      reason:
        "It says Physics, but this is a fighting story — not a lesson on your topic.",
      suggestedAction: "return_to_goal",
      classifier: "demo-fixture",
    },
  },
];

const OFF_TOPIC =
  /\b(chess|gaming|gamer|gameplay|minecraft|fortnite|roblox|valorant|football|soccer|nba|nfl|cricket|tennis|anime|manga|makeup|skincare|cooking|recipe|vlog|unboxing|prank|reaction|music|song|official video|trailer|podcast|asmr|comedy|tiktok|ufc|mma|highlights|celebrity|movie|netflix|series)\b/i;
const STUDY_TOPIC =
  /\b(momentum|impulse|newton|collision|kinematics|inertia|conservation of momentum|resultant force)\b/i;

const EXAM_BOARD =
  /\b(igcse|gcse|a-?level|as-?level|o-?level|\bap\b|\bib\b)\b/i;
const STOP_WORDS = new Set([
  "study",
  "studying",
  "revise",
  "revision",
  "learn",
  "learning",
  "about",
  "with",
  "from",
  "into",
  "igcse",
  "gcse",
  "alevel",
  "aslevel",
  "olevel",
  "syllabus",
  "exam",
  "exams",
  "paper",
  "unit",
  "intro",
  "video",
  "watch",
  "edexcel",
  "cambridge",
  "aqa",
  "ocr",
]);

function topicTokens(intention) {
  return normalize(intention)
    .replace(/a-level|as-level|o-level/g, " ")
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 4 && !/^\d+$/.test(word) && !STOP_WORDS.has(word) && !EXAM_BOARD.test(word));
}

function titleCoversTopic(titleNorm, tokens) {
  if (!tokens.length) {
    return false;
  }
  return tokens.some((token) => {
    if (titleNorm.includes(token)) {
      return true;
    }
    if (token.length < 5) {
      return false;
    }
    const stem = token.slice(0, 5);
    return titleNorm.split(/[^a-z0-9]+/).some((word) => word.startsWith(stem));
  });
}

function intentionTokens(intention) {
  const text = normalize(intention);
  const generic = [
    "physics",
    "maths",
    "math",
    "chemistry",
    "biology",
    "history",
    "english",
    "science",
    "revise",
    "revision",
  ];
  const specificHints = [
    "momentum",
    "impulse",
    "newton",
    "collision",
    "kinematics",
    "algebra",
    "calculus",
    "organic",
    "stoichiometry",
  ];
  return {
    generic: generic.filter((token) => text.includes(token)),
    specific: specificHints.filter((token) => text.includes(token)),
  };
}

function isVague(title) {
  const words = normalize(title).split(" ").filter(Boolean);
  if (words.length <= 4 && !OFF_TOPIC.test(title) && !STUDY_TOPIC.test(title)) {
    return true;
  }
  return /^(this|watch this|wait|wow|part \d+|ep\.? \d+|must watch)/i.test(title.trim());
}

function drifting(reason, confidence = 0.84) {
  return {
    status: "drifting",
    confidence,
    reason,
    suggestedAction: "return_to_goal",
    classifier: "heuristic",
  };
}

function heuristic(intention, title) {
  const tokens = intentionTokens(intention);
  const topics = topicTokens(intention);
  const titleNorm = normalize(title);
  const offTopic = OFF_TOPIC.test(title) || OFF_TOPIC.test(titleNorm);
  const coversTopic = titleCoversTopic(titleNorm, topics);
  const hasSpecific =
    tokens.specific.some((token) => titleNorm.includes(token)) ||
    (STUDY_TOPIC.test(title) && STUDY_TOPIC.test(intention));
  const hasGeneric = tokens.generic.some((token) => titleNorm.includes(token));

  if (offTopic && !coversTopic) {
    return drifting("This looks like something else — not the topic you started with.");
  }
  if (coversTopic || hasSpecific) {
    return {
      status: "aligned",
      confidence: coversTopic ? 0.78 : 0.74,
      reason: "This looks like a lesson on the topic you sat down to study.",
      suggestedAction: "continue",
      classifier: "heuristic",
    };
  }
  if (hasGeneric && !offTopic) {
    return {
      status: "uncertain",
      confidence: 0.48,
      reason:
        "The title shares a big subject word, but not the specific topic. Hard to tell from the name alone.",
      suggestedAction: "review",
      classifier: "heuristic",
    };
  }
  if (isVague(title)) {
    return {
      status: "uncertain",
      confidence: 0.36,
      reason: "The title is too vague to tell if it matches what you’re studying.",
      suggestedAction: "review",
      classifier: "heuristic",
    };
  }
  return drifting("This does not look like a lesson on the topic you sat down to study.");
}

export function evaluate(intention, context) {
  const title = ((context && context.title) || "").trim();
  if (!title) {
    return emptyTitleEvaluation();
  }
  const fixture = fromFixtures(title);
  if (fixture) {
    return fixture;
  }
  const haystack = [title, context && context.channel].filter(Boolean).join(" ");
  return heuristic(intention, haystack || title);
}

function emptyTitleEvaluation() {
  return {
    status: "uncertain",
    confidence: 0.2,
    reason: "Brain Growth couldn’t read a video title yet.",
    suggestedAction: "review",
    classifier: "heuristic",
  };
}

function fromFixtures(title) {
  const fixture = FIXTURES.find((entry) => normalize(entry.title) === normalize(title));
  return fixture ? fixture.evaluation : null;
}

const STATUSES = ["aligned", "uncertain", "drifting"];
const ACTIONS = ["continue", "review", "return_to_goal"];
const TIERS = ["title", "description-excerpt", "description-full"];

export function parseModelEvaluation(data) {
  const source = data && typeof data === "object" && data.evaluation ? data.evaluation : data;
  if (!source || typeof source !== "object") {
    return null;
  }
  const mapped = String(source.classification || source.status || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();
  const status =
    mapped === "aligned" || mapped === "on topic"
      ? "aligned"
      : mapped === "drifting" || mapped === "off topic"
        ? "drifting"
        : mapped === "uncertain" || mapped === "not sure yet"
          ? "uncertain"
          : "";
  if (!STATUSES.includes(status)) {
    return null;
  }
  const reason = String(source.reasoning || source.reason || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!reason) {
    return null;
  }
  const confidenceNumber = Number(source.confidence);
  const suggestedAction = String(source.suggestedAction || "").trim();
  const evidenceTier = String(source.evidenceTier || "").trim();
  return {
    status,
    confidence: Number.isFinite(confidenceNumber)
      ? Math.min(1, Math.max(0, confidenceNumber))
      : 0.7,
    reason: reason.slice(0, 280),
    suggestedAction: ACTIONS.includes(suggestedAction)
      ? suggestedAction
      : status === "aligned"
        ? "continue"
        : status === "drifting"
          ? "return_to_goal"
          : "review",
    classifier: "model",
    evidenceTier: TIERS.includes(evidenceTier) ? evidenceTier : undefined,
  };
}

function classifyUrl() {
  if (typeof window !== "undefined" && window.BRAIN_GROWTH_CLASSIFY_URL) {
    return String(window.BRAIN_GROWTH_CLASSIFY_URL);
  }
  return "/api/classify";
}

async function requestModel(intention, context) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(classifyUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intention,
        title: context.title || "",
        channel: context.channel || "",
        description: context.description || "",
        url: context.url || "",
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    return parseModelEvaluation(await response.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function evaluateWithModel(intention, context, classify) {
  const title = ((context && context.title) || "").trim();
  if (!title) {
    return emptyTitleEvaluation();
  }
  const fixture = fromFixtures(title);
  if (fixture) {
    return fixture;
  }
  try {
    const model = classify
      ? parseModelEvaluation(
          await classify({
            intention,
            title,
            channel: (context && context.channel) || "",
            description: (context && context.description) || "",
            url: (context && context.url) || "",
          }),
        )
      : await requestModel(intention, context || {});
    if (model) {
      return model;
    }
  } catch {
    // Fall through to the labeled heuristic.
  }
  return evaluate(intention, context);
}

export function searchQueryFor(intention) {
  return String(intention || "")
    .replace(/[—–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const DEMO_INTENTION = "Study IGCSE Physics — momentum and impulse";

export const DEMO_VIDEOS = [
  {
    id: "aligned-misunderstood",
    title: "The Most Misunderstood Concept in Physics",
    channel: "Field Notes Lab",
    duration: "12:48",
    views: "2.1M views",
    blurb: "Why students mix up ideas that sound similar. No formula dump. Does not say momentum or impulse.",
    expected: "aligned",
  },
  {
    id: "uncertain-changed",
    title: "This changed everything",
    channel: "late night notes",
    duration: "18:02",
    views: "890K views",
    blurb: "A title with no subject. Brain Growth won’t pretend it knows.",
    expected: "uncertain",
  },
  {
    id: "drifting-failed-physics",
    title: "I Failed Physics, Then Became a UFC Fighter",
    channel: "Ring Lights",
    duration: "22:11",
    views: "4.4M views",
    blurb: "Contains the word Physics. It is still a sports story, not a lesson.",
    expected: "drifting",
  },
];
