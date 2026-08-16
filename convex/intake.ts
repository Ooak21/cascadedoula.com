import { internalMutation, internalAction } from "./_generated/server";
import { v } from "convex/values";

export const saveLead = internalMutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    provider: v.optional(v.string()),
    placeOfDelivery: v.optional(v.string()),
    about: v.optional(v.string()),
    lookingFor: v.array(v.string()),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cascade_leads", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const notifyDesk = internalAction({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    provider: v.optional(v.string()),
    placeOfDelivery: v.optional(v.string()),
    about: v.optional(v.string()),
    lookingFor: v.array(v.string()),
  },
  handler: async (_ctx, args) => {
    const key = process.env.RESEND_API_KEY;
    if (!key) return { sent: false, reason: "no_key" };
    const name = `${args.firstName} ${args.lastName}`.trim();
    const rows = [
      args.email && `Email: ${args.email}`,
      args.phone && `Phone: ${args.phone}`,
      args.dueDate && `EDD: ${args.dueDate}`,
      args.provider && `Provider: ${args.provider}`,
      args.placeOfDelivery && `Place of delivery: ${args.placeOfDelivery}`,
      args.lookingFor.length && `Looking for: ${args.lookingFor.join(", ")}`,
      args.about && `About: ${args.about}`,
    ].filter(Boolean);
    const html = `<div style="font-family:Georgia,serif;color:#2c2424">
      <p>Nicole, a new inquiry landed.</p>
      <p><b>${escapeHtml(name)}</b></p>
      <p>${rows.map((r) => escapeHtml(String(r))).join("<br>")}</p>
    </div>`;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "Cascade Doula Care <hello@ibs.luisocadiz.online>",
        to: [process.env.DESK_EMAIL || "cascadedoulanl@gmail.com"],
        cc: process.env.DESK_CC ? [process.env.DESK_CC] : undefined,
        reply_to: args.email || process.env.DESK_EMAIL || "cascadedoulanl@gmail.com",
        subject: `New Cascade inquiry: ${name}`,
        html,
      }),
    });
    return { sent: r.ok, status: r.status };
  },
});

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
