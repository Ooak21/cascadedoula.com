# Cascade Doula Care is live

Cut over 2026-08-15. Luis confirmed the site on mobile 2026-08-16. Nicole confirmed both branded emails.

Public: https://www.cascadedoula.com/
Repo: https://github.com/Ooak21/cascadedoula.com (`main`, Pages root, HTTPS enforced)
Convex: existing `IBS/cascade-doula` prod `zany-cassowary-596`. Do not create another.
Intake: `https://zany-cassowary-596.convex.site/intake`
Webhook: `https://zany-cassowary-596.convex.site/resend-webhook`

## Leave alone

- Domain registrar: Squarespace Domains until 2027-03-21. Do not cancel.
- NS: `ns-cloud-d1`–`d4.googledomains.com`
- Apex A: GitHub `185.199.108.153` `185.199.109.153` `185.199.110.153` `185.199.111.153`
- www CNAME: `ooak21.github.io`
- MX: Namecheap eforward
- Resend DKIM + `send.cascadedoula.com` MX (bounces only). Receiving off.
- Google verification TXT

## Mail

From: `Cascade Doula Care <hello@cascadedoula.com>` (miguelloza Pro, verified).
Patient: "I got your note" + Nicole photo. Reply-To Nicole.
Desk: "Someone reached out." Reply-To the mama. `DESK_EMAIL=cascadedoulanl@gmail.com`.

Secrets live only on Convex prod env: `RESEND_API_KEY`, `RESEND_FROM`, `DESK_EMAIL`.

## Open

- First real contact-form submit still pending (branding sends used `mailer.sendPreview`).
- Add a plain affiliate disclosure on Resources when she asks.
- `mailer.sendPreview` is public and allowlisted to Luis + Nicole. Can make internal later.
