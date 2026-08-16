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
    const firstName = String(body.firstName || "").trim().slice(0, 80);
    const lastName = String(body.lastName || "").trim().slice(0, 80);
    const email = String(body.email || "").trim().slice(0, 160);
    const phone = String(body.phone || "").trim().slice(0, 40);
    if (!firstName || !(email || phone)) {
      return json(400, { ok: false, error: "name and email or phone required" });
    }
    const lookingFor = Array.isArray(body.lookingFor)
      ? body.lookingFor.map((x) => String(x).slice(0, 80)).slice(0, 8)
      : [];
    const args = {
      firstName,
      lastName,
      email: email || undefined,
      phone: phone || undefined,
      dueDate: String(body.dueDate || "").trim().slice(0, 40) || undefined,
      provider: String(body.provider || "").trim().slice(0, 160) || undefined,
      placeOfDelivery: String(body.placeOfDelivery || "").trim().slice(0, 160) || undefined,
      about: String(body.about || "").trim().slice(0, 2000) || undefined,
      lookingFor,
      source: "website",
    };
    await ctx.runMutation(internal.intake.saveLead, args);
    await ctx.runAction(internal.intake.notifyDesk, {
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      phone: args.phone,
      dueDate: args.dueDate,
      provider: args.provider,
      placeOfDelivery: args.placeOfDelivery,
      about: args.about,
      lookingFor: args.lookingFor,
    });
    return json(200, { ok: true });
  }),
});

export default http;
