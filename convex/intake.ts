import { internalMutation } from "./_generated/server";
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

export const logEmail = internalMutation({
  args: {
    template: v.string(),
    to: v.string(),
    subject: v.string(),
    resendId: v.optional(v.string()),
    ok: v.boolean(),
    detail: v.optional(v.string()),
    event: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("cascade_email_log", { ...args, createdAt: Date.now() });
  },
});

export const markEmailEvent = internalMutation({
  args: { resendId: v.string(), event: v.string() },
  handler: async (ctx, { resendId, event }) => {
    const rows = await ctx.db
      .query("cascade_email_log")
      .withIndex("by_resend", (q) => q.eq("resendId", resendId))
      .collect();
    for (const row of rows) await ctx.db.patch(row._id, { event });
  },
});
