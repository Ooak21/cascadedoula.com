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
  }).index("by_created", ["createdAt"]),
});
