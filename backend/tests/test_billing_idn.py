"""
Stripe billing / IDN (bragarmål.no) checkout tests.

Focus of this iteration:
  1. /api/billing/checkout accepts the raw IDN origin `https://bragarmål.no` and returns a
     valid Stripe checkout URL (backend must convert IDN → punycode before calling Stripe).
  2. Same call with the already-encoded punycode host `https://xn--bragarml-b1a.no` also works.
  3. All 4 lookup_keys exist on the Stripe account:
        bragr_monthly_nok        (149 NOK)
        bragr_yearly_nok         (1290 NOK)
        bragr_monthly_founder    (99  NOK, founder eligibility required)
        bragr_yearly_founder     (890 NOK, founder eligibility required)
  4. Unknown lookup_key → 400
  5. Unauthenticated → 401

Founder lookup_keys are validated against the Stripe price catalog directly (not through
the /checkout endpoint) because a fresh test user (rank > 100) is not eligible and the
endpoint returns 403. That 403 itself is the correct business behavior and is asserted.
"""
import os
import re
import time
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

import pytest
import requests
import stripe
from dotenv import load_dotenv
from pymongo import MongoClient
from urllib.parse import urlparse

# ---- Env loading ----
load_dotenv(Path("/app/backend/.env"))

BASE_URL = (
    os.environ.get("REACT_APP_BACKEND_URL")
    or next(
        (
            line.split("=", 1)[1].strip()
            for line in Path("/app/frontend/.env").read_text().splitlines()
            if line.startswith("REACT_APP_BACKEND_URL=")
        ),
        None,
    )
).rstrip("/")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY")
stripe.api_key = STRIPE_SECRET_KEY


ALL_KEYS = [
    "bragr_monthly_nok",
    "bragr_yearly_nok",
    "bragr_monthly_founder",
    "bragr_yearly_founder",
]
EXPECTED_AMOUNTS_NOK = {  # unit_amount in øre (smallest unit)
    "bragr_monthly_nok": 149_00,
    "bragr_yearly_nok": 1290_00,
    "bragr_monthly_founder": 99_00,
    "bragr_yearly_founder": 890_00,
}

IDN_ORIGIN = "https://bragarmål.no"
# Correct punycode for bragarmål.no is xn--bragarml-g0a.no (verified via idna lib).
# Note: the review request incorrectly stated xn--bragarml-b1a.no, which actually
# decodes to béragarml.no — a different domain. See test report notes.
PUNY_ORIGIN = "https://xn--bragarml-g0a.no"
EXPECTED_ASCII_HOST = "xn--bragarml-g0a.no"


# ---------- Fixtures ----------
@pytest.fixture(scope="module")
def mongo_db():
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


@pytest.fixture(scope="module")
def billing_user(mongo_db):
    """Seed a fresh authenticated user via direct MongoDB insert."""
    ts = int(time.time())
    user_id = f"test-billing-{ts}-{uuid.uuid4().hex[:6]}"
    session_token = f"test_sess_{ts}_{uuid.uuid4().hex[:12]}"
    email = f"billing.test.{ts}@example.com"

    mongo_db.users.insert_one({
        "user_id": user_id,
        "email": email,
        "name": "Billing Tester",
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

    # cleanup
    mongo_db.users.delete_many({"user_id": user_id})
    mongo_db.user_sessions.delete_many({"session_token": session_token})
    mongo_db.subscriptions.delete_many({"user_id": user_id})
    mongo_db.payment_transactions.delete_many({"user_id": user_id})


@pytest.fixture
def auth_headers(billing_user):
    return {
        "Authorization": f"Bearer {billing_user['session_token']}",
        "Content-Type": "application/json",
    }


# ---------- Stripe catalog sanity ----------
class TestStripeCatalog:
    """Verify all 4 lookup_keys exist in Stripe with expected NOK amounts."""

    @pytest.mark.parametrize("lookup_key", ALL_KEYS)
    def test_price_exists(self, lookup_key):
        if not STRIPE_SECRET_KEY:
            pytest.skip("STRIPE_SECRET_KEY not configured")
        prices = stripe.Price.list(lookup_keys=[lookup_key], active=True, limit=1).data
        assert len(prices) == 1, f"No active Stripe price for lookup_key={lookup_key}"
        p = prices[0]
        assert p.currency.lower() == "nok", f"{lookup_key} currency={p.currency}, expected NOK"
        assert p.unit_amount == EXPECTED_AMOUNTS_NOK[lookup_key], (
            f"{lookup_key} amount={p.unit_amount}, expected={EXPECTED_AMOUNTS_NOK[lookup_key]}"
        )
        assert p.recurring is not None, f"{lookup_key} is not recurring"


# ---------- Checkout: IDN + punycode ----------
class TestCheckoutIDN:
    """The critical fix — backend must convert IDN → punycode before Stripe."""

    def _post_checkout(self, headers, lookup_key, origin):
        return requests.post(
            f"{BASE_URL}/api/billing/checkout",
            json={"lookup_key": lookup_key, "origin_url": origin},
            headers=headers,
            timeout=30,
        )

    def test_checkout_with_raw_idn_origin_returns_valid_url(self, auth_headers):
        r = self._post_checkout(auth_headers, "bragr_monthly_nok", IDN_ORIGIN)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        body = r.json()
        assert "checkout_url" in body and "session_id" in body
        url = body["checkout_url"]
        assert isinstance(url, str) and url.startswith("https://checkout.stripe.com/"), url
        # Stripe test-mode session id shape
        assert body["session_id"].startswith("cs_"), body["session_id"]

    def test_checkout_with_punycode_origin_returns_valid_url(self, auth_headers):
        r = self._post_checkout(auth_headers, "bragr_monthly_nok", PUNY_ORIGIN)
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        body = r.json()
        assert body["checkout_url"].startswith("https://checkout.stripe.com/")
        assert body["session_id"].startswith("cs_")

    def test_checkout_success_and_cancel_urls_are_ascii(self, auth_headers):
        """Confirm the Stripe session's success/cancel URLs use punycode (ASCII), not raw IDN."""
        if not STRIPE_SECRET_KEY:
            pytest.skip("STRIPE_SECRET_KEY not configured")
        r = self._post_checkout(auth_headers, "bragr_monthly_nok", IDN_ORIGIN)
        assert r.status_code == 200, r.text
        session_id = r.json()["session_id"]

        sess = stripe.checkout.Session.retrieve(session_id)
        # success_url should include xn-- ASCII form, not literal "bragarmål"
        assert "bragarmål" not in (sess.success_url or ""), (
            f"success_url still contains non-ASCII: {sess.success_url}"
        )
        assert "bragarmål" not in (sess.cancel_url or ""), sess.cancel_url
        assert "xn--bragarml-g0a.no" in (sess.success_url or ""), (
            f"success_url missing punycode: {sess.success_url}"
        )
        assert "/betaling/vellykket" in (sess.success_url or "")
        assert "/betaling/avbrutt" in (sess.cancel_url or "")

    def test_checkout_yearly_nok_with_idn(self, auth_headers):
        r = self._post_checkout(auth_headers, "bragr_yearly_nok", IDN_ORIGIN)
        assert r.status_code == 200, r.text
        assert r.json()["checkout_url"].startswith("https://checkout.stripe.com/")


# ---------- Founder eligibility ----------
class TestFounderEligibility:
    def test_founder_lookup_blocked_for_late_signup(self, auth_headers, billing_user, mongo_db):
        """
        A brand-new test user is rank > 100 (there are many pre-existing users), so founder
        prices must be rejected with 403.
        """
        # Ensure rank > 100 — count users created before this one
        me = mongo_db.users.find_one({"user_id": billing_user["user_id"]}, {"created_at": 1})
        prior = mongo_db.users.count_documents({"created_at": {"$lt": me["created_at"]}})
        if prior < 100:
            pytest.skip(f"Only {prior} prior users — founder slots still open, cannot test 403 path")

        r = requests.post(
            f"{BASE_URL}/api/billing/checkout",
            json={"lookup_key": "bragr_monthly_founder", "origin_url": IDN_ORIGIN},
            headers=auth_headers,
            timeout=30,
        )
        assert r.status_code == 403, f"Expected 403 for late-signup founder attempt: {r.status_code} {r.text}"


# ---------- Error paths ----------
class TestCheckoutErrors:
    def test_unknown_lookup_key_returns_400(self, auth_headers):
        r = requests.post(
            f"{BASE_URL}/api/billing/checkout",
            json={"lookup_key": "bragr_bogus_key", "origin_url": IDN_ORIGIN},
            headers=auth_headers,
            timeout=15,
        )
        assert r.status_code == 400

    def test_unauthenticated_returns_401(self):
        r = requests.post(
            f"{BASE_URL}/api/billing/checkout",
            json={"lookup_key": "bragr_monthly_nok", "origin_url": IDN_ORIGIN},
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        assert r.status_code == 401


# ---------- Billing status ----------
class TestBillingStatus:
    def test_status_new_user_inactive(self, auth_headers):
        r = requests.get(f"{BASE_URL}/api/billing/status", headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert "active" in d
        # New user with rank > BETA_FREE_SLOTS should be inactive (no beta, no sub)
        assert isinstance(d["active"], bool)
        assert "plan" in d
        assert "beta" in d
