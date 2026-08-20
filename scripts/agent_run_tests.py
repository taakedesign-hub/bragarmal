#!/usr/bin/env python3
"""En enkel agent-hjelper som kjører backend-tester og gir et kort sammendrag.

Kjør fra repo-roten med:

    python scripts/agent_run_tests.py

Den kjører `pytest -q` i `backend/` og skriver ut en kort statuslinje.
"""
import re
import subprocess
import sys
from pathlib import Path


def run_pytest():
    backend_dir = Path(__file__).resolve().parents[1] / "backend"
    cmd = [sys.executable, "-m", "pytest", "-q"]
    try:
        proc = subprocess.run(cmd, cwd=str(backend_dir), capture_output=True, text=True, check=False)
    except Exception as e:
        print(f"Feil ved kjøring av pytest: {e}")
        return 2

    out = proc.stdout + "\n" + proc.stderr

    # Finn pytest-sammendragslinjen, f.eks. "== 3 passed, 1 failed in 0.12s =="
    m = re.search(r"=+\s*(.*?)\s*in\s*[0-9\.]+s\s*=+", out, re.DOTALL)
    if m:
        summary = m.group(1).strip()
    else:
        # Fallback: se etter 'failed' eller 'passed'
        found = re.findall(r"(\d+\s+failed|\d+\s+passed|\d+\s+error|\d+\s+errors)", out)
        summary = ", ".join(found) if found else "Ingen klar pytest-sammendrag funnet"

    print("Backend-tests (backend/):", summary)

    # Hvis det er feil, skriv kort feilstub
    if proc.returncode != 0:
        # Ta de siste 2000 tegn fra output for rask feilsjekk
        tail = out.strip()[-2000:]
        print("\n--- Kort feilsammendrag (siste output) ---\n")
        print(tail)

    return proc.returncode


if __name__ == "__main__":
    rc = run_pytest()
    sys.exit(rc)
