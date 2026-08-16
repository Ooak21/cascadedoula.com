import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";

// From is set on the existing cascade-doula prod env (RESEND_FROM).
const FROM =
  process.env.RESEND_FROM ||
  "Cascade Doula Care <hello@cascadedoula.com>";
const DESK = process.env.DESK_EMAIL || "cascadedoulanl@gmail.com";
const DESK_CC = process.env.DESK_CC || "";

// Hosted on the public repo so they load before DNS flips off Squarespace.
// Square Nicole crop matches the contact page (object-position 50% 18%).
const PHOTO =
  process.env.NICOLE_PHOTO_URL ||
  "https://cdn.jsdelivr.net/gh/Ooak21/cascadedoula.com@main/assets/img/email-nicole.jpg";
const LOGO =
  process.env.LOGO_URL ||
  "https://cdn.jsdelivr.net/gh/Ooak21/cascadedoula.com@main/assets/img/email-logo.png";

const BLUSH = "#e1ccbe";
const PAPER = "#faf6f1";
const CREAM = "#f4ebe3";
const INK = "#2c2424";
const SOFT = "#5c524e";
const MAUVE = "#775c61";
const PLUM = "#5f4c50";
const GOLD = "#edd7ad";
const WHITE = "#ffffff";
const SERIF = "Georgia, 'Iowan Old Style', Palatino, 'Times New Roman', serif";

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

function wrap(inner: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap" rel="stylesheet">
<title>Cascade Doula Care</title>
</head>
<body style="margin:0;padding:0;background:${BLUSH};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">Cascade Doula Care · Santa Cruz and Los Gatos</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BLUSH};margin:0;padding:0">
<tr><td align="center" style="padding:32px 12px 40px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:${PAPER}">
  <tr><td style="height:10px;background:${BLUSH};font-size:0;line-height:0">&nbsp;</td></tr>
  <tr><td style="padding:28px 36px 8px;text-align:center;background:${PAPER}">
    <img src="${esc(LOGO)}" width="92" height="92" alt="Cascade Doula Care" style="width:92px;height:92px;display:inline-block;border:0">
    <div style="font-family:${SERIF};font-size:26px;line-height:1.2;color:${INK};margin-top:10px">Cascade Doula Care</div>
    <div style="font-family:${SERIF};font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:${SOFT};margin-top:8px">Santa Cruz &middot; Los Gatos</div>
  </td></tr>
  <tr><td style="padding:0 36px 8px;background:${PAPER}">
    <div style="height:1px;background:${GOLD};line-height:1px;font-size:0">&nbsp;</div>
  </td></tr>
  <tr><td style="padding:18px 36px 32px;color:${INK};font-family:${SERIF};background:${PAPER}">${inner}</td></tr>
  <tr><td style="padding:16px 36px 22px;background:${CREAM};text-align:center">
    <div style="font-family:${SERIF};font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:${SOFT}">Nicole Lakey</div>
    <div style="font-family:${SERIF};font-size:13px;color:${SOFT};margin-top:4px">Birth Doula &middot; Body Ready Method Pro</div>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function nicolePortrait() {
  return `<table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 18px">
<tr><td align="center">
  <img src="${esc(PHOTO)}" alt="Nicole Lakey" width="168" height="168" style="width:168px;height:168px;border-radius:84px;display:block;border:0;object-fit:cover">
</td></tr>
</table>`;
}

export function patientHtml(firstName: string) {
  const hi = firstName ? `Hi ${esc(firstName)},` : "Hi,";
  return wrap(`
    ${nicolePortrait()}
    <p style="font-family:${SERIF};font-size:28px;line-height:1.25;color:${INK};margin:0 0 14px;text-align:center">${hi}</p>
    <p style="font-family:${SERIF};font-size:16px;line-height:1.7;color:${SOFT};margin:0 0 14px;text-align:center">Thank you for reaching out to Cascade Doula Care. I received your note and I will read it personally. You do not need to do anything else right now.</p>
    <p style="font-family:${SERIF};font-size:16px;line-height:1.7;color:${SOFT};margin:0 0 22px;text-align:center">If you would rather talk live, you can book a consult anytime.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:0 0 10px">
        <a href="https://calendly.com/cascadedoulanl/30min" style="display:inline-block;background:${PLUM};color:${WHITE};text-decoration:none;padding:13px 22px;font-family:${SERIF};font-size:13px;letter-spacing:.08em;text-transform:uppercase">Santa Cruz consult</a>
      </td></tr>
      <tr><td align="center" style="padding:0 0 8px">
        <a href="https://calendly.com/cascadedoulanl/60-minute-consultation-clone" style="display:inline-block;background:${CREAM};color:${INK};text-decoration:none;padding:13px 22px;font-family:${SERIF};font-size:13px;letter-spacing:.08em;text-transform:uppercase">Los Gatos consult</a>
      </td></tr>
    </table>
    <p style="font-family:${SERIF};font-size:15px;line-height:1.6;color:${SOFT};margin:22px 0 0;text-align:center">I am glad you wrote. I will be in touch soon.</p>
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
        `<tr>
          <td style="padding:10px 14px;border-top:${i ? "1px solid #eadfd4" : "none"};font-family:${SERIF};font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:${SOFT};width:36%;vertical-align:top">${esc(k)}</td>
          <td style="padding:10px 14px;border-top:${i ? "1px solid #eadfd4" : "none"};font-family:${SERIF};font-size:15px;color:${INK}">${esc(v)}</td>
        </tr>`,
    )
    .join("");
  return wrap(`
    <p style="font-family:${SERIF};font-size:28px;line-height:1.25;color:${INK};margin:0 0 10px;text-align:center">Someone reached out.</p>
    <p style="font-family:${SERIF};font-size:16px;line-height:1.7;color:${SOFT};margin:0 0 20px;text-align:center"><span style="color:${INK}">${esc(name)}</span> sent a note from the website. Reply to this email to write them back.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${WHITE};border:1px solid #eadfd4">${table}</table>
  `);
}

async function send(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
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
    text: opts.text,
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
      text: `Hi ${args.firstName || ""},\n\nThank you for reaching out to Cascade Doula Care. I received your note and I will read it personally.\n\nSanta Cruz consult: https://calendly.com/cascadedoulanl/30min\nLos Gatos consult: https://calendly.com/cascadedoulanl/60-minute-consultation-clone\n\nNicole Lakey`,
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
      text: `Someone reached out.\n\n${name}\n${args.email || ""}\n${args.phone || ""}\n${args.about || ""}`,
      replyTo: args.email || DESK,
    });
  },
});

const PREVIEW_ALLOW = new Set([
  "hello@luisocadiz.online",
  "luis@innovativeblockchainsolutions.live",
]);

export const sendPreview = action({
  args: { to: v.string() },
  handler: async (_ctx, { to }) => {
    const dest = to.trim().toLowerCase();
    if (!PREVIEW_ALLOW.has(dest)) return { ok: false, detail: "not allowlisted" };
    const sample = {
      firstName: "Luis",
      lastName: "Ocadiz",
      email: dest,
      phone: "preview only",
      dueDate: "",
      provider: "",
      placeOfDelivery: "",
      about: "Branding preview. Not a mama. Safe to ignore.",
      lookingFor: ["Birth Doula"],
    };
    const patient = await send({
      to: dest,
      subject: "I got your note",
      html: patientHtml("Luis"),
      text: "Branding preview of the patient thank-you.",
      replyTo: DESK,
    });
    const desk = await send({
      to: dest,
      subject: "Someone reached out: Luis Ocadiz",
      html: deskHtml(sample),
      text: "Branding preview of Nicole desk alert.",
      replyTo: dest,
    });
    return { ok: !!(patient.ok && desk.ok), patient, desk };
  },
});
