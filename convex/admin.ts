import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Names match the functions Claude already deployed. Keep these so dashboard calls do not break.
export const recent = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cascade_leads").withIndex("by_created").order("desc").take(50);
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
