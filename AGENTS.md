AGENTS.md
===========

Kort guide for AI-kodingassistenter (på norsk)

Formål
- Gi rask, handlingsorientert kontekst for AI-agenter slik at de kan jobbe effektivt i dette repoet.
- Hold innholdet minimalt — pek til eksisterende dokumentasjon for detaljer.

Viktige kommandoer
- Frontend (React/CRACO):

  - Install: `cd frontend && npm install` eller `yarn install`
  - Dev: `cd frontend && npm start` eller `yarn start`
  - Prod-build: `cd frontend && npm run build` eller `yarn build`

- Backend (Python):

  - Oppsett: `python -m venv .venv && source .venv/bin/activate && pip install -r backend/requirements.txt`
  - Kjør utvikling: `uvicorn backend.server:app --reload --host 0.0.0.0 --port 8000`
  - Test: `cd backend && pytest`

Hvor viktig informasjon finnes (lenker)
- Prosjekt-README: [README.md](README.md)
- Frontend README og scripts: [frontend/package.json](frontend/package.json) og [frontend/README.md](frontend/README.md)
- Backend server og krav: [backend/server.py](backend/server.py), [backend/requirements.txt](backend/requirements.txt), [backend/pytest.ini](backend/pytest.ini)
- Backend-tester: [backend/tests/test_backend.py](backend/tests/test_backend.py) (eksempel på teststruktur)
- Auth / test-seed: [auth_testing.md](auth_testing.md)
- Hjelpeskript: [scripts/make_favicons.py](scripts/make_favicons.py)
- Tidligere testresultater: [test_reports/pytest/pytest_results.xml](test_reports/pytest/pytest_results.xml)

Kort arkitektur-notat
- Frontend: Create React App (CRACO) i `frontend/` med komponenter i `frontend/src/components`.
- Backend: Python/ASGI (FastAPI-liknende struktur) i `backend/`.
- Tester: Pytest for backend (konfig i `backend/pytest.ini`).

Vanlige fallgruver for agenter
- Ikke endre `backend/pytest.ini` sitt `addopts` uten å verifisere CI; xdist-innstillinger brukes i CI.
- Mange tester forutsetter seeded autentisering — se `auth_testing.md` før du endrer testdata.

Prod-url / domene
- Bruk dette domenet i kontekst og lenker når relevant: https://bragarm%C3%A5l.no

Forslag til videre agent-tilpasninger
- Opprett en kort `backend/AGENT_BACKEND.md` med lokale dev-kommandoer og env-vars hvis ønskelig.
- Lag en liten skill som kan kjøre `cd backend && pytest -q` og presentere feilmeldinger kort.

Verktøy for agenter
- Rask test-kjører: `python scripts/agent_run_tests.py` — kjører backend-tester og skriver kort sammendrag.


Kontakt og tilbakemelding
- Hvis noe er uklart, be om mer spesifikk info eller ønsket format for instruksjonene.
