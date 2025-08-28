import os

# --- Admin auth (simple) ---
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "samuel")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")

# Token = sha256(ADMIN_PASSWORD + SECRET_SALT)
SECRET_SALT = os.getenv("SECRET_SALT", "local_dev_only_change_me")

# --- Server paths ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_DIR = os.path.join(BASE_DIR, "storage")
UPLOAD_DIR = os.path.join(STORAGE_DIR, "uploads")
EXPORT_DIR = os.path.join(BASE_DIR, "exports")

# --- App flags ---
DEBUG = True
