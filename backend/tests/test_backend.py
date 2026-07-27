"""End-to-end backend tests for Skrivestemme."""
import json
import io
import os
import re
import time

import requests

# Long-form Norwegian sample text used across tests
NORSK_SAMPLE = (
    "Han husker lukter best. Lukten av fuktig betong og sigarettrøyk fra oppgangen. "
    "Lukten av blod da han var tolv og måtte se på mens de lærte en mann som skyldte penger. "
    "Lukten av frykt i sin egen munn hver gang han løp hjem til fjerde etasje. "
    "Moren stod ved kjøkkenvinduet og røyka. Hun sa ingenting. Hun spurte aldri. "
    "Det var november og det regna skrått mot ruta. Han satte fra seg skolesekken og gikk inn på rommet sitt. "
    "På veggen hang et bilde av faren, tatt sommeren før han forsvant. Faren smilte skjevt, som om han visste noe. "
    "Gutten sov ikke godt den natten. Han hørte skritt i trappa. Han hørte stemmer. Han holdt pusten."
)


# ---------- Basic health ----------
class TestHealth:
    def test_root(self, base_url, api_client):
        r = api_client.get(f"{base_url}/api/")
        assert r.status_code == 200
        data = r.json()
        assert data.get("ok") is True
        assert data.get("app") == "Skrivestemme"

    def test_models_list(self, base_url, api_client):
        r = api_client.get(f"{base_url}/api/models")
        assert r.status_code == 200
        models = r.json()
        assert isinstance(models, list)
        ids = {m["id"] for m in models}
        expected = {
            "claude-sonnet-4-5", "claude-sonnet-4-6",
            "gpt-5.2", "gpt-5.4",
            "gemini-3-pro", "gemini-3-flash",
        }
        assert expected.issubset(ids), f"Missing models: {expected - ids}"
        # verify shape
        for m in models:
            assert "label" in m and "provider" in m


# ---------- Auth ----------
class TestAuth:
    def test_me_without_session_returns_401(self, base_url, api_client):
        r = api_client.get(f"{base_url}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_invalid_token_returns_401(self, base_url, api_client):
        r = api_client.get(
            f"{base_url}/api/auth/me",
            headers={"Authorization": "Bearer invalid-token-xyz"},
        )
        assert r.status_code == 401

    def test_me_with_valid_session(self, base_url, auth_client, test_user):
        r = auth_client.get(f"{base_url}/api/auth/me")
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user_id"] == test_user["user_id"]
        assert data["email"] == test_user["email"]
        assert data["name"] == "Testforfatter"


# ---------- Samples ----------
class TestSamples:
    def test_create_paste_sample(self, base_url, auth_client):
        payload = {"title": "Testprøve novelle", "content": NORSK_SAMPLE}
        r = auth_client.post(f"{base_url}/api/samples", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert "id" in data and isinstance(data["id"], str)
        assert data["title"] == "Testprøve novelle"
        assert data["source"] == "paste"
        assert data["word_count"] > 0
        assert data["content"] == NORSK_SAMPLE

        # verify persistence via GET list
        r2 = auth_client.get(f"{base_url}/api/samples")
        assert r2.status_code == 200
        samples = r2.json()
        assert any(s["id"] == data["id"] for s in samples)

    def test_create_sample_too_short(self, base_url, auth_client):
        r = auth_client.post(f"{base_url}/api/samples", json={"title": "kort", "content": "abc"})
        assert r.status_code == 400

    def test_upload_txt_sample(self, base_url, test_user):
        # multipart requires no Content-Type: application/json
        s = requests.Session()
        files = {"file": ("proeve.txt", NORSK_SAMPLE.encode("utf-8"), "text/plain")}
        data = {"title": "Opplastet prøve"}
        r = s.post(
            f"{base_url}/api/samples/upload",
            files=files, data=data,
            headers={"Authorization": f"Bearer {test_user['session_token']}"},
        )
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["source"] == "file"
        assert j["filename"] == "proeve.txt"
        assert j["word_count"] > 0
        assert j["content"].startswith("Han husker lukter")

    def test_list_samples_user_isolation(self, base_url, auth_client, other_auth_client):
        # test_user has samples from previous tests; other_user should NOT see them
        r_other = other_auth_client.get(f"{base_url}/api/samples")
        assert r_other.status_code == 200
        assert r_other.json() == []

        r_self = auth_client.get(f"{base_url}/api/samples")
        assert r_self.status_code == 200
        assert len(r_self.json()) >= 1

    def test_delete_sample(self, base_url, auth_client):
        # create then delete
        r = auth_client.post(
            f"{base_url}/api/samples",
            json={"title": "Slett meg", "content": NORSK_SAMPLE + " Ekstra tekst for slettetest."},
        )
        assert r.status_code == 200
        sid = r.json()["id"]

        rd = auth_client.delete(f"{base_url}/api/samples/{sid}")
        assert rd.status_code == 200
        assert rd.json().get("ok") is True

        rl = auth_client.get(f"{base_url}/api/samples")
        assert not any(s["id"] == sid for s in rl.json())

    def test_delete_nonexistent(self, base_url, auth_client):
        r = auth_client.delete(f"{base_url}/api/samples/nonexistent-id")
        assert r.status_code == 404


# ---------- Voice analysis ----------
class TestVoiceAnalysis:
    def test_analyze_requires_samples(self, base_url, other_auth_client):
        r = other_auth_client.post(f"{base_url}/api/voice/analyze")
        assert r.status_code == 400

    def test_analyze_returns_profile(self, base_url, auth_client):
        # ensure at least one sample exists (from TestSamples)
        # add a second longer sample for richer analysis
        auth_client.post(f"{base_url}/api/samples", json={
            "title": "Andre prøve",
            "content": (
                "Gata var stille om kvelden. En bil kjørte forbi. Så en til. "
                "Han tenkte på Anna, hun som gikk ut av leiligheten uten å si adjø. "
                "Radioen spilte lavt inne i kjøkkenet. Kaffen ble kald i koppen. "
                "Ingen ringte den kvelden. Ingen ringte den neste heller."
            )
        })

        r = auth_client.post(f"{base_url}/api/voice/analyze", timeout=120)
        assert r.status_code == 200, r.text
        p = r.json()
        # Statistical fields
        assert p["total_words"] > 0
        assert p["avg_sentence_length"] > 0
        assert p["avg_word_length"] > 0
        assert 0 < p["vocabulary_richness"] <= 1
        assert isinstance(p["top_words"], list) and len(p["top_words"]) > 0
        for tw in p["top_words"]:
            assert "word" in tw and "count" in tw
        assert isinstance(p["sentence_length_distribution"], list)
        assert all("range" in b and "count" in b for b in p["sentence_length_distribution"])
        # Claude-generated fields (real AI output)
        assert isinstance(p.get("tone_description"), str)
        assert isinstance(p.get("style_summary"), str)
        assert isinstance(p.get("signature_phrases"), list)
        # These should be non-empty when Claude successfully analyzed
        assert len(p["tone_description"]) > 5, f"tone_description empty: {p['tone_description']!r}"
        assert len(p["style_summary"]) > 5, f"style_summary empty: {p['style_summary']!r}"
        assert len(p["signature_phrases"]) > 0, "signature_phrases empty"

    def test_get_voice_profile(self, base_url, auth_client):
        r = auth_client.get(f"{base_url}/api/voice/profile")
        assert r.status_code == 200
        p = r.json()
        assert p is not None
        assert p["total_words"] > 0

    def test_get_voice_profile_null_for_new_user(self, base_url, other_auth_client):
        r = other_auth_client.get(f"{base_url}/api/voice/profile")
        assert r.status_code == 200
        assert r.json() is None


# ---------- Generation (SSE) ----------
def _read_sse(base_url, token, body, timeout=120):
    """Read SSE stream and return (deltas, done_seen, errors)."""
    r = requests.post(
        f"{base_url}/api/generate",
        json=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
        },
        stream=True,
        timeout=timeout,
    )
    assert r.status_code == 200, r.text
    deltas = []
    done_seen = False
    errors = []
    for raw in r.iter_lines(decode_unicode=True):
        if not raw:
            continue
        if raw.startswith("data: "):
            try:
                obj = json.loads(raw[6:])
            except json.JSONDecodeError:
                continue
            if "delta" in obj:
                deltas.append(obj["delta"])
            if obj.get("done"):
                done_seen = True
                break
            if "error" in obj:
                errors.append(obj["error"])
    r.close()
    return deltas, done_seen, errors


class TestGenerate:
    def test_generate_prompt_streams(self, base_url, test_user):
        body = {
            "mode": "prompt",
            "text": "En novemberkveld ringte telefonen tre ganger.",
            "model": "claude-sonnet-4-5",
            "humanize_level": 2,
            "length": "kort",
        }
        deltas, done_seen, errors = _read_sse(base_url, test_user["session_token"], body)
        assert not errors, f"Errors in stream: {errors}"
        assert done_seen, "No done event received"
        assert len(deltas) > 0, "No delta tokens received"
        full = "".join(deltas)
        assert len(full) > 30, f"Generated text too short: {full!r}"
        # heuristic Norwegian check: contains at least one common word or æ/ø/å
        assert re.search(r"[æøåÆØÅ]|\b(og|som|han|ikke|det)\b", full, re.IGNORECASE), \
            f"Output doesn't appear Norwegian: {full!r}"

    def test_generate_continue_streams(self, base_url, test_user):
        body = {
            "mode": "continue",
            "text": "Han la på røret og gikk ut på balkongen.",
            "model": "claude-sonnet-4-5",
            "humanize_level": 1,
            "length": "kort",
        }
        deltas, done_seen, errors = _read_sse(base_url, test_user["session_token"], body)
        assert not errors, f"Errors: {errors}"
        assert done_seen
        assert len(deltas) > 0
        assert len("".join(deltas)) > 20

    def test_generate_humanize_streams(self, base_url, test_user):
        body = {
            "mode": "humanize",
            "text": "I en verden der teknologien utvikler seg raskt, er det viktig å merke seg at endringer skjer. Til syvende og sist vil dette påvirke oss alle.",
            "model": "claude-sonnet-4-5",
            "humanize_level": 3,
            "length": "kort",
        }
        deltas, done_seen, errors = _read_sse(base_url, test_user["session_token"], body)
        assert not errors, f"Errors: {errors}"
        assert done_seen
        assert len("".join(deltas)) > 20

    def test_generate_invalid_model(self, base_url, auth_client):
        r = auth_client.post(f"{base_url}/api/generate", json={
            "mode": "prompt",
            "text": "test",
            "model": "unknown-model",
        })
        assert r.status_code == 400

    def test_generate_requires_auth(self, base_url, api_client):
        r = api_client.post(f"{base_url}/api/generate", json={
            "mode": "prompt", "text": "test", "model": "claude-sonnet-4-5",
        })
        assert r.status_code == 401


# ---------- AI detection ----------
class TestDetect:
    def test_detect_ai_markers_lower_score(self, base_url, auth_client):
        ai_text = (
            "I en verden der alt går fort, er det viktig å merke seg at ting endrer seg. "
            "Til syvende og sist må vi tilpasse oss. I lys av dette bør vi handle."
        )
        r = auth_client.post(f"{base_url}/api/detect", json={"text": ai_text})
        assert r.status_code == 200, r.text
        d = r.json()
        assert "score" in d and "label" in d
        assert "burstiness" in d and "vocab_richness" in d
        assert "ai_markers" in d and isinstance(d["ai_markers"], list)
        assert len(d["ai_markers"]) >= 2, f"Expected AI markers to be detected: {d['ai_markers']}"
        ai_score = d["score"]

        human_text = (
            "Han husker lukter best. Fuktig betong. Sigarettrøyk. "
            "Moren stod ved vinduet og røyka. Hun sa ingenting. "
            "Klokka på veggen tikka. Bak den tikka en annen klokke, dypere inne. "
            "November er en måned uten farge, tenkte han, og gikk ut. "
            "Regnet skrått. Trikken bremset. En kvinne løp forbi med paraplyen brukket."
        )
        r2 = auth_client.post(f"{base_url}/api/detect", json={"text": human_text})
        assert r2.status_code == 200
        d2 = r2.json()
        human_score = d2["score"]
        assert human_score > ai_score, \
            f"Human-like text should score higher (got human={human_score} vs ai={ai_score})"

    def test_detect_empty_text(self, base_url, auth_client):
        r = auth_client.post(f"{base_url}/api/detect", json={"text": ""})
        assert r.status_code == 400

    def test_detect_requires_auth(self, base_url, api_client):
        r = api_client.post(f"{base_url}/api/detect", json={"text": "test tekst her"})
        assert r.status_code == 401
