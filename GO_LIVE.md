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

## Spam gate (added 2026-08-20)

The form path is proven, but the only submits so far were tests and spam, and every
one of them mailed Nicole and got a branded auto-reply. `/intake` now gates the mail.

**Rule: the row is always saved. Only the email is gated.** A lead is never lost.

Hard signals, no mail at all, bot still gets `{"ok":true}` so it does not retry:
- honeypot `website2` filled (off screen on the contact form)
- `elapsedMs` present and under 3000
- `Origin` missing or not in the allowlist (her two domains plus localhost:8022)

Soft signals, score 3 or more means desk alert with a `[likely spam]` subject and
**no patient auto-reply**, so `hello@cascadedoula.com` never answers a harvested address:
commercial phrase +2, link in message +2, random casing +3, vowelless word +2.

Check what it caught:
```bash
npx convex run admin:spamRecent --prod          # what was blocked, and why
npx convex run admin:recent --prod              # clean only, what Nicole should have got
npx convex run admin:recent --prod '{"includeSpam":true}'
npx convex run admin:checkSpam --prod '{...}'   # dry run the rules, no write, no mail
```

If a mama says she wrote in and Nicole never got the note, look in `spamRecent` first.

Note: `http://127.0.0.1:8022` is allowlisted so local previews are not flagged. That
means **a local form submit sends real mail to Nicole.** Do not submit while previewing.

## Open

- Still no real mama submit. All 8 rows are tests or spam. The 3 old spam rows were
  retro flagged 2026-08-20 (flag only, nothing deleted).
- Add a plain affiliate disclosure on Resources when she asks.
- `mailer.sendPreview` is public and allowlisted to Luis + Nicole. Can make internal later.
