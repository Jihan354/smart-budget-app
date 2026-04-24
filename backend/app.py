from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

# ================= DB =================
def get_db():
    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()

    # ✅ tambahin kolom type (yang kurang)
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

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT,
            email TEXT,
            password TEXT
        )
    """)

    conn.close()

init_db()

# ================= ROUTES =================
@app.route("/")
def home():
    return "API jalan!"

# ================= EXPENSES =================
@app.route("/expenses", methods=["GET", "POST"])
def expenses():
    conn = get_db()

    if request.method == "POST":
        data = request.json

        conn.execute(
            "INSERT INTO expenses (nama, kategori, jumlah, tanggal, trip, type) VALUES (?, ?, ?, ?, ?, ?)",
            (
                data["nama"],
                data["kategori"],
                data["jumlah"],
                data["tanggal"],
                data["trip"],
                data["type"]   # 🔥 tambahan aja
            )
        )
        conn.commit()
        conn.close()

        return jsonify({"message": "Data ditambah"})

    else:
        data = conn.execute("SELECT * FROM expenses").fetchall()
        conn.close()

        return jsonify([dict(row) for row in data])


# UPDATE
@app.route("/expenses/<int:id>", methods=["PUT"])
def update_expense(id):
    data = request.json

    conn = get_db()
    conn.execute(
        "UPDATE expenses SET nama=?, kategori=?, jumlah=?, tanggal=?, trip=?, type=? WHERE id=?",
        (
            data["nama"],
            data["kategori"],
            data["jumlah"],
            data["tanggal"],
            data["trip"],
            data["type"],  # 🔥 tambahan aja
            id
        )
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Data diupdate"})


# DELETE
@app.route("/expenses/<int:id>", methods=["DELETE"])
def delete_expense(id):
    conn = get_db()
    conn.execute("DELETE FROM expenses WHERE id=?", (id,))
    conn.commit()
    conn.close()

    return jsonify({"message": "Data dihapus"})


# ================= AUTH =================
@app.route("/register", methods=["POST"])
def register():
    data = request.json

    conn = get_db()
    conn.execute(
        "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
        (data["nama"], data["email"], data["password"])
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "Register berhasil"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE email=? AND password=?",
        (data["email"], data["password"])
    ).fetchone()
    conn.close()

    if user:
        return jsonify({"message": "Login sukses"})
    else:
        return jsonify({"message": "Login gagal"}), 401


# ================= SUMMARY =================
@app.route("/summary", methods=["GET"])
def summary():
    conn = get_db()

    total_expense = conn.execute(
        "SELECT SUM(jumlah) FROM expenses WHERE type='expense'"
    ).fetchone()[0] or 0

    total_income = conn.execute(
        "SELECT SUM(jumlah) FROM expenses WHERE type='income'"
    ).fetchone()[0] or 0

    conn.close()

    return jsonify({
        "total_expense": total_expense,
        "total_income": total_income,
        "saldo": total_income - total_expense
    })


# ================= RUN =================
if __name__ == "__main__":
    app.run(debug=True)