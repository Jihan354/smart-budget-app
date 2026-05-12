import sqlite3
import os

# ================= PATH DATABASE =================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_PATH = os.path.join(BASE_DIR, "database.db")


# ================= CONNECT DB =================
def get_db():

    conn = sqlite3.connect(DB_PATH)

    conn.row_factory = sqlite3.Row

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

        start_date TEXT,

        end_date TEXT,

        from_city TEXT,

        destination TEXT,

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

    # ================= COMMIT =================
    conn.commit()

    conn.close()