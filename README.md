# Crux

**AI made deciding cheap. Crux makes it accountable.**

Decision record for the AI era - capture, commit, resolve, reflect.

## Run locally

```bash
npm install
copy .env.example .env.local   # add GROQ_API_KEY (optional)
npm run dev                    # http://localhost:3000
```

## Environment

```env
GROQ_API_KEY=your-key
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_EXTRACT_MODEL=llama-3.1-8b-instant

# Optional — auth + persistence (also set in Vercel, not just .env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Production — your Vercel URL (OAuth redirects + Open Graph)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

Works without Groq or Supabase via graceful fallbacks. Logged-out visitors always see the sample ledger demo.

### Supabase setup

1. Run `supabase/migrations/001_decisions.sql` in the Supabase SQL editor.
2. **Auth → URL Configuration**: Site URL = your Vercel domain; add `http://localhost:3000` and production URL to Redirect URLs.
3. **Auth → Providers → Google**: enable and paste OAuth credentials; add Supabase callback URL to Google Cloud.
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_SITE_URL` in **Vercel** environment variables.
5. Add `https://your-app.vercel.app/auth/callback` to Supabase **Redirect URLs** (alongside localhost).

## Tech

Next.js 16, React 19, Tailwind v4, Groq (Llama 3.1 / 3.3), Supabase (optional).

## Routes

| Route      | Purpose                            |
| ---------- | ---------------------------------- |
| `/`        | Landing                            |
| `/capture` | Paste AI chat → structure decision |
| `/ledger`  | Append-only record                 |
| `/reflect` | Calibration + AI-agreement mirror  |
| `/login`   | Sign in (magic link, password, Google) |
