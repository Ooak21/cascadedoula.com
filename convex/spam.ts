// Spam gate for the public /intake endpoint.
//
// Design rule: never lose a real mama. Every submit is stored, always.
// The gate only decides whether we EMAIL, never whether we SAVE.
//
// Hard signals mean a bot, and mean no mail at all.
// Soft signals add up. At 3+ we still alert the desk (subject prefixed) but we
// never send the branded patient auto-reply, so hello@cascadedoula.com never
// answers a harvested address.

export const ALLOWED_ORIGINS = new Set([
  "https://www.cascadedoula.com",
  "https://cascadedoula.com",
  "http://127.0.0.1:8022",
  "http://localhost:8022",
]);

// A human filling name, email, due date, provider, place and a paragraph
// cannot do it in under three seconds.
const MIN_FILL_MS = 3000;

const COMMERCIAL = [
  "seo", "search engine optimi", "backlink", "keyword rank", "first page of google",
  "rank higher", "web traffic", "advertising platform", "marketing agency",
  "lead generation", "grow your business", "digital marketing", "guest post",
  "we can place your", "ahead of competitors", "boost your sales", "increase your revenue",
  "crypto", "bitcoin", "forex", "casino", "loan offer", "make money online",
  "click here to", "unsubscribe", "sex", "viagra",
];

// "y" counts as a vowel on purpose. Treating it as a consonant flags real
// surnames like Krzyzewski and Brzeczyszczykiewicz, and this practice serves
// families of every background. Both rules below are deliberately high
// precision and low recall: the hard signals above do the real work.
const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

// Links are checked separately. Strip them first or "https" reads as a
// vowelless word and every legitimate link looks like machine noise.
function stripUrls(raw: string): string {
  return String(raw || "")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\b\S+\.(com|net|org|ru|xyz|top|info|io|co)\b/gi, " ");
}

function tokens(raw: string): string[] {
  return stripUrls(raw).split(/[^A-Za-z]+/);
}

// "uDyiupjDlegooRKhimRPLol". A human never types this. McDonald and MacArthur
// flip case once, so the bar is three flips in one word.
function hasRandomCasing(raw: string): boolean {
  for (const token of tokens(raw)) {
    if (token.length < 6) continue;
    if (!/[a-z]/.test(token) || !/[A-Z]/.test(token)) continue;
    let caps = 0;
    for (let i = 1; i < token.length; i++) {
      if (token[i] >= "A" && token[i] <= "Z") caps++;
    }
    if (caps >= 3) return true;
  }
  return false;
}

// A word of real length with no vowel at all. Weaker on its own, because a
// mama could write "shhh" or "psst", so this one only ever contributes.
function hasVowellessWord(raw: string): boolean {
  for (const token of tokens(raw)) {
    if (token.length < 4) continue;
    let vowel = false;
    for (const ch of token.toLowerCase()) {
      if (VOWELS.has(ch)) {
        vowel = true;
        break;
      }
    }
    if (!vowel) return true;
  }
  return false;
}

function hasLink(raw: string): boolean {
  return /https?:\/\/|www\.|\.(com|net|org|ru|xyz|top|info)\b/i.test(raw || "");
}

export type Verdict = { spam: boolean; reason?: string; score: number };

export function judge(input: {
  origin: string | null;
  honeypot: string;
  elapsedMs: number | null;
  firstName: string;
  lastName: string;
  about: string;
  provider: string;
  placeOfDelivery: string;
}): Verdict {
  // ---- hard signals: certainly a bot ----
  if (input.honeypot.trim()) {
    return { spam: true, reason: "honeypot filled", score: 99 };
  }
  // Missing elapsed means stale cached JS, which we let through. Present and
  // impossibly fast means a script.
  if (input.elapsedMs !== null && input.elapsedMs < MIN_FILL_MS) {
    return { spam: true, reason: `submitted in ${input.elapsedMs}ms`, score: 99 };
  }
  // A browser always sends Origin on a cross origin POST, and this form is
  // always cross origin (cascadedoula.com -> convex.site). No Origin means
  // curl or a script hitting the endpoint directly.
  if (!input.origin || !ALLOWED_ORIGINS.has(input.origin)) {
    return { spam: true, reason: `origin ${input.origin || "missing"}`, score: 99 };
  }

  // ---- soft signals: add up ----
  let score = 0;
  const reasons: string[] = [];
  const haystack = [input.about, input.provider, input.placeOfDelivery].join(" ").toLowerCase();

  for (const phrase of COMMERCIAL) {
    if (haystack.includes(phrase)) {
      score += 2;
      reasons.push(`phrase "${phrase}"`);
      break;
    }
  }
  if (hasLink(input.about)) {
    score += 2;
    reasons.push("link in message");
  }
  // Random casing is worth the threshold on its own. Nothing a person writes
  // looks like this, and it is what the 08-20 bot submit actually did.
  const named = `${input.firstName} ${input.lastName}`;
  if (hasRandomCasing(named) || hasRandomCasing(input.about)) {
    score += 3;
    reasons.push("random casing");
  }
  if (hasVowellessWord(named) || hasVowellessWord(input.about)) {
    score += 2;
    reasons.push("vowelless word");
  }

  return score >= 3
    ? { spam: true, reason: reasons.join(", "), score }
    : { spam: false, score };
}
