# OUTFYT

Your AI stylist that talks to you before you step out.

## Features

- **Landing page** — Hero, features, how it works, AI intelligence, testimonials, CTA
- **Auth** — Email/password signup & login, Google auth (demo flow)
- **6-step onboarding** — Wardrobe upload/manual text, weather/location, occasion, mood, style, optional selfie
- **AI Stylist** — Primary chat experience with quick actions and outfit cards
- **Outfit Studio** — Generate, regenerate, compare, save looks with confidence scores
- **Wardrobe** — Grid, filters, tabs, AI categorization
- **History** — Searchable sessions, chats, saved looks
- **Saved Looks** — Collections & folders
- **Settings** — Profile, AI personalization, colors, weather, privacy
- **Style memory** — Insights, repeat outfit detection

## Tech Stack

| Layer | Stack |
|-------|--------|
| Frontend | React, Vite, Tailwind CSS v4, Framer Motion, React Router |
| Backend | Node.js, Express, JWT auth |
| Data | JSON file store (dev) — ready to swap for PostgreSQL/Supabase |
| Weather | Open-Meteo API (free) |
| AI Engine | Rule-based wardrobe intelligence + optional OpenAI via `OPENAI_API_KEY` |

## Quick Start

```bash
# Install dependencies
npm install

# Run API + frontend together
npm run dev:all

# Or separately:
npm run server   # http://localhost:3001
npm run dev      # http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) → **Start Styling Now** → sign up → complete onboarding → land on **AI Stylist**.

## API Routes

- `POST /api/auth/signup` · `POST /api/auth/login` · `POST /api/auth/google`
- `GET/POST /api/wardrobe` · `POST /api/wardrobe/upload` · `POST /api/wardrobe/text`
- `POST /api/outfits/generate` · `POST /api/outfits/save` · `GET /api/outfits/memory`
- `POST /api/chat/message` · `GET /api/history`
- `GET /api/saved` · `PATCH /api/user/profile` · `POST /api/user/onboarding`
- `GET /api/weather?city=Jaipur`

## Visual Identity

Minimal, premium, and clean design. Clean typography (Inter font), subtle spacing, soft accent colors only. No heavy glassmorphism, excess blur effects, or over-animations.

## Production Notes

- Set `JWT_SECRET` in environment
- Replace `server/db.js` JSON store with PostgreSQL/Supabase
- Add real Google OAuth (Passport or similar)
- Set `OPENAI_API_KEY` for LLM-powered chat (optional; rule engine works offline)
