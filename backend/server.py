"""
Skrivestemme — Backend
Norsk skriveassistent som lærer brukerens stemme og hjelper med skrivesperre.
"""
import os
import io
import uuid
import logging
import re
import json
import asyncio
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

import httpx
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, UploadFile, File, Form
from fastapi.responses import StreamingResponse, JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone, ImageContent
from emergentintegrations.llm.openai import OpenAISpeechToText

# Extraction libs
from PyPDF2 import PdfReader
from docx import Document as DocxDocument


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Mongo
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI(title="Skrivestemme")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ---------- Models ----------
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


SAMPLE_CATEGORIES = {
    "ren_menneske_gammel": "Ren menneske · gamle tekster",
    "ren_menneske_ny": "Ren menneske · nye tekster",
    "hybrid": "Hybrid · AI-start + tung redigering",
    "ren_ai": "Ren AI",
    "melding": "Uformelt · meldinger/notater",
}

HUMAN_CATEGORIES = {"ren_menneske_gammel", "ren_menneske_ny", "melding"}


class Sample(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    content: str
    source: Literal["paste", "file", "handwriting", "audio"] = "paste"
    category: str = "ren_menneske_ny"
    filename: Optional[str] = None
    word_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class VoiceProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    total_samples: int = 0
    total_words: int = 0
    avg_sentence_length: float = 0
    avg_word_length: float = 0
    vocabulary_richness: float = 0  # unique / total
    top_words: List[dict] = []
    function_word_frequencies: List[dict] = []
    sentence_length_distribution: List[dict] = []
    tone_description: str = ""
    style_summary: str = ""
    signature_phrases: List[str] = []


ALLOWED_MODELS = {
    "claude-sonnet-4-5": ("anthropic", "claude-sonnet-4-5-20250929"),
    "claude-sonnet-4-6": ("anthropic", "claude-sonnet-4-6"),
    "gpt-5.2": ("openai", "gpt-5.2"),
    "gpt-5.4": ("openai", "gpt-5.4"),
    "gemini-3-pro": ("gemini", "gemini-3.1-pro-preview"),
    "gemini-3-flash": ("gemini", "gemini-3-flash-preview"),
}


# ---------- Auth ----------
async def get_current_user(request: Request) -> User:
    token = request.cookies.get("session_token")
    if not token:
        auth = request.headers.get("Authorization")
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1]
    if not token:
        raise HTTPException(status_code=401, detail="Ikke autentisert")

    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Ugyldig økt")

    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Økten er utløpt")

    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Bruker ikke funnet")
    return User(**user_doc)


@api_router.post("/auth/session")
async def create_session(request: Request, response: Response):
    """Exchange session_id from Emergent Auth for a session cookie."""
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="Mangler session_id")

    async with httpx.AsyncClient(timeout=15) as h:
        r = await h.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id},
        )
        if r.status_code != 200:
            raise HTTPException(status_code=401, detail="Kunne ikke bekrefte økt")
        data = r.json()

    email = data["email"]
    name = data.get("name", email)
    picture = data.get("picture")
    session_token = data["session_token"]

    # Upsert user
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": name, "picture": picture}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat(),
        })

    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60,
        path="/",
    )

    return {
        "user_id": user_id,
        "email": email,
        "name": name,
        "picture": picture,
    }


@api_router.get("/auth/me")
async def me(user: User = Depends(get_current_user)):
    return {
        "user_id": user.user_id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
    }


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/")
    return {"ok": True}


# ---------- File extraction ----------
def extract_text_from_upload(filename: str, data: bytes) -> str:
    name = filename.lower()
    if name.endswith(".txt") or name.endswith(".md"):
        try:
            return data.decode("utf-8")
        except UnicodeDecodeError:
            return data.decode("latin-1", errors="ignore")
    if name.endswith(".pdf"):
        reader = PdfReader(io.BytesIO(data))
        return "\n\n".join((p.extract_text() or "") for p in reader.pages)
    if name.endswith(".docx"):
        doc = DocxDocument(io.BytesIO(data))
        return "\n\n".join(p.text for p in doc.paragraphs)
    raise HTTPException(status_code=400, detail="Filtype støttes ikke. Bruk .txt, .pdf eller .docx")


# ---------- Voice analysis ----------
NORWEGIAN_STOPWORDS = {
    "og","i","jeg","det","at","en","et","den","til","er","som","på","de","med","han",
    "av","ikke","der","så","var","meg","seg","men","ett","har","om","vi","min","mitt",
    "ha","hadde","hun","nå","over","da","ved","fra","du","ut","sin","dem","oss","opp",
    "man","kan","hans","hvor","eller","hva","skal","selv","sjøl","her","alle","vil",
    "bli","ble","blitt","kunne","inn","når","være","kom","noen","noe","ville","dere",
    "som","deres","kun","ja","etter","ned","skulle","denne","for","deg","si","sine",
    "sitt","mot","å","meget","hvorfor","dette","disse","uten","hvordan","ingen","din",
    "ditt","blir","samme","hvilken","hvilke","sånn","inni","mellom","vår","hver",
    "hvem","vors","hvis","både","bare","enn","fordi","før","mange","også","slik",
    "vært","være","båe","begge","siden","dykk","dykkar","dei","deira","deires","egen",
    "et","hu","enno","annet","annen","andre","the"
}


def analyze_voice(samples: List[dict]) -> dict:
    """Local, deterministic analysis of writing style."""
    text = "\n\n".join(s["content"] for s in samples)
    words_all = re.findall(r"[A-Za-zÆØÅæøåéèê']+", text)
    if not words_all:
        return {
            "total_words": 0,
            "avg_sentence_length": 0,
            "avg_word_length": 0,
            "vocabulary_richness": 0,
            "top_words": [],
            "sentence_length_distribution": [],
        }

    words_lower = [w.lower() for w in words_all]
    unique = set(words_lower)
    avg_word_len = sum(len(w) for w in words_all) / len(words_all)
    richness = len(unique) / len(words_lower)

    # Sentences
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    sentences = [s for s in sentences if s.strip()]
    sent_lens = [len(re.findall(r"[A-Za-zÆØÅæøå']+", s)) for s in sentences]
    sent_lens = [n for n in sent_lens if n > 0]
    avg_sent = sum(sent_lens) / len(sent_lens) if sent_lens else 0

    # Distribution buckets
    buckets = [
        ("1-5", 0), ("6-10", 0), ("11-15", 0), ("16-20", 0), ("21-30", 0), ("31+", 0)
    ]
    b = dict(buckets)
    for n in sent_lens:
        if n <= 5: b["1-5"] += 1
        elif n <= 10: b["6-10"] += 1
        elif n <= 15: b["11-15"] += 1
        elif n <= 20: b["16-20"] += 1
        elif n <= 30: b["21-30"] += 1
        else: b["31+"] += 1
    distribution = [{"range": k, "count": v} for k, v in b.items()]

    # Top words (excluding stopwords, length >= 4)
    freq = {}
    for w in words_lower:
        if w in NORWEGIAN_STOPWORDS or len(w) < 4:
            continue
        freq[w] = freq.get(w, 0) + 1
    top = sorted(freq.items(), key=lambda x: -x[1])[:15]
    top_words = [{"word": w, "count": c} for w, c in top]

    # Function-word frequencies (per 1000 words) — strong stylometric marker
    fw_targets = [
        "og","men","som","at","fordi","hvis","når","der","hvor","der",
        "ikke","også","kanskje","liksom","altså","bare","enda","jo","nok","alltid",
        "kanskje","selv","ganske","helt","litt","veldig","så","da","mens","selv",
    ]
    fw_set = list(dict.fromkeys(fw_targets))
    fw_counts = {}
    for w in words_lower:
        if w in fw_set:
            fw_counts[w] = fw_counts.get(w, 0) + 1
    per_1000 = 1000.0 / max(len(words_lower), 1)
    function_word_frequencies = sorted(
        [{"word": w, "per_1000": round(c * per_1000, 2), "count": c} for w, c in fw_counts.items()],
        key=lambda x: -x["per_1000"],
    )[:20]

    return {
        "total_words": len(words_lower),
        "avg_sentence_length": round(avg_sent, 2),
        "avg_word_length": round(avg_word_len, 2),
        "vocabulary_richness": round(richness, 3),
        "top_words": top_words,
        "function_word_frequencies": function_word_frequencies,
        "sentence_length_distribution": distribution,
    }


async def build_style_summary(samples: List[dict], stats: dict) -> dict:
    """Use Claude to describe user's tone and signature phrases in Norwegian."""
    if not samples or not EMERGENT_LLM_KEY:
        return {"tone_description": "", "style_summary": "", "signature_phrases": []}

    # Trim to a reasonable size
    joined = "\n\n---\n\n".join(s["content"] for s in samples)
    if len(joined) > 12000:
        joined = joined[:12000]

    system = (
        "Du er en litterær stilanalytiker. Du analyserer en forfatters norske tekster "
        "og beskriver stemmen kort, konkret og uten klisjeer. Svar KUN i gyldig JSON."
    )
    prompt = f"""Analyser følgende tekstprøver fra samme forfatter. Basert på faktiske detaljer i teksten:

1. `tone_description`: 1-2 setninger på norsk som beskriver tonen (rytme, temperatur, distanse, humor, alvor).
2. `style_summary`: 2-3 setninger på norsk om setningsbygning, ordvalg og typiske grep.
3. `signature_phrases`: 5-8 karakteristiske uttrykk, ord eller vendinger forfatteren faktisk bruker (kopier direkte fra tekstene).

Statistikk: gjennomsnittlig setningslengde {stats.get('avg_sentence_length')} ord, ordforråd-rikhet {stats.get('vocabulary_richness')}.

Svar i dette JSON-formatet, ingen forklaring utenfor JSON:
{{"tone_description": "...", "style_summary": "...", "signature_phrases": ["...", "..."]}}

TEKSTER:
{joined}
"""

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"analyze-{uuid.uuid4().hex[:8]}",
        system_message=system,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        parts = []
        async for ev in chat.stream_message(UserMessage(text=prompt)):
            if isinstance(ev, TextDelta):
                parts.append(ev.content)
            elif isinstance(ev, StreamDone):
                break
        raw = "".join(parts).strip()
        # Extract JSON block
        m = re.search(r"\{.*\}", raw, re.DOTALL)
        if m:
            raw = m.group(0)
        parsed = json.loads(raw)
        return {
            "tone_description": parsed.get("tone_description", ""),
            "style_summary": parsed.get("style_summary", ""),
            "signature_phrases": parsed.get("signature_phrases", [])[:8],
        }
    except Exception as e:
        logger.warning(f"Style summary failed: {e}")
        return {"tone_description": "", "style_summary": "", "signature_phrases": []}


# ---------- Sample endpoints ----------
class SampleCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = None


@api_router.post("/samples")
async def create_sample(payload: SampleCreate, user: User = Depends(get_current_user)):
    content = payload.content.strip()
    if len(content) < 20:
        raise HTTPException(status_code=400, detail="Teksten er for kort (minst 20 tegn)")
    category = payload.category if payload.category in SAMPLE_CATEGORIES else "ren_menneske_ny"
    sample = Sample(
        user_id=user.user_id,
        title=payload.title.strip() or "Uten tittel",
        content=content,
        source="paste",
        category=category,
        word_count=len(re.findall(r"\S+", content)),
    )
    doc = sample.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.samples.insert_one(doc)
    return sample


@api_router.post("/samples/upload")
async def upload_sample(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    user: User = Depends(get_current_user),
):
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Filen er for stor (maks 5 MB)")
    text = extract_text_from_upload(file.filename, data)
    text = text.strip()
    if len(text) < 20:
        raise HTTPException(status_code=400, detail="Kunne ikke lese meningsfull tekst fra filen")
    cat = category if category in SAMPLE_CATEGORIES else "ren_menneske_ny"
    sample = Sample(
        user_id=user.user_id,
        title=(title or file.filename or "Uten tittel").strip(),
        content=text,
        source="file",
        category=cat,
        filename=file.filename,
        word_count=len(re.findall(r"\S+", text)),
    )
    doc = sample.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.samples.insert_one(doc)
    return sample


@api_router.post("/samples/scan")
async def scan_handwritten(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    """OCR a photo of handwritten Norwegian text using Claude Sonnet 4.5 vision.
    Returns extracted text without saving as a sample — user can review before saving.
    """
    import base64

    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM-nøkkel mangler")

    ct = (file.content_type or "").lower()
    if not (ct.startswith("image/") or file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".heic"))):
        raise HTTPException(status_code=400, detail="Bare bildefiler (.jpg, .png, .webp)")

    data = await file.read()
    if len(data) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Bildet er for stort (maks 15 MB)")

    b64 = base64.b64encode(data).decode("utf-8")

    system = (
        "Du er en nøyaktig transkriberer av norsk håndskrift. Din oppgave er å transkribere "
        "teksten i bildet HELT ORDRETT — bevar setningsstruktur, linjeskift, og alle særegenheter "
        "i skrivemåten (staveformer, dialektord, gammeldags skrivemåte). "
        "IKKE forbedre grammatikken. IKKE moderniser språket. IKKE oppsummer. "
        "Hvis noen ord er uleselige, marker med [uleselig] i stedet for å gjette. "
        "Returner KUN den transkriberte teksten, ingen forklaring."
    )

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"ocr-{user.user_id}-{uuid.uuid4().hex[:6]}",
        system_message=system,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    msg = UserMessage(
        text="Transkriber all håndskrevet norsk tekst i dette bildet ordrett.",
        file_contents=[ImageContent(image_base64=b64)],
    )

    try:
        parts = []
        async for ev in chat.stream_message(msg):
            if isinstance(ev, TextDelta):
                parts.append(ev.content)
            elif isinstance(ev, StreamDone):
                break
        text = "".join(parts).strip()
    except Exception as e:
        logger.exception("OCR failed")
        raise HTTPException(status_code=500, detail=f"Kunne ikke transkribere: {e}")

    if len(text) < 5:
        raise HTTPException(status_code=400, detail="Fant ikke lesbar tekst i bildet")

    return {
        "text": text,
        "word_count": len(re.findall(r"\S+", text)),
        "filename": file.filename,
    }


@api_router.post("/samples/transcribe")
async def transcribe_audio(
    file: UploadFile = File(...),
    user: User = Depends(get_current_user),
):
    """Transcribe a recorded Norwegian audio file (høytlesning) to text via Whisper.
    Returns the transcript — user reviews and can save as a sample.
    """
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM-nøkkel mangler")

    name = (file.filename or "").lower()
    ct = (file.content_type or "").lower()
    if not (ct.startswith("audio/") or ct.startswith("video/webm") or
            name.endswith((".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"))):
        raise HTTPException(status_code=400, detail="Bare lydfiler (.mp3, .m4a, .wav, .webm)")

    data = await file.read()
    if len(data) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Lyden er for stor (maks 25 MB)")

    # Write to a temp file so OpenAI SDK can read it
    import tempfile
    suffix = os.path.splitext(name)[1] or ".webm"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(data)
        tmp_path = tmp.name

    try:
        stt = OpenAISpeechToText(api_key=EMERGENT_LLM_KEY)
        with open(tmp_path, "rb") as af:
            resp = await stt.transcribe(
                file=af,
                model="whisper-1",
                response_format="json",
                language="no",
                temperature=0.0,
                prompt="Norsk høytlesning fra forfatter. Bevar egne ord og dialekt.",
            )
        text = (getattr(resp, "text", None) or "").strip()
    except Exception as e:
        logger.exception("Whisper failed")
        raise HTTPException(status_code=500, detail=f"Kunne ikke transkribere lyd: {e}")
    finally:
        try: os.unlink(tmp_path)
        except Exception: pass

    if len(text) < 3:
        raise HTTPException(status_code=400, detail="Fant ingen tale i lyden")

    return {
        "text": text,
        "word_count": len(re.findall(r"\S+", text)),
        "filename": file.filename,
    }



async def list_samples(user: User = Depends(get_current_user)):
    docs = await db.samples.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", -1).to_list(200)
    for d in docs:
        if isinstance(d.get("created_at"), str):
            pass
    return docs


@api_router.delete("/samples/{sample_id}")
async def delete_sample(sample_id: str, user: User = Depends(get_current_user)):
    r = await db.samples.delete_one({"id": sample_id, "user_id": user.user_id})
    if r.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Ikke funnet")
    return {"ok": True}


class SampleCategoryUpdate(BaseModel):
    category: str


@api_router.patch("/samples/{sample_id}/category")
async def update_sample_category(
    sample_id: str,
    body: SampleCategoryUpdate,
    user: User = Depends(get_current_user),
):
    if body.category not in SAMPLE_CATEGORIES:
        raise HTTPException(status_code=400, detail="Ukjent kategori")
    r = await db.samples.update_one(
        {"id": sample_id, "user_id": user.user_id},
        {"$set": {"category": body.category}},
    )
    if r.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ikke funnet")
    return {"ok": True, "category": body.category}


@api_router.get("/categories")
async def list_categories():
    return [{"id": k, "label": v} for k, v in SAMPLE_CATEGORIES.items()]


# ---------- Voice profile ----------
@api_router.post("/voice/analyze")
async def analyze_user_voice(user: User = Depends(get_current_user)):
    all_samples = await db.samples.find({"user_id": user.user_id}, {"_id": 0}).to_list(500)
    if not all_samples:
        raise HTTPException(status_code=400, detail="Legg til minst én skriveprøve først")

    # Base the voice profile on HUMAN samples only (exclude hybrid/pure AI)
    human_samples = [s for s in all_samples if s.get("category", "ren_menneske_ny") in HUMAN_CATEGORIES]
    if not human_samples:
        raise HTTPException(
            status_code=400,
            detail="Ingen 'ren menneske'-prøver funnet. Hybrid- og AI-prøver brukes ikke som basis for stemmen."
        )

    stats = analyze_voice(human_samples)
    ai_stuff = await build_style_summary(human_samples, stats)

    profile = {
        "user_id": user.user_id,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "total_samples": len(human_samples),
        **stats,
        **ai_stuff,
    }
    await db.voice_profiles.update_one(
        {"user_id": user.user_id},
        {"$set": profile},
        upsert=True,
    )
    return profile


@api_router.get("/voice/profile")
async def get_voice_profile(user: User = Depends(get_current_user)):
    doc = await db.voice_profiles.find_one({"user_id": user.user_id}, {"_id": 0})
    if not doc:
        return None
    return doc


# ---------- Generation ----------
def build_voice_system_prompt(profile: Optional[dict], samples: List[dict], inspirations: List[dict], humanize_level: int) -> str:
    base = (
        "Du er en skygge-skriver som gjenskaper en spesifikk norsk forfatters stemme perfekt. "
        "Du skriver ALLTID på norsk (bokmål med mindre prøvene tydelig er nynorsk). "
        "Målet er tekst som verken føles maskinell eller generisk. "
        "\n\n"
        "ABSOLUTT REGEL OM REFERANSEFORFATTERE: Hvis brukeren har oppgitt litterære slektninger "
        "(referanseforfattere), skal du ALDRI, under noen omstendighet, plagiere eller kopiere "
        "deres stemme direkte. Du skal heller ikke navngi dem, låne deres kjente motiver, karakterer "
        "eller kjennemerkevendinger. Referanseforfattere brukes KUN som svakt bakteppe for å hjelpe "
        "deg forstå hvilket landskap brukerens egen stemme beveger seg i. Sluttresultatet skal alltid "
        "være brukerens egen stemme, slik den fremgår av hennes prøvetekster — aldri en imitasjon.\n\n"
        "Kritiske krav for å unngå AI-signaturer:\n"
        "- Ikke bruk fraser som 'i en verden der', 'la oss dykke ned', 'det er verdt å nevne', "
        "'til syvende og sist', 'i lys av', 'det er viktig å merke seg', 'når alt kommer til alt'.\n"
        "- Unngå trippel-listestruktur og punktvise oppsummeringer.\n"
        "- Ikke start setninger med 'Videre,', 'Dessuten,', 'Videre så', 'Sammenfattet,'.\n"
        "- Bland korte og lange setninger ujevnt. Bruk gjerne enkeltordssetninger for effekt.\n"
        "- Unngå metaforer som klinger som markedsføring. Bruk konkrete, sanselige detaljer.\n"
        "- Behold rytmen og pausene forfatteren faktisk bruker.\n"
        "- Ikke forklar deg selv, ikke skriv 'her er teksten:', bare lever teksten.\n"
    )

    if profile:
        base += "\n--- FORFATTERENS STEMME ---\n"
        if profile.get("tone_description"):
            base += f"Tone: {profile['tone_description']}\n"
        if profile.get("style_summary"):
            base += f"Stil: {profile['style_summary']}\n"
        if profile.get("signature_phrases"):
            base += f"Signaturord/uttrykk å nikke til (bruk sparsomt, ikke tvinge inn): {', '.join(profile['signature_phrases'])}\n"
        if profile.get("avg_sentence_length"):
            base += f"Gjennomsnittlig setningslengde: {profile['avg_sentence_length']} ord. Etterlign dette omtrentlig, men varier bevisst.\n"

    # Include short excerpts from samples for style anchoring
    if samples:
        excerpts = []
        total = 0
        for s in samples[:5]:
            snippet = s["content"][:900]
            excerpts.append(snippet)
            total += len(snippet)
            if total > 4000:
                break
        base += "\n--- REFERANSE FRA FORFATTERENS EGNE TEKSTER (etterlign rytme og ordvalg) ---\n"
        base += "\n\n---\n\n".join(excerpts)

    if inspirations:
        base += "\n\n--- LITTERÆRE SLEKTNINGER (KUN BAKTEPPE — ALDRI PLAGIER) ---\n"
        base += (
            "Forfatteren kjenner seg beslektet med disse. Bruk dem som et svakt "
            "orienteringspunkt — for å forstå hvilket landskap brukerens stemme beveger seg i. "
            "IKKE etterlign dem. IKKE nevn dem. IKKE lån kjente vendinger eller motiver fra dem. "
            "Brukerens egen stemme, slik den fremgår av hennes prøvetekster, kommer alltid først.\n"
        )
        lines = []
        for i in inspirations[:10]:
            note = (i.get("note") or "").strip()
            if note:
                lines.append(f"- {i['name']} — {note}")
            else:
                lines.append(f"- {i['name']}")
        base += "\n".join(lines)

    if humanize_level >= 2:
        base += (
            "\n\nEkstra humanisering: Legg inn små naturlige uregelmessigheter — "
            "en ufullstendig setning her og der, en spontan tanke i parentes, "
            "en dagligdags vending. Ikke overdriv. Tekst skal ikke se 'redigert' ut."
        )
    if humanize_level >= 3:
        base += (
            "\n\nMaksimal humanisering: Skriv som førsteutkast fra en menneskelig forfatter. "
            "Bruk 'og' og 'men' som setningsstartere når det passer. Tillat gjentakelser "
            "hvis de forsterker rytmen. Ingen glatt AI-flyt."
        )
    return base


class GenerateBody(BaseModel):
    mode: Literal["prompt", "continue", "humanize"]
    text: str
    model: str = "claude-sonnet-4-5"
    humanize_level: int = 1  # 1..3
    length: Literal["kort", "medium", "lang"] = "medium"


@api_router.post("/generate")
async def generate(body: GenerateBody, user: User = Depends(get_current_user)):
    if body.model not in ALLOWED_MODELS:
        raise HTTPException(status_code=400, detail="Ukjent modell")
    provider, model = ALLOWED_MODELS[body.model]

    profile = await db.voice_profiles.find_one({"user_id": user.user_id}, {"_id": 0})
    all_samples = await db.samples.find({"user_id": user.user_id}, {"_id": 0}).sort("created_at", -1).to_list(30)
    # Only use HUMAN samples as style anchors for generation
    samples = [s for s in all_samples if s.get("category", "ren_menneske_ny") in HUMAN_CATEGORIES][:20]
    inspirations = await db.inspirations.find(
        {"user_id": user.user_id}, {"_id": 0, "name_lower": 0}
    ).sort("created_at", 1).to_list(20)

    system = build_voice_system_prompt(profile, samples, inspirations, body.humanize_level)

    length_hint = {
        "kort": "Skriv omtrent 80-150 ord.",
        "medium": "Skriv omtrent 200-350 ord.",
        "lang": "Skriv omtrent 450-700 ord.",
    }[body.length]

    if body.mode == "prompt":
        user_msg = f"{length_hint}\n\nSkriv en tekst basert på dette utgangspunktet, helt i forfatterens stemme:\n\n{body.text}"
    elif body.mode == "continue":
        user_msg = f"{length_hint}\n\nFortsett følgende tekst sømløst i samme stemme og rytme. Ikke gjenta det som allerede står. Start rett der teksten slipper:\n\n---\n{body.text}\n---"
    else:  # humanize
        user_msg = (
            "Skriv følgende tekst på nytt slik at den fremstår helt menneskelig og i forfatterens stemme. "
            "Fjern AI-signaturer, bryt opp glatt flyt, behold meningen. Lever kun den omskrevne teksten:\n\n"
            f"---\n{body.text}\n---"
        )

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"gen-{user.user_id}-{uuid.uuid4().hex[:6]}",
        system_message=system,
    ).with_model(provider, model)

    async def stream():
        try:
            async for ev in chat.stream_message(UserMessage(text=user_msg)):
                if isinstance(ev, TextDelta):
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    yield f"data: {json.dumps({'done': True})}\n\n"
                    break
        except Exception as e:
            logger.exception("Generation error")
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ---------- AI detection heuristic ----------
class DetectBody(BaseModel):
    text: str


AI_MARKERS = [
    r"\bi en verden der\b",
    r"\bla oss dykke\b",
    r"\btil syvende og sist\b",
    r"\bi lys av\b",
    r"\bdet er viktig å merke seg\b",
    r"\bnår alt kommer til alt\b",
    r"\bdet er verdt å nevne\b",
    r"\bfor å oppsummere\b",
    r"\bfør vi går videre\b",
    r"\bsammenfattet\b",
    r"\bfremtidens\b",
    r"\bi en tid der\b",
]


@api_router.post("/detect")
async def detect_ai(body: DetectBody, user: User = Depends(get_current_user)):
    text = body.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Tom tekst")

    words = re.findall(r"[A-Za-zÆØÅæøå']+", text)
    total_words = max(len(words), 1)
    unique_ratio = len(set(w.lower() for w in words)) / total_words

    sentences = [s for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
    sent_lens = [len(re.findall(r"\S+", s)) for s in sentences] or [0]
    if len(sent_lens) > 1:
        mean = sum(sent_lens) / len(sent_lens)
        variance = sum((x - mean) ** 2 for x in sent_lens) / len(sent_lens)
        std = variance ** 0.5
        burstiness = std / mean if mean else 0
    else:
        burstiness = 0

    marker_hits = 0
    hits_list = []
    for pat in AI_MARKERS:
        m = re.findall(pat, text, flags=re.IGNORECASE)
        if m:
            marker_hits += len(m)
            hits_list.append({"pattern": pat, "count": len(m)})

    # Score: high burstiness + high vocab richness + low marker hits => human
    score = 0
    score += min(burstiness * 40, 40)  # 0..40
    score += min(unique_ratio * 60, 60)  # 0..60
    score -= marker_hits * 8
    score = max(0, min(100, score))

    label = "Menneskelig" if score >= 65 else ("Blandet" if score >= 40 else "AI-aktig")

    # ---- Personal style similarity ----
    # Compare text against the user's HUMAN samples using function-word + top-word fingerprint.
    personal = await compute_personal_style_score(user.user_id, text, words)

    # ---- Sentence-level highlighting: which sentences feel most foreign ----
    highlights = []
    if personal.get("available"):
        profile = await db.voice_profiles.find_one({"user_id": user.user_id}, {"_id": 0})
        highlights = compute_sentence_highlights(text, profile)

    return {
        "score": round(score, 1),
        "label": label,
        "burstiness": round(burstiness, 3),
        "vocab_richness": round(unique_ratio, 3),
        "avg_sentence_length": round(sum(sent_lens) / len(sent_lens), 2) if sent_lens else 0,
        "ai_markers": hits_list,
        "personal_style": personal,
        "highlights": highlights,
    }


def compute_sentence_highlights(text: str, profile: dict) -> List[dict]:
    """
    Score each sentence in the text against the user's voice profile.
    Returns list of {index, sentence, similarity (0..100), foreign (bool), foreign_words[]}.
    """
    if not profile:
        return []
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text.strip()) if s.strip()]
    if not sentences:
        return []

    # Precompute profile fingerprints
    profile_fw = {f["word"]: f["per_1000"] for f in (profile.get("function_word_frequencies") or [])}
    profile_top = set(w["word"] for w in (profile.get("top_words") or [])[:30])
    profile_avg_sl = profile.get("avg_sentence_length") or 0

    # Vocab from all profile samples: we approximate "known words" = signature + function words
    known_vocab = set(profile_fw.keys()) | profile_top

    ai_marker_res = [re.compile(pat, re.IGNORECASE) for pat in AI_MARKERS]

    results = []
    for idx, s in enumerate(sentences):
        s_words = re.findall(r"[A-Za-zÆØÅæøå']+", s)
        n = max(len(s_words), 1)
        s_lower = [w.lower() for w in s_words]

        # Function-word cosine (per-sentence, using absolute counts scaled)
        if profile_fw:
            counts = {}
            for w in s_lower:
                if w in profile_fw:
                    counts[w] = counts.get(w, 0) + 1
            per_1000 = 1000.0 / n
            s_fw = {w: c * per_1000 for w, c in counts.items()}
            keys = set(profile_fw.keys()) | set(s_fw.keys())
            dot = sum(profile_fw.get(k, 0) * s_fw.get(k, 0) for k in keys)
            na = sum(v * v for v in profile_fw.values()) ** 0.5
            nb = sum(v * v for v in s_fw.values()) ** 0.5
            fw_cos = (dot / (na * nb)) if (na and nb) else 0
        else:
            fw_cos = 0

        # Signature overlap
        overlap = sum(1 for w in s_lower if w in profile_top) / n

        # Sentence length delta
        if profile_avg_sl > 0:
            delta = abs(n - profile_avg_sl) / max(profile_avg_sl, 1)
            length_sim = max(0.0, 1.0 - min(delta, 1.0))
        else:
            length_sim = 0.5

        # AI marker in sentence => strong penalty
        ai_hit = any(rx.search(s) for rx in ai_marker_res)

        blended = (0.55 * fw_cos + 0.20 * overlap + 0.25 * length_sim) * 100
        if ai_hit:
            blended = max(0.0, blended - 25)
        blended = round(max(0.0, min(100.0, blended)), 1)

        # Foreign words in this sentence: content words not in known_vocab and appearing rarely
        foreign_words = []
        for w in s_words:
            wl = w.lower()
            if len(wl) < 5:
                continue
            if wl in NORWEGIAN_STOPWORDS or wl in known_vocab:
                continue
            if wl not in foreign_words:
                foreign_words.append(wl)
        foreign_words = foreign_words[:6]

        results.append({
            "index": idx,
            "sentence": s,
            "similarity": blended,
            "foreign": blended < 45,
            "foreign_words": foreign_words,
            "ai_marker_hit": ai_hit,
        })

    return results


async def compute_personal_style_score(user_id: str, text: str, words: List[str]) -> dict:
    """
    Similarity between the input text and the user's known voice.
    Uses:
      - Cosine similarity on function-word frequency vector
      - Overlap ratio of user's signature top-words appearing in the text
      - Sentence-length distribution correlation
    Returns a 0..100 personal_similarity score and diagnostic breakdown.
    """
    profile = await db.voice_profiles.find_one({"user_id": user_id}, {"_id": 0})
    if not profile:
        return {
            "available": False,
            "reason": "Ingen stemmeprofil ennå — kjør analyse under «Stemme» først.",
        }

    # Build vectors
    text_words = [w.lower() for w in words]
    text_len = max(len(text_words), 1)

    # Function-word cosine
    fw_profile = {f["word"]: f["per_1000"] for f in (profile.get("function_word_frequencies") or [])}
    if fw_profile:
        text_fw_counts = {}
        for w in text_words:
            if w in fw_profile:
                text_fw_counts[w] = text_fw_counts.get(w, 0) + 1
        per_1000 = 1000.0 / text_len
        text_fw = {w: c * per_1000 for w, c in text_fw_counts.items()}
        # Cosine over union of keys
        keys = set(fw_profile.keys()) | set(text_fw.keys())
        dot = sum(fw_profile.get(k, 0) * text_fw.get(k, 0) for k in keys)
        na = sum(v * v for v in fw_profile.values()) ** 0.5
        nb = sum(v * v for v in text_fw.values()) ** 0.5
        fw_cos = (dot / (na * nb)) if (na and nb) else 0
    else:
        fw_cos = 0

    # Signature-word overlap: how many of the user's top 15 words appear in this text
    top_words = [w["word"] for w in (profile.get("top_words") or [])[:15]]
    if top_words:
        text_word_set = set(text_words)
        overlap = sum(1 for w in top_words if w in text_word_set)
        overlap_ratio = overlap / len(top_words)
    else:
        overlap_ratio = 0

    # Sentence-length distribution correlation (pearson-ish, using shared bins)
    profile_dist = {d["range"]: d["count"] for d in (profile.get("sentence_length_distribution") or [])}
    if profile_dist:
        sentences = [s for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]
        sl = [len(re.findall(r"\S+", s)) for s in sentences]
        sl = [n for n in sl if n > 0]
        text_dist = {"1-5": 0, "6-10": 0, "11-15": 0, "16-20": 0, "21-30": 0, "31+": 0}
        for n in sl:
            if n <= 5: text_dist["1-5"] += 1
            elif n <= 10: text_dist["6-10"] += 1
            elif n <= 15: text_dist["11-15"] += 1
            elif n <= 20: text_dist["16-20"] += 1
            elif n <= 30: text_dist["21-30"] += 1
            else: text_dist["31+"] += 1
        # Normalize
        def norm(d):
            t = sum(d.values()) or 1
            return {k: v / t for k, v in d.items()}
        pn = norm(profile_dist)
        tn = norm(text_dist)
        # 1 - half L1 (0..1 similarity)
        dist_sim = 1 - 0.5 * sum(abs(pn[k] - tn[k]) for k in pn.keys())
    else:
        dist_sim = 0

    # Blend
    personal_similarity = (
        0.55 * fw_cos +
        0.25 * overlap_ratio +
        0.20 * dist_sim
    ) * 100
    personal_similarity = round(max(0, min(100, personal_similarity)), 1)

    if personal_similarity >= 70:
        label = "Din stemme"
    elif personal_similarity >= 45:
        label = "Delvis din stemme"
    else:
        label = "Fremmed stemme"

    return {
        "available": True,
        "personal_similarity": personal_similarity,
        "label": label,
        "function_word_cosine": round(fw_cos, 3),
        "signature_word_overlap": round(overlap_ratio, 3),
        "sentence_shape_similarity": round(dist_sim, 3),
    }


# ---------- Models list ----------
@api_router.get("/models")
async def list_models():
    return [
        {"id": "claude-sonnet-4-5", "label": "Claude Sonnet 4.5", "provider": "Anthropic"},
        {"id": "claude-sonnet-4-6", "label": "Claude Sonnet 4.6", "provider": "Anthropic"},
        {"id": "gpt-5.2", "label": "GPT 5.2", "provider": "OpenAI"},
        {"id": "gpt-5.4", "label": "GPT 5.4", "provider": "OpenAI"},
        {"id": "gemini-3-pro", "label": "Gemini 3.1 Pro", "provider": "Google"},
        {"id": "gemini-3-flash", "label": "Gemini 3 Flash", "provider": "Google"},
    ]


@api_router.get("/")
async def root():
    return {"app": "Echo", "ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
