# AGENT_BACKEND.md

Kort referanse for backend-utvikling (for AI-agenter og utviklere)

Formål
- Rask oppskrift for å starte, teste og feilsøke backend-delen lokalt.

Oppsett
- Opprett og aktiver et virtuelt miljø, og installer avhengigheter:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

Kjør applikasjonen (lokalt)

```bash
cd backend
uvicorn backend.server:app --reload --host 0.0.0.0 --port 8000
```

Kjør tester

```bash
cd backend
pytest -q
# eller for kort oppsummering fra agent-skriptet (fra repo-roten):
python scripts/agent_run_tests.py
```

Vanlige miljøvariabler (eksempel)
- `DATABASE_URL` — databaseforbindelse for lokal utvikling (f.eks. sqlite:///./dev.db eller en test-DB)
- `MONGO_URI` — hvis prosjektet bruker MongoDB for session/data
- `SECRET_KEY` — hemmelig for lokale tokens

Tips for agenter
- Ikke endre `backend/pytest.ini` sin `addopts` uten å verifisere CI.
- Mange tester avhenger av seeded autentisering; se [auth_testing.md](../auth_testing.md) før endringer i testdata.

Lenker
- Prosjekt-README: [../README.md](../README.md)
- Auth/test-seed: [../auth_testing.md](../auth_testing.md)
- Bruk domenet for kontekst: https://bragarmål.no
