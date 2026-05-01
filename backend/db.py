import sqlite3
import os

# ================= PATH DATABASE =================
# 🔥 biar database selalu di folder backend (gak nyasar)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "database.db")


# ================= CONNECT DB =================
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # biar bisa akses pakai nama kolom
    return conn


# ================= INIT DATABASE =================
def init_db():
    conn = get_db()

    # ================= TABLE EXPENSES =================
    conn.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT,
            kategori TEXT,
            jumlah INTEGER,
            tanggal TEXT,
            trip TEXT,
            type TEXT
        )
    """)

    # ================= TABLE USERS =================
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT,
            email TEXT,
            password TEXT
        )
    """)

    # 🔥 WAJIB commit biar ke-save
    conn.commit()

    conn.close()