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
```

Works without a key via heuristic fallbacks.

## Tech

Next.js 16, React 19, Tailwind v4, Groq (Llama 3.1 / 3.3).

## Routes

| Route      | Purpose                            |
| ---------- | ---------------------------------- |
| `/`        | Landing                            |
| `/capture` | Paste AI chat → structure decision |
| `/ledger`  | Append-only record                 |
| `/reflect` | Calibration + AI-agreement mirror  |
