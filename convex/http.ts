import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });

const http = httpRouter();
http.route({
  path: "/intake",
  method: "OPTIONS",
  handler: httpAction(async () => new Response(null, { status: 204, headers: cors })),
});
http.route({
  path: "/intake",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return json(400, { ok: false, error: "bad json" });
    }
    const firstName = String(body.firstName || body.first_name || "").trim().slice(0, 80);
    const lastName = String(body.lastName || body.last_name || "").trim().slice(0, 80);
    const email = String(body.email || "").trim().slice(0, 160);
    const phone = String(body.phone || "").trim().slice(0, 40);
    if (!firstName) return json(400, { ok: false, error: "first name is required" });
    if (!email && !phone) return json(400, { ok: false, error: "an email or phone is required" });
    const lookingRaw = body.lookingFor || body.interests;
    const lookingFor = Array.isArray(lookingRaw)
      ? lookingRaw.map((x) => String(x).slice(0, 80)).slice(0, 8)
      : [];
    const leadId = await ctx.runMutation(internal.intake.create, {
      first_name: firstName,
      last_name: lastName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      edd: String(body.dueDate || body.edd || "").trim().slice(0, 40) || undefined,
      provider: String(body.provider || "").trim().slice(0, 160) || undefined,
      birth_place: String(body.placeOfDelivery || body.birth_place || "").trim().slice(0, 160) || undefined,
      message: String(body.about || body.message || "").trim().slice(0, 2000) || undefined,
      interests: lookingFor,
      source: String(body.source || "website"),
      user_agent: String(req.headers.get("user-agent") || "").slice(0, 200) || undefined,
    });
    await ctx.runAction(internal.intake.notify, { leadId });
    return json(200, { ok: true });
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
