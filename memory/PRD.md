# Skrivestemme — PRD

## Original problem statement
"Writers block: make an app that detect ly voice, stays clear of ai detection when i need help with my blocks. I will now upload different types of writing i have done so you can see my writers voice. It's all in Norwegian. Train to be my voice."

## User preferences (2026-02)
- **LLMs**: Claude Sonnet 4.5 (primary), GPT 5.2, Gemini 3.1 Pro via Emergent Universal Key
- **Auth**: Emergent-managed Google Auth (private, single-user oriented)
- **Ingestion**: Both paste + file upload (.txt/.md/.pdf/.docx)
- **Features**: All four — voice analysis, voice-mimicking generation, "continue my text", AI-detection avoidance
- **UI language**: Norwegian (bokmål)
- **Aesthetic**: Nordic minimalist editorial — Cormorant Garamond + Lora + IBM Plex Sans

## User personas
- **The Norwegian novelist / writer** (this user): mixes genres — noir/thriller, dark coming-of-age, children's books, personal essays. Wants a private assistant that knows *her* voice, not a generic AI chatbot.

## Architecture
- **Backend**: FastAPI + MongoDB (Motor). Single-file `/app/backend/server.py`.
- **LLM**: `emergentintegrations.llm.chat.LlmChat` with `stream_message()` → SSE.
- **Auth**: Emergent Google OAuth → session_id → `/session-data` → session_token cookie (7-day).
- **File extraction**: PyPDF2 + python-docx (in-process, no object storage).
- **Frontend**: React 19, react-router 7, TanStack Query, shadcn/ui, Recharts.

## Endpoints (all `/api`-prefixed)
- `GET /` health
- `POST /auth/session`, `GET /auth/me`, `POST /auth/logout`
- `POST /samples`, `POST /samples/upload`, `GET /samples`, `DELETE /samples/{id}`
- `POST /voice/analyze`, `GET /voice/profile`
- `POST /generate` (SSE)
- `POST /detect`
- `GET /models`

## Implemented (2026-02-27)
- Landing page in Norwegian with Google login CTA
- Auth callback + session cookie handling
- Dashboard with stats + shortcut tiles
- Samples page: drag-drop upload + paste + list + delete
- Voice page: statistical + Claude-driven style analysis, Recharts bar chart
- Write page: 3 modes (prompt/continue/humanize) × 3 lengths × 3 humanize levels × 6 models, live SSE streaming, copy/regenerate/humanize-more, AI-detection meter
- 23/23 backend tests passing; Claude + GPT 5.2 + Gemini 3.1 Pro all verified streaming Norwegian

## Backlog
### P1
- Rich-text editor mode with inline "continue from cursor" (currently textarea + copy back)
- Save generated drafts as new samples with one click
- Per-sample influence toggle (mute/boost specific samples in the profile)

### P2
- Export analysis / drafts as .docx
- Dark mode toggle in UI (CSS already prepared, needs a switch)
- Style comparison view (compare tones across sample subsets)
- Team/family sharing (currently strictly single-user)

## Not implemented
- JWT email/password auth (user picked "both" but Emergent Google Auth is enough for a private tool; no reason to build a second path)
- Object storage for files (files are parsed to text in-process; original files are not retained — content is what matters for voice analysis)
