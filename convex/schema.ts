import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Intake only. This project stays on Convex because the practice needs a BAA.
// Do not move these records to the shared Supabase project.
export default defineSchema({
  cascade_leads: defineTable({
    createdAt: v.number(),
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
    notified: v.optional(v.boolean()),
    notifiedAt: v.optional(v.number()),
  })
    .index("by_created", ["createdAt"])
    .index("by_email", ["email"]),
  cascade_email_log: defineTable({
    createdAt: v.number(),
    template: v.string(),
    to: v.string(),
    subject: v.string(),
    resendId: v.optional(v.string()),
    ok: v.boolean(),
    detail: v.optional(v.string()),
    event: v.optional(v.string()),
  }).index("by_created", ["createdAt"])
    .index("by_resend", ["resendId"]),
});
