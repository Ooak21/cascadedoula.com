import { internalAction, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const leadWrite = {
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
  userAgent: v.optional(v.string()),
};

export const saveLead = internalMutation({
  args: leadWrite,
  handler: async (ctx, args) => {
    return await ctx.db.insert("cascade_leads", {
      ...args,
      createdAt: Date.now(),
      notified: false,
    });
  },
});

// Claude's live mutation name. Same write, snake_case args so we do not break the deployed API.
export const create = internalMutation({
  args: {
    first_name: v.string(),
    last_name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    edd: v.optional(v.string()),
    provider: v.optional(v.string()),
    birth_place: v.optional(v.string()),
    interests: v.array(v.string()),
    message: v.optional(v.string()),
    source: v.optional(v.string()),
    user_agent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("cascade_leads", {
      createdAt: Date.now(),
      firstName: args.first_name,
      lastName: args.last_name || "",
      email: args.email,
      phone: args.phone,
      dueDate: args.edd,
      provider: args.provider,
      placeOfDelivery: args.birth_place,
      about: args.message,
      lookingFor: args.interests,
      source: args.source || "website",
      userAgent: args.user_agent,
      notified: false,
    });
  },
});

export const getForNotify = internalQuery({
  args: { leadId: v.id("cascade_leads") },
  handler: async (ctx, { leadId }) => ctx.db.get(leadId),
});

export const markNotified = internalMutation({
  args: { leadId: v.id("cascade_leads") },
  handler: async (ctx, { leadId }) => {
    await ctx.db.patch(leadId, { notified: true, notifiedAt: Date.now() });
  },
});

export const notify = internalAction({
  args: { leadId: v.id("cascade_leads") },
  handler: async (ctx, { leadId }) => {
    const lead = await ctx.runQuery(internal.intake.getForNotify, { leadId });
    if (!lead) return { ok: false, detail: "lead not found" };
    const mailArgs = {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      dueDate: lead.dueDate,
      provider: lead.provider,
      placeOfDelivery: lead.placeOfDelivery,
      about: lead.about,
      lookingFor: lead.lookingFor,
    };
    const desk = await ctx.runAction(internal.mailer.sendDeskAlert, mailArgs);
    await ctx.runMutation(internal.intake.logEmail, {
      template: "desk_alert",
      to: "cascadedoulanl@gmail.com",
      subject: `Someone reached out: ${lead.firstName} ${lead.lastName}`.trim(),
      resendId: desk.id,
      ok: !!desk.ok,
      detail: desk.detail,
    });
    if (lead.email) {
      const thanks = await ctx.runAction(internal.mailer.sendPatientThanks, mailArgs);
      await ctx.runMutation(internal.intake.logEmail, {
        template: "patient_thanks",
        to: lead.email,
        subject: "I got your note",
        resendId: thanks.id,
        ok: !!thanks.ok,
        detail: thanks.detail,
      });
    }
    await ctx.runMutation(internal.intake.markNotified, { leadId });
    return { ok: true };
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
