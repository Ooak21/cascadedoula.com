# Cascade Doula Care

Public site for Nicole Lakey. Own repo. GitHub Pages + custom domain.

**Backend is Convex, not Supabase.** The practice needs a BAA. Intake (name, contact, due date, provider, place of delivery) stays on this Convex project. Do not put it on the shared IBS Supabase.

## Local preview

```bash
cd ~/cascadedoula.com
python3 -m http.server 8022
```

Open http://127.0.0.1:8022/

Go-live checklist: `GO_LIVE.md`

## Convex (BAA)

Existing project on team IBS: `cascade-doula`.
Prod HTTP: `https://zany-cassowary-596.convex.site`. Already in `assets/js/config.js`.
Do not run `npx convex dev` in a way that creates a new project. Do not reuse Vitality or Silver Canyon.

```bash
npm install
npx convex dev --once --configure=existing --team IBS --project cascade-doula
```

Secrets (Convex dashboard, never in git):

- `RESEND_API_KEY`
- `RESEND_FROM` (default `Cascade Doula Care <hello@ibs.luisocadiz.online>`)
- `DESK_EMAIL` (`cascadedoulanl@gmail.com`)
- `DESK_CC` (optional, `info@` while testing)

Reply-To on desk mail is the lead, or Nicole.

## Deploy later

1. Create `Ooak21/cascadedoula.com` (or `cascade-doula`)
2. Pages from `main`, root
3. Then, and only then, point Squarespace Domains A / www at Pages
4. Leave MX (Namecheap eforward) and the Google TXT alone

Do not flip DNS until Luis has signed off on this preview.

## Source of the copy

Her live Squarespace words and photos. No invented testimonials or prices.
BRM prices are hers. The birth doula package has no public dollar amount.
