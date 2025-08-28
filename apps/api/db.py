import os
import sqlite3
from datetime import datetime
from typing import List, Tuple, Any
from . import config

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "todo.db")

def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def now():
    return datetime.utcnow().isoformat(timespec="seconds")

def init_dirs():
    os.makedirs(config.UPLOAD_DIR, exist_ok=True)
    os.makedirs(config.EXPORT_DIR, exist_ok=True)

def init_db():
    init_dirs()
    conn = get_conn()
    cur = conn.cursor()

    cur.executescript(
        """
        PRAGMA journal_mode=WAL;

        CREATE TABLE IF NOT EXISTS tasks(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          category TEXT NOT NULL CHECK(category IN ('Operational','Development','Experiment/Belajar')),
          status TEXT NOT NULL CHECK(status IN ('Not Started','In Progress','On Hold','Done')),
          deadline_type TEXT CHECK(deadline_type IN ('soft','hard')),
          deadline_date TEXT, -- ISO date (YYYY-MM-DD) or NULL
          progress_pct INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          completed_at TEXT,         -- when moved to Done
          last_update_at TEXT        -- last update timestamp
        );

        CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
        CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed_at);
        CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
        CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);

        CREATE TABLE IF NOT EXISTS tags(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL -- stored as lowercase for exact-match search
        );
        CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

        CREATE TABLE IF NOT EXISTS task_tags(
          task_id INTEGER NOT NULL,
          tag_id INTEGER NOT NULL,
          PRIMARY KEY(task_id, tag_id),
          FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
          FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_task_tags_tag ON task_tags(tag_id);

        CREATE TABLE IF NOT EXISTS updates(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          task_id INTEGER NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          text TEXT NOT NULL,
          progress_pct INTEGER,           -- optional
          links_json TEXT,                -- JSON array string
          image_path TEXT,                -- relative under /uploads
          is_highlight INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE
        );
        CREATE INDEX IF NOT EXISTS idx_updates_task ON updates(task_id);
        """
    )

    conn.commit()
    conn.close()
