import { internalAction } from "./_generated/server";
import { v } from "convex/values";

// Sending domain: hello@cascadedoula.com once Resend verifies it.
// Until then we fall back to the verified IBS send-only address and always set reply_to.
const FROM =
  process.env.RESEND_FROM ||
  "Cascade Doula Care <hello@ibs.luisocadiz.online>";
const DESK = process.env.DESK_EMAIL || "cascadedoulanl@gmail.com";
const DESK_CC = process.env.DESK_CC || "";
const PHOTO =
  process.env.NICOLE_PHOTO_URL ||
  "https://images.squarespace-cdn.com/content/v1/68991f2f4ac3100678a1ceaf/f8eaf005-4c27-447b-96f1-49ac240bb016/IMG_3233.JPG?format=500w";
const LOGO =
  process.env.LOGO_URL ||
  "https://www.cascadedoula.com/assets/img/logo-mauve.png";

const BLUSH = "#e1ccbe";
const PAPER = "#faf6f1";
const CREAM = "#f4ebe3";
const INK = "#2c2424";
const SOFT = "#5c524e";
const MAUVE = "#775c61";
const SERIF = "Georgia, 'Times New Roman', serif";

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

function wrap(inner: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BLUSH}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BLUSH};padding:28px 12px">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:${PAPER};border:1px solid #eadfd4">
  <tr><td style="padding:28px 32px 12px;text-align:center">
    <img src="${esc(LOGO)}" width="72" height="72" alt="Cascade Doula Care" style="width:72px;height:72px;display:inline-block;border:0">
    <div style="font-family:${SERIF};font-size:22px;color:${INK};margin-top:10px">Cascade Doula Care</div>
    <div style="font-family:${SERIF};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${SOFT};margin-top:6px">Santa Cruz &middot; Los Gatos</div>
  </td></tr>
  <tr><td style="padding:8px 32px 28px;color:${INK};font-family:${SERIF}">${inner}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function nicoleSignature() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;border-top:1px solid #eadfd4;padding-top:20px;width:100%">
<tr>
  <td style="vertical-align:top;padding-right:14px;width:72px">
    <img src="${esc(PHOTO)}" alt="Nicole Lakey" width="72" height="72" style="width:72px;height:72px;border-radius:50%;object-fit:cover;object-position:50% 18%;display:block;border:0">
  </td>
  <td style="vertical-align:middle">
    <div style="font-family:${SERIF};font-size:18px;color:${INK}">Nicole Lakey</div>
    <div style="font-size:13px;color:${SOFT};margin-top:2px">Birth Doula &middot; Body Ready Method Pro</div>
    <div style="font-size:13px;color:${SOFT};margin-top:6px">I am glad you wrote. I will be in touch soon.</div>
  </td>
</tr>
</table>`;
}

export function patientHtml(firstName: string) {
  const hi = firstName ? `Hi ${esc(firstName)},` : "Hi,";
  return wrap(`
    <p style="font-size:16px;line-height:1.65;margin:0 0 14px">${hi}</p>
    <p style="font-size:16px;line-height:1.65;color:${SOFT};margin:0 0 14px">Thank you for reaching out to Cascade Doula Care. I received your note and I will read it personally. You do not need to do anything else right now.</p>
    <p style="font-size:16px;line-height:1.65;color:${SOFT};margin:0 0 14px">If you would rather talk live, you can book a consult anytime:</p>
    <p style="margin:0 0 8px"><a href="https://calendly.com/cascadedoulanl/30min" style="display:inline-block;background:${MAUVE};color:${PAPER};text-decoration:none;padding:11px 18px;font-size:14px">Santa Cruz consult</a></p>
    <p style="margin:0 0 18px"><a href="https://calendly.com/cascadedoulanl/60-minute-consultation-clone" style="display:inline-block;background:${CREAM};color:${INK};text-decoration:none;padding:11px 18px;font-size:14px">Los Gatos consult</a></p>
    ${nicoleSignature()}
  `);
}

export function deskHtml(args: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dueDate?: string;
  provider?: string;
  placeOfDelivery?: string;
  about?: string;
  lookingFor: string[];
}) {
  const name = `${args.firstName} ${args.lastName}`.trim();
  const rows: [string, string][] = [];
  if (args.email) rows.push(["Email", args.email]);
  if (args.phone) rows.push(["Phone", args.phone]);
  if (args.dueDate) rows.push(["Due date", args.dueDate]);
  if (args.provider) rows.push(["Provider", args.provider]);
  if (args.placeOfDelivery) rows.push(["Place of delivery", args.placeOfDelivery]);
  if (args.lookingFor.length) rows.push(["Looking for", args.lookingFor.join(", ")]);
  if (args.about) rows.push(["Note", args.about]);
  const table = rows
    .map(
      ([k, v], i) =>
        `<tr><td style="padding:8px 0;border-top:${i ? "1px solid #eadfd4" : "none"};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${SOFT};width:38%;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-top:${i ? "1px solid #eadfd4" : "none"};font-size:15px;color:${INK}">${esc(v)}</td></tr>`,
    )
    .join("");
  return wrap(`
    <p style="font-size:22px;margin:0 0 10px">Someone reached out.</p>
    <p style="font-size:16px;line-height:1.65;color:${SOFT};margin:0 0 18px"><b style="color:${INK}">${esc(name)}</b> sent a note from the website. Reply to this email to write them back.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table>
  `);
}

async function send(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string[];
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, detail: "RESEND_API_KEY not set" };
  const body: Record<string, unknown> = {
    from: FROM,
    to: [opts.to],
    subject: opts.subject,
    html: opts.html,
    reply_to: opts.replyTo || DESK,
  };
  if (opts.cc?.length) body.cc = opts.cc;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "User-Agent": "curl/8.7.1",
    },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, detail: (data as { message?: string }).message || `status ${r.status}` };
  return { ok: true, id: (data as { id?: string }).id };
}

const leadFields = {
  firstName: v.string(),
  lastName: v.string(),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  dueDate: v.optional(v.string()),
  provider: v.optional(v.string()),
  placeOfDelivery: v.optional(v.string()),
  about: v.optional(v.string()),
  lookingFor: v.array(v.string()),
};

export const sendPatientThanks = internalAction({
  args: leadFields,
  handler: async (_ctx, args) => {
    if (!args.email) return { ok: false, detail: "no email" };
    return await send({
      to: args.email,
      subject: "I got your note",
      html: patientHtml(args.firstName),
      replyTo: DESK,
    });
  },
});

export const sendDeskAlert = internalAction({
  args: leadFields,
  handler: async (_ctx, args) => {
    const name = `${args.firstName} ${args.lastName}`.trim();
    return await send({
      to: DESK,
      cc: DESK_CC ? [DESK_CC] : undefined,
      subject: `Someone reached out: ${name}`,
      html: deskHtml(args),
      replyTo: args.email || DESK,
    });
  },
});
