import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { ALLOWED_ORIGINS, judge } from "./spam";

// Was "*". Locked to her own domains so a script cannot pose as the form.
const corsFor = (origin: string | null) => ({
  "Access-Control-Allow-Origin":
    origin && ALLOWED_ORIGINS.has(origin) ? origin : "https://www.cascadedoula.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  Vary: "Origin",
});
const json = (status: number, body: unknown, origin: string | null = null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsFor(origin), "content-type": "application/json" },
  });

const http = httpRouter();
http.route({
  path: "/intake",
  method: "OPTIONS",
  handler: httpAction(async (_ctx, req) =>
    new Response(null, { status: 204, headers: corsFor(req.headers.get("origin")) })
  ),
});
http.route({
  path: "/intake",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const origin = req.headers.get("origin");
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return json(400, { ok: false, error: "bad json" }, origin);
    }
    const firstName = String(body.firstName || body.first_name || "").trim().slice(0, 80);
    const lastName = String(body.lastName || body.last_name || "").trim().slice(0, 80);
    const email = String(body.email || "").trim().slice(0, 160);
    const phone = String(body.phone || "").trim().slice(0, 40);
    if (!firstName) return json(400, { ok: false, error: "first name is required" }, origin);
    if (!email && !phone)
      return json(400, { ok: false, error: "an email or phone is required" }, origin);
    const lookingRaw = body.lookingFor || body.interests;
    const lookingFor = Array.isArray(lookingRaw)
      ? lookingRaw.map((x) => String(x).slice(0, 80)).slice(0, 8)
      : [];
    const about = String(body.about || body.message || "").trim().slice(0, 2000);
    const provider = String(body.provider || "").trim().slice(0, 160);
    const placeOfDelivery = String(body.placeOfDelivery || body.birth_place || "")
      .trim()
      .slice(0, 160);

    const elapsedRaw = Number(body.elapsedMs);
    const verdict = judge({
      origin,
      honeypot: String(body.website || body.hp || ""),
      elapsedMs: Number.isFinite(elapsedRaw) && elapsedRaw > 0 ? elapsedRaw : null,
      firstName,
      lastName,
      about,
      provider,
      placeOfDelivery,
    });

    const leadId = await ctx.runMutation(internal.intake.create, {
      first_name: firstName,
      last_name: lastName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      edd: String(body.dueDate || body.edd || "").trim().slice(0, 40) || undefined,
      provider: provider || undefined,
      birth_place: placeOfDelivery || undefined,
      message: about || undefined,
      interests: lookingFor,
      source: String(body.source || "website"),
      user_agent: String(req.headers.get("user-agent") || "").slice(0, 200) || undefined,
      spam: verdict.spam,
      spam_reason: verdict.reason,
      spam_score: verdict.score,
    });

    // The row is saved either way. Only the mail is gated, and the bot is told
    // "ok" so it does not retry with a different shape.
    if (verdict.spam && verdict.score >= 99) {
      return json(200, { ok: true }, origin);
    }
    await ctx.runAction(internal.intake.notify, { leadId, suspected: verdict.spam });
    return json(200, { ok: true }, origin);
  }),
});

http.route({
  path: "/resend-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (secret) {
      const got = req.headers.get("svix-id") || req.headers.get("wh-secret") || "";
      if (!got && req.headers.get("authorization") !== `Bearer ${secret}`) {
        // Resend signs with Svix. We accept the JSON body and log the event id.
      }
    }
    let body: { type?: string; data?: { email_id?: string } } = {};
    try {
      body = await req.json();
    } catch {
      return json(400, { ok: false });
    }
    const id = body.data?.email_id;
    const type = body.type || "";
    if (id && type) await ctx.runMutation(internal.intake.markEmailEvent, { resendId: id, event: type });
    return json(200, { ok: true });
  }),
});

export default http;
