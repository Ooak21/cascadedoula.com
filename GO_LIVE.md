# Live

Cut over 2026-08-15. Luis confirmed our site on mobile. Nicole confirmed both branded emails.

Squarespace **site** plan ends 2026-08-16. The **domain** stays at Squarespace Domains until 2027-03-21. Do not cancel the domain.

## Ready

| Piece | Status |
|---|---|
| Faithful static site | Local at `~/cascadedoula.com`, preview http://127.0.0.1:8022/ |
| Own git repo | Yes. Local `main` only. **No GitHub remote yet.** |
| Contact form on the page | Yes. Nicole photo + fields. No popup. |
| Convex | Existing `IBS/cascade-doula` prod `zany-cassowary-596`. Mailer + `/resend-webhook` **deployed**. Form pointed at it. |
| Email copy | Patient: "I got your note" with her picture at the bottom. Nicole: "Someone reached out." Reply-To is the patient. |
| CNAME file | `www.cascadedoula.com` in the repo for Pages |

## Not ready (blocks a DNS flip)

1. **GitHub repo + Pages.** Done. https://github.com/Ooak21/cascadedoula.com Pages from `main` / root. `CNAME` is `www.cascadedoula.com`. Do not flip DNS yet. Do not QA on `ooak21.github.io/cascadedoula.com` (root-relative assets break there). Preview stays http://127.0.0.1:8022/
2. **Convex project.** Already exists on team IBS. Do not make another.
   - Dashboard: https://dashboard.convex.dev/t/IBS/cascade-doula
   - Prod: `zany-cassowary-596` → https://zany-cassowary-596.convex.site/intake
   - Dev: `knowing-gopher-830`
   - Live API is snake_case: `first_name` + email or phone. Table `cascade_leads` is empty.
   - Live functions: `POST /intake`, `POST /resend-webhook`, `intake.create` / `notify` / `admin.recent` / `admin.purgeByEmail`, mailer desk + patient.
   - Env names on prod: `RESEND_API_KEY`, `RESEND_FROM`, `DESK_EMAIL`. Do not make another project.
3. **Resend domain `cascadedoula.com`.** Verified 2026-08-15 on **miguelloza** Pro. Sending ready. Apex MX still Namecheap eforward. **Leave Enable Receiving off.**
4. **Convex secrets.** Set on prod. Values stay in the Convex dashboard, never in git.
5. **Resend webhook.** Still a click in Resend: Webhooks → `https://zany-cassowary-596.convex.site/resend-webhook` (email sent / delivered / bounced). The route is live.

## DNS flip (last)

When Pages is green and Convex answers `/intake`:

- Keep NS at Squarespace Domains / Google Cloud
- Change **A** to GitHub Pages: `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153`
- Change **www CNAME** to `ooak21.github.io`
- Leave MX (Namecheap eforward) and the Google verification TXT
- Leave the Resend DKIM / send-subdomain records alone (already in)

Do not cancel the domain. Do not move MX to Resend unless we later want inbound at Resend.

## From address

From: `Cascade Doula Care <hello@cascadedoula.com>` (verified).
Reply-To: `cascadedoulanl@gmail.com` on patient mail. Reply-To: the patient on Nicole's alert.

## Order of operations

1. Resend domain verified. Sending is ready. Receiving stays off.
2. **Now:** API keys → create a **send-only** key named `cascade-doula`. Do not reuse the restricted Silver Canyon key.
3. Repo exists: https://github.com/Ooak21/cascadedoula.com
4. Pages is on (`main` / root). Custom domain waits for the DNS flip.
5. Link this repo to the existing project (do not create): `npx convex dev --once --configure=existing --team IBS --project cascade-doula` then deploy to **prod** `zany-cassowary-596`. Merge first so we do not wipe `admin.js`.
6. `config.js` already points at `https://zany-cassowary-596.convex.site`. Leave it.
7. `npx convex env set --prod --deployment IBS:cascade-doula:prod RESEND_API_KEY ...` / `RESEND_FROM` / `DESK_EMAIL=cascadedoulanl@gmail.com`
8. Resend → Webhooks → `https://zany-cassowary-596.convex.site/resend-webhook` (email sent / delivered / bounced) **after** that route exists on prod.
9. Submit the contact form once. Nicole gets "Someone reached out." Tester gets "I got your note" with her photo.
10. Then point A / www at Pages. Leave apex MX alone.
