# Where we are before pointing cascadedoula.com

Today: 2026-08-15. Squarespace **site** plan ends 2026-08-16. The **domain** stays at Squarespace Domains until 2027-03-21.

## Ready

| Piece | Status |
|---|---|
| Faithful static site | Local at `~/cascadedoula.com`, preview http://127.0.0.1:8022/ |
| Own git repo | Yes. Local `main` only. **No GitHub remote yet.** |
| Contact form on the page | Yes. Nicole photo + fields. No popup. |
| Convex code | `convex/http.ts` `/intake` + `/resend-webhook`. Leads + email log. |
| Email copy | Patient: "I got your note" with her picture at the bottom. Nicole: "Someone reached out." Reply-To is the patient. |
| CNAME file | `www.cascadedoula.com` in the repo for Pages |

## Not ready (blocks a DNS flip)

1. **GitHub repo + Pages.** Create `Ooak21/cascadedoula.com`, push `main`, turn on Pages from root. Until that exists there is nothing to point the domain at.
2. **Convex project.** Code is written. `npx convex dev` has not created a deployment. `assets/js/config.js` still has `convexSite: ""`. The form cannot save or send until this is live.
3. **Resend domain `cascadedoula.com`.** Not verified. Sending from `hello@cascadedoula.com` will 403 until Luis adds the TXT/DKIM records Resend gives us at Squarespace Domains. Do **not** change MX. MX stays Namecheap eforward so her existing mail keeps working. We only add SPF + DKIM TXT for sending.
4. **Convex secrets.** After the project exists: `RESEND_API_KEY`, `RESEND_FROM=Cascade Doula Care <hello@cascadedoula.com>` (or the IBS fallback until verify), `DESK_EMAIL=cascadedoulanl@gmail.com`, optional `DESK_CC`, `RESEND_WEBHOOK_SECRET`, `NICOLE_PHOTO_URL` (can stay the Squarespace CDN until Pages is up).
5. **Resend webhook.** Point Resend "emails" webhook at `https://<deployment>.convex.site/resend-webhook` after Convex exists.

## DNS flip (last)

When Pages is green and Convex answers `/intake`:

- Keep NS at Squarespace Domains / Google Cloud
- Change **A** and **www CNAME** only, to GitHub Pages
- Leave MX (Namecheap eforward) and the Google verification TXT
- Add the Resend SPF + DKIM TXT records (sending only)

Do not cancel the domain. Do not move MX to Resend unless we later want inbound at Resend.

## Fallback until her domain verifies

From: `Cascade Doula Care <hello@ibs.luisocadiz.online>` (already verified, send-only).
Reply-To: `cascadedoulanl@gmail.com` on patient mail. Reply-To: the patient on Nicole's alert.

## Order of operations

1. `gh repo create Ooak21/cascadedoula.com --public --source=. --remote=origin --push`
2. Enable GitHub Pages on `main` / root
3. `npx convex dev` (new project, not Vitality)
4. Put the `.convex.site` URL in `assets/js/config.js` and commit
5. `npx convex env set` the secrets
6. Create + verify `cascadedoula.com` in Resend, add TXT records at Squarespace Domains
7. Hook Resend webhook to `/resend-webhook`
8. Submit the contact form once. Confirm Nicole gets "Someone reached out" and the tester gets "I got your note" with her photo
9. Then, and only then, point A / www at Pages
