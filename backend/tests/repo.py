"""Paths into the checked-out repo.

Tidligere leste testene fra hardkodede `/app/...`-stier og hentet statiske
filer over HTTP fra backend-URL-en. Begge deler stammer fra da frontend og
backend delte samme origin i preview-miljøet. Nå ligger frontend på Cloudflare
og API-et på Railway, så statiske filer finnes ikke bak backend-URL-en i det
hele tatt — de leses fra repoet i stedet.
"""
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
PUBLIC = REPO_ROOT / "frontend" / "public"
FRONTEND_SRC = REPO_ROOT / "frontend" / "src"


def public_bytes(name: str) -> bytes:
    """Les en fil fra frontend/public. `name` kan ha ledende skråstrek."""
    path = PUBLIC / name.lstrip("/")
    assert path.is_file(), f"{path} finnes ikke i repoet"
    return path.read_bytes()


def public_text(name: str) -> str:
    return public_bytes(name).decode("utf-8")


def src_text(relative: str) -> str:
    """Les en kildefil fra frontend/src."""
    path = FRONTEND_SRC / relative.lstrip("/")
    assert path.is_file(), f"{path} finnes ikke i repoet"
    return path.read_text(encoding="utf-8")
