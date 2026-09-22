"""
MongoDB connection and data-access helpers for AgroGuard AI.

Connects to mongodb://localhost:27017/ and uses the `agroguard_db` database
with two collections:
  - users       : registered accounts (email, name, hashed password, token)
  - detections  : saved crop-disease predictions per user
"""

import os
import logging
from pathlib import Path
from datetime import datetime, timezone

from dotenv import load_dotenv
from pymongo import MongoClient, DESCENDING
from pymongo.errors import PyMongoError

# Load backend/.env so MONGO_URI / MONGO_DB can be configured there.
load_dotenv(Path(__file__).resolve().parent / ".env")

logger = logging.getLogger(__name__)

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.environ.get("MONGO_DB", "agroguard_db")

_client = None
_db = None


def get_db():
    """Return a (cached) database handle, connecting on first use."""
    global _client, _db
    if _db is None:
        _client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=4000)
        _db = _client[DB_NAME]
        # Ensure useful indexes exist
        _db.users.create_index("email", unique=True)
        _db.users.create_index("token")
        _db.detections.create_index([("email", 1), ("createdAt", DESCENDING)])
        logger.info("Connected to MongoDB at %s (db=%s)", MONGO_URI, DB_NAME)
    return _db


def ping():
    """Return True if MongoDB is reachable, False otherwise."""
    try:
        get_db().client.admin.command("ping")
        return True
    except PyMongoError as e:
        logger.error("MongoDB ping failed: %s", e)
        return False


def utcnow_iso():
    return datetime.now(timezone.utc).isoformat()


def serialize(doc):
    """Convert a Mongo document to a JSON-safe dict (ObjectId -> str, drop email)."""
    if doc is None:
        return None
    out = {}
    for key, value in doc.items():
        if key == "_id":
            out["id"] = str(value)
        elif key == "email":
            continue  # never expose the query key to the client
        elif isinstance(value, datetime):
            out[key] = value.isoformat()
        else:
            out[key] = value
    return out


def public_user(user_doc):
    """Strip sensitive fields from a user document."""
    if not user_doc:
        return None
    return {
        "id": str(user_doc.get("_id")),
        "name": user_doc.get("name"),
        "email": user_doc.get("email"),
        "createdAt": user_doc.get("createdAt"),
    }


# ------------------------------- Collections ------------------------------

def users():
    return get_db().users


def detections():
    return get_db().detections
