# Bragr — Product Requirements Document

## Original Problem Statement
An app that detects the user's unique writing voice and helps them overcome writer's block without sounding like generic AI. Users can upload previous writings (text, PDF, DOCX, handwriting photos, voice recordings) to train a personal voice profile. The app provides writing assistance, style matching, and highlights sentences that deviate from the user's authentic voice.

## Branding
- **App name**: Bragr (Norwegian for "poetic art" / "the foremost", from Norse mythology)
- **Domain**: bragarmål.no (purchased Feb 2026)
- **Tagline**: "Vi genererer ikke ord. Vi finner din stemme."
- **Sub-tagline**: "Finn din indre skald."
- **Language**: Norwegian (all UI + user interactions)
- **Design**: Nordic editorial aesthetic — papyrus/off-white, moss green (#4A5D23), rust (#8B4513). No purple gradients or AI slop.

## Philosophy
- Sparring partner, not a text generator
- No auto-writing whole chapters
- Highlights AI-deviation from user's authentic voice
- Click-to-rewrite sentences into user's voice

## Core Features (DONE)
- JWT + Emergent Google Auth
- Samples: paste, upload (PDF/DOCX/TXT), handwriting OCR (Claude Vision), voice transcription (Whisper)
- Voice profile analysis (function words, sentence lengths, top content words)
- AI signature detection with sentence-level color-coded highlighting
- Custom AI Helpers (users can provide own OpenAI/Claude/Gemini API keys)
- Stripe billing: 3 tiers (Beta 3-mo free, Founder, Standard) — TEST MODE
- Info pages: Manifest, Etikk (Ethics), Priser
- Free contact + save alternatives: mailto contact link, Download .txt, Send via mailto
- Norwegian UI throughout

## Tech Stack
- **Frontend**: React + Tailwind + Shadcn UI
- **Backend**: FastAPI + Motor (async MongoDB)
- **DB**: MongoDB
- **Integrations**: Emergent LLM Key (Claude/GPT/Gemini/Whisper), Stripe (test), File & Media storage

## Data Models
- users, samples, voice_profiles, files, subscriptions, helpers, payment_transactions

## Recent Changes (Feb 2026)
- 2026-02-27: Renamed Echo → Bragr across all UI + backend
- 2026-02-27: Added new taglines and Bragr name explanation on Landing hero
- 2026-02-27: Added download .txt, email out, contact footer link
- 2026-02-27: Removed manifest closing lines (redundant with hero)
- 2026-02-27: Removed Grok (xAI) and Resend integrations
- 2026-02-27: Fixed missing @api_router.get decorator on /api/samples
- 2026-02-27: Deployment readiness confirmed (WARN status — performance-only, non-blocking)
- 2026-08-05: Added protected `/tips` page — first entry "Stipend for forfattere" (Stipendportalen search-tips, small legater 10–50k, lokale muligheter). Added Tips-lenke i AppShell-nav. Data-drevet oppsett gjør det lett å legge til flere tips senere.

## Deployment Status
- Preview URL: https://echo-writer-2.preview.emergentagent.com
- **Ready to deploy** via Emergent Deploy button
- User owns bragarmål.no — pending domain link via Emergent → Entri

## Backlog (P1)
- Add paginering to /api/samples, /api/voice/analyze, /api/generate (perf opt after lansering)
- Update Stripe products to `bragr_*` lookup_keys (currently `echo_*`, works fine)
- Update meta tags in index.html to Bragr

## Backlog (P2)
- Modularize server.py (~1900 lines → split into auth/billing/samples/generation modules)
- Custom domain landing (bragarmål.no)
- Norwegian SEO optimization
