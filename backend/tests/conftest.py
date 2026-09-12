"""Shared fixtures for Skrivestemme backend tests."""
import os
import time
import uuid
from datetime import datetime, timezone, timedelta

import pytest
import requests
from pymongo import MongoClient
from dotenv import load_dotenv
from pathlib import Path

from .repo import REPO_ROOT

# Load backend .env when one is present. Tidligere pekte denne på en hardkodet
# `/app/backend/.env` som bare fantes i det gamle preview-miljøet.
load_dotenv(REPO_ROOT / "backend" / ".env")

# API-testene trenger en kjørende backend. I CI startes en lokal uvicorn og
# BASE_URL peker på den. Uten BASE_URL hoppes de over i stedet for å feile —
# de skal aldri stille som standard mot produksjon.
BASE_URL = (os.environ.get("BASE_URL") or "").rstrip("/") or None
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")

_NO_API = "Krever kjørende backend: sett BASE_URL, MONGO_URL og DB_NAME"


@pytest.fixture(scope="session")
def base_url():
    if not BASE_URL:
        pytest.skip(_NO_API)
    return BASE_URL


@pytest.fixture(scope="session")
def mongo_db():
    if not (MONGO_URL and DB_NAME):
        pytest.skip(_NO_API)
    c = MongoClient(MONGO_URL)
    db = c[DB_NAME]
    yield db
    c.close()


@pytest.fixture(scope="session")
def test_user(mongo_db):
    """Seed a test user + session in MongoDB. Cleanup after tests."""
    ts = int(time.time())
    user_id = f"test-user-{ts}-{uuid.uuid4().hex[:6]}"
    session_token = f"test_session_{ts}_{uuid.uuid4().hex[:12]}"
    email = f"test.writer.{ts}@example.com"

    mongo_db.users.insert_one({
        "user_id": user_id,
        "email": email,
        "name": "Testforfatter",
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    mongo_db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    yield {"user_id": user_id, "session_token": session_token, "email": email}

    # Cleanup
    mongo_db.users.delete_many({"user_id": user_id})
    mongo_db.user_sessions.delete_many({"session_token": session_token})
    mongo_db.samples.delete_many({"user_id": user_id})
    mongo_db.voice_profiles.delete_many({"user_id": user_id})


@pytest.fixture(scope="session")
def other_user(mongo_db):
    """A second isolated user to test user_id isolation."""
    ts = int(time.time())
    user_id = f"test-user-other-{ts}-{uuid.uuid4().hex[:6]}"
    session_token = f"test_session_other_{ts}_{uuid.uuid4().hex[:12]}"
    email = f"test.writer.other.{ts}@example.com"

    mongo_db.users.insert_one({
        "user_id": user_id,
        "email": email,
        "name": "Andre Testforfatter",
        "picture": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    mongo_db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    yield {"user_id": user_id, "session_token": session_token, "email": email}

    mongo_db.users.delete_many({"user_id": user_id})
    mongo_db.user_sessions.delete_many({"session_token": session_token})
    mongo_db.samples.delete_many({"user_id": user_id})
    mongo_db.voice_profiles.delete_many({"user_id": user_id})


@pytest.fixture
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture
def auth_client(api_client, test_user):
    api_client.headers.update({"Authorization": f"Bearer {test_user['session_token']}"})
    return api_client


@pytest.fixture
def other_auth_client(test_user, other_user):
    s = requests.Session()
    s.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {other_user['session_token']}",
    })
    return s
