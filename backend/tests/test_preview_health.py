"""
Preview environment health/smoke test.

Verifies preview environment is healthy after user reported production being slow.
- Auth via cookie (POST /api/auth/login)
- Response times measured for critical endpoints
- Character CRUD verified
- Protected pages load with logged-in session
"""
import os
import time
from pathlib import Path

import pytest
import requests

# Resolve BASE_URL from frontend .env (source of truth for preview URL)
BASE_URL = None
fe_env = Path("/app/frontend/.env").read_text()
for line in fe_env.splitlines():
    if line.startswith("REACT_APP_BACKEND_URL="):
        BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
        break
assert BASE_URL, "REACT_APP_BACKEND_URL not found"

EMAIL = "editortest2@bragarmal.no"
PASSWORD = "Test1234!"

# Perf thresholds
FRONTEND_MAX = 3.0
SAMPLES_MAX = 2.0
MANUSCRIPT_MAX = 1.5
CHARACTERS_MAX = 1.5
HARD_FAIL_MAX = 5.0


@pytest.fixture(scope="module")
def logged_in_session():
    s = requests.Session()
    r = s.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": EMAIL, "password": PASSWORD},
        timeout=10,
    )
    assert r.status_code == 200, f"Login failed: {r.status_code} {r.text}"
    assert "session_token" in s.cookies, "session_token cookie not set on login"
    yield s


class TestSupervisorAndBasics:
    def test_frontend_root_loads_fast(self):
        t = time.perf_counter()
        r = requests.get(f"{BASE_URL}/", timeout=10)
        dt = time.perf_counter() - t
        assert r.status_code == 200, f"Frontend root returned {r.status_code}"
        assert len(r.text) > 100, "Frontend root HTML unexpectedly small"
        assert dt < FRONTEND_MAX, f"Frontend root took {dt:.2f}s (>{FRONTEND_MAX}s)"
        print(f"[perf] GET / -> 200 in {dt:.2f}s (bytes={len(r.text)})")

    def test_login_endpoint_responds(self, logged_in_session):
        # fixture already asserted login worked
        assert logged_in_session.cookies.get("session_token")


class TestPerformance:
    def test_samples_endpoint_perf(self, logged_in_session):
        t = time.perf_counter()
        r = logged_in_session.get(f"{BASE_URL}/api/samples", timeout=10)
        dt = time.perf_counter() - t
        assert r.status_code == 200, f"/api/samples returned {r.status_code}"
        assert dt < HARD_FAIL_MAX, f"/api/samples took {dt:.2f}s (>{HARD_FAIL_MAX}s hard fail)"
        assert dt < SAMPLES_MAX, f"/api/samples took {dt:.2f}s (>{SAMPLES_MAX}s soft fail)"
        assert isinstance(r.json(), list)
        print(f"[perf] GET /api/samples -> 200 in {dt:.2f}s (n={len(r.json())})")

    def test_manuscript_endpoint_perf(self, logged_in_session):
        t = time.perf_counter()
        r = logged_in_session.get(f"{BASE_URL}/api/manuscript", timeout=10)
        dt = time.perf_counter() - t
        assert r.status_code == 200, f"/api/manuscript returned {r.status_code}"
        assert dt < HARD_FAIL_MAX, f"/api/manuscript took {dt:.2f}s (>{HARD_FAIL_MAX}s hard fail)"
        assert dt < MANUSCRIPT_MAX, f"/api/manuscript took {dt:.2f}s (>{MANUSCRIPT_MAX}s soft fail)"
        print(f"[perf] GET /api/manuscript -> 200 in {dt:.2f}s")

    def test_characters_endpoint_perf(self, logged_in_session):
        t = time.perf_counter()
        r = logged_in_session.get(f"{BASE_URL}/api/characters", timeout=10)
        dt = time.perf_counter() - t
        assert r.status_code == 200, f"/api/characters returned {r.status_code}"
        assert dt < HARD_FAIL_MAX, f"/api/characters took {dt:.2f}s (>{HARD_FAIL_MAX}s hard fail)"
        assert dt < CHARACTERS_MAX, f"/api/characters took {dt:.2f}s (>{CHARACTERS_MAX}s soft fail)"
        assert isinstance(r.json(), list)
        print(f"[perf] GET /api/characters -> 200 in {dt:.2f}s (n={len(r.json())})")


class TestProtectedPagesLoad:
    """Frontend routes are SPA — root HTML served regardless. Check 200 + non-empty."""

    @pytest.mark.parametrize(
        "path", ["/manuskript", "/karakterer", "/skriv", "/prover", "/stemme"]
    )
    def test_page_renders(self, logged_in_session, path):
        t = time.perf_counter()
        r = logged_in_session.get(f"{BASE_URL}{path}", timeout=10)
        dt = time.perf_counter() - t
        assert r.status_code == 200, f"GET {path} returned {r.status_code}"
        assert len(r.text) > 200, f"GET {path} HTML too small ({len(r.text)} bytes)"
        assert dt < FRONTEND_MAX, f"GET {path} took {dt:.2f}s"
        print(f"[perf] GET {path} -> 200 in {dt:.2f}s (bytes={len(r.text)})")


class TestCharactersCRUD:
    def test_character_create_list_delete(self, logged_in_session):
        # CREATE
        t = time.perf_counter()
        r = logged_in_session.post(
            f"{BASE_URL}/api/characters",
            json={"name": "TESTPerson_HealthCheck"},
            timeout=10,
        )
        dt_create = time.perf_counter() - t
        assert r.status_code == 200, f"POST /api/characters -> {r.status_code} {r.text}"
        created = r.json()
        assert created["name"] == "TESTPerson_HealthCheck"
        assert "id" in created and created["id"]
        char_id = created["id"]
        print(f"[perf] POST /api/characters -> 200 in {dt_create:.2f}s id={char_id}")

        try:
            # LIST includes it
            r2 = logged_in_session.get(f"{BASE_URL}/api/characters", timeout=10)
            assert r2.status_code == 200
            ids = [c.get("id") for c in r2.json()]
            assert char_id in ids, "Newly created character not in list"

            # PATCH update
            r3 = logged_in_session.patch(
                f"{BASE_URL}/api/characters/{char_id}",
                json={"role": "Testrolle"},
                timeout=10,
            )
            assert r3.status_code == 200, f"PATCH -> {r3.status_code} {r3.text}"
            assert r3.json().get("role") == "Testrolle"
        finally:
            # DELETE (cleanup)
            r4 = logged_in_session.delete(
                f"{BASE_URL}/api/characters/{char_id}", timeout=10
            )
            assert r4.status_code == 200, f"DELETE -> {r4.status_code} {r4.text}"

        # Verify removed
        r5 = logged_in_session.get(f"{BASE_URL}/api/characters", timeout=10)
        assert r5.status_code == 200
        assert char_id not in [c.get("id") for c in r5.json()]
