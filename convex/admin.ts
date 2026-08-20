import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { judge } from "./spam";

// Names match the functions Claude already deployed. Keep these so dashboard calls do not break.
// Filtering happens in JS, not on the by_spam index, because rows written
// before the gate shipped have spam undefined rather than false.
export const recent = internalQuery({
  args: { includeSpam: v.optional(v.boolean()) },
  handler: async (ctx, { includeSpam }) => {
    const rows = await ctx.db.query("cascade_leads").withIndex("by_created").order("desc").take(200);
    return (includeSpam ? rows : rows.filter((r) => !r.spam)).slice(0, 50);
  },
});

// What the gate caught, and why. Check this if a mama says she wrote in and
// Nicole never got the note.
export const spamRecent = internalQuery({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("cascade_leads").withIndex("by_created").order("desc").take(200);
    return rows
      .filter((r) => r.spam)
      .slice(0, 50)
      .map((r) => ({
        _id: r._id,
        createdAt: r.createdAt,
        name: `${r.firstName} ${r.lastName}`.trim(),
        email: r.email,
        spamReason: r.spamReason,
        spamScore: r.spamScore,
        about: (r.about || "").slice(0, 120),
      }));
  },
});

// Retro flag a row the gate predates. Sets a flag, never deletes.
export const flagAsSpam = internalMutation({
  args: { leadId: v.id("cascade_leads"), reason: v.string() },
  handler: async (ctx, { leadId, reason }) => {
    await ctx.db.patch(leadId, { spam: true, spamReason: reason, spamScore: 99 });
    return { ok: true };
  },
});

export const purgeByEmail = internalMutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const want = email.trim().toLowerCase();
    if (!want) return { deleted: 0 };
    const rows = await ctx.db
      .query("cascade_leads")
      .withIndex("by_email", (q) => q.eq("email", email))
      .collect();
    const extra = await ctx.db.query("cascade_leads").collect();
    const ids = new Set(rows.map((r) => r._id));
    for (const row of extra) {
      if ((row.email || "").trim().toLowerCase() === want) ids.add(row._id);
    }
    for (const id of ids) await ctx.db.delete(id);
    return { deleted: ids.size };
  },
});

// Dry run the real gate with no write and no mail. Use this to prove a change
// to the rules before it ever touches a live submit.
export const checkSpam = internalQuery({
  args: {
    origin: v.optional(v.string()),
    honeypot: v.optional(v.string()),
    elapsedMs: v.optional(v.number()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    about: v.optional(v.string()),
    provider: v.optional(v.string()),
    placeOfDelivery: v.optional(v.string()),
  },
  handler: async (_ctx, a) =>
    judge({
      origin: a.origin ?? null,
      honeypot: a.honeypot ?? "",
      elapsedMs: a.elapsedMs ?? null,
      firstName: a.firstName ?? "",
      lastName: a.lastName ?? "",
      about: a.about ?? "",
      provider: a.provider ?? "",
      placeOfDelivery: a.placeOfDelivery ?? "",
    }),
});
