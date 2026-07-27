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

# Load backend .env for MongoDB credentials
load_dotenv(Path("/app/backend/.env"))

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if "REACT_APP_BACKEND_URL" in os.environ else None
if not BASE_URL:
    # fetch from frontend .env
    fe = Path("/app/frontend/.env").read_text()
    for line in fe.splitlines():
        if line.startswith("REACT_APP_BACKEND_URL="):
            BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
            break

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]


@pytest.fixture(scope="session")
def base_url():
    assert BASE_URL, "BASE_URL not configured"
    return BASE_URL


@pytest.fixture(scope="session")
def mongo_db():
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
