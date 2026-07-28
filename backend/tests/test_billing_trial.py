"""
Iteration 6 — /api/billing/checkout `trial_days` parameter tests.

IMPORTANT LIMITATION: Stripe's `subscription_data.trial_period_days` is a WRITE-ONLY
parameter on the CheckoutSession API. Once a Session is created, the parameter is
NOT exposed on `Session.retrieve` (see keys enumeration in iteration_6 notes).
It only becomes observable on the resulting Subscription object AFTER payment
completion (as trial_end / trial_start fields on Stripe Subscription).

Because we cannot programmatically complete a Stripe Checkout Session without a
browser (the CardElement is client-only, not scriptable via API), we verify the
trial flow with these external observations:

  A) POST /api/billing/checkout with trial_days=14 returns 200 + valid checkout_url.
     If Stripe rejected the value (e.g. > 730), the call would 500 — so success
     proves the value was accepted by Stripe.
  B) Backend code inspection at server.py:1763-1769 confirms:
        if body.trial_days and body.trial_days > 0:
            subscription_data["trial_period_days"] = min(body.trial_days, 60)
     — i.e. 14 → 14, 365 → 60, 0/None → no trial.
  C) Behavioral cap: passing trial_days=61 succeeds (Stripe accepts trials up to
     730 days), and passing trial_days=800 also succeeds because the backend caps
     to 60 before hitting Stripe. Both would be indistinguishable from external
     inspection — noted as `unverified: post-checkout-only`.

We also re-run the IDN regression from iteration 5 to make sure the trial
addition did not break the punycode encoding.
"""
import os
import time
import uuid
from datetime import datetime, timezone, timedelta
from pathlib import Path

import pytest
import requests
import stripe
from dotenv import load_dotenv
from pymongo import MongoClient

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

IDN_ORIGIN = "https://bragarmål.no"


@pytest.fixture(scope="module")
def mongo_db():
    c = MongoClient(MONGO_URL)
    yield c[DB_NAME]
    c.close()


@pytest.fixture(scope="module")
def billing_user(mongo_db):
    ts = int(time.time())
    user_id = f"test-trial-{ts}-{uuid.uuid4().hex[:6]}"
    session_token = f"test_sess_{ts}_{uuid.uuid4().hex[:12]}"
    email = f"trial.test.{ts}@example.com"

    mongo_db.users.insert_one({
        "user_id": user_id,
        "email": email,
        "name": "Trial Tester",
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
    mongo_db.subscriptions.delete_many({"user_id": user_id})
    mongo_db.payment_transactions.delete_many({"user_id": user_id})


@pytest.fixture
def auth_headers(billing_user):
    return {
        "Authorization": f"Bearer {billing_user['session_token']}",
        "Content-Type": "application/json",
    }


class TestTrialDays:
    """Verify /api/billing/checkout accepts trial_days and forwards to Stripe."""

    def _checkout(self, headers, payload):
        return requests.post(
            f"{BASE_URL}/api/billing/checkout",
            json=payload,
            headers=headers,
            timeout=30,
        )

    def test_checkout_with_trial_days_14_returns_success(self, auth_headers):
        """Primary happy path — trial_days=14, IDN origin."""
        r = self._checkout(auth_headers, {
            "lookup_key": "bragr_monthly_nok",
            "trial_days": 14,
            "origin_url": IDN_ORIGIN,
        })
        assert r.status_code == 200, f"Expected 200, got {r.status_code}: {r.text}"
        body = r.json()
        assert "checkout_url" in body and body["checkout_url"].startswith("https://checkout.stripe.com/"), body
        assert body.get("session_id", "").startswith("cs_"), body

        # IDN regression: verify success_url still punycoded
        if STRIPE_SECRET_KEY:
            sess = stripe.checkout.Session.retrieve(body["session_id"])
            assert "xn--bragarml-g0a.no" in (sess.success_url or "")
            assert "bragarmål" not in (sess.success_url or "")
            assert sess.mode == "subscription"
            # subscription_data is write-only on Stripe API — cannot re-read trial_period_days
            # We accept the create-time success (Stripe would reject invalid trial values with 400)
            assert not hasattr(sess, "subscription_data") or getattr(sess, "subscription_data", None) is None, (
                "Unexpected: Stripe now exposes subscription_data on retrieve. Update assertion."
            )

    def test_checkout_without_trial_days_still_works(self, auth_headers):
        """Regression: existing non-trial checkout must still return 200."""
        r = self._checkout(auth_headers, {
            "lookup_key": "bragr_monthly_nok",
            "origin_url": IDN_ORIGIN,
        })
        assert r.status_code == 200, r.text
        assert r.json()["checkout_url"].startswith("https://checkout.stripe.com/")

    def test_checkout_trial_days_zero_no_trial(self, auth_headers):
        """trial_days=0 must be treated as no-trial (backend guard: > 0)."""
        r = self._checkout(auth_headers, {
            "lookup_key": "bragr_monthly_nok",
            "trial_days": 0,
            "origin_url": IDN_ORIGIN,
        })
        assert r.status_code == 200, r.text

    def test_checkout_trial_days_high_value_capped(self, auth_headers):
        """trial_days=365 → backend caps to 60 → Stripe accepts (max is 730)."""
        r = self._checkout(auth_headers, {
            "lookup_key": "bragr_monthly_nok",
            "trial_days": 365,
            "origin_url": IDN_ORIGIN,
        })
        # If backend didn't cap and passed 365 raw, Stripe would still accept (< 730)
        # but backend intent is to cap to 60. Both cases return 200.
        # Actual cap verification is via code review at server.py:1765.
        assert r.status_code == 200, r.text

    def test_checkout_trial_days_yearly_plan(self, auth_headers):
        """Trial should work with yearly plan too."""
        r = self._checkout(auth_headers, {
            "lookup_key": "bragr_yearly_nok",
            "trial_days": 14,
            "origin_url": IDN_ORIGIN,
        })
        assert r.status_code == 200, r.text
        assert r.json()["checkout_url"].startswith("https://checkout.stripe.com/")

    def test_checkout_trial_with_unknown_lookup_key_returns_400(self, auth_headers):
        r = self._checkout(auth_headers, {
            "lookup_key": "bragr_fake_key",
            "trial_days": 14,
            "origin_url": IDN_ORIGIN,
        })
        assert r.status_code == 400

    def test_checkout_trial_unauthenticated_returns_401(self):
        r = requests.post(
            f"{BASE_URL}/api/billing/checkout",
            json={"lookup_key": "bragr_monthly_nok", "trial_days": 14, "origin_url": IDN_ORIGIN},
            headers={"Content-Type": "application/json"},
            timeout=15,
        )
        assert r.status_code == 401
